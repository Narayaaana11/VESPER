import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/vesper/Nav";
import { Capabilities } from "@/components/vesper/Capabilities";
import { ArchitectureModal } from "@/components/vesper/ArchitectureModal";
import { ContextInspector } from "@/components/vesper/ContextInspector";
import { UtoExplorerModal } from "@/components/vesper/UtoExplorerModal";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";

const title = "System Architecture & 8-Layer Pipeline | VESPER Desktop";
const description =
  "Explore the sub-180ms neural speech pipeline, WinKeyServer C++ hardware hooks, Silero VAD, and caret injection architecture.";

export const Route = createFileRoute("/architecture")({
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
  component: ArchitecturePage,
});

function ArchitecturePage() {
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isContextInspectorOpen, setIsContextInspectorOpen] = useState(false);
  const [isUtoOpen, setIsUtoOpen] = useState(false);

  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10 pt-16">
          <Capabilities
            onOpenArchitectureModal={() => setIsArchitectureOpen(true)}
            onOpenContextInspector={() => setIsContextInspectorOpen(true)}
            onOpenUtoModal={() => setIsUtoOpen(true)}
          />
        </main>
        <Footer />

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

export default ArchitecturePage;
