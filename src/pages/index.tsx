import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { useI18n } from "@/hooks/use-i18n";
import { Search, MapPin, ArrowRight, Shield, CheckCircle, MessageCircle, Heart, Star } from "lucide-react";
import type { Listing, AnimalType, Breed, BreederProfile } from "@/types";

export default function HomePage() {
  const { t } = useI18n();
  const [listings, setListings] = useState<Listing[]>([]);
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [breeders, setBreeders] = useState<BreederProfile[]>([]);
  const [searchType, setSearchType] = useState("all");
  const [searchBreed, setSearchBreed] = useState("all");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchMinPrice, setSearchMinPrice] = useState("");
  const [searchMaxPrice, setSearchMaxPrice] = useState("");

  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
    fetch("/api/listings").then((r) => r.json()).then((d) => setListings(d.listings || []));
    fetch("/api/animal-types").then((r) => r.json()).then((d) => setAnimalTypes(d.animalTypes || []));
    fetch("/api/breeds").then((r) => r.json()).then((d) => setBreeds(d.breeds || []));
    fetch("/api/breeders").then((r) => r.json()).then((d) => setBreeders(d.breeders || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchType && searchType !== "all") {
      fetch(`/api/breeds?type=${searchType}`).then((r) => r.json()).then((d) => setBreeds(d.breeds || []));
    } else {
      fetch("/api/breeds").then((r) => r.json()).then((d) => setBreeds(d.breeds || []));
    }
  }, [searchType]);

  const featuredListings = listings.slice(0, 4);
  const recentListings = listings.slice(0, 6);
  const popularBreeds = [...new Set(listings.map((l) => l.breed))].slice(0, 6);
  const verifiedBreeders = breeders.filter((b) => b.verified).slice(0, 4);

  const doSearch = () => {
    const params = new URLSearchParams();
    if (searchType !== "all") params.set("type", searchType);
    if (searchBreed !== "all") params.set("breed", searchBreed);
    if (searchLocation) params.set("location", searchLocation);
    if (searchMinPrice) params.set("minPrice", searchMinPrice);
    if (searchMaxPrice) params.set("maxPrice", searchMaxPrice);
    window.location.href = `/browse?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/10 py-20 lg:py-28" style={{ opacity: "1" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
              {t("hero.subtitle")}
            </p>
            
            <div className="mt-8 bg-card rounded-2xl shadow-lg p-4 md:p-6 border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="bg-muted border-0"><SelectValue placeholder={t("hero.allAnimals")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("hero.allAnimals")}</SelectItem>
                    {animalTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={searchBreed} onValueChange={setSearchBreed}>
                  <SelectTrigger className="bg-muted border-0"><SelectValue placeholder={t("hero.allBreeds")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("hero.allBreeds")}</SelectItem>
                    {breeds.map((b) => (
                      <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("hero.location")}
                    className="pl-9 bg-muted border-0"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>

                <Input
                  placeholder={t("hero.minPrice")}
                  type="number"
                  className="bg-muted border-0"
                  value={searchMinPrice}
                  onChange={(e) => setSearchMinPrice(e.target.value)}
                />
                
                <Input
                  placeholder={t("hero.maxPrice")}
                  type="number"
                  className="bg-muted border-0"
                  value={searchMaxPrice}
                  onChange={(e) => setSearchMaxPrice(e.target.value)}
                />

                <Button onClick={doSearch} className="gap-2">
                  <Search className="w-4 h-4" /> {t("hero.searchTitle")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredListings.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold">{t("home.featuredListings")}</h2>
              <Link href="/browse" className="text-primary font-medium flex items-center gap-1 hover:underline">
                {t("home.viewAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {recentListings.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold">{t("home.recentlyAdded")}</h2>
              <Link href="/browse?sort=newest" className="text-primary font-medium flex items-center gap-1 hover:underline">
                {t("home.viewAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        </section>
      )}

      {popularBreeds.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">{t("home.popularBreeds")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularBreeds.map((breed) => (
                <Link
                  key={breed}
                  href={`/browse?breed=${encodeURIComponent(breed)}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-muted"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-medium text-sm">{breed}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {verifiedBreeders.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">{t("home.verifiedBreeders")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {verifiedBreeders.map((breeder) => (
                <Link key={breeder.id} href={`/breeder/${breeder.id}`} className="block bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display font-bold text-primary text-lg">{breeder.kennelName?.[0] || "B"}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{breeder.kennelName}</h3>
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <CheckCircle className="w-3.5 h-3.5" /> {t("home.verifiedBreedersTitle")}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{breeder.about}</p>
                  <p className="text-sm mt-2 text-muted-foreground">{breeder.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">{t("home.howItWorks")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: t("home.discover"), desc: t("home.discoverDesc") },
              { icon: Heart, title: t("home.saveFavorites"), desc: t("home.saveFavoritesDesc") },
              { icon: MessageCircle, title: t("home.contactBreeders"), desc: t("home.contactBreedersDesc") },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">{t("home.trustSafety")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: t("home.verifiedBreedersTitle"), desc: t("home.verifiedBreedersDesc") },
              { icon: CheckCircle, title: t("home.listingModeration"), desc: t("home.listingModerationDesc") },
              { icon: Star, title: t("home.reviews"), desc: t("home.reviewsDesc") },
              { icon: MessageCircle, title: t("home.secureMessaging"), desc: t("home.secureMessagingDesc") },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border">
                <item.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-display font-semibold mb-4">Breedela</h4>
              <p className="text-sm text-background/70">{t("footer.tagline")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("footer.browse")}</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/browse" className="hover:text-background">{t("footer.allAnimals")}</Link></li>
                <li><Link href="/breeders" className="hover:text-background">{t("footer.breeders")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/how-it-works" className="hover:text-background">{t("footer.howItWorks")}</Link></li>
                <li><Link href="/help" className="hover:text-background">{t("footer.helpCenter")}</Link></li>
                <li><Link href="/safety" className="hover:text-background">{t("footer.safety")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/terms" className="hover:text-background">{t("footer.terms")}</Link></li>
                <li><Link href="/privacy" className="hover:text-background">{t("footer.privacy")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-background/10 text-center text-sm text-background/50">
            {t("footer.copyright", { year: "2026" })}
          </div>
        </div>
      </footer>
    </div>
  );
}