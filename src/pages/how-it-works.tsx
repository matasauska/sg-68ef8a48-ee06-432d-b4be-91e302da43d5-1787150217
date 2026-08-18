import { Header } from "@/components/Header";
import { Search, MessageCircle, Shield, Heart, FileCheck, Star } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "Browse & Search",
      description: "Use our powerful filters to find the perfect breed, age, and location. View detailed listings with photos and health information.",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Create a free account to save listings you love. Compare breeders and animals side by side before making contact.",
    },
    {
      icon: MessageCircle,
      title: "Contact Breeders",
      description: "Message breeders directly through our secure platform. Ask questions, arrange visits, and learn about the animal's background.",
    },
    {
      icon: Shield,
      title: "Verify & Trust",
      description: "Look for the verified breeder badge. Read reviews from other buyers and check pedigree documentation before committing.",
    },
    {
      icon: FileCheck,
      title: "Complete Purchase",
      description: "Arrange payment and pickup directly with the breeder. Always verify documentation and health records in person.",
    },
    {
      icon: Star,
      title: "Leave a Review",
      description: "Help the community by sharing your experience. Honest reviews keep Breedela trustworthy for future buyers.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold">How Breedela Works</h1>
          <p className="text-muted-foreground mt-2">Finding your new family member is simple and safe</p>
        </div>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 md:gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">Step {i + 1}</span>
                </div>
                <h3 className="font-display text-lg font-bold mt-1">{step.title}</h3>
                <p className="text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-muted rounded-2xl p-6 md:p-8">
          <h2 className="font-display text-xl font-bold mb-4">For Breeders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Create a breeder profile and verify your credentials",
              "Post listings with photos, pedigrees, and health info",
              "Respond to buyer messages and manage inquiries",
              "Mark animals as sold and build your reputation",
              "Apply for verified status to stand out",
              "Upgrade your plan for more features",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">{i + 1}</span>
                </div>
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}