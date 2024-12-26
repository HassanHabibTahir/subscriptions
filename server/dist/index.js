"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const cors_1 = __importDefault(require("cors"));
const stripe_1 = __importDefault(require("stripe"));
const sequelize_1 = __importDefault(require("./sequelize"));
const subscriptionRoution_1 = __importDefault(require("./routes/subscriptionRoution"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const { Sequelize, DataTypes } = require("sequelize");
const app = (0, express_1.default)();
// stripe configuration
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.post("/create-one-time-payment", async (req, res) => {
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
app.post("/create-subscription-payment", async (req, res) => {
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
    }
    catch (error) {
        console.error("Error creating subscription session:", error);
        res.status(500).json({ error: "Failed to create subscription session" });
    }
});
// Get subscription details
app.get("/success", async (req, res) => {
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
    }
    catch (error) {
        console.error("Error retrieving subscription:", error);
        res.status(500).json({ error: "Failed to retrieve subscription" });
    }
});
app.post("/webhook", express_1.default.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        case "customer.subscription.created":
            const subscription = event.data.object;
            console.log("New subscription created:", subscription.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
});
app.use('/api', subscriptionRoution_1.default);
app.use('/api/auth', authRoutes_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "Hello World!",
    });
});
app.use(express_1.default.static(path.join(__dirname, "public")));
const main = async () => {
    sequelize_1.default
        .authenticate()
        .then(() => {
        console.log("Connection has been established successfully.");
        app.listen({ port: process.env.PORT || 4000 }, () => console.log(`Server ready at http://localhost:${process.env.PORT || 4000}`));
    })
        .catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });
};
main().catch(console.error);
