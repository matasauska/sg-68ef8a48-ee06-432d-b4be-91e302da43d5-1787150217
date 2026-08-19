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

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: t("auth.loginSuccess") });
      router.push("/dashboard");
    } catch (err: any) {
      toast({ title: err.message || t("auth.loginError"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl border border-border p-8">
          <h1 className="font-display text-2xl font-bold text-center mb-2">{t("auth.welcomeBack")}</h1>
          <p className="text-muted-foreground text-center mb-6">{t("auth.loginSubtitle")}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.loggingIn") : t("auth.logIn")}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("auth.noAccount")} <Link href="/register" className="text-primary hover:underline">{t("nav.register")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}