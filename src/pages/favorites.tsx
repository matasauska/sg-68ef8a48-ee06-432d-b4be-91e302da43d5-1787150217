import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import type { Listing } from "@/types";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<Listing[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetch("/api/favorites").then(r => r.json()).then(d => setFavorites(d.favorites || []));
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center">Loading...</div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground mb-8">Animals you have saved for later</p>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No favorites yet</p>
            <Button asChild>
              <Link href="/browse">Browse Animals</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}