import { Header } from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I create a listing?",
      a: "Register as a breeder, complete your profile, then click 'Post a Listing' in the navigation. Follow the step-by-step process to add photos, details, and health information.",
    },
    {
      q: "Is Breedela free to use?",
      a: "Yes, buyers can browse and contact breeders for free. Breeders can post a limited number of listings on the free plan. Upgraded plans offer more listings and features.",
    },
    {
      q: "How does breeder verification work?",
      a: "Breeders can apply for verification by submitting documentation about their breeding program. Our team reviews the application and awards a verified badge to approved breeders.",
    },
    {
      q: "Can I report a suspicious listing?",
      a: "Yes, every listing has a 'Report' button. Our moderation team reviews all reports and takes appropriate action, including removing listings and suspending accounts.",
    },
    {
      q: "How do I contact a breeder?",
      a: "Click 'Contact Breeder' on any listing to start a secure conversation. You can ask questions, arrange visits, and discuss details before making any commitment.",
    },
    {
      q: "What happens after I submit a listing?",
      a: "Listings go through moderation before becoming public. This usually takes 24-48 hours. You'll be notified when your listing is approved or if any changes are needed.",
    },
    {
      q: "How do payments work?",
      a: "Breedela does not process payments between buyers and breeders. Payment arrangements are made directly between the parties. We recommend secure, traceable payment methods.",
    },
    {
      q: "Can I edit or delete my listing?",
      a: "Yes, go to your dashboard to manage all your listings. You can edit details, update photos, mark as sold, or delete listings at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Help Center</h1>
          <p className="text-muted-foreground mt-2">Frequently asked questions about Breedela</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-2xl border border-border px-4">
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 bg-muted rounded-2xl p-6 text-center">
          <h3 className="font-display font-bold mb-2">Still need help?</h3>
          <p className="text-sm text-muted-foreground mb-4">Contact our support team for assistance</p>
          <p className="text-sm">support@breedela.demo</p>
        </div>
      </div>
    </div>
  );
}