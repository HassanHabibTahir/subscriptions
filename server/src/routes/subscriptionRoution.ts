import express from 'express';
import SubscriptionController from '../controller/subscription';
const router = express.Router();
const subscription = new SubscriptionController();
router.post('/packages', subscription.createPackage.bind(subscription));
router.get('/success', subscription.getPackages.bind(subscription));
router.delete('/cancel', subscription.cancelSubscription.bind(subscription));
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    subscription.webhook.bind(subscription)

  );
  
// router.post('/subscriptions/paid', SubscriptionController.createSubscription);
// router.get('/subscriptions/:userId', SubscriptionController.getUserSubscription);
// router.put('/subscriptions/:userId', SubscriptionController.updateUserSubscription);

export default router;


// api/subscription/webhook
