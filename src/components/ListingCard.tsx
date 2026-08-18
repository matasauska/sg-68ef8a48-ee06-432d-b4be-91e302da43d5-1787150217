import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, Calendar, BadgeCheck, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Listing } from "@/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorited, setFavorited] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Please log in to save favorites" });
      return;
    }
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const data = await res.json();
      setFavorited(data.favorited);
      toast({ title: data.favorited ? "Added to favorites" : "Removed from favorites" });
    } catch {
      toast({ title: "Error updating favorite", variant: "destructive" });
    }
  };

  const age = Math.floor((Date.now() - new Date(listing.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <Link href={`/listing/${listing.id}`} className="group block">
      <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.isPremium && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                <Crown className="w-3 h-3" /> Premium
              </span>
            )}
            {listing.isBoosted && !listing.isPremium && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                <Zap className="w-3 h-3" /> Boosted
              </span>
            )}
          </div>
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${favorited ? "text-red-500 fill-red-500" : "text-foreground"}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-lg leading-tight">{listing.title}</h3>
              <p className="text-muted-foreground text-sm mt-0.5">{listing.breed}</p>
            </div>
            <p className="font-display font-bold text-lg text-primary">€{listing.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {age} months
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-sm font-medium">{listing.breederName}</span>
            {listing.breederVerified && (
              <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
            )}
          </div>
          <div className="flex gap-2 mt-2">
            {listing.vaccinated && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Vaccinated</span>}
            {listing.microchipped && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Chipped</span>}
            {listing.pedigree && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Pedigree</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}