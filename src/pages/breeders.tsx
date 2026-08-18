import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { BadgeCheck, MapPin, Star, Search } from "lucide-react";
import type { BreederProfile } from "@/types";

export default function BreedersPage() {
  const [breeders, setBreeders] = useState<BreederProfile[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/breeders").then(r => r.json()).then(d => setBreeders(d.breederProfiles || []));
  }, []);

  const filtered = breeders.filter(b => 
    b.kennelName?.toLowerCase().includes(query.toLowerCase()) ||
    b.location?.toLowerCase().includes(query.toLowerCase()) ||
    b.breeds?.some(br => br.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">Breeders</h1>
        
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search breeders by name, location, or breed..."
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(breeder => (
            <Link key={breeder.id} href={`/breeder/${breeder.id}`} className="block bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-display font-bold text-primary text-xl">{breeder.kennelName?.[0] || "B"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{breeder.kennelName}</h3>
                    {breeder.verified && <BadgeCheck className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {breeder.location}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{breeder.experienceYears} years experience</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {breeder.breeds?.map(br => (
                      <span key={br} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{br}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{breeder.about}</p>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No breeders found matching your search.</div>
        )}
      </div>
    </div>
  );
}