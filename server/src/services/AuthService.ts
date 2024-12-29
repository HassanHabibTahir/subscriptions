import User from "../model/users_models";
import Subscription from "../model/subscriptions_table";
import { getTierByName } from "../utils/package";
import PackageTable from "../model/packages_table";

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
  static async signup(
    name: string,
    email: string,
    password: string,
    tierName: string
  ) {
    try {
      const selectedTier = getTierByName(tierName);

      const user = await User.create({
        name,
        email,
        password,
        tier: selectedTier.title,
        type: "user",
        username: email.includes("@") ? email.split("@")[0] : email,
        display_name: name,
      });

      if (selectedTier.is_free) {
        await Subscription.create({
          user_id: user.id,
          email: user.email,
          package_title: selectedTier.title,
          package_reference: selectedTier.package_reference,
          package_id: selectedTier.package_id,
          subscription_id: "",
          mode: "free",
          expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          paid_amount: 0,
          payment_status: "free",
          status: "active",
        });

        await PackageTable.create({
          user_id: user.id,
          title: selectedTier.title,
          per_month_charges: 0,
          yearly_per_month_charges: 0,
          package_subscriptionId: "",
          monthly_sub_priceId: "",
          yearly_sub_priceId: "",
          package_reference: "",
          features: selectedTier.package_reference,
        });

        return {
          message: "User created successfully with free tier",
          userId: user.id,
          subscription: true,
        };
      } else {
        return {
          message: `User created successfully. Selected tier: ${selectedTier.title}. Subscription required.`,
          userId: user.id,
          subscription: false,
        };
      }
    } catch (error: any) {
      throw new Error(`Signup error: ${error.message || "Unknown error"}`);
    }
  }
}
