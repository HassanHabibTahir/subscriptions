import "dotenv/config";
import express from "express";
import * as path from "path";
import cors from "cors";
import Stripe from "stripe";
import sequelize from "./sequelize";
import subscriptionRoutes from "./routes/subscriptionRoution";
import authRoutes from "./routes/authRoutes";
const { Sequelize, DataTypes } = require("sequelize");
const app: any = express();

// stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/create-one-time-payment", async (req: any, res: any) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "product",
          },
          unit_amount: 50000 * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cancel`,
  });
  res.json({
    message: "Your payment was successful'",
    sessionId: session.id,
    url: session.url,
  });
});

// create a subscription payment session
app.post("/create-subscription-payment", async (req: any, res: any) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Price ID from your Stripe dashboard
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    res.json({
      message: "Subscription created successfully",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating subscription session:", error);
    res.status(500).json({ error: "Failed to create subscription session" });
  }
});

// Get subscription details
app.get("/success", async (req: any, res: express.Response) => {
  try {
    console.log(req.query.session_id);

    const result = await Promise.all([
      stripe.checkout.sessions.retrieve(req.query.session_id, {
        expand: ["payment_intent.payment_method"],
      }),
      stripe.checkout.sessions.listLineItems(req.query.session_id),
    ]);

    // console.log(JSON.stringify( result))
    res.json("success");
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    res.status(500).json({ error: "Failed to retrieve subscription" });
  }
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: express.Request, res: express.Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription;
        console.log("New subscription created:", subscription.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);
app.use('/api', subscriptionRoutes);
app.use('/api/auth', authRoutes);
app.get("/", (req: any, res: any) => {
  res.json({
    message: "Hello World!",
  });
});



app.use(express.static(path.join(__dirname, "public")));
const main = async () => {
 
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");

      app.listen({ port: process.env.PORT || 4000 }, () =>
        console.log(
          `Server ready at http://localhost:${process.env.PORT || 4000}`
        )
      );
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
};

main().catch(console.error);
