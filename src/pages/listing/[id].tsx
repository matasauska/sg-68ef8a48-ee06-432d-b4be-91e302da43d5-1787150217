import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Heart, MapPin, Calendar, BadgeCheck, Zap, Crown, Shield, MessageCircle, Flag, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Listing, BreederProfile, Review } from "@/types";

export default function ListingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [breeder, setBreeder] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorited, setFavorited] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`).then(r => r.json()).then(d => {
      setListing(d.listing);
      if (d.listing?.breederId) {
        fetch(`/api/breeders/${d.listing.breederId}`).then(r => r.json()).then(b => {
          setBreeder(b);
          setReviews(b.reviews || []);
        });
      }
    });
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast({ title: "Please log in to save favorites" });
      return;
    }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id }),
    });
    const data = await res.json();
    setFavorited(data.favorited);
    toast({ title: data.favorited ? "Added to favorites" : "Removed from favorites" });
  };

  const submitReport = async () => {
    if (!reportReason) return;
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id, reason: reportReason }),
    });
    setReportOpen(false);
    toast({ title: "Report submitted. Thank you." });
  };

  const startConversation = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: listing?.breederId, listingId: id, content: `Hi, I am interested in ${listing?.title}.` }),
    });
    const data = await res.json();
    router.push(`/messages/${data.conversation.id}`);
  };

  if (!listing) return <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center">Loading...</div></div>;

  const age = Math.floor((Date.now() - new Date(listing.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="aspect-[16/10] bg-muted">
                <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              {listing.photos.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.photos.map((p, i) => (
                    <img key={i} src={p} alt="" className="w-20 h-20 rounded-lg object-cover border border-border" />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold">{listing.title}</h1>
                  <p className="text-muted-foreground mt-1">{listing.breed} · {listing.animalType}</p>
                </div>
                <div className="flex items-center gap-2">
                  {listing.isPremium && <Badge className="bg-accent text-accent-foreground"><Crown className="w-3 h-3 mr-1" /> Premium</Badge>}
                  {listing.isBoosted && !listing.isPremium && <Badge className="bg-primary text-primary-foreground"><Zap className="w-3 h-3 mr-1" /> Boosted</Badge>}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {listing.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {age} months old</span>
                <span>{listing.gender}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {listing.vaccinated && <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" /> Vaccinated</Badge>}
                {listing.microchipped && <Badge variant="secondary">Microchipped</Badge>}
                {listing.pedigree && <Badge variant="secondary">Pedigree</Badge>}
                {listing.neutered && <Badge variant="secondary">Neutered</Badge>}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </div>

              {listing.healthInfo && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Health Information</h3>
                  <p className="text-muted-foreground leading-relaxed">{listing.healthInfo}</p>
                </div>
              )}

              {listing.pedigreeInfo && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Pedigree</h3>
                  <p className="text-muted-foreground leading-relaxed">{listing.pedigreeInfo}</p>
                </div>
              )}

              {listing.parentsInfo && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Parents</h3>
                  <p className="text-muted-foreground leading-relaxed">{listing.parentsInfo}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <p className="font-display text-3xl font-bold text-primary">€{listing.price.toLocaleString()}</p>
              <div className="mt-4 space-y-3">
                <Button className="w-full gap-2" onClick={startConversation}>
                  <MessageCircle className="w-4 h-4" /> Contact Breeder
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={toggleFavorite}>
                  <Heart className={`w-4 h-4 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
                  {favorited ? "Saved" : "Save to Favorites"}
                </Button>
                <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={() => setReportOpen(!reportOpen)}>
                  <Flag className="w-4 h-4" /> Report Listing
                </Button>
              </div>

              {reportOpen && (
                <div className="mt-4 p-4 bg-muted rounded-xl">
                  <p className="text-sm font-medium mb-2">Why are you reporting this?</p>
                  <textarea
                    className="w-full p-2 rounded-lg border border-border bg-background text-sm min-h-[80px]"
                    placeholder="Describe the issue..."
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                  />
                  <Button size="sm" className="mt-2 w-full" onClick={submitReport}>Submit Report</Button>
                </div>
              )}

              {breeder?.breeder && (
                <div className="mt-6 pt-6 border-t border-border">
                  <Link href={`/breeder/${breeder.breeder.id}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display font-bold text-primary">{breeder.breeder.kennelName[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{breeder.breeder.kennelName}</p>
                      <div className="flex items-center gap-1 text-sm text-primary">
                        {breeder.breeder.verified && <><BadgeCheck className="w-3.5 h-3.5" /> Verified Breeder</>}
                      </div>
                    </div>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">{breeder.breeder.location}</p>
                  <p className="text-sm text-muted-foreground">{breeder.breeder.yearsExperience} years experience</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}