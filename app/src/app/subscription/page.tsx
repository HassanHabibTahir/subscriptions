/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

// import { useEffect, useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";

// export default function SubscriptionPage() {
//   const userId = localStorage.getItem("user");
//   const [yearlyPlans, setYearlyPlans] = useState<{ [key: string]: boolean }>({
//     Enthusiast: false,
//     Collector: false,
//     Elite: false,
//   });
//   const [email, setEmail] = useState("");
//   const [userSubscription, setUserSubscription] = useState<any>(null);
//   const [packages, setPackages] = useState<any[]>([]);

//   const togglePlan = (planName: string) => {
//     setYearlyPlans((prev) => ({ ...prev, [planName]: !prev[planName] }));
//   };

//   const handleSubscription = async (tierName: string, email: string, isYearly: boolean, currentPackage: string) => {
//     const payload = {
//       tierName,
//       email,
//       condition: isYearly ? 'yearly' : 'monthly',
//       currentPackage,
//     };

//     try {
//       const response = await fetch('http://localhost:4000/api/subscription/packages', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (data.url) window.location.href = data.url;
//       else alert(data.message || 'Subscription successful!');
//     } catch (error) {
//       console.error('Subscription failed:', error);
//       alert('Subscription failed. Please try again.');
//     }
//   };

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("userEmail");
//     if (storedEmail) setEmail(storedEmail);

//     (async () => {
//       if (userId) {
//         try {
//           const response = await fetch(`http://localhost:4000/api/subscription/user-subscription?id=${userId}`);
//           const data = await response.json();
//           setUserSubscription(data);
//         } catch (error) {
//           console.error("Error fetching user subscription:", error);
//         }
//       }
//     })();
//   }, [userId]);

  // useEffect(() => {
  //   const fetchPackages = async () => {
  //     try {
  //       const response = await fetch("http://localhost:4000/api/subscription/get-pakages");
  //       const data = await response.json();
  //       setPackages(data);
  //     } catch (error) {
  //       console.error("Error fetching packages:", error);
  //     }
  //   };

  //   fetchPackages();
  // }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center">
//           <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose Your Subscription Plan</h1>
//           <p className="mt-4 text-xl text-gray-600">Select the perfect package for your collecting needs</p>
//         </div>

//         <div className="mt-12 grid gap-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
//           {packages.map((pkg) => {
//             const isYearly = yearlyPlans[pkg.package_reference];
//             const monthlyPrice = parseFloat(pkg.per_month_charges);
//             const yearlyPrice = parseFloat(pkg.yearly_per_month_charges) * 12;
//             const displayPrice = isYearly ? yearlyPrice / 12 : monthlyPrice;

