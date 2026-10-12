import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Nav } from "@/components/vesper/Nav";
import { Hero } from "@/components/vesper/Hero";
import { Simulator } from "@/components/vesper/Simulator";
import { Personas } from "@/components/vesper/Personas";
import { Capabilities } from "@/components/vesper/Capabilities";
import { Shortcuts } from "@/components/vesper/Shortcuts";
import { Pricing } from "@/components/vesper/Pricing";
import { DownloadSetup } from "@/components/vesper/DownloadSetup";
import { Roadmap } from "@/components/vesper/Roadmap";
import { Waitlist } from "@/components/vesper/Waitlist";
import { FaqFeedback } from "@/components/vesper/FaqFeedback";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";
import { EnterpriseModal } from "@/components/vesper/EnterpriseModal";
import { ArchitectureModal } from "@/components/vesper/ArchitectureModal";
import { ContextInspector } from "@/components/vesper/ContextInspector";
import { UtoExplorerModal } from "@/components/vesper/UtoExplorerModal";

const title = "VESPER Desktop: Software 3.0 Ambient Voice-to-Action for Windows";
const description =
  "The high-bandwidth biological bridge to your PC. Hold Right Alt, speak naturally, and paste pre-polished text directly at your cursor in sub-180ms. Follows the Zero-Backspace Rule.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isContextInspectorOpen, setIsContextInspectorOpen] = useState(false);
  const [isUtoOpen, setIsUtoOpen] = useState(false);

  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10">
          <Hero />
          <Simulator />
          <Personas />
          <Capabilities
            onOpenArchitectureModal={() => setIsArchitectureOpen(true)}
            onOpenContextInspector={() => setIsContextInspectorOpen(true)}
            onOpenUtoModal={() => setIsUtoOpen(true)}
          />
          <Shortcuts />
          <Pricing onOpenEnterpriseModal={() => setIsEnterpriseOpen(true)} />
          <DownloadSetup />
          <Roadmap />
          <Waitlist />
          <FaqFeedback />
        </main>
        <Footer />

        <EnterpriseModal isOpen={isEnterpriseOpen} onClose={() => setIsEnterpriseOpen(false)} />
        <ArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
        <ContextInspector
          isOpen={isContextInspectorOpen}
          onClose={() => setIsContextInspectorOpen(false)}
        />
        <UtoExplorerModal isOpen={isUtoOpen} onClose={() => setIsUtoOpen(false)} />
      </div>
    </ClickSpark>
  );
}
