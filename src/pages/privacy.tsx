import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="mb-4">Last updated: August 18, 2026</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide when registering, creating profiles, posting listings, and communicating with other users. This includes name, email, location, and profile information.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">2. How We Use Information</h2>
          <p className="mb-4">Your information is used to operate the platform, facilitate connections between buyers and breeders, improve our services, and send important notifications.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">3. Information Sharing</h2>
          <p className="mb-4">We do not sell your personal information. Your contact information is only shared with other users when you initiate contact through our messaging system.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">4. Data Security</h2>
          <p className="mb-4">We implement reasonable security measures to protect your data. However, no online platform can guarantee absolute security.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">5. Cookies</h2>
          <p className="mb-4">We use cookies for authentication and to improve your experience on our platform.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">6. Your Rights</h2>
          <p className="mb-4">You may request deletion of your account and associated data at any time by contacting support.</p>

          <h2 className="text-foreground font-bold mt-6 mb-2">7. Changes to This Policy</h2>
          <p className="mb-4">We may update this privacy policy periodically. We will notify users of significant changes.</p>
        </div>
      </div>
    </div>
  );
}