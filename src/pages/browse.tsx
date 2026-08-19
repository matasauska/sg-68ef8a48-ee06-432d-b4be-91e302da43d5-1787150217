import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { useI18n } from "@/hooks/use-i18n";
import { SlidersHorizontal } from "lucide-react";
import type { Listing, AnimalType, Breed } from "@/types";

export default function BrowsePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [filters, setFilters] = useState({
    type: "",
    breed: "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    verified: false,
    vaccinated: false,
    microchipped: false,
    pedigree: false,
    sort: "recommended",
  });

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    setFilters({
      type: (q.type as string) || "",
      breed: (q.breed as string) || "",
      gender: (q.gender as string) || "",
      minPrice: (q.minPrice as string) || "",
      maxPrice: (q.maxPrice as string) || "",
      location: (q.location as string) || "",
      verified: q.verified === "true",
      vaccinated: q.vaccinated === "true",
      microchipped: q.microchipped === "true",
      pedigree: q.pedigree === "true",
      sort: (q.sort as string) || "recommended",
    });
  }, [router.isReady, router.query]);

  useEffect(() => {
    fetch("/api/animal-types").then(r => r.json()).then(d => setAnimalTypes(d.animalTypes || []));
    fetch("/api/breeds").then(r => r.json()).then(d => setBreeds(d.breeds || []));
  }, []);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    const res = await fetch(`/api/listings?${params.toString()}`);
    const data = await res.json();
    setListings(data.listings || []);
  };

  const updateFilter = (key: string, value: any) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    router.push(`/browse?${params.toString()}`, undefined, { shallow: true });
  };

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium mb-2 block">{t("filters.animalType")}</label>
        <Select value={filters.type} onValueChange={v => updateFilter("type", v)}>
          <SelectTrigger><SelectValue placeholder={t("filters.all")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            {animalTypes.map(type => <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">{t("filters.breed")}</label>
        <Select value={filters.breed} onValueChange={v => updateFilter("breed", v)}>
          <SelectTrigger><SelectValue placeholder={t("filters.all")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all")}</SelectItem>
            {breeds.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">{t("filters.gender")}</label>
        <Select value={filters.gender} onValueChange={v => updateFilter("gender", v)}>
          <SelectTrigger><SelectValue placeholder={t("filters.anyGender")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.anyGender")}</SelectItem>
            <SelectItem value="Male">{t("listings.male")}</SelectItem>
            <SelectItem value="Female">{t("listings.female")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">{t("filters.minPrice")}</label>
          <Input type="number" value={filters.minPrice} onChange={e => updateFilter("minPrice", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">{t("filters.maxPrice")}</label>
          <Input type="number" value={filters.maxPrice} onChange={e => updateFilter("maxPrice", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">{t("listings.location")}</label>
        <Input value={filters.location} onChange={e => updateFilter("location", e.target.value)} placeholder={t("hero.location")} />
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <Checkbox checked={filters.verified} onCheckedChange={v => updateFilter("verified", v)} />
          <span className="text-sm">{t("filters.verifiedBreeder")}</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={filters.vaccinated} onCheckedChange={v => updateFilter("vaccinated", v)} />
          <span className="text-sm">{t("filters.vaccinated")}</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={filters.microchipped} onCheckedChange={v => updateFilter("microchipped", v)} />
          <span className="text-sm">{t("filters.microchipped")}</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={filters.pedigree} onCheckedChange={v => updateFilter("pedigree", v)} />
          <span className="text-sm">{t("filters.pedigreeDocs")}</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">{t("nav.animals")}</h1>
          <div className="flex items-center gap-3">
            <Select value={filters.sort} onValueChange={v => updateFilter("sort", v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">{t("filters.recommended")}</SelectItem>
                <SelectItem value="newest">{t("filters.newest")}</SelectItem>
                <SelectItem value="price-asc">{t("filters.priceLowHigh")}</SelectItem>
                <SelectItem value="price-desc">{t("filters.priceHighLow")}</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader><SheetTitle>{t("filters.filters")}</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterPanel /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold mb-4">{t("filters.filters")}</h3>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-4">{listings.length} {listings.length === 1 ? t("filters.result") : t("filters.results")}</p>
            {listings.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-2xl">
                <p className="text-muted-foreground">{t("listings.noListings")}</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setFilters({ type: "", breed: "", gender: "", minPrice: "", maxPrice: "", location: "", verified: false, vaccinated: false, microchipped: false, pedigree: false, sort: "recommended" });
                  router.push("/browse");
                }}>{t("filters.clearFilters")}</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}