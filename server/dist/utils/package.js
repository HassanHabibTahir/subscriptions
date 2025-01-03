"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriceId = exports.getTierByName = exports.tiers = void 0;
exports.calculateExpirationDate = calculateExpirationDate;
exports.extractSubscriptionDetails = extractSubscriptionDetails;
exports.tiers = {
    STARTER: {
        title: "Starter Tier",
        package_reference: "starter_tier",
        package_id: 1,
        is_free: true,
    },
    ENTHUSIAST: {
        title: "Enthusiast Tier",
        package_reference: "enthusiast_tier",
        package_id: 2,
        is_free: false,
    },
    COLLECTOR: {
        title: "Collector Tier",
        package_reference: "collector_tier",
        package_id: 3,
        is_free: false,
    },
    ELITE: {
        title: "Elite Tier",
        package_reference: "elite_tier",
        package_id: 4,
        is_free: false,
    },
    BASIC: {
        title: "Basic Tier",
        package_reference: "basic_tier",
        package_id: 5,
        is_free: true,
    },
};
const getTierByName = (tierName) => {
    switch (tierName.toLowerCase()) {
        case "starter_tier":
            return exports.tiers.STARTER;
        case "enthusiast_tier":
            return exports.tiers.ENTHUSIAST;
        case "collector_tier":
            return exports.tiers.COLLECTOR;
        case "elite_tier":
            return exports.tiers.ELITE;
        case "basic_tier":
            return exports.tiers.BASIC;
        default:
            throw new Error(`Unknown tier name: ${tierName}`);
    }
};
exports.getTierByName = getTierByName;
// Check the  Subscription
// Function to get the price ID based on package and condition
const getPriceId = (packageName, condition) => {
    const priceMap = {
        enthusiast_tier: {
            monthly: process.env.PRICE_ID_ENTHUSIAST_MONTHLY,
            yearly: process.env.PRICE_ID_ENTHUSIAST_YEARLY,
        },
        collector_tier: {
            monthly: process.env.PRICE_ID_COLLECTOR_MONTHLY,
            yearly: process.env.PRICE_ID_COLLECTOR_YEARLY,
        },
        elite_tier: {
            monthly: process.env.PRICE_ID_ELITE_MONTHLY,
            yearly: process.env.PRICE_ID_ELITE_YEARLY,
        },
        basic_tier: {
            day: process.env.PRICE_ID_ONE_DAY,
        },
    };
    return priceMap[packageName]?.[condition];
};
exports.getPriceId = getPriceId;
function calculateExpirationDate(condition) {
    let expirationDate;
    if (condition === "monthly") {
        expirationDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    }
    else if (condition === "yearly") {
        expirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }
    else if (condition === "day") {
        expirationDate = new Date(new Date().setDate(new Date().getDate() + 1));
    }
    return expirationDate;
}
function extractSubscriptionDetails(subscriptionItems) {
    let monthlyPrice = 0;
    let yearlyPrice = 0;
    let monthlyPriceId = "";
    let yearlyPriceId = "";
    let dayPrice = 0;
    let dayPriceId = "";
    subscriptionItems.forEach((item) => {
        if (item.price.recurring.interval === "month") {
            monthlyPrice = item.amount_total / 100;
            monthlyPriceId = item.price.id;
        }
        if (item.price.recurring.interval === "year") {
            yearlyPrice = item.amount_total / 100;
            yearlyPriceId = item.price.id;
        }
        if (item.price.recurring.interval === "day") {
            dayPrice = item.amount_total / 100;
            dayPriceId = item.price.id;
        }
    });
    return {
        monthlyPrice,
        yearlyPrice,
        monthlyPriceId,
        yearlyPriceId,
        dayPrice,
        dayPriceId,
    };
}
