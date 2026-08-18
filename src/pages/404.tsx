import { Header } from "@/components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-md">
          Sorry, we couldn&apos;t find the page you requested. This page may have been moved, deleted, or never existed.
        </p>
        <Link href="/" className="mt-8">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
