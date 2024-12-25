"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionServuce_1 = __importDefault(require("../services/subscriptionServuce"));
class SubscriptionController {
    async createPackage(req, res) {
        try {
            const newPackage = await subscriptionServuce_1.default.createPackage(req.body);
            res.status(201).json(newPackage);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getPackages(req, res) {
        try {
            const packages = await subscriptionServuce_1.default.getPackages();
            res.status(200).json(packages);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createSubscription(req, res) {
        try {
            const newSubscription = await subscriptionServuce_1.default.createSubscription(req.body);
            res.status(201).json(newSubscription);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getUserSubscription(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const subscription = await subscriptionServuce_1.default.getUserSubscription(userId);
            res.status(200).json(subscription);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateUserSubscription(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const updatedSubscription = await subscriptionServuce_1.default.updateUserSubscription(userId, req.body);
            res.status(200).json(updatedSubscription);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async cancelSubscription(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const cancelledSubscription = await subscriptionServuce_1.default.cancelSubscription(userId);
            res.status(200).json(cancelledSubscription);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = new SubscriptionController();
