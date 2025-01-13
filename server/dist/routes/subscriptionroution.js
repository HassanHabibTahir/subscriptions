"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_1 = __importDefault(require("../controller/subscription"));
const router = express_1.default.Router();
const subscription = new subscription_1.default();
// get all pakages from sql db
router.get("/get-pakages", subscription.getAllPakages.bind(subscription));
// create a new pakage
router.post("/create-subscription", subscription.createPackage.bind(subscription));
// get  success packages from stripe
router.get("/success", subscription.getPackage.bind(subscription));
// cancel subscription menul with api
router.post("/cancel-subscription", subscription.cancelSubscription.bind(subscription));
// upgrade subscription or downgrade
router.post("/upgrade-subscription", subscription.upgradeSubscription.bind(subscription));
// cancel response from the stripe
router.get("/cancel", subscription.stripeCancelSubscription.bind(subscription));
// get User subscription
router.get("/user-subscription", subscription.getUserSubscription.bind(subscription));
router.post("/webhook", express_1.default.raw({ type: "application/json" }), subscription.webhook.bind(subscription));
exports.default = router;
