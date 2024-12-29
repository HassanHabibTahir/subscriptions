import express, { Router } from "express";
import AuthController from "../controller/authcontroller";

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup.bind(authController));

export default router;
