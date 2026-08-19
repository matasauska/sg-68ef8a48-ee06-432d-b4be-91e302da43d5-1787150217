import { Header } from "@/components/Header";
import { useI18n } from "@/hooks/use-i18n";
import { Shield, AlertTriangle, CheckCircle, Eye, FileText, MapPin } from "lucide-react";

export default function SafetyPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold">{t("safety.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("safety.subtitle")}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">{t("safety.disclaimerTitle")}</h3>
              <p className="text-sm text-amber-700 mt-1">{t("safety.disclaimer")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { icon: Shield, title: t("safety.verifiedBreeders"), text: t("safety.verifiedBreedersDesc") },
            { icon: Eye, title: t("safety.moderation"), text: t("safety.moderationDesc") },
            { icon: FileText, title: t("safety.documentation"), text: t("safety.documentationDesc") },
            { icon: MapPin, title: t("safety.inPerson"), text: t("safety.inPersonDesc") },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-display font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mb-4">{t("safety.buyerTips")}</h2>
        <div className="space-y-3 mb-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
              <p className="text-sm">{t(`safety.tip${i}`)}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mb-4">{t("safety.scamTitle")}</h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="space-y-2">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{t(`safety.scam${i}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}