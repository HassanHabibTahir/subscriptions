
import Subscription from "../model/subscriptions_table";
import User from "../model/users_models";
import { stripe } from "../utils/stripe";
import {
  calculateExpirationDate,
  extractSubscriptionDetails,
  getTierByName,
} from "../utils/package";
import PackageTable from "../model/packages_table";
import Stripe from "stripe";

type PackageData = {
  title: string;
  package_reference: string;
  package_id: number;
  is_free: boolean;
  email: string;
  condition: string;
  priceId: string;
};

class SubscriptionService {
  async createPackage(data: PackageData) {
    try {
      const user = await User.findOne({
        where: { email: data.email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const session = await stripe.checkout.sessions.create({
        customer_email: data.email,
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.BASE_URL}/api/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/api/subscription/cancel`,
        metadata: {
          userId: user.id,
          packageId: data.package_id,
          paymentPlan: data.condition,
          membershipType: data.package_reference,
        },
      });
      await user.update({
        paymentSessionId: session.id,
        package_id: data.package_id,
        payment_plane: data.condition,
        membership_type: data.package_reference,
      });
      return { url: session?.url, id: session.id };
    } catch (error) {
      throw new Error(`Error creating subscription: ${error.message}`);
    }
  }

  async getPackages(sessionId: any) {
    try {
      // Find user and validate session ID
      const user = await User.findOne({
        where: { paymentSessionId: sessionId },
      });

      if (!user) {
        throw new Error("User not found or invalid session");
      }
      const [session, lineItems] = await Promise.all([
        stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["payment_intent.payment_method"],
        }),
        stripe.checkout.sessions.listLineItems(sessionId),
      ]);

      // Get selected tier and calculate expiration date
      const selectedTier = await getTierByName(user.membership_type);
      const expiresAt = await calculateExpirationDate(user.payment_plane);
      // Check if subscription already exists
      const existingSubscription = await Subscription.findOne({
        where: { user_id: user.id },
      });

      if (existingSubscription) {
        // Update existing subscription if found
        await Subscription.update(
          {
            subscription_id: session.subscription,
            mode: user?.payment_plane,
            expires_at: expiresAt,
            paid_amount: session.amount_total / 100,
            payment_status: session?.payment_status,
            status: "active",
          },
          {
            where: { user_id: user.id },
          }
        );
        return {
          message: "Subscription updated successfully",
          sessionId: session.id,
          url: session.url,
        };
      } else {
        // If subscription does not exist, create new records
        await Subscription.create({
          user_id: user.id,
          email: user.email,
          package_title: selectedTier.title,
          package_reference: user.membership_type,
          package_id: user.package_id,
          subscription_id: session.subscription,
          mode: user?.payment_plane,
          expires_at: expiresAt,
          paid_amount: session.amount_total / 100,
          payment_status: session?.payment_status,
          status: "active",
        });
        return {
          message: "Subscription created successfully",
          sessionId: session.id,
          url: session.url,
        };
      }
      // return session
    } catch (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }
  }

  // cancelSubscriptionService
  async cancelSubscription(subscription: any) {
    try {
      const stripeSubscription = await stripe.subscriptions.update(
        subscription.subscription_id,
        {
            cancel_at_period_end: false, 
          
        }
      );
      
      await subscription.update({
        status: "canceled",
      });
      return {
        message: "Subscription has been cancelled instantly.",
        subscription: stripeSubscription,
      };
    } catch (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }
  }

// upgrde subscription
 async upgradeSubscription(subscription,newPriceId){
  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.subscription_id);
    const updatedSubscription = await stripe.subscriptions.update(subscription.subscription_id, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPriceId,
        },
      ],
    });
// upgrade in db pass data from frotend like prince and package refrence




    return {
      message: 'Subscription upgraded successfully',
      subscription: updatedSubscription
    };

  } catch (error) {
    throw new Error(`Error upgrading subscription: ${error.message}`);
  }
 }

// downgrade subscription 
async downgradeSubscription(subscription,newPriceId){
  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.subscription_id);
    const updatedSubscription = await stripe.subscriptions.update(subscription.subscription_id, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPriceId,
        },
      ],
    });
    // upgrade in db pass data from frotend like prince and package refrence
    return {
      message: 'Subscription downgraded successfully',
      subscription: updatedSubscription
    };

  } catch (error) {
    throw new Error(`Error downgrading subscription: ${error.message}`);
  }
  

}


  async webhook(req: any, res: any) {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      return res.status(400).send("Missing stripe-signature header");
    }
    let event;
    try {
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
    try {
      switch (event.type) {
        case "customer.subscription.updated":
          console.log("event.type", event.type);
          console.log(
            "customer.subscription.paused",
            JSON.stringify(event.data.object)
          );
          await this.handleUpdateSubscriptionPauseOrResume(event.data.object);
          break;
        case "customer.subscription.deleted":
          console.log("customer.subscription.deleted");
          await this.handleSubscriptionCancelled(event.data.object);
          break;
        case "invoice.payment_succeeded":
          console.log("invoice.payment_succeeded");

          await this.handleInvoiceUpdateSubscription(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      return { status: 200, body: { received: true } };
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  // upgrade downgrade or pause  or resume
  private async handleUpdateSubscriptionPauseOrResume(invoice) {
    const subscriptionId = invoice?.id;
    console.log(`updating subscription ${subscriptionId}`);

    try {
      // Retrieve the latest subscription info from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscriptionId
      );

      // // Fetch subscription from the database
      const subscription = await Subscription.findOne({
        where: { subscription_id: subscriptionId },
      });

      const isPausedNow = stripeSubscription.pause_collection !== null;

      let statusUpdate = isPausedNow ? "paused" : "active";

      if (statusUpdate) {
        await subscription.update({ status: statusUpdate });
        console.log(`Subscription ${statusUpdate}:`, subscriptionId);
      } else {
        console.error("Subscription not found for ID:", subscriptionId);
      }
    } catch (error) {
      console.error("Error handling subscription update:", error);
    }
  }

  // renew subscription if cycle end

  private async handleInvoiceUpdateSubscription(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string;
    const subscription = await Subscription.findOne({
      where: { subscription_id: subscriptionId },
    });
    if (subscription) {
      await subscription.update({
        paid_amount: invoice.amount_paid / 100,
        payment_status: "paid",
        last_payment_date: new Date(),
        expires_at: new Date(invoice.lines.data[0].period.end * 1000),
      });

      console.log("Subscription updated:", {
        subscription_id: subscriptionId,
        paid_amount: invoice.amount_paid / 100,
      });
    } else {
      console.error("Subscription not found for ID:", subscriptionId);
    }
  }

  // cancel subscription
  private async handleSubscriptionCancelled(subscription) {
    if (!subscription?.id) {
      console.error("No subscription id found");
      return;
    }
    const subscriptionRecord = await Subscription.findOne({
      where: { subscription_id: subscription?.id },
    });
    if (subscriptionRecord) {
      await subscriptionRecord.update({
        status: "cancelled",
        is_deleted: true,
      });
      console.log(`Subscription cancelled `);
    } else {
      console.error(`No subscription found`);
    }
  }
}

export default new SubscriptionService();