//             return (
//               <Card
//                 key={pkg.id}
//                 className={`flex flex-col justify-between ${userSubscription?.package_reference === pkg.package_reference ? 'border-4 border-green-500' : 'border border-gray-200'}`}
//               >
//                 <CardHeader>
//                   <CardTitle>{pkg.title}</CardTitle>
//                   <CardDescription>
//                     {monthlyPrice === 0 ? 'Always free' : isYearly ? 'Billed annually' : 'Billed monthly'}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-4xl font-bold mb-4">
//                     {monthlyPrice === 0 ? (
//                       'Free'
//                     ) : (
//                       <>
//                         ${displayPrice.toFixed(2)}
//                         <span className="text-base font-normal text-gray-500">{isYearly ? '/year' : '/month'}</span>
//                       </>
//                     )}
//                   </div>
//                   <ul className="space-y-2 mb-4">
//                     {['VIP access', 'Unlimited storage', 'Dedicated account manager', 'Private events', 'Monthly rare item'].map((feature, index) => (
//                       <li key={index} className="flex items-center">
//                         <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                           <path d="M5 13l4 4L19 7"></path>
//                         </svg>
//                         {feature}
//                       </li>
//                     ))}
//                   </ul>
//                   {monthlyPrice !== 0 && (
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor={`${pkg.package_reference}-toggle`} className="text-sm">Monthly</Label>
//                       <Switch
//                         id={`${pkg.package_reference}-toggle`}
//                         checked={isYearly}
//                         onCheckedChange={() => togglePlan(pkg.package_reference)}
//                       />
//                       <Label htmlFor={`${pkg.package_reference}-toggle`} className="text-sm">Yearly</Label>
//                     </div>
//                   )}
//                 </CardContent>
//                 <CardFooter>
//                   {userSubscription?.package_reference === pkg.package_reference ? (
//                     <span className="text-green-600 font-bold">Purchased</span>
//                   ) : (
//                     <Button
//                       className="w-full"
//                       onClick={() => handleSubscription(pkg.package_reference, email, isYearly, userSubscription?.package_reference)}
//                     >
//                       {monthlyPrice === 0 ? 'Start for Free' : `Subscribe to ${pkg.title}`}
//                     </Button>
//                   )}
//                 </CardFooter>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SubscriptionPage() {
  const userId = localStorage.getItem("user");
  const [yearlyPlans, setYearlyPlans] = useState<{ [key: string]: boolean }>({
    Enthusiast: false,
    Collector: false,
    Elite: false,
  });
  const [email, setEmail] = useState("");
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);

  const togglePlan = (planName: string) => {
    setYearlyPlans((prev) => ({ ...prev, [planName]: !prev[planName] }));
  };

  const handleSubscription = async (tierName: string, email: string, isYearly: boolean, currentPackage: string) => {
    try {
      // Find the selected package
      const selectedPackage = packages.find(
        (pkg) => pkg.package_reference === tierName
      );

      if (!selectedPackage) {
        alert("Selected package not found.");
        return;
      }

      const priceId = isYearly ? selectedPackage.yearly_sub_priceId : selectedPackage.monthly_sub_priceId;
      const payload = {
        userId,
        priceId: priceId,
        package_reference: selectedPackage.package_reference,
        condition: isYearly ? "yearly" : "monthly",
        currentPackage,
        package_id: selectedPackage.id,
        package_title: selectedPackage.package_title,
        ...selectedPackage

      };
      if(currentPackage==="starter_tier"){
        const response = await fetch("http://localhost:4000/api/subscription/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        console.log(data,"data-->");
        window.location.replace(data.url);

      }else{
      
      
        const response = await fetch("http://localhost:4000/api/subscription/upgrade-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
      
        if (data.success) {
          alert(data?.message);
          // Optionally, refresh the subscription info
          await     init();
        } else {
          alert("Subscription update failed. Please try again.");
        }
      }
    } catch (error) {
      console.log("Subscription failed:", error);
      // alert("Subscription failed. Please try again.");
    }
  };
  const init = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:4000/api/subscription/user-subscription?id=${userId}`);
        const data = await response.json();
        setUserSubscription(data);
      } catch (error) {
        console.error("Error fetching user subscription:", error);
      }
    }
  }
  

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
    init();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/subscription/get-pakages");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose Your Subscription Plan</h1>
          <p className="mt-4 text-xl text-gray-600">Select the perfect package for your collecting needs</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
          {packages.map((pkg) => {
            const isYearly = yearlyPlans[pkg.package_reference];
            const monthlyPrice = parseFloat(pkg.per_month_charges);
            const yearlyPrice = parseFloat(pkg.yearly_per_month_charges) * 12;
            const displayPrice = isYearly ? yearlyPrice / 12 : monthlyPrice;

            return (
              <Card
                key={pkg.id}
                className={`flex flex-col justify-between ${userSubscription?.package_reference === pkg.package_reference ? 'border-4 border-green-500' : 'border border-gray-200'}`}
              >
                <CardHeader>
                  <CardTitle>{pkg.title}</CardTitle>
                  <CardDescription>
                    {monthlyPrice === 0 ? "Always free" : isYearly ? "Billed annually" : "Billed monthly"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4">
                    {monthlyPrice === 0 ? (
                      "Free"
                    ) : (
                      <>
                        ${displayPrice.toFixed(2)}
                        <span className="text-base font-normal text-gray-500">{isYearly ? "/year" : "/month"}</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-2 mb-4">
                    {["VIP access", "Unlimited storage", "Dedicated account manager", "Private events", "Monthly rare item"].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {monthlyPrice !== 0 && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${pkg.package_reference}-toggle`} className="text-sm">Monthly</Label>
                      <Switch
                        id={`${pkg.package_reference}-toggle`}
                        checked={isYearly}
                        onCheckedChange={() => togglePlan(pkg.package_reference)}
                      />
                      <Label htmlFor={`${pkg.package_reference}-toggle`} className="text-sm">Yearly</Label>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {userSubscription?.package_reference === pkg.package_reference ? (
                    <span className="text-green-600 font-bold">Purchased</span>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSubscription(pkg.package_reference, email, isYearly, userSubscription?.package_reference)}
                    >
                      {monthlyPrice === 0 ? "Start for Free" : `Subscribe to ${pkg.title}`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
