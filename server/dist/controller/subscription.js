"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionServuce_1 = __importDefault(require("../services/subscriptionServuce"));
const subscriptions_table_1 = __importDefault(require("../model/subscriptions_table"));
class SubscriptionController {
    async createPackage(req, res) {
        try {
            const newPackage = await subscriptionServuce_1.default.createPackage({
                ...req.body,
            });
            res.status(201).json(newPackage);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // pakces subscription
    async getPackage(req, res) {
        try {
            const sessionId = req.query.session_id;
            const packages = await subscriptionServuce_1.default.getPackage(sessionId);
            // res.status(200).json(packages);
            res.redirect(`${"http://localhost:3000"}/subscription`);
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
            const result = await subscriptionServuce_1.default.cancelSubscription(subscription, userId);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // upgrade subscription
    async upgradeSubscription(req, res) {
        try {
            const body = req.body;
            const subscription = await subscriptions_table_1.default.findOne({
                where: { user_id: body?.userId },
            });
            if (!subscription) {
                return res.status(404).json({ error: "Subscription not found" });
            }
            const result = await subscriptionServuce_1.default.upgradeSubscription(subscription, body);
            res.json(result);
        }
        catch (error) {
            console.log(error, "error");
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
    //
    // // get all packages from sql
    async getAllPakages(req, res) {
        try {
            const packages = await subscriptionServuce_1.default.getAllPackages();
            res.status(200).json(packages);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // getUser
    async getUserSubscription(req, res) {
        try {
            const userId = req.query.id;
            const user = await subscriptionServuce_1.default.findUserSubscription(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = SubscriptionController;
