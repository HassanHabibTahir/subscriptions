import { Request, Response } from "express";
import User from "../model/users_models";
import SubscriptionService from "../services/subscriptionServuce";
import { AuthService } from "../services/AuthService";
class AuthController {
  async signup(req: Request, res: Response) {
    try {
      console.log(req.body,"req.body");
      const { name, email, password, tier } = req.body;
      const result = await AuthService.signup(name, email, password, tier);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AuthController();
