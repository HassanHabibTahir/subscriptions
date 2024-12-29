"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_1 = __importDefault(require("../controller/subscription"));
const router = express_1.default.Router();
const subscription = new subscription_1.default();
router.post('/packages', subscription.createPackage.bind(subscription));
router.get('/success', subscription.getPackages.bind(subscription));
router.delete('/cancel', subscription.cancelSubscription.bind(subscription));
router.post("/webhook", express_1.default.raw({ type: "application/json" }), subscription.webhook.bind(subscription));
// router.post('/subscriptions/paid', SubscriptionController.createSubscription);
// router.get('/subscriptions/:userId', SubscriptionController.getUserSubscription);
// router.put('/subscriptions/:userId', SubscriptionController.updateUserSubscription);
exports.default = router;
// api/subscription/webhook
