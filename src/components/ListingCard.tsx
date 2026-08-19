import Link from "next/link";
import { Heart, MapPin, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
  showFavorite?: boolean;
}

export function ListingCard({ listing, showFavorite = true }: ListingCardProps) {
  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/listing/${listing.id}`} className="block relative aspect-[4/3] bg-muted">
        {listing.photos?.[0] ? (
          <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No photo
          </div>
        )}
        {showFavorite && (
          <button
            onClick={e => {
              e.preventDefault();
              fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId: listing.id }) });
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
        )}
        {listing.status === "pending" && (
          <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            Pending
          </span>
        )}
        {listing.featured && (
          <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
            Featured
          </span>
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-sm line-clamp-1">{listing.title}</h3>
          <p className="font-bold text-sm text-primary">€{listing.price}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{listing.breed} · {listing.gender}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          {listing.location}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/breeder/${listing.breederId}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            {listing.breederName}
          </Link>
          {listing.breederVerified && (
            <BadgeCheck className="w-3.5 h-3.5 text-primary" />
          )}
        </div>
      </div>
    </div>
  );
}