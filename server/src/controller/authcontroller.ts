import { Request, Response } from "express";
import User from "../model/users_models";
import SubscriptionService from "../services/subscriptionServuce";
import { AuthService } from "../services/AuthService";
class AuthController {

   async signup(req: Request, res: Response) {
    try {
      
      const body= req.body;
      console.log(body,"body")
      const user = await AuthService.findUser(body?.email);
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const result = await AuthService.signup(body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default   AuthController;
