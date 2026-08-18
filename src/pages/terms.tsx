import { Header } from "@/components/Header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="mb-4">Last updated: August 18, 2026</p>
          
          <h2 className="text-foreground font-bold mt-6 mb-2">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using Breedela, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">2. User Accounts</h2>
          <p className="mb-4">You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">3. Listings and Content</h2>
          <p className="mb-4">Users posting listings must have the legal right to sell the animals listed. All content must be accurate and not misleading. Breedela reserves the right to remove any listing.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">4. Transactions</h2>
          <p className="mb-4">Breedela is a marketplace platform only. We do not process payments or guarantee transactions. All arrangements between buyers and sellers are at their own risk.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">5. Prohibited Activities</h2>
          <p className="mb-4">Users may not post fraudulent listings, engage in harassment, sell illegal animals, or use the platform for any unlawful purpose.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">6. Limitation of Liability</h2>
          <p className="mb-4">Breedela is not responsible for the health, condition, or legality of animals listed. Users must verify all information independently before purchase.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">7. Modifications</h2>
          <p className="mb-4">We may update these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.</p>
        </div>
      </div>
    </div>
  );
}