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
// cancel subscription menul with api
router.post('/cancel-subscription', subscription.cancelSubscription.bind(subscription));
// upgrade subscription
router.post('/upgrade-subscription', subscription.upgradeSubscription.bind(subscription));
// downgrade subscription
router.post('/downgrade-subscription', subscription.downgradeSubscription.bind(subscription));
// cancel response from the stripe
router.get('/cancel', subscription.stripeCancelSubscription.bind(subscription));
router.post("/webhook", express_1.default.raw({ type: 'application/json' }), subscription.webhook.bind(subscription));
exports.default = router;
// api/subscription/webhook
