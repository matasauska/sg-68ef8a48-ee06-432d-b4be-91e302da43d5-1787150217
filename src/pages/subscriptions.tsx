import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Star, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SubscriptionsPage() {
  const { user } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "€0",
      period: "/month",
      description: "Perfect for occasional breeders",
      icon: Star,
      features: [
        "3 active listings",
        "Standard search placement",
        "Basic breeder profile",
        "Message buyers",
      ],
      cta: "Current Plan",
      popular: false,
    },
    {
      name: "Breeder",
      price: "€9.99",
      period: "/month",
      description: "For dedicated breeders",
      icon: Crown,
      features: [
        "15 active listings",
        "Priority search placement",
        "Enhanced breeder profile",
        "Verified badge eligible",
        "Listing analytics",
        "Priority support",
      ],
      cta: "Upgrade",
      popular: true,
    },
    {
      name: "Professional",
      price: "€24.99",
      period: "/month",
      description: "For breeding businesses",
      icon: Crown,
      features: [
        "Unlimited listings",
        "Top search placement",
        "Premium breeder profile",
        "Verified badge included",
        "Advanced analytics",
        "Featured placements",
        "Dedicated support",
      ],
      cta: "Upgrade",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Breedela Plans</h1>
          <p className="text-muted-foreground mt-2">Choose the plan that fits your breeding needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative rounded-2xl ${plan.popular ? "border-primary shadow-lg" : "border-border"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <plan.icon className={`w-8 h-8 mx-auto mb-2 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} disabled={!user}>
                  {!user ? "Log in to upgrade" : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-muted rounded-2xl p-6 text-center">
          <h3 className="font-display text-lg font-bold mb-2">Listing Boosts</h3>
          <p className="text-muted-foreground text-sm mb-4">One-time upgrades for individual listings</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="font-semibold">Boosted</p>
              <p className="text-2xl font-bold">€2.99</p>
              <p className="text-sm text-muted-foreground">Higher placement + Boosted badge</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="font-semibold">Premium</p>
              <p className="text-2xl font-bold">€5.99</p>
              <p className="text-sm text-muted-foreground">Top placement + Premium badge + Featured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}