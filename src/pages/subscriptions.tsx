import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "/month",
    description: "Start selling with basic features",
    icon: Star,
    features: ["3 active listings", "Standard placement", "Basic profile", "Photo uploads"],
    cta: "Current Plan",
    popular: false,
  },
  {
    name: "Breeder",
    price: "€9.99",
    period: "/month",
    description: "Grow your breeding business",
    icon: Zap,
    features: ["15 active listings", "Priority placement", "Professional profile", "More photos", "Listing analytics", "Premium badge"],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Professional",
    price: "€24.99",
    period: "/month",
    description: "Maximum visibility and tools",
    icon: Crown,
    features: ["Unlimited listings", "Top placement", "Featured profile", "Unlimited photos", "Advanced analytics", "Priority support", "Verified badge"],
    cta: "Subscribe",
    popular: false,
  },
];

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const handleSubscribe = (planName: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    // Mock payment flow - will integrate Stripe later
    alert(`This will redirect to payment for ${planName} plan. Stripe integration coming soon.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upgrade your breeder profile to reach more buyers and sell faster
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <Button variant={billingCycle === "monthly" ? "default" : "outline"} size="sm" onClick={() => setBillingCycle("monthly")}>
              Monthly
            </Button>
            <Button variant={billingCycle === "yearly" ? "default" : "outline"} size="sm" onClick={() => setBillingCycle("yearly")}>
              Yearly <Badge className="ml-1 bg-primary text-primary-foreground text-xs">Save 20%</Badge>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan.name} className={`relative ${plan.popular ? "border-primary ring-1 ring-primary" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <plan.icon className={`w-10 h-10 mx-auto mb-3 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} onClick={() => handleSubscribe(plan.name)}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-xl font-bold mb-4">Listing Upgrades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <h3 className="font-medium">Featured Listing</h3>
                <p className="text-sm text-muted-foreground">Higher placement + Featured badge</p>
              </div>
              <div className="text-right">
                <p className="font-bold">€4.99</p>
                <Button size="sm" variant="outline">Add</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <h3 className="font-medium">Boost Listing</h3>
                <p className="text-sm text-muted-foreground">7-day position boost + Boosted badge</p>
              </div>
              <div className="text-right">
                <p className="font-bold">€2.99</p>
                <Button size="sm" variant="outline">Add</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}