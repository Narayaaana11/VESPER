import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/vesper/Nav";
import { Simulator } from "@/components/vesper/Simulator";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";

const title = "Interactive Voice Simulator | VESPER Desktop";
const description =
  "Test the sub-180ms physical push-to-talk voice mechanic in your browser. Live WebAudio feedback, HWND caret simulation, and the Zero-Backspace Rule.";

export const Route = createFileRoute("/simulator")({
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
  component: SimulatorPage,
});

function SimulatorPage() {
  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10 pt-16">
          <Simulator />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

export default SimulatorPage;
