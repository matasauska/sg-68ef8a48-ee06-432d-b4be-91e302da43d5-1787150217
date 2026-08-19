import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "buyer" as "buyer" | "breeder",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast({ title: t("auth.registerSuccess") });
      router.push("/dashboard");
    } catch (err: any) {
      toast({ title: err.message || t("auth.registerError"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-card rounded-2xl border border-border p-8">
          <h1 className="font-display text-2xl font-bold text-center mb-2">{t("auth.createAccount")}</h1>
          <p className="text-muted-foreground text-center mb-6">{t("auth.registerSubtitle")}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">{t("auth.firstName")}</Label>
                <Input id="firstName" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="lastName">{t("auth.lastName")}</Label>
                <Input id="lastName" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <Label>{t("auth.role")}</Label>
              <div className="flex gap-3 mt-1">
                <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer text-center ${form.role === "buyer" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="role" value="buyer" checked={form.role === "buyer"} onChange={() => setForm({ ...form, role: "buyer" })} className="sr-only" />
                  <span className="font-medium">{t("auth.buyer")}</span>
                </label>
                <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer text-center ${form.role === "breeder" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="role" value="breeder" checked={form.role === "breeder"} onChange={() => setForm({ ...form, role: "breeder" })} className="sr-only" />
                  <span className="font-medium">{t("auth.breeder")}</span>
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.creatingAccount") : t("auth.createAccountBtn")}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("auth.hasAccount")} <Link href="/login" className="text-primary hover:underline">{t("nav.login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}