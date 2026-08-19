import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { BadgeCheck, MapPin, Star, MessageCircle, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { ListingCard } from "@/components/ListingCard";
import type { BreederProfile, Listing, Review } from "@/types";

export default function BreederProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useI18n();
  const [breeder, setBreeder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/breeders/${id}`).then(r => r.json()).then(d => {
      setBreeder(d);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center">{t("common.loading")}</div></div>;
  if (!breeder) return <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center">{t("listings.noListings")}</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-primary text-3xl">{breeder.kennelName?.[0] || "B"}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl md:text-3xl font-bold">{breeder.kennelName}</h1>
                {breeder.verified && (
                  <span className="inline-flex items-center gap-1 text-sm px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    <BadgeCheck className="w-3.5 h-3.5" /> {t("listings.verifiedBreeder")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" /> {breeder.location}
              </div>
              <p className="text-muted-foreground mt-3 max-w-2xl">{breeder.about}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-muted-foreground" /> {breeder.experienceYears} {t("listings.yearsExperience")}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-muted-foreground" /> {breeder.reviews?.length || 0} {t("listings.reviews")}</span>
                <span className="flex items-center gap-1">{breeder.listings?.length || 0} {t("listings.activeListings")}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {breeder.breeds?.map((br: string) => (
                  <span key={br} className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">{br}</span>
                ))}
              </div>
              <div className="mt-6">
                <Button asChild>
                  <Link href={`/messages?breeder=${breeder.id}`}><MessageCircle className="w-4 h-4 mr-1" /> {t("listings.contactBreeder")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {breeder.listings?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4">{t("listings.activeListings")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {breeder.listings.map((l: Listing) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}

        {breeder.reviews?.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-4">{t("listings.reviews")}</h2>
            <div className="space-y-4">
              {breeder.reviews.map((r: Review) => (
                <div key={r.id} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}