import { Header } from "@/components/Header";
import { useI18n } from "@/hooks/use-i18n";

export default function TermsPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold mb-6">{t("terms.title")}</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="mb-4">{t("terms.lastUpdated", { date: "2026-08-19" })}</p>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i}>
              <h2 className="text-foreground font-bold mt-6 mb-2">{t(`terms.section${i}Title`)}</h2>
              <p className="mb-4">{t(`terms.section${i}Text`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}