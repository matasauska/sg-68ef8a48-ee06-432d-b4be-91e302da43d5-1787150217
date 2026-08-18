import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, List, CheckCircle, AlertTriangle, Star, DollarSign } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && user.role !== "admin") router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetch("/api/admin/stats").then(r => r.json()).then(d => setStats(d));
    fetch("/api/admin/listings").then(r => r.json()).then(d => setPendingListings(d.listings?.filter((l: any) => l.status === "pending") || []));
    fetch("/api/admin/reports").then(r => r.json()).then(d => setReports(d.reports || []));
  }, [user]);

  const approveListing = async (id: string) => {
    const res = await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id, status: "approved" }),
    });
    if (res.ok) {
      toast({ title: "Listing approved" });
      setPendingListings(prev => prev.filter(l => l.id !== id));
    }
  };

  const rejectListing = async (id: string) => {
    const res = await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id, status: "rejected" }),
    });
    if (res.ok) {
      toast({ title: "Listing rejected" });
      setPendingListings(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleReport = async (id: string, action: "resolved" | "dismissed") => {
    const res = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId: id, status: action }),
    });
    if (res.ok) {
      toast({ title: `Report ${action}` });
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  if (loading || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold mb-8 flex items-center gap-2">
          <Shield className="w-7 h-7" /> Admin Dashboard
        </h1>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.totalUsers, icon: Users },
              { label: "Total Listings", value: stats.totalListings, icon: List },
              { label: "Active Listings", value: stats.activeListings, icon: CheckCircle },
              { label: "Verified Breeders", value: stats.verifiedBreeders, icon: Star },
            ].map((s, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-5">
                <s.icon className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Pending Listings ({pendingListings.length})</h2>
            <div className="space-y-3">
              {pendingListings.length === 0 && <p className="text-muted-foreground">No pending listings</p>}
              {pendingListings.map(l => (
                <div key={l.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{l.title}</h3>
                      <p className="text-sm text-muted-foreground">{l.breed} · {l.location} · €{l.price}</p>
                      <p className="text-sm text-muted-foreground">By {l.breederName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => rejectListing(l.id)}>Reject</Button>
                      <Button size="sm" onClick={() => approveListing(l.id)}>Approve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-4">Reports ({reports.length})</h2>
            <div className="space-y-3">
              {reports.length === 0 && <p className="text-muted-foreground">No active reports</p>}
              {reports.map(r => (
                <div key={r.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{r.reason}</h3>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                      <p className="text-sm text-muted-foreground">Reporter: {r.reporterName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleReport(r.id, "dismissed")}>Dismiss</Button>
                      <Button size="sm" onClick={() => handleReport(r.id, "resolved")}>Resolve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}