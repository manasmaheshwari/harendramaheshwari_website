import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import {
  TrustBar,
  Services,
  WhyUs,
  CTABand,
  About,
  Testimonials,
  Blog,
  Callback,
  Footer,
} from "@/components/site/Sections";
import { Calculators } from "@/components/site/Calculators";
import { ConsultationModal } from "@/components/site/Modal";
import { Chatbot } from "@/components/site/Chatbot";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { LeadPopup } from "@/components/site/LeadPopup";
import { CustomCursor } from "@/components/site/CustomCursor";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [consult, setConsult] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <Toaster position="top-center" richColors />
      <Nav onConsult={() => setConsult(true)} />
      <main>
        <Hero onConsult={() => setConsult(true)} />
        <TrustBar />
        <Services />
        <WhyUs />
        <CTABand onConsult={() => setConsult(true)} />
        <Calculators />
        <About />
        <Testimonials />
        <Blog />
        <Callback />
      </main>
      <Footer />
      <Chatbot onConsult={() => setConsult(true)} />
      <FloatingWhatsApp />
      <LeadPopup />
      <ConsultationModal open={consult} onClose={() => setConsult(false)} />
    </div>
  );
}
