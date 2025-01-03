"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const users_models_1 = __importDefault(require("../model/users_models"));
const subscriptions_table_1 = __importDefault(require("../model/subscriptions_table"));
const stripe_1 = require("../utils/stripe");
class AuthService {
    // find User
    static async findUser(email) {
        try {
            const user = await users_models_1.default.findOne({
                where: { email },
            });
            return user;
        }
        catch (err) {
            throw new Error(`Error finding user: ${err.message}`);
        }
    }
    // singup
    static async signup(body) {
        try {
            // const selectedTier = getTierByName(tierName);
            const user = await users_models_1.default.create({
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
                await subscriptions_table_1.default.create({
                    user_id: user.id,
                    email: user.email,
                    package_title: body.title,
                    package_reference: body.tiers,
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
            }
            else {
                const session = await stripe_1.stripe.checkout.sessions.create({
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
        }
        catch (error) {
            throw new Error(`Signup error: ${error.message || "Unknown error"}`);
        }
    }
}
exports.AuthService = AuthService;
