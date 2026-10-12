import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/vesper/Nav";
import { Pricing } from "@/components/vesper/Pricing";
import { EnterpriseModal } from "@/components/vesper/EnterpriseModal";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";

const title = "Transparent Pricing & Licenses | VESPER Desktop";
const description =
  "Simple, transparent pricing for VESPER Desktop. Free community tier with 30m daily allowance, Pro tier, and custom Enterprise deployments.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);

  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10 pt-16">
          <Pricing onOpenEnterpriseModal={() => setIsEnterpriseOpen(true)} />
        </main>
        <Footer />

        <EnterpriseModal isOpen={isEnterpriseOpen} onClose={() => setIsEnterpriseOpen(false)} />
      </div>
    </ClickSpark>
  );
}

export default PricingPage;
