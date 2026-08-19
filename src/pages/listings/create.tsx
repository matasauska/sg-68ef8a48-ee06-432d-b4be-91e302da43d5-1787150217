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
import { ArrowRight, ArrowLeft, Camera } from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [animalTypes, setAnimalTypes] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    animalType: "",
    breed: "",
    title: "",
    gender: "Male" as "Male" | "Female",
    dateOfBirth: "",
    price: "",
    location: "",
    description: "",
    photos: [] as string[],
    videoUrl: "",
    vaccinated: false,
    microchipped: false,
    pedigree: false,
    healthInfo: "",
    parentsInfo: "",
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && user.role === "buyer") router.push("/");
    if (!loading && user && user.role === "breeder") {
      fetch("/api/verification").then(r => r.json()).then(d => {
        if (!d || d.status !== "verified") {
          toast({ title: t("dashboard.verificationRequired"), description: t("dashboard.verificationRequiredDesc"), variant: "destructive" });
          router.push("/verification");
        } else {
          setVerified(true);
        }
      });
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/animal-types").then(r => r.json()).then(d => setAnimalTypes(d.animalTypes || []));
  }, []);

  useEffect(() => {
    if (form.animalType) {
      fetch(`/api/breeds?type=${form.animalType}`).then(r => r.json()).then(d => setBreeds(d.breeds || []));
    }
  }, [form.animalType]);

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const addPhoto = () => {
    const urls = [
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop",
    ];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    setForm(prev => ({ ...prev, photos: [...prev.photos, randomUrl] }));
  };

  const submit = async () => {
    setSubmitting(true);
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast({ title: t("listings.submitted") });
      router.push("/dashboard");
    } else {
      toast({ title: t("errors.createListingFailed"), variant: "destructive" });
    }
  };

  if (loading || !user || verified === null) return null;

  const steps = [
    { title: t("listings.stepType"), content: (
      <div className="space-y-4">
        <Label>{t("listings.selectType")}</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {animalTypes.map(type => (
            <button key={type.id} onClick={() => update("animalType", type.id)}
              className={`p-4 rounded-xl border-2 text-center transition-colors ${form.animalType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <p className="font-medium">{type.name}</p>
            </button>
          ))}
        </div>
      </div>
    )},
    { title: t("listings.stepBreed"), content: (
      <div className="space-y-4">
        <Label>{t("listings.selectBreed")}</Label>
        <Select value={form.breed} onValueChange={v => update("breed", v)}>
          <SelectTrigger><SelectValue placeholder={t("listings.chooseBreed")} /></SelectTrigger>
          <SelectContent>
            {breeds.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    )},
    { title: t("listings.stepPhotos"), content: (
      <div className="space-y-4">
        <Label>{t("listings.photos")}</Label>
        <div className="grid grid-cols-3 gap-3">
          {form.photos.map((p, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden">
              <img src={p} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <button onClick={addPhoto} className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors">
            <Camera className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t("listings.addPhoto")}</span>
          </button>
        </div>
      </div>
    )},
    { title: t("listings.stepDetails"), content: (
      <div className="space-y-4">
        <div>
          <Label>{t("listings.title")}</Label>
          <Input value={form.title} onChange={e => update("title", e.target.value)} placeholder={t("listings.titlePlaceholder")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t("listings.gender")}</Label>
            <Select value={form.gender} onValueChange={v => update("gender", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t("listings.male")}</SelectItem>
                <SelectItem value="Female">{t("listings.female")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("listings.dateOfBirth")}</Label>
            <Input type="date" value={form.dateOfBirth} onChange={e => update("dateOfBirth", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t("listings.price")}</Label>
            <Input type="number" value={form.price} onChange={e => update("price", e.target.value)} />
          </div>
          <div>
            <Label>{t("listings.location")}</Label>
            <Input value={form.location} onChange={e => update("location", e.target.value)} placeholder={t("hero.location")} />
          </div>
        </div>
        <div>
          <Label>{t("listings.description")}</Label>
          <Textarea value={form.description} onChange={e => update("description", e.target.value)} rows={4} />
        </div>
      </div>
    )},
    { title: t("listings.stepHealth"), content: (
      <div className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <Checkbox checked={form.vaccinated} onCheckedChange={v => update("vaccinated", v)} />
            <span>{t("filters.vaccinated")}</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={form.microchipped} onCheckedChange={v => update("microchipped", v)} />
            <span>{t("filters.microchipped")}</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={form.pedigree} onCheckedChange={v => update("pedigree", v)} />
            <span>{t("filters.pedigreeDocs")}</span>
          </label>
        </div>
        <div>
          <Label>{t("listings.healthInfo")}</Label>
          <Textarea value={form.healthInfo} onChange={e => update("healthInfo", e.target.value)} rows={3} />
        </div>
        <div>
          <Label>{t("listings.parentsInfo")}</Label>
          <Textarea value={form.parentsInfo} onChange={e => update("parentsInfo", e.target.value)} rows={3} />
        </div>
      </div>
    )},
    { title: t("listings.stepPreview"), content: (
      <div className="space-y-4">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-xl font-bold">{form.title || t("listings.untitled")}</h3>
          <p className="text-muted-foreground">{form.breed} · {form.gender} · €{form.price}</p>
          <p className="mt-2">{form.description}</p>
          <div className="flex gap-2 mt-3">
            {form.vaccinated && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t("filters.vaccinated")}</span>}
            {form.microchipped && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t("filters.microchipped")}</span>}
            {form.pedigree && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t("filters.pedigreeDocs")}</span>}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{t("listings.moderationNote")}</p>
      </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold mb-2">{t("nav.postListing")}</h1>
        <p className="text-muted-foreground mb-6">{t("common.step")} {step} {t("common.of")} {steps.length}: {steps[step - 1].title}</p>

        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          {steps[step - 1].content}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
            <ArrowLeft className="w-4 h-4 mr-1" /> {t("common.back")}
          </Button>
          {step < steps.length ? (
            <Button onClick={() => setStep(step + 1)} disabled={(step === 1 && !form.animalType) || (step === 2 && !form.breed)}>
              {t("common.next")} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? t("common.submitting") : t("listings.submitListing")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}