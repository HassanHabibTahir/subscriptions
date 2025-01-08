import { tiers } from "./../utils/package";
import User from "../model/users_models";
import Subscription from "../model/subscriptions_table";
import { getTierByName } from "../utils/package";
import PackageTable from "../model/packages_table";
import { stripe } from "../utils/stripe";

export class AuthService {
  // find User
  static async findUser(email: string) {
    try {
      const user = await User.findOne({
        where: { email },
      });
      return user;
    } catch (err) {
      throw new Error(`Error finding user: ${err.message}`);
    }
  }

  // singup
  static async signup(body: any) {
    try {
      // const selectedTier = getTierByName(tierName);
      const user = await User.create({
        name: body.name,
        email: body.email,
        password: body.password,
        tier: body.title,
        type: "user",
        username: body?.email.includes("@")
          ? body?.email.split("@")[0]
          : body?.email,
        display_name: body?.name,
      });
      
      if (body.is_free) {
        await Subscription.create({
          user_id: user.id,
          email: user.email,
          package_title: body.title,
          package_reference: body.tier,
          package_id: body.package_id,
          subscription_id: "",
          mode: "free",
          expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          paid_amount: 0,
          payment_status: "free",
          status: "active",
        });
        return {
          message: "User created successfully with free tier",
          userId: user.id,
          subscription: true,
        };
      } else {
        const session = await stripe.checkout.sessions.create({
          customer_email: user.email,
          line_items: [
            {
              price: body.price_id,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${process.env.BASE_URL}/api/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.BASE_URL}/api/subscription/cancel`,
          metadata: {
            userId: user.id,
            packageId: body.package_id,
            paymentPlan: body.subscription_duration,
            membershipType: body.tier,
          },
        });
        await user.update({
          paymentSessionId: session.id,
          package_id: body.package_id,
          payment_plane: body.subscription_duration,
          membership_type: body.tier,
        });

        return {
          message: `User created successfully. Selected tier: ${body.title}.`,
          userId: user.id,
          subscription: false,
          url: session?.url,
          id: session.id,
        };
      }
      // await PackageTable.create({
      //   user_id: user.id,
      //   title: selectedTier.title,
      //   per_month_charges: 0,
      //   yearly_per_month_charges: 0,
      //   package_subscriptionId: "",
      //   monthly_sub_priceId: "",
      //   yearly_sub_priceId: "",
      //   package_reference: "",
      //   features: selectedTier.package_reference,
      // });

      //   return {
      //     message: "User created successfully with free tier",
      //     userId: user.id,
      //     subscription: true,
      //   };
      // } else {
    } catch (error: any) {
      throw new Error(`Signup error: ${error.message || "Unknown error"}`);
    }
  }
}
