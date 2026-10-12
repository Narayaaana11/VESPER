import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/vesper/Nav";
import { Personas } from "@/components/vesper/Personas";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";

const title = "High-Frequency Daily Workflows | VESPER Desktop";
const description =
  "See how senior engineers, founders, and creators use VESPER for code reviews, rapid memos, and documentation with the Zero-Backspace Rule.";

export const Route = createFileRoute("/workflows")({
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
  component: WorkflowsPage,
});

function WorkflowsPage() {
  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10 pt-16">
          <Personas />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

export default WorkflowsPage;
