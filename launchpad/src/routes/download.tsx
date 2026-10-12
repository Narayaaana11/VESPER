import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/vesper/Nav";
import { DownloadSetup } from "@/components/vesper/DownloadSetup";
import { Footer } from "@/components/vesper/Footer";
import { ClickSpark } from "@/components/reactbits";

const title = "Download VESPER for Windows (.exe) | Official Release";
const description =
  "Download the official VESPER Windows Installer (64-bit), verify SHA-256 checksums, or install via Windows Package Manager (winget).";

export const Route = createFileRoute("/download")({
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
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <ClickSpark sparkColor="#ff6b00" sparkSize={10} sparkRadius={20} sparkCount={8} duration={400}>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        <Nav />
        <main className="relative z-10 pt-16">
          <DownloadSetup />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}

export default DownloadPage;
