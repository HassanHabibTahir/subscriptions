"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTierByName = exports.tiers = void 0;
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
};
const getTierByName = (tierName) => {
    switch (tierName.toLowerCase()) {
        case "starter":
            return exports.tiers.STARTER;
        case "enthusiast":
            return exports.tiers.ENTHUSIAST;
        case "collector":
            return exports.tiers.COLLECTOR;
        case "elite":
            return exports.tiers.ELITE;
        default:
            throw new Error(`Unknown tier name: ${tierName}`);
    }
};
exports.getTierByName = getTierByName;
