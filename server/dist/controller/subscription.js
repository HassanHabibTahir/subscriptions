"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionServuce_1 = __importDefault(require("../services/subscriptionServuce"));
const package_1 = require("../utils/package");
class SubscriptionController {
    async createPackage(req, res) {
        try {
            const { tierName, email, condition } = req.body;
            console.log(tierName, email, "email,tireName");
            const selectedTier = await (0, package_1.getTierByName)(tierName);
            const priceId = await (0, package_1.getPriceId)(tierName, condition);
            const newPackage = await subscriptionServuce_1.default.createPackage({ ...selectedTier, email, condition, priceId });
            res.status(201).json(newPackage);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
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
    async webhook(req, res) {
        const response = await subscriptionServuce_1.default.webhook(req, res);
        res.status(response.status).json(response.body);
    }
    async cancelSubscription(req, res) {
        try {
            const { userId } = req.body;
            const result = await subscriptionServuce_1.default.cancelSubscription(userId);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = SubscriptionController;
