export const tiers = {
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

export const getTierByName = (tierName: string) => {
  switch (tierName.toLowerCase()) {
    case "starter":
      return tiers.STARTER;
    case "enthusiast":
      return tiers.ENTHUSIAST;
    case "collector":
      return tiers.COLLECTOR;
    case "elite":
      return tiers.ELITE;
    default:
      throw new Error(`Unknown tier name: ${tierName}`);
  }
};

// Check the  Subscription
// Function to get the price ID based on package and condition
export const getPriceId = (packageName: string, condition: string): string => {
  const priceMap: { [key: string]: { monthly: string; yearly: string } } = {
    enthusiast: {
      monthly: process.env.PRICE_ID_ENTHUSIAST_MONTHLY!,
      yearly: process.env.PRICE_ID_ENTHUSIAST_YEARLY!,
    },
    collector: {
      monthly: process.env.PRICE_ID_COLLECTOR_MONTHLY!,
      yearly: process.env.PRICE_ID_COLLECTOR_YEARLY!,
    },
    Elite: {
      monthly: process.env.PRICE_ID_ELITE_MONTHLY!,
      yearly: process.env.PRICE_ID_ELITE_YEARLY!,
    },
  };

  return priceMap[packageName]?.[condition];
};
