import { Header } from "@/components/Header";
import { Shield, AlertTriangle, CheckCircle, Eye, FileText, MapPin } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Trust & Safety</h1>
          <p className="text-muted-foreground mt-2">Your safety is our priority when finding a new companion</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Important Disclaimer</h3>
              <p className="text-sm text-amber-700 mt-1">
                Breedela provides a platform for connecting buyers and breeders. We do not guarantee the health, 
                legality, or authenticity of any animal listed. Always verify documentation, health records, 
                and breeder credentials in person before completing a purchase. Breedela is not responsible 
                for transactions between users.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              icon: Shield,
              title: "Verified Breeders",
              text: "Look for the verified badge. These breeders have submitted documentation for review by our team.",
            },
            {
              icon: Eye,
              title: "Listing Moderation",
              text: "Every listing is reviewed before going live. Suspicious content is flagged and investigated.",
            },
            {
              icon: FileText,
              title: "Documentation",
              text: "Request pedigree papers, vaccination records, and health certificates before purchase.",
            },
            {
              icon: MapPin,
              title: "In-Person Visits",
              text: "Always visit the breeder and meet the animal in person before sending any payment.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-display font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mb-4">Safety Tips for Buyers</h2>
        <div className="space-y-3 mb-8">
          {[
            "Never send money before seeing the animal in person",
            "Ask for veterinary records and vaccination proof",
            "Verify the breeder's identity and location",
            "Meet in a safe, public place or at the breeder's registered address",
            "Request a contract or written agreement",
            "Report suspicious listings immediately using the report button",
            "Check for reviews from previous buyers",
            "Be wary of prices significantly below market value",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl font-bold mb-4">Scam Warning Signs</h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="space-y-2">
            {[
              "Seller refuses to meet in person or provide video calls",
              "Requests payment via untraceable methods (gift cards, wire transfers)",
              "Price is significantly below market rate with pressure to act fast",
              "No verifiable documentation or veterinary records",
              "Sellers located far away with excuses for not shipping properly",
              "Multiple listings with identical photos and descriptions",
            ].map((warning, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}