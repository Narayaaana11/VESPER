import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/vesper/Nav";
import { Shortcuts } from "@/components/vesper/Shortcuts";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";

const title = "Keyboard Shortcuts & Hardware Keys | VESPER Desktop";
const description =
  "Hardware-hooked push-to-talk key combinations, mechanical keycap tester, and sub-1ms WinKeyServer keyboard shortcuts for Windows.";

export const Route = createFileRoute("/shortcuts")({
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
  component: ShortcutsPage,
});

function ShortcutsPage() {
  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10 pt-16">
          <Shortcuts />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

export default ShortcutsPage;
