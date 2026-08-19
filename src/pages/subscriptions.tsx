import { useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/use-i18n";

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: t("monetization.freePlan"),
      price: "€0",
      period: `/${t("monetization.month")}`,
      description: t("monetization.freeDesc"),
      icon: Star,
      features: [t("monetization.freeF1"), t("monetization.freeF2"), t("monetization.freeF3"), t("monetization.freeF4")],
      cta: t("monetization.currentPlan"),
      popular: false,
    },
    {
      name: t("monetization.breederPlan"),
      price: "€9.99",
      period: `/${t("monetization.month")}`,
      description: t("monetization.breederDesc"),
      icon: Zap,
      features: [t("monetization.breederF1"), t("monetization.breederF2"), t("monetization.breederF3"), t("monetization.breederF4"), t("monetization.breederF5"), t("monetization.breederF6")],
      cta: t("monetization.subscribe"),
      popular: true,
    },
    {
      name: t("monetization.proPlan"),
      price: "€24.99",
      period: `/${t("monetization.month")}`,
      description: t("monetization.proDesc"),
      icon: Crown,
      features: [t("monetization.proF1"), t("monetization.proF2"), t("monetization.proF3"), t("monetization.proF4"), t("monetization.proF5"), t("monetization.proF6"), t("monetization.proF7")],
      cta: t("monetization.subscribe"),
      popular: false,
    },
  ];

  const handleSubscribe = (planName: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    alert(`${t("monetization.mockPayment")} ${planName}. ${t("monetization.stripeComing")}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">{t("monetization.choosePlan")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("monetization.planSubtitle")}
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <Button variant={billingCycle === "monthly" ? "default" : "outline"} size="sm" onClick={() => setBillingCycle("monthly")}>
              {t("monetization.monthly")}
            </Button>
            <Button variant={billingCycle === "yearly" ? "default" : "outline"} size="sm" onClick={() => setBillingCycle("yearly")}>
              {t("monetization.yearly")} <Badge className="ml-1 bg-primary text-primary-foreground text-xs">{t("monetization.save")}</Badge>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card key={plan.name} className={`relative ${plan.popular ? "border-primary ring-1 ring-primary" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">{t("monetization.popular")}</Badge>
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
          <h2 className="font-display text-xl font-bold mb-4">{t("monetization.listingUpgrades")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <h3 className="font-medium">{t("monetization.featuredTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("monetization.featuredDesc")}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">€4.99</p>
                <Button size="sm" variant="outline">{t("monetization.add")}</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <h3 className="font-medium">{t("monetization.boostTitle")}</h3>
                <p className="text-sm text-muted-foreground">{t("monetization.boostDesc")}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">€2.99</p>
                <Button size="sm" variant="outline">{t("monetization.add")}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}