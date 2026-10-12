import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/vesper/Nav";
import { Roadmap } from "@/components/vesper/Roadmap";
import { Waitlist } from "@/components/vesper/Waitlist";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";

const title = "Software 3.0 Engineering Roadmap | VESPER Desktop";
const description =
  "Explore the upcoming development phases of VESPER: local on-device neural pipelines, multi-modal screen agents, and enterprise telemetry.";

export const Route = createFileRoute("/roadmap")({
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
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10 pt-16">
          <Roadmap />
          <Waitlist />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

export default RoadmapPage;
