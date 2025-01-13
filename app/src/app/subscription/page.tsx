'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const packages = [
  {
    name: 'Starter',
    price: 0,
    features: ['Basic access', 'Limited storage', 'Email support'],
    package_reference: "starter_tier",
  },
  {
    name: 'Enthusiast',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    features: ['Full access', 'Increased storage', 'Priority email support', 'Monthly newsletter'],
    package_reference: "enthusiast_tier",
  },
  {
    name: 'Collector',
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    features: ['Premium access', 'Unlimited storage', '24/7 phone support', 'Exclusive events', 'Quarterly gifts'],
    package_reference: "collector_tier",
  },
  {
    name: 'Elite',
    monthlyPrice: 79.99,
    yearlyPrice: 799.99,
    features: ['VIP access', 'Unlimited storage', 'Dedicated account manager', 'Private events', 'Monthly rare item'],
    package_reference: "elite_tier",
  },
]

export default function SubscriptionPage() {
  const userId = localStorage.getItem("user");
  const [yearlyPlans, setYearlyPlans] = useState<{ [key: string]: boolean }>({
    Enthusiast: false,
    Collector: false,
    Elite: false,
  });
  const [email, setEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userSubscription, setUserSubscription] = useState<any>(null);

  const togglePlan = (planName: string) => {
    setYearlyPlans(prev => ({ ...prev, [planName]: !prev[planName] }));
  };

  const handleSubscription = async (tierName: string, email: string, isYearly: boolean) => {
    const payload = {
      tierName,
      email,
      condition: isYearly ? 'yearly' : 'monthly',
    };

    try {
      console.log(payload, "payload");
      const response = await fetch('http://localhost:4000/api/subscription/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Subscription response:', data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Subscription successful!');
      }

      alert(data.message);
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    (async () => {
      try {
        if (userId) {
          console.log(userId, "USERiD");
          const response = await fetch(`http://localhost:4000/api/subscription/user-subscription?id=${userId}`);
          const data = await response.json();
          setUserSubscription(data);
          console.log(data, "user -------->");
        }
      } catch (error) {
        console.error("Error fetching user subscription:", error);
      }
    })();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Subscription Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect package for your collecting needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`flex flex-col justify-between ${
                userSubscription?.package_reference === pkg.package_reference
                  ? 'border-4 border-green-500'
                  : 'border border-gray-200'
              }`}
            >
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>
                  {pkg.price === 0
                    ? 'Always free'
                    : yearlyPlans[pkg.name]
                    ? 'Billed annually'
                    : 'Billed monthly'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">
                  {pkg.price === 0 ? (
                    'Free'
                  ) : (
                    <>
                      $
                      {yearlyPlans[pkg.name]
                        ? pkg.yearlyPrice?.toFixed(2) ?? 'N/A'
                        : pkg.monthlyPrice?.toFixed(2) ?? 'N/A'}
                      <span className="text-base font-normal text-gray-500">
                        {yearlyPlans[pkg.name] ? '/year' : '/month'}
                      </span>
                    </>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {pkg.price !== 0 && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${pkg.name}-toggle`} className="text-sm">
                      Monthly
                    </Label>
                    <Switch
                      id={`${pkg.name}-toggle`}
                      checked={yearlyPlans[pkg.name]}
                      onCheckedChange={() => togglePlan(pkg.name)}
                    />
                    <Label htmlFor={`${pkg.name}-toggle`} className="text-sm">
                      Yearly
                    </Label>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {userSubscription?.package_reference === pkg.package_reference ? (
                  <span className="text-green-600 font-bold">Purchased</span>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleSubscription(pkg.package_reference, email, yearlyPlans[pkg.name])
                    }
                  >
                    {pkg.price === 0 ? 'Start for Free' : `Subscribe to ${pkg.name}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
