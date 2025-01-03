import { Request, Response } from "express";
import SubscriptionService from "../services/subscriptionServuce";
import { getPriceId, getTierByName } from "../utils/package";
import Subscription from "../model/subscriptions_table";

class SubscriptionController {
  async createPackage(req: Request, res: Response) {
    try {
      const { tierName, email, condition } = req.body;
      console.log(tierName, email, "email,tireName");
      const selectedTier = await getTierByName(tierName);
      const priceId = await getPriceId(tierName, condition);
      const newPackage = await SubscriptionService.createPackage({
        ...selectedTier,
        email,
        condition,
        priceId,
      });

      res.status(201).json(newPackage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // pakces subscription
  async getPackages(req: Request, res: Response) {
    try {
      const sessionId = req.query.session_id;
      const packages = await SubscriptionService.getPackages(sessionId);
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // webhook
  async webhook(req: Request, res: Response) {
    const response = await SubscriptionService.webhook(req, res);
    res.status(response.status).json(response.body);
  }

  // cancel subscription by api

  async cancelSubscription(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      console.log(userId, "userId");
      const subscription = await Subscription.findOne({
        where: { user_id: userId },
      });

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      const result = await SubscriptionService.cancelSubscription(subscription);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
// upgrade subscription
  async upgradeSubscription(req: Request, res: Response) {
    try {
      const { userId ,newPriceId} = req.body;
      const subscription = await Subscription.findOne({
        where: { user_id: userId },
      });

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      const result = await SubscriptionService.upgradeSubscription(
        subscription,
        newPriceId
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
// downgrade subscription
  async downgradeSubscription(req: Request, res: Response) {
    try {
      const { userId, newPriceId } = req.body;
      const subscription = await Subscription.findOne({
        where: { user_id: userId },
      });

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      const result = await SubscriptionService.downgradeSubscription(
        subscription,
        newPriceId
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // cancel form stripe subscription
  async stripeCancelSubscription(req: Request, res: Response) {
    try {
      console.log("cancelling form subscription");
      res.json("cancelled");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default SubscriptionController;
