"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionServuce_1 = __importDefault(require("../services/subscriptionServuce"));
const package_1 = require("../utils/package");
const subscriptions_table_1 = __importDefault(require("../model/subscriptions_table"));
class SubscriptionController {
    async createPackage(req, res) {
        try {
            const { tierName, email, condition } = req.body;
            console.log(tierName, email, "email,tireName");
            const selectedTier = await (0, package_1.getTierByName)(tierName);
            const priceId = await (0, package_1.getPriceId)(tierName, condition);
            const newPackage = await subscriptionServuce_1.default.createPackage({
                ...selectedTier,
                email,
                condition,
                priceId,
            });
            res.status(201).json(newPackage);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // pakces subscription
    async getPackages(req, res) {
        try {
            const sessionId = req.query.session_id;
            const packages = await subscriptionServuce_1.default.getPackages(sessionId);
            res.status(200).json(packages);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // webhook
    async webhook(req, res) {
        const response = await subscriptionServuce_1.default.webhook(req, res);
        res.status(response.status).json(response.body);
    }
    // cancel subscription by api
    async cancelSubscription(req, res) {
        try {
            const { userId } = req.body;
            console.log(userId, "userId");
            const subscription = await subscriptions_table_1.default.findOne({
                where: { user_id: userId },
            });
            if (!subscription) {
                return res.status(404).json({ error: "Subscription not found" });
            }
            const result = await subscriptionServuce_1.default.cancelSubscription(subscription);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // upgrade subscription
    async upgradeSubscription(req, res) {
        try {
            const { userId, newPriceId, package_reference } = req.body;
            const subscription = await subscriptions_table_1.default.findOne({
                where: { user_id: userId },
            });
            if (!subscription) {
                return res.status(404).json({ error: "Subscription not found" });
            }
            const result = await subscriptionServuce_1.default.upgradeSubscription(subscription, newPriceId, package_reference);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // downgrade subscription
    async downgradeSubscription(req, res) {
        try {
            const { userId, newPriceId, package_reference } = req.body;
            const subscription = await subscriptions_table_1.default.findOne({
                where: { user_id: userId },
            });
            if (!subscription) {
                return res.status(404).json({ error: "Subscription not found" });
            }
            const result = await subscriptionServuce_1.default.downgradeSubscription(subscription, newPriceId, package_reference);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // cancel form stripe subscription
    async stripeCancelSubscription(req, res) {
        try {
            console.log("cancelling form subscription");
            res.json("cancelled");
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = SubscriptionController;
