import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Menu, X, Heart, MessageCircle, Plus, Shield, User } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">P</span>
            </div>
            <span className="font-display font-semibold text-xl text-foreground">Breedela</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search breeds, animals..."
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
            <Button variant="ghost" asChild><Link href="/browse">Animals</Link></Button>
            <Button variant="ghost" asChild><Link href="/breeders">Breeders</Link></Button>
            <Button variant="ghost" asChild><Link href="/how-it-works">How It Works</Link></Button>
            <Button variant="ghost" asChild><Link href="/help">Help</Link></Button>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/favorites"><Heart className="w-5 h-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/messages"><MessageCircle className="w-5 h-5" /></Link>
                </Button>
                {user.role === "breeder" && (
                  <Button variant="default" size="sm" asChild>
                    <Link href="/listings/create"><Plus className="w-4 h-4 mr-1" />Post</Link>
                  </Button>
                )}
                {user.role === "admin" && (
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
                <Button variant="ghost" asChild><Link href="/login">Log In</Link></Button>
                <Button variant="default" asChild>
                  <Link href="/listings/create"><Plus className="w-4 h-4 mr-1" />Post a Listing</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 py-4 space-y-2">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
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
          <Link href="/browse" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Animals</Link>
          <Link href="/breeders" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Breeders</Link>
          <Link href="/how-it-works" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>How It Works</Link>
          <Link href="/help" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Help</Link>
          {user ? (
            <>
              <Link href="/favorites" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Favorites</Link>
              <Link href="/messages" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Messages</Link>
              <Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {user.role === "breeder" && (
                <Link href="/listings/create" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Post a Listing</Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Admin</Link>
              )}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-muted text-destructive">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(false)}>Log In</Link>
              <Link href="/register" className="block px-3 py-2 rounded-md bg-primary text-white" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}