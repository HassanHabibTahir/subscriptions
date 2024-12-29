import { Request, Response } from 'express';
import SubscriptionService from '../services/subscriptionServuce';
import { getPriceId, getTierByName } from '../utils/package';

class SubscriptionController {
  async createPackage(req: Request, res: Response) {
    try {
     const {tierName, email,condition} = req.body;
     console.log(tierName, email , "email,tireName");
      const selectedTier = await getTierByName(tierName);
      const priceId = await  getPriceId(tierName,condition);
      const newPackage = await SubscriptionService.createPackage({...selectedTier,email,condition,priceId});
     
      res.status(201).json(newPackage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPackages(req: Request, res: Response) {
    try {
      const sessionId =  req.query.session_id
      const packages = await SubscriptionService.getPackages(sessionId);
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  async webhook(req:Request,res:Response){
 const  response = await SubscriptionService.webhook(req,res);
 res.status(response.status).json(response.body);

  }


  async cancelSubscription(req: Request, res: Response) {
    try {
      const {userId} = req.body;
      const result =  await SubscriptionService.cancelSubscription(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }




}

export default  SubscriptionController;

