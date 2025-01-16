import Subscription from "../model/subscriptions_table";
import User from "../model/users_models";
import { stripe } from "../utils/stripe";
import {
  calculateExpirationDate,
  extractSubscriptionDetails,
  getTierByName,
} from "../utils/package";
import Packages from "../model/packages_table";
import Stripe from "stripe";

class SubscriptionService {
  //Find user Subscription
  async findUserSubscription(user_id: any) {
    try {
      const user = await Subscription.findOne({
        where: { user_id: user_id },
      });
      return user;
    } catch (err) {
      throw new Error(`Error finding user: ${err.message}`);
    }
  }
  async createPackage(data: any) {
    try {
      const user = await User.findOne({
        where: { id: data.userId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
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
      await user.update(
        {
          paymentSessionId: session.id,
          package_id: data.package_id,
          payment_plane: data.condition,
          membership_type: data.package_reference,
        },
        {
          where: { user_id: user.id },
        }
      );

      return { url: session?.url, id: session.id };
    } catch (error) {
      throw new Error(`Error creating subscription: ${error.message}`);
    }
  }

  async getPackage(sessionId: any) {
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
            package_reference: user.membership_type,
            package_title: selectedTier.title,
            package_id: user.package_id,
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
  async cancelSubscription(subscription: any, userId: any) {
    try {
      // const stripeSubscription = await stripe.subscriptions.update(
      //   subscription.subscription_id,
      //   {
      //     cancel_at_period_end: true,
      //   }
      // );
      const canceledSubscription = await stripe.subscriptions.cancel(subscription.subscription_id)

      await subscription.update(
        {
          status: "canceled",
          package_title: "Starter Tier",
          package_reference: "starter_tier",
          mode: "monthly",
          package_id: 1,
          expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          paid_amount: 0,
          payment_status: "free",
        },
        {
          where: { subscription_id: subscription.subscription_id },
        }
      );
      await User.update(
        {
          package_id: 1,
          payment_plane: "monthly",
          membership_type: "starter_tier",
        },
        {
          where: { id: userId },
        }
      );

      return {
        message: "Subscription has been cancelled instantly.",
        subscription: canceledSubscription,
      };
    } catch (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }
  }

  // upgrde subscription
  async upgradeSubscription(subscription, body) {
    try {
      const expiresAt = await calculateExpirationDate(body.condition);
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.subscription_id
      );
      const updatedSubscription = await stripe.subscriptions.update(
        subscription.subscription_id,
        {
          items: [
            {
              id: stripeSubscription.items.data[0].id,
              price: body?.priceId,
            },
          ],
        }
      );

      const newPrice = updatedSubscription.items.data[0].price;
      const priceAmount = newPrice.unit_amount / 100;
      await Subscription.update(
        {
          package_reference: body?.package_reference,
          paid_amount: priceAmount,
          package_title: body?.title,
          package_id: body?.package_id,
          mode: body.condition,
          expires_at: expiresAt,
        },
        {
          where: { subscription_id: subscription.subscription_id },
        }
      );
      await User.update(
        {
          package_id: body.package_id,
          payment_plane: body.condition,
          membership_type: body.package_reference,
        },
        {
          where: { id: body.userId },
        }
      );

      return {
        message: "Subscription upgraded successfully",
        subscription: updatedSubscription,
        success: true,
      };
    } catch (error) {
      throw new Error(`Error upgrading subscription: ${error.message}`);
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
      console.log(event.type, "event", event);
      switch (event.type) {
        case "customer.subscription.created":
          console.log("Subscription created:", event.data.object.status);
          break;
        case "customer.subscription.updated":
          console.log("Subscription updated:", event.data.object.status);
          await this.handleUpdateSubscriptionPauseOrResume(event.data.object);
          break;
        case "customer.subscription.deleted":
          await this.handleSubscriptionCancelled(event.data.object);
          break;
        case "invoice.payment_succeeded":
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
    try {
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
      } else {
        console.error("Subscription not found for ID:", subscriptionId);
      }
    } catch (error) {}
  }

  // cancel subscription
  private async handleSubscriptionCancelled(subscription) {
    try {
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
    } catch (error) {}
  }
  // get all packages from sql
  async getAllPackages() {
    try {
      const packages = await Packages.findAll();
      return packages;
    } catch (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }
  }
}

export default new SubscriptionService();
