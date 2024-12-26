import express from 'express';
import SubscriptionController from '../controller/subscription';
const router = express.Router();

router.post('/packages', SubscriptionController.createPackage);
router.get('/packages', SubscriptionController.getPackages);
router.post('/subscriptions/paid', SubscriptionController.createSubscription);
router.get('/subscriptions/:userId', SubscriptionController.getUserSubscription);
router.put('/subscriptions/:userId', SubscriptionController.updateUserSubscription);
router.delete('/subscriptions/:userId', SubscriptionController.cancelSubscription);

export default router;

