import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { Heart, MessageCircle, Package, Plus, Shield, Star, TrendingUp, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Listing, Conversation, BreederProfile } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [breederProfile, setBreederProfile] = useState<BreederProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetch("/api/listings?mine=true").then(r => r.json()).then(d => setListings(d.listings || []));
    fetch("/api/favorites").then(r => r.json()).then(d => setFavorites(d.favorites || []));
    fetch("/api/messages").then(r => r.json()).then(d => setConversations(d.conversations || []));
    if (user.role === "breeder") {
      fetch("/api/breeders").then(r => r.json()).then(d => {
        const mine = d.breederProfiles?.find((p: BreederProfile) => p.userId === user.id);
        setBreederProfile(mine || null);
      });
      fetch(`/api/breeders/${user.id}`).then(r => r.json()).then(d => setReviews(d.reviews || [])).catch(() => {});
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center">Loading...</div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.firstName}</p>
          </div>
          {user.role === "breeder" && (
            <Button asChild>
              <Link href="/listings/create"><Plus className="w-4 h-4 mr-1" /> Post Listing</Link>
            </Button>
          )}
          {user.role === "admin" && (
            <Button variant="outline" asChild>
              <Link href="/admin"><Shield className="w-4 h-4 mr-1" /> Admin Panel</Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{listings.length}</p>
                <p className="text-sm text-muted-foreground">My Listings</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{favorites.length}</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{conversations.length}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </div>
          {user.role === "breeder" && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{reviews?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {user.role === "breeder" && breederProfile && (
          <div className="mb-8 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Breeder Profile</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/breeder/edit">Edit Profile</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-display font-bold text-2xl text-primary">{breederProfile.kennelName?.[0]}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{breederProfile.kennelName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{breederProfile.location}</span>
                  {breederProfile.verified && <Badge className="bg-primary text-primary-foreground text-xs">Verified</Badge>}
                </div>
              </div>
            </div>
          </div>
        )}

        {listings.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4">My Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 3).map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
            {listings.length > 3 && (
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/my-listings">View all {listings.length} listings</Link>
              </Button>
            )}
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold mb-4">Saved Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.slice(0, 3).map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/favorites">View all favorites</Link>
            </Button>
          </div>
        )}

        {conversations.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Recent Messages</h2>
            <div className="space-y-3">
              {conversations.slice(0, 3).map(c => (
                <Link key={c.id} href={`/messages/${c.id}`} className="block bg-card rounded-2xl border border-border p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{c.listingTitle || "Conversation"}</p>
                      <p className="text-sm text-muted-foreground">{c.lastMessage?.content || "No messages yet"}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(c.lastMessageAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}