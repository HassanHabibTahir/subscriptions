// // Define types for subscription options
// interface SubscriptionOption {
//   title: string;
//   package_reference: string;
//   package_id: number;
//   is_free: boolean;
//   price_id_monthly: string;
//   price_id_yearly: string;
// }

// Type for subscription options object
// const subscriptionOptions: Record<string, SubscriptionOption> = {
//     STARTER: {
//       title: "Starter Tier",
//       package_reference: "starter_tier",
//       package_id: 1,
//       is_free: true,
//       price_id_monthly: "",
//       price_id_yearly: "",
//     },

//     ENTHUSIAST: {
//       title: "Enthusiast Tier",
//       package_reference: "enthusiast_tier",
//       package_id: 2,
//       is_free: false,
//       price_id_monthly: "price_1QaWc6F5wRQ0Uvcsmvmn7cGk",
//       price_id_yearly: "price_1QaWfTF5wRQ0UvcsmB8DPNRw",

//     },
//     COLLECTOR: {
//       title: "Collector Tier",
//       package_reference: "collector_tier",
//       package_id: 3,
//       is_free: false,
//       price_id_monthly: "price_1QaWiUF5wRQ0UvcsPxwx4QFr",
//       price_id_yearly: "price_1QaWlOF5wRQ0Uvcs8giJjoZS",
//     },
//     ELITE: {
//       title: "Elite Tier",
//       package_reference: "elite_tier",
//       package_id: 4,
//       is_free: false,
//       price_id_monthly: "price_1QaWnLF5wRQ0UvcsJrV5k42K",
//       price_id_yearly: "price_1QaWpDF5wRQ0UvcsJED9EcTp",
//     },
// };
"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
import SelectPopup from "@/components/ui/SelectPopup";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [selectedTier, setSelectedTier] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [packages, setPackages] = useState<any[]>([]);  // Define a more specific type for the packages
  const [subscriptionDuration, setSubscriptionDuration] =
    useState<string>("monthly");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/subscription/get-pakages"
        );
        const data = await response.json();
        console.log(data, "data--->");
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get selected package details based on selectedTier
    const selectedPackage = packages.find(
      (pkg) => pkg.package_reference === selectedTier
    );
  

    if (!selectedPackage) {
      alert("Please select a valid package.");
      return;
    }

    const price_id =
      subscriptionDuration === "monthly"
        ? selectedPackage.monthly_sub_priceId
        : selectedPackage.
        yearly_sub_priceId
        ;
        const is_free = selectedPackage.package_reference==="starter_tier"?true:false;
    const payload = {
      ...formData,
      tier: selectedPackage.package_reference,
      subscription_duration: subscriptionDuration,
      price_id: price_id,
      is_free,
      title: selectedPackage.title,
      package_id: selectedPackage.id
      
    };
    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });


      const data = await response.json();
      console.log("Signup successful:", data);

      alert("Signup successful!");

      if (data.subscription) {
        alert(data?.message);
      } else {
        window.location.href = data.url;
        console.log(data);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const options = packages.reduce((acc, item) => {
    acc[item.package_reference] = item.title;
    return acc;
  }, {} as { [key: string]: string });


  console.log(selectedTier,"selectedTier")

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
                options={options} // Passing the transformed options object
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
