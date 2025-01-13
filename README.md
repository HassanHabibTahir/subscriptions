# 🚀 Express Server Setup (MDX Guide)

This MDX file explains how to set up a basic **Express server** with **Sequelize** for managing database connections and API routes.

```javascript
import "dotenv/config";
import express from "express";
import * as path from "path";
import cors from "cors";
import sequelize from "./sequelize";
import subscriptionRoutes from "./routes/subscriptionRoution";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";
```

We create an `app` instance and configure middlewares like `bodyParser`, `cors`, and static file serving. The routes for subscriptions and authentication are added using `app.use()`.

```javascript
const app = express();
app.use('/api/subscription/webhook', bodyParser.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cors());
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/auth', authRoutes);
```

## ✏️ Auth Route Setup

The `authRoutes` file handles user authentication logic. Here's a sample route for signing up users:

```javascript
import express, { Router } from "express";
import AuthController from "../controller/authcontroller";

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup.bind(authController));

export default router;
```

## 📦 Subscription Route Setup

The `subscriptionRoutes` file manages all subscription-related functionalities, such as getting packages, creating subscriptions, and handling Stripe events.

```javascript
import express from "express";
import SubscriptionController from "../controller/subscription";

const router = express.Router();
const subscription = new SubscriptionController();

// Get all packages from the SQL database
router.get("/get-pakages", subscription.getAllPakages.bind(subscription));

// Create a new subscription package
router.post("/create-subscription", subscription.createPackage.bind(subscription));

// Retrieve successful packages from Stripe
router.get("/success", subscription.getPackage.bind(subscription));

// Cancel subscription manually via API
router.post("/cancel-subscription", subscription.cancelSubscription.bind(subscription));

// Upgrade or downgrade subscription
router.post("/upgrade-subscription", subscription.upgradeSubscription.bind(subscription));

// Handle Stripe's cancel response
router.get("/cancel", subscription.stripeCancelSubscription.bind(subscription));

// Get user subscription details
router.get("/user-subscription", subscription.getUserSubscription.bind(subscription));

// Stripe webhook for subscription events
router.post("/webhook", express.raw({ type: "application/json" }), subscription.webhook.bind(subscription));

export default router;
```

This route setup efficiently manages user subscriptions and integrates Stripe events for automated responses.

## 👤 Auth Controller Setup

The `AuthController` class handles user-related operations like signup. It interacts with the `AuthService` to validate user information and manage user records.

```javascript
import { Request, Response } from "express";
import User from "../model/users_models";
import SubscriptionService from "../services/subscriptionServuce";
import { AuthService } from "../services/AuthService";

class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const body = req.body;

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

export default AuthController;
```

This controller handles user signup by first checking if the user already exists. If not, it creates a new user and returns a success response.

# Subscription Controller

This README provides an overview of the `SubscriptionController` class, which is responsible for handling subscription-related operations in an Express.js application.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Methods](#methods)
- [Usage](#usage)
- [Error Handling](#error-handling)

## Overview

The `SubscriptionController` class manages various subscription-related operations, including creating packages, handling webhooks, canceling subscriptions, upgrading subscriptions, and retrieving subscription information.

## Dependencies

This controller relies on the following dependencies:

- Express.js (for handling HTTP requests and responses)
- `SubscriptionService` (for business logic related to subscriptions)
- `Subscription` model (for database operations)
- Utility functions (`getPriceId`, `getTierByName`)

## Methods

### `createPackage(req: Request, res: Response)`

Creates a new subscription package.

### `getPackage(req: Request, res: Response)`

Retrieves package information and redirects to the subscription page.

### `webhook(req: Request, res: Response)`

Handles webhook events related to subscriptions.

### `cancelSubscription(req: Request, res: Response)`

Cancels a user's subscription.

### `upgradeSubscription(req: Request, res: Response)`

Upgrades a user's subscription.

### `stripeCancelSubscription(req: Request, res: Response)`

Placeholder for handling Stripe subscription cancellations.

### `getAllPakages(req: Request, res: Response)`

Retrieves all available subscription packages.

### `getUserSubscription(req: Request, res: Response)`

Retrieves subscription information for a specific user.

## Usage

To use this controller, you should set up routes in your Express application that map to these methods. For example:

```javascript
import express from 'express';
import SubscriptionController from './path/to/SubscriptionController';

const router = express.Router();
const subscriptionController = new SubscriptionController();

router.post('/package', subscriptionController.createPackage);
router.get('/package', subscriptionController.getPackage);
router.post('/webhook', subscriptionController.webhook);
router.post('/cancel', subscriptionController.cancelSubscription);
router.post('/upgrade', subscriptionController.upgradeSubscription);
router.get('/packages', subscriptionController.getAllPakages);
router.get('/user-subscription', subscriptionController.getUserSubscription);

export default router;
