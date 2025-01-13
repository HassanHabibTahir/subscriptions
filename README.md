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


# User Model

 the User model used in the application. The User model represents the structure and behavior of user data in the database.

## Table of Contents

1. [Model Overview](#model-overview)
2. [Fields](#fields)
3. [Usage](#usage)
4. [Timestamps](#timestamps)
5. [Sequelize Configuration](#sequelize-configuration)

## Model Overview

The User model is implemented using Sequelize, a popular ORM for Node.js. It extends the Sequelize `Model` class and defines the structure of the `users` table in the database.

## Fields

The User model includes the following fields:

| Field Name          | Type      | Constraints                    | Description                                    |
|---------------------|-----------|--------------------------------|------------------------------------------------|
| id                  | INTEGER   | Primary Key, Auto Increment    | Unique identifier for the user                 |
| type                | STRING    | Not Null                       | Type of user (e.g., 'admin', 'regular')        |
| name                | STRING    | Not Null                       | Full name of the user                          |
| username            | STRING    | Not Null, Unique               | Unique username for the user                   |
| display_name        | STRING    | Not Null                       | Name to be displayed publicly                  |
| email               | STRING    | Not Null, Unique               | User's email address                           |
| password            | STRING    | Not Null                       | Hashed password of the user                    |
| image_url           | STRING    | Nullable                       | URL to the user's profile image                |
| City                | STRING    | Nullable                       | User's city of residence                       |
| state               | STRING    | Nullable                       | User's state of residence                      |
| membership_type     | STRING    | Nullable                       | Type of membership the user has                |
| payment_plane       | STRING    | Nullable                       | Payment plan of the user                       |
| package_id          | INTEGER   | Nullable                       | ID of the package associated with the user     |
| paymentSessionId    | STRING    | Nullable                       | ID of the payment session                      |
| forget_password_code| STRING    | Nullable                       | Code for password reset functionality          |
| display_real_name   | BOOLEAN   | Default: true                  | Whether to display the user's real name        |
| is_deleted          | BOOLEAN   | Default: false                 | Soft delete flag                               |
| is_verified         | BOOLEAN   | Default: false                 | Whether the user's account is verified         |
| last_login          | DATE      | Nullable                       | Timestamp of the user's last login             |
| created_at          | DATE      | Default: Current Timestamp     | Timestamp of when the user was created         |
| updated_at          | DATE      | Default: Current Timestamp     | Timestamp of the last update to the user       |

## Usage

To use the User model in your application, you can import it and use Sequelize methods to interact with the database. Here are some examples:

```typescript
import User from './path/to/User';

// Create a new user
const newUser = await User.create({
  type: 'regular',
  name: 'John Doe',
  username: 'johndoe',
  display_name: 'John',
  email: 'john@example.com',
  password: 'hashedpassword',
  // ... other fields as needed
});

// Find a user by id
const user = await User.findByPk(1);

// Find a user by email
const userByEmail = await User.findOne({ where: { email: 'john@example.com' } });

// Update a user
await user.update({ display_name: 'Johnny' });

// Delete a user (soft delete)
await user.update({ is_deleted: true });

# Subscription Model

The Subscription model used in the application. The Subscription model represents the structure and behavior of subscription data in the database.

## Table of Contents

1. [Model Overview](#model-overview)
2. [Fields](#fields)
3. [Usage](#usage)
4. [Timestamps](#timestamps)
5. [Sequelize Configuration](#sequelize-configuration)

## Model Overview

The Subscription model is implemented using Sequelize, a popular ORM for Node.js. It extends the Sequelize `Model` class and defines the structure of the `subscriptions` table in the database.

## Fields

The Subscription model includes the following fields:

| Field Name         | Type      | Constraints                    | Description                                    |
|--------------------|-----------|--------------------------------|------------------------------------------------|
| id                 | INTEGER   | Primary Key, Auto Increment    | Unique identifier for the subscription         |
| user_id            | INTEGER   | Not Null                       | ID of the user associated with the subscription|
| email              | STRING    | Not Null                       | Email address associated with the subscription |
| package_title      | STRING    | Not Null                       | Title of the subscribed package                |
| package_reference  | STRING    | Not Null                       | Reference code for the package                 |
| package_id         | INTEGER   | Nullable                       | ID of the package (no foreign key constraint)  |
| subscription_id    | STRING    | Not Null                       | Unique identifier for the subscription         |
| mode               | STRING    | Not Null                       | Mode of the subscription (e.g., 'monthly')     |
| expires_at         | DATE      | Not Null                       | Expiration date of the subscription            |
| paid_amount        | FLOAT     | Not Null                       | Amount paid for the subscription               |
| payment_status     | STRING    | Not Null                       | Status of the payment                          |
| status             | STRING    | Not Null                       | Current status of the subscription             |
| is_deleted         | BOOLEAN   | Default: false                 | Soft delete flag                               |
| is_verified        | BOOLEAN   | Default: false                 | Verification status of the subscription        |
| last_login         | DATE      | Nullable                       | Timestamp of the last login (if applicable)    |
| created_at         | DATE      | Default: Current Timestamp     | Timestamp of when the subscription was created |
| updated_at         | DATE      | Default: Current Timestamp     | Timestamp of the last update to the subscription |

## Usage

To use the Subscription model in your application, you can import it and use Sequelize methods to interact with the database. Here are some examples:

```typescript
import Subscription from './path/to/Subscription';

// Create a new subscription
const newSubscription = await Subscription.create({
  user_id: 1,
  email: 'user@example.com',
  package_title: 'Premium Plan',
  package_reference: 'PREM001',
  subscription_id: 'sub_123456',
  mode: 'monthly',
  expires_at: new Date('2024-01-01'),
  paid_amount: 29.99,
  payment_status: 'paid',
  status: 'active',
  // ... other fields as needed
});

// Find a subscription by id
const subscription = await Subscription.findByPk(1);

// Find subscriptions for a specific user
const userSubscriptions = await Subscription.findAll({ where: { user_id: 1 } });

// Update a subscription
await subscription.update({ status: 'cancelled' });

// Delete a subscription (soft delete)
await subscription.update({ is_deleted: true });








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

the `SubscriptionController` class, which is responsible for handling subscription-related operations in an Express.js application.

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
```

# Auth Service

the `AuthService` class, which is responsible for handling user authentication and subscription-related operations in the application.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Methods](#methods)
- [Usage](#usage)
- [Error Handling](#error-handling)

## Overview

The `AuthService` class manages user authentication and subscription processes. It provides methods for finding users, signing up new users, and handling subscription creation through Stripe for paid tiers.

## Dependencies

This service relies on the following dependencies:

- `tiers` from "../utils/package"
- `User` model from "../model/users_models"
- `Subscription` model from "../model/subscriptions_table"
- `getTierByName` from "../utils/package"
- `PackageTable` model from "../model/packages_table"
- `stripe` from "../utils/stripe"

## Methods

### `static async findUser(email: string)`

Finds a user by their email address.

#### Parameters:
- `email`: string - The email address of the user to find.

#### Returns:
- A Promise that resolves to the user object if found, or null if not found.

### `static async signup(body: any)`

Handles the user signup process, including creating a new user and setting up their subscription.

#### Parameters:
- `body`: any - An object containing the user's signup information, including:
  - `name`: string
  - `email`: string
  - `password`: string
  - `title`: string (tier title)
  - `is_free`: boolean
  - `tier`: string
  - `package_id`: string
  - `price_id`: string (for paid subscriptions)
  - `subscription_duration`: string (for paid subscriptions)

#### Returns:
- For free tiers:
  ```typescript
  {
    message: string,
    userId: string,
    subscription: true
  }

# SubscriptionService

The `SubscriptionService` class is responsible for managing subscription-related operations in the application. It handles creating packages, managing subscriptions, processing Stripe webhooks, and interacting with the database.

## Key Features

1. User subscription management
2. Package creation and retrieval
3. Stripe integration for payment processing
4. Webhook handling for subscription events
5. Subscription upgrades and cancellations

## Main Methods

### `findUserSubscription(user_id: any)`
Finds a user's subscription based on their user ID.

### `createPackage(data: any)`
Creates a new subscription package and initiates a Stripe checkout session.

### `getPackage(sessionId: any)`
Retrieves package information based on a Stripe session ID and updates or creates a subscription record.

### `cancelSubscription(subscription: any)`
Cancels a user's subscription both in Stripe and in the local database.

### `upgradeSubscription(subscription, body)`
Upgrades a user's subscription, updating both Stripe and local records.

### `webhook(req: any, res: any)`
Handles Stripe webhook events for subscription updates, cancellations, and invoice payments.

### `getAllPackages()`
Retrieves all available subscription packages from the database.

## Private Methods

- `handleUpdateSubscriptionPauseOrResume(invoice)`
- `handleInvoiceUpdateSubscription(invoice: Stripe.Invoice)`
- `handleSubscriptionCancelled(subscription)`

These methods handle specific webhook events and update the local database accordingly.

## Dependencies

- Stripe API
- Database models (Subscription, User, Packages)
- Utility functions (calculateExpirationDate, getTierByName)

## Usage

This service is designed to be used as a singleton. Import and use it in your controllers or route handlers like this:

```typescript
import SubscriptionService from './path/to/SubscriptionService';

// Example usage in a route handler
app.post('/create-package', async (req, res) => {
  try {
    const result = await SubscriptionService.createPackage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```