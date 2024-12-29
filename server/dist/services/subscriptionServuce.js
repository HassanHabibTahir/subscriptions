"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptions_table_1 = __importDefault(require("../model/subscriptions_table"));
const users_models_1 = __importDefault(require("../model/users_models"));
const stripe_1 = require("../utils/stripe");
const package_1 = require("../utils/package");
const packages_table_1 = __importDefault(require("../model/packages_table"));
class SubscriptionService {
    async createPackage(data) {
        try {
            const user = await users_models_1.default.findOne({
                where: { email: data.email },
            });
            if (!user) {
                throw new Error("User not found");
            }
            const session = await stripe_1.stripe.checkout.sessions.create({
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
            return session;
        }
        catch (error) {
            throw new Error(`Error creating subscription: ${error.message}`);
        }
    }
    async getPackages(sessionId) {
        try {
            // Find user and validate session ID
            const user = await users_models_1.default.findOne({
                where: { paymentSessionId: sessionId },
            });
            if (!user) {
                throw new Error("User not found or invalid session");
            }
            const [session, lineItems] = await Promise.all([
                stripe_1.stripe.checkout.sessions.retrieve(sessionId, {
                    expand: ["payment_intent.payment_method"],
                }),
                stripe_1.stripe.checkout.sessions.listLineItems(sessionId),
            ]);
            // Get selected tier and calculate expiration date
            const selectedTier = await (0, package_1.getTierByName)(user.membership_type);
            const expiresAt = await (0, package_1.calculateExpirationDate)(user.payment_plane);
            const { monthlyPrice, yearlyPrice, monthlyPriceId, yearlyPriceId } = await (0, package_1.extractSubscriptionDetails)(lineItems.data);
            const subscriptionType = user.payment_plane;
            // Check if subscription already exists
            const existingSubscription = await subscriptions_table_1.default.findOne({
                where: { user_id: user.id },
            });
            if (existingSubscription) {
                // Update existing subscription if found
                await subscriptions_table_1.default.update({
                    subscription_id: session.subscription,
                    mode: user?.payment_plane,
                    expires_at: expiresAt,
                    paid_amount: session.amount_total / 100,
                    payment_status: session?.payment_status,
                    status: "active",
                }, {
                    where: { user_id: user.id },
                });
                // Update existing package table record
                await packages_table_1.default.update({
                    title: selectedTier.title,
                    per_month_charges: subscriptionType === "monthly" ? monthlyPrice : 0,
                    yearly_per_month_charges: subscriptionType === "yearly" ? yearlyPrice : 0,
                    package_subscriptionId: session.subscription,
                    monthly_sub_priceId: subscriptionType === "monthly" ? monthlyPriceId : "",
                    yearly_sub_priceId: subscriptionType === "yearly" ? yearlyPriceId : "",
                    package_reference: selectedTier.package_reference,
                    features: selectedTier.package_reference,
                }, {
                    where: { user_id: user.id },
                });
                return {
                    message: "Subscription updated successfully",
                    sessionId: session.id,
                    url: session.url,
                };
            }
            else {
                // If subscription does not exist, create new records
                await subscriptions_table_1.default.create({
                    user_id: user.id,
                    email: user.email,
                    package_title: selectedTier.title,
                    package_reference: selectedTier.package_reference,
                    package_id: selectedTier.package_id,
                    subscription_id: session.subscription,
                    mode: user?.payment_plane,
                    expires_at: expiresAt,
                    paid_amount: session.amount_total / 100,
                    payment_status: session?.payment_status,
                    status: "active",
                });
                await packages_table_1.default.create({
                    user_id: user.id,
                    title: selectedTier.title,
                    per_month_charges: subscriptionType === "monthly" ? monthlyPrice : 0,
                    yearly_per_month_charges: subscriptionType === "yearly" ? yearlyPrice : 0,
                    package_subscriptionId: session.subscription,
                    monthly_sub_priceId: subscriptionType === "monthly" ? monthlyPriceId : "",
                    yearly_sub_priceId: subscriptionType === "yearly" ? yearlyPriceId : "",
                    package_reference: selectedTier.package_reference,
                    features: selectedTier.package_reference,
                });
                return {
                    message: "Subscription created successfully",
                    sessionId: session.id,
                    url: session.url,
                };
            }
            // return session
        }
        catch (error) {
            throw new Error(`Error fetching packages: ${error.message}`);
        }
    }
    async webhook(req, res) {
        const sig = req.headers["stripe-signature"];
        if (!sig) {
            return res.status(400).send("Missing stripe-signature header");
        }
        try {
            const event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            console.log(event, "event");
            if (event.type === "invoice.payment_succeeded") {
                const invoice = event.data.object;
                if (invoice.billing_reason === "subscription_cycle" && invoice.subscription) {
                    console.log("Recurring subscription payment succeeded:", invoice);
                    await this.handleUpdateSubscription(invoice);
                }
            }
            return { status: 200, body: { received: true } };
            // return res.json({ received: true });
        }
        catch (error) {
            console.error("Webhook error:", error);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
    async handleUpdateSubscription(invoice) {
        const subscriptionId = invoice.subscription;
        const subscription = await subscriptions_table_1.default.findOne({
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
        }
        else {
            console.error("Subscription not found for ID:", subscriptionId);
        }
    }
    async cancelSubscription(userId) {
        try {
            // Find user's active subscription
            const subscription = await subscriptions_table_1.default.findOne({
                where: {
                    user_id: userId,
                    status: 'active'
                }
            });
            if (!subscription) {
                throw new Error('No active subscription found');
            }
            // Cancel the subscription in Stripe
            const stripeSubscription = await stripe_1.stripe.subscriptions.update(subscription.subscription_id, {
                cancel_at_period_end: false
            });
            // Update subscription in database
            const updateData = {
                status: 'cancelled',
                cancellation_date: new Date(),
                updated_at: new Date()
            };
            await Promise.all([
                subscriptions_table_1.default.update(updateData, {
                    where: { subscription_id: subscription.subscription_id }
                }),
                packages_table_1.default.update({ status: 'inactive' }, { where: { package_subscriptionId: subscription.subscription_id } })
            ]);
            return {
                message: 'Subscription cancelled successfully',
                cancelDate: new Date()
            };
        }
        catch (error) {
            console.error('Subscription cancellation error:', error);
            throw new Error(`Failed to cancel subscription: ${error.message}`);
        }
    }
}
exports.default = new SubscriptionService();
