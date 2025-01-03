"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { useRouter } from 'next/navigation'
import SelectPopup from "@/components/ui/SelectPopup";

// Define types for subscription options
interface SubscriptionOption {
  title: string;
  package_reference: string;
  package_id: number;
  is_free: boolean;
  price_id_monthly: string;
  price_id_yearly: string;
}

// Type for subscription options object
const subscriptionOptions: Record<string, SubscriptionOption> = {
  STARTER: {
    title: "Starter Tier",
    package_reference: "starter_tier",
    package_id: 1,
    is_free: true,
    price_id_monthly: "",
    price_id_yearly: "",
  },

  ENTHUSIAST: {
    title: "Enthusiast Tier",
    package_reference: "enthusiast_tier",
    package_id: 2,
    is_free: false,
    price_id_monthly: "price_1QaWc6F5wRQ0Uvcsmvmn7cGk",
    price_id_yearly: "price_1QaWfTF5wRQ0UvcsmB8DPNRw",
  },
  COLLECTOR: {
    title: "Collector Tier",
    package_reference: "collector_tier",
    package_id: 3,
    is_free: false,
    price_id_monthly: "price_1QaWiUF5wRQ0UvcsPxwx4QFr",
    price_id_yearly: "price_1QaWlOF5wRQ0Uvcs8giJjoZS",
  },
  ELITE: {
    title: "Elite Tier",
    package_reference: "elite_tier",
    package_id: 4,
    is_free: false,
    price_id_monthly: "price_1QaWnLF5wRQ0UvcsJrV5k42K",
    price_id_yearly: "price_1QaWpDF5wRQ0UvcsJED9EcTp",
  },
};

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [selectedTier, setSelectedTier] = useState<string>("ENTHUSIAST");
  const [subscriptionDuration, setSubscriptionDuration] =
    useState<string>("monthly");
  // const { push } = useRouter()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get selected product info based on tier and duration
    const selectedProduct = subscriptionOptions[selectedTier];
    const price_id =
      subscriptionDuration === "monthly"
        ? selectedProduct.price_id_monthly
        : selectedProduct.price_id_yearly;

    const payload = {
      ...formData,
      tier: selectedProduct.package_reference,
      subscription_duration: subscriptionDuration,
      price_id: price_id,
      is_free: selectedProduct.is_free,
      title: selectedProduct.title,
      package_id: selectedProduct.package_id,
    };

    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Signup successful:", data);

      alert("Signup successful!");
      // localStorage.setItem("userEmail", payload?.email)

      if (data.subscription) {
        console.log(data);
        alert(data?.message)
      } else {
        window.location.href = data.url;
        // alert(data?.message)
        console.log(data);
        // Redirect to the subscription page
        // push('/subscription')
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tier selection dropdown */}
            <div className="space-y-2">
              <SelectPopup
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                options={Object.fromEntries(
                  Object.entries(subscriptionOptions).map(([key, tier]) => [
                    key,
                    tier.title,
                  ])
                )}
                label="Select Your Tier"
              />
            </div>

            {/* Subscription Duration dropdown */}
            <div className="space-y-2">
              <SelectPopup
                value={subscriptionDuration}
                onChange={(e) => setSubscriptionDuration(e.target.value)}
                options={{ monthly: "Monthly", yearly: "Yearly" }}
                label="Select Subscription Duration"
              />
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full bg-slate-500 text-white">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
