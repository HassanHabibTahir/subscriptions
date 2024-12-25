import { Request, Response } from 'express';
import SubscriptionService from '../services/subscriptionServuce';

class SubscriptionController {
  async createPackage(req: Request, res: Response) {
    try {
      const newPackage = await SubscriptionService.createPackage(req.body);
      res.status(201).json(newPackage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPackages(req: Request, res: Response) {
    try {
      const packages = await SubscriptionService.getPackages();
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSubscription(req: Request, res: Response) {
    try {
      const newSubscription = await SubscriptionService.createSubscription(req.body);
      res.status(201).json(newSubscription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserSubscription(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const subscription = await SubscriptionService.getUserSubscription(userId);
      res.status(200).json(subscription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserSubscription(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const updatedSubscription = await SubscriptionService.updateUserSubscription(userId, req.body);
      res.status(200).json(updatedSubscription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const cancelledSubscription = await SubscriptionService.cancelSubscription(userId);
      res.status(200).json(cancelledSubscription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new SubscriptionController();

