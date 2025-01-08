import express from "express";
import SubscriptionController from "../controller/subscription";
const router = express.Router();
const subscription = new SubscriptionController();

// get all pakages from sql db
router.get("/get-pakages", subscription.getAllPakages.bind(subscription));
// create a new pakage
router.post("/packages", subscription.createPackage.bind(subscription));
// get  success packages from stripe
router.get("/success", subscription.getPackage.bind(subscription));
// cancel subscription menul with api
router.post(
  "/cancel-subscription",
  subscription.cancelSubscription.bind(subscription)
);
// upgrade subscription
router.post(
  "/upgrade-subscription",
  subscription.upgradeSubscription.bind(subscription)
);
// downgrade subscription
router.post(
  "/downgrade-subscription",
  subscription.downgradeSubscription.bind(subscription)
);
// cancel response from the stripe
router.get("/cancel", subscription.stripeCancelSubscription.bind(subscription));
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  subscription.webhook.bind(subscription)
);
export default router;

// api/subscription/webhook
