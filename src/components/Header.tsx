import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n, availableLocales } from "@/hooks/use-i18n";
import { Search, Menu, X, Heart, MessageCircle, Plus, Shield, User, Globe } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src="/logo.jpg" alt="Breedela" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-xl text-foreground">Breedela</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("nav.search") || "Search breeds, animals..."}
                className="pl-9 bg-muted border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" asChild><Link href="/browse">{t("nav.animals") || "Animals"}</Link></Button>
            <Button variant="ghost" asChild><Link href="/breeders">{t("nav.breeders") || "Breeders"}</Link></Button>
            <Button variant="ghost" asChild><Link href="/how-it-works">{t("nav.howItWorks") || "How It Works"}</Link></Button>
            <Button variant="ghost" asChild><Link href="/help">{t("nav.help") || "Help"}</Link></Button>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setLangOpen(!langOpen)}>
                <Globe className="w-5 h-5" />
              </Button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                  {availableLocales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLocale(l.code as any); setLangOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${locale === l.code ? "text-primary" : ""}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/favorites"><Heart className="w-5 h-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/messages"><MessageCircle className="w-5 h-5" /></Link>
                </Button>
                {user.role === "breeder" && user.breederVerified && (
                  <Button variant="default" size="sm" asChild>
                    <Link href="/listings/create"><Plus className="w-4 h-4 mr-1" />{t("nav.postListing") || "Post"}</Link>
                  </Button>
                )}
                {user.role === "breeder" && !user.breederVerified && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/verification">{t("verification.title") || "Verify"}</Link>
                  </Button>
                )}
                {user.isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin"><Shield className="w-4 h-4 mr-1" />Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard"><User className="w-5 h-5" /></Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild><Link href="/login">{t("nav.login") || "Log In"}</Link></Button>
                <Button variant="default" asChild>
                  <Link href="/listings/create"><Plus className="w-4 h-4 mr-1" />{t("nav.postListing") || "Post a Listing"}</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 py-4 space-y-2">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("nav.search") || "Search..."}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/browse?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
            />
          </div>
          <Link href="/browse" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.animals") || "Animals"}</Link>
          <Link href="/breeders" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.breeders") || "Breeders"}</Link>
          <Link href="/how-it-works" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.howItWorks") || "How It Works"}</Link>
          <Link href="/help" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.help") || "Help"}</Link>
          {user ? (
            <>
              <Link href="/favorites" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.favorites") || "Favorites"}</Link>
              <Link href="/messages" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.messages") || "Messages"}</Link>
              <Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.dashboard") || "Dashboard"}</Link>
              {user.role === "breeder" && user.breederVerified && (
                <Link href="/listings/create" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.postListing") || "Post a Listing"}</Link>
              )}
              {user.role === "breeder" && !user.breederVerified && (
                <Link href="/verification" className="block px-3 py-2 rounded-md hover:bg-muted text-primary" onClick={() => setMobileOpen(false)}>{t("verification.title") || "Verify Account"}</Link>
              )}
              {user.isAdmin && (
                <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Admin</Link>
              )}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-muted text-destructive">
                {t("nav.logout") || "Log Out"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>{t("nav.login") || "Log In"}</Link>
              <Link href="/register" className="block px-3 py-2 rounded-md bg-primary text-primary-foreground" onClick={() => setMobileOpen(false)}>{t("nav.register") || "Register"}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}