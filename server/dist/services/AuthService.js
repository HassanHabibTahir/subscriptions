"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const users_models_1 = __importDefault(require("../model/users_models"));
const subscriptions_table_1 = __importDefault(require("../model/subscriptions_table"));
const package_1 = require("../utils/package");
const packages_table_1 = __importDefault(require("../model/packages_table"));
class AuthService {
    static async signup(name, email, password, tierName) {
        try {
            const selectedTier = (0, package_1.getTierByName)(tierName);
            const user = await users_models_1.default.create({
                name,
                email,
                password,
                tier: selectedTier.title,
                type: "user",
                username: email.includes("@") ? email.split("@")[0] : email,
                display_name: name,
            });
            if (selectedTier.is_free) {
                await subscriptions_table_1.default.create({
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
                await packages_table_1.default.create({
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
                };
            }
            else {
                // If the selected tier is not free, only create the user
                return {
                    message: `User created successfully. Selected tier: ${selectedTier.title}. Subscription required.`,
                    userId: user.id,
                };
            }
        }
        catch (error) {
            throw new Error(`Signup error: ${error.message || "Unknown error"}`);
        }
    }
}
exports.AuthService = AuthService;
