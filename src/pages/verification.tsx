import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

export default function VerificationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    country: "",
    address: "",
    breederName: "",
    contactInfo: "",
    registrationInfo: "",
    animalIdInfo: "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/verification", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data) setStatus(data.status);
      });
  }, [user]);

  const submit = async () => {
    setSubmitting(true);
    const res = await fetch("/api/verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user!.token}`,
      },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.ok) {
      setStatus("pending");
      toast({ title: t("verification.submit") });
    } else {
      toast({ title: t("errors.serverError"), variant: "destructive" });
    }
  };

  if (authLoading || !user) return null;

  const statusConfig: Record<string, { icon: any; color: string; message: string }> = {
    pending: { icon: Clock, color: "text-yellow-400", message: t("verification.pendingMessage") },
    verified: { icon: CheckCircle, color: "text-green-400", message: t("breeder.verified") },
    rejected: { icon: XCircle, color: "text-red-400", message: t("verification.rejectedMessage") },
    additional_info: { icon: AlertCircle, color: "text-orange-400", message: t("verification.additionalInfoMessage") },
  };

  if (status && statusConfig[status]) {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto py-16 px-4">
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <Icon className={`w-16 h-16 mx-auto mb-4 ${config.color}`} />
            <h1 className="text-2xl font-bold mb-2">{t("verification.title")}</h1>
            <p className="text-muted-foreground mb-6">{config.message}</p>
            {status === "rejected" && (
              <Button onClick={() => setStatus(null)}>{t("verification.resubmit")}</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">{t("verification.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("verification.subtitle")}</p>
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          {[
            { key: "fullName", label: t("verification.fullName") },
            { key: "dateOfBirth", label: t("verification.dateOfBirth"), type: "date" },
            { key: "country", label: t("verification.country") },
            { key: "address", label: t("verification.address") },
            { key: "breederName", label: t("verification.breederName") },
            { key: "contactInfo", label: t("verification.contactInfo") },
            { key: "registrationInfo", label: t("verification.registrationInfo") },
            { key: "animalIdInfo", label: t("verification.animalIdInfo") },
          ].map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.key === "address" || field.key === "contactInfo" || field.key === "registrationInfo" || field.key === "animalIdInfo" ? (
                <Textarea
                  id={field.key}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type || "text"}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <Button onClick={submit} disabled={submitting} className="w-full">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("verification.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}