import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import type { Listing } from "@/types";

export default function EditListingPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.listing) setListing(d.listing);
      })
      .catch(() => router.push("/dashboard"));
  }, [id, router]);

  const update = (field: keyof Listing, value: any) => {
    setListing(prev => prev ? { ...prev, [field]: value } : null);
  };

  const save = async () => {
    if (!listing) return;
    setSaving(true);
    const res = await fetch(`/api/listings/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        gender: listing.gender,
        vaccinated: listing.vaccinated,
        microchipped: listing.microchipped,
        pedigree: listing.pedigree,
        healthInfo: listing.healthInfo,
        parentsInfo: listing.parentsInfo,
        status: listing.status,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast({ title: t("listings.listingUpdated") });
      router.push("/dashboard");
    } else {
      toast({ title: t("errors.updateListingFailed"), variant: "destructive" });
    }
  };

  const remove = async () => {
    if (!listing || !confirm(t("listings.deleteConfirm"))) return;
    setDeleting(true);
    const res = await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      toast({ title: t("listings.listingDeleted") });
      router.push("/dashboard");
    } else {
      toast({ title: t("errors.deleteListingFailed"), variant: "destructive" });
    }
  };

  if (loading || !user) return null;
  if (!listing) return <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center">{t("common.loading")}</div></div>;

  const canEdit = user.role === "admin" || (user.role === "breeder" && listing.breederId === user.id);

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-xl font-bold">{t("errors.notAuthorized")}</h1>
          <p className="text-muted-foreground mt-2">{t("errors.onlyOwnListings")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">{t("listings.editListing")}</h1>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <div>
            <Label>{t("listings.title")}</Label>
            <Input value={listing.title} onChange={e => update("title", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("listings.price")}</Label>
              <Input type="number" value={listing.price} onChange={e => update("price", Number(e.target.value))} />
            </div>
            <div>
              <Label>{t("listings.location")}</Label>
              <Input value={listing.location} onChange={e => update("location", e.target.value)} />
            </div>
          </div>

          <div>
            <Label>{t("listings.gender")}</Label>
            <Select value={listing.gender} onValueChange={v => update("gender", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t("listings.male")}</SelectItem>
                <SelectItem value="Female">{t("listings.female")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t("listings.description")}</Label>
            <Textarea value={listing.description} onChange={e => update("description", e.target.value)} rows={4} />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox checked={listing.vaccinated} onCheckedChange={v => update("vaccinated", v)} />
              <span>{t("filters.vaccinated")}</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={listing.microchipped} onCheckedChange={v => update("microchipped", v)} />
              <span>{t("filters.microchipped")}</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={listing.pedigree} onCheckedChange={v => update("pedigree", v)} />
              <span>{t("filters.pedigreeDocs")}</span>
            </label>
          </div>

          <div>
            <Label>{t("listings.healthInfo")}</Label>
            <Textarea value={listing.healthInfo || ""} onChange={e => update("healthInfo", e.target.value)} rows={3} />
          </div>

          <div>
            <Label>{t("listings.parentsInfo")}</Label>
            <Textarea value={listing.parentsInfo || ""} onChange={e => update("parentsInfo", e.target.value)} rows={3} />
          </div>

          <div>
            <Label>{t("listings.status")}</Label>
            <Select value={listing.status} onValueChange={v => update("status", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t("listings.statusPending")}</SelectItem>
                <SelectItem value="approved">{t("listings.statusApproved")}</SelectItem>
                <SelectItem value="sold">{t("listings.statusSold")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={save} disabled={saving}>{saving ? t("common.saving") : t("common.save")}</Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>{t("common.cancel")}</Button>
            <Button variant="destructive" onClick={remove} disabled={deleting} className="ml-auto">{deleting ? t("common.deleting") : t("common.delete")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}