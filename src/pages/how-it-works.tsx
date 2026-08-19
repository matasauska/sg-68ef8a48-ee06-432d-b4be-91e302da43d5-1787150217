import { Header } from "@/components/Header";
import { useI18n } from "@/hooks/use-i18n";
import { Search, MessageCircle, Shield, Heart, FileCheck, Star } from "lucide-react";

export default function HowItWorksPage() {
  const { t } = useI18n();
  const steps = [
    { icon: Search, title: t("how.browseTitle"), description: t("how.browseDesc") },
    { icon: Heart, title: t("how.saveTitle"), description: t("how.saveDesc") },
    { icon: MessageCircle, title: t("how.contactTitle"), description: t("how.contactDesc") },
    { icon: Shield, title: t("how.verifyTitle"), description: t("how.verifyDesc") },
    { icon: FileCheck, title: t("how.purchaseTitle"), description: t("how.purchaseDesc") },
    { icon: Star, title: t("how.reviewTitle"), description: t("how.reviewDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold">{t("how.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("how.subtitle")}</p>
        </div>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 md:gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">{t("how.step", { num: i + 1 })}</span>
                </div>
                <h3 className="font-display text-lg font-bold mt-1">{step.title}</h3>
                <p className="text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-muted rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-xl font-bold mb-4">{t("how.forBreeders")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">{i}</span>
                </div>
                <p className="text-sm">{t(`how.breederStep${i}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}