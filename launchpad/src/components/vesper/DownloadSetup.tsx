import { Copy, Download, Eye, EyeOff, Check, ExternalLink, ShieldCheck, Terminal, X, Key, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SpotlightCard,
  StarBorder,
  Magnet,
  ShinyText,
  DecryptedText,
} from "@/components/reactbits";

const SHA256_CHECKSUM = "9c2639de9aa7012d3855a2335993c17322258e2bbbc800bbacad16e053f91d7f";

function WindowsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="currentColor">
      <path d="M0 12.402l35.687-4.86.016 34.423-35.67.248L0 12.402zm35.67 33.529l.028 34.453L.028 75.48.003 46.179l35.667-.248zM40.97 6.479L87.977 0v41.526l-47.008.377V6.479zm47.037 39.467l-.03 41.602-46.99-6.613-.013-34.612 47.033-.377z" />
    </svg>
  );
}

export function DownloadSetup() {
  const [showSha, setShowSha] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWinget, setCopiedWinget] = useState(false);
  const [copiedPowerShell, setCopiedPowerShell] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const copyCode = () => {
    const code =
      "# Authorized internal developer access\ncd vesper-desktop\nnpm install\nnpm run dev";
    void navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    toast.success("Command copied to clipboard");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyWinget = () => {
    void navigator.clipboard?.writeText("winget install vesper");
    setCopiedWinget(true);
    toast.success("Winget command copied to clipboard!");
    setTimeout(() => setCopiedWinget(false), 2000);
  };

  const copyPowerShell = () => {
    const cmd = "irm https://vesperflow-ai.vercel.app/api/download/windows -OutFile VESPER-Setup.exe; .\\VESPER-Setup.exe";
    void navigator.clipboard?.writeText(cmd);
    setCopiedPowerShell(true);
    toast.success("PowerShell automated install script copied!");
    setTimeout(() => setCopiedPowerShell(false), 2000);
  };

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
    toast.success("Opening VESPER Download & Verification Center...");
  };

  return (
    <section id="download" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 relative">
      <div className="text-center sm:text-left">
        <p className="font-mono text-[11px] tracking-[0.2em] text-primary font-semibold">
          DOWNLOAD &amp; ONBOARDING
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-foreground sm:text-4xl">
          Zero-friction setup. Running in under two minutes.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Download the pre-compiled native installer, activate your VESPER subscription license, and begin speaking
          anywhere in Windows.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Direct Download Box wrapped in SpotlightCard */}
        <SpotlightCard
          spotlightColor="rgba(255, 107, 0, 0.15)"
          className="flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-sm backdrop-blur-md"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-orange-50 shadow-inner">
                <WindowsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">VESPER for Windows</h3>
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary font-semibold">
                    <ShinyText text="Official Release" speed={2} color="#ff6b00" shineColor="#ffffff" />
                  </span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  ~170 MB · Windows 10 &amp; 11 (x64) · Direct Caret Injection
                </p>
              </div>
            </div>

            {/* Direct Download with Magnet & StarBorder */}
            <div className="mt-6">
              <Magnet padding={40} magnetStrength={3} wrapperClassName="w-full">
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="w-full focus:outline-none"
                >
                  <StarBorder
                    as="div"
                    color="#ff6b00"
                    speed="3s"
                    thickness={1.5}
                    backgroundColor="#ff6b00"
                    className="flex w-full items-center justify-center text-sm font-semibold shadow-md transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white">
                      <Download className="h-4 w-4 text-white" />
                      <span>Download VESPER Installer (.exe)</span>
                    </div>
                  </StarBorder>
                </button>
              </Magnet>
            </div>

            {/* Mirror & Portable build note */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Verified Release Package</span>
              </div>
              <span className="font-mono text-[11px] text-primary font-semibold">SHA-256 Checksum Verified</span>
            </div>

            {/* Windows SmartScreen Note */}
            <div className="mt-4 rounded-lg border border-border bg-slate-50 p-3 text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Notice:</span> Because this is an
              unsigned community preview, Windows SmartScreen may show an initial prompt. Click{" "}
              <span className="text-foreground font-semibold underline">More info</span> &gt;{" "}
              <span className="text-foreground font-semibold underline">Run anyway</span>.
            </div>
          </div>

          {/* SHA256 Checksum Toggle */}
          <div className="mt-6 border-t border-border pt-4">
            <button
              onClick={() => setShowSha((v) => !v)}
              className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {showSha ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>Verify SHA256 Checksum</span>
            </button>
            {showSha && (
              <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-border bg-slate-50 p-2.5">
                <code className="break-all font-mono text-[10px] leading-4 text-muted-foreground">
                  <DecryptedText
                    text={SHA256_CHECKSUM}
                    speed={25}
                    maxIterations={6}
                    animateOn="view"
                    className="text-primary font-mono font-medium"
                    encryptedClassName="text-muted-foreground font-mono"
                  />
                </code>
                <button
                  onClick={() => {
                    void navigator.clipboard?.writeText(SHA256_CHECKSUM);
                    toast.success("SHA256 checksum copied to clipboard");
                  }}
                  className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-slate-200 hover:text-foreground cursor-pointer"
                  aria-label="Copy checksum"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* 4-Step Prerequisites & Setup Guide wrapped in SpotlightCard */}
        <SpotlightCard
          spotlightColor="rgba(255, 107, 0, 0.12)"
          className="rounded-xl border border-border bg-white px-6 py-4 shadow-sm backdrop-blur-md"
        >
          <Accordion type="single" collapsible defaultValue="s1">
            {/* Step 1: VESPER Software License */}
            <AccordionItem value="s1" className="border-border">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary">
                    1
                  </span>
                  <span className="text-foreground font-semibold">Activate Your VESPER Subscription License</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3.5 text-sm text-muted-foreground pb-4">
                <p>
                  VESPER authenticates desktop sessions against your developer subscription license.
                  Sign in with Google or verify your email on this portal to generate your license key.
                </p>
                <ol className="list-decimal space-y-1.5 pl-5 text-xs text-muted-foreground">
                  <li>Create your account or sign in using the top navigation bar.</li>
                  <li>Verify your email address via the 6-digit PIN sent to your inbox.</li>
                  <li>
                    Copy your assigned license key (format:{" "}
                    <span className="font-mono text-foreground font-medium">VESPER-XXXX-XXXX-XXXX</span>).
                  </li>
                </ol>
                <a
                  href="/guidance"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-slate-100"
                >
                  <span>Open Guidance &amp; License Gate</span>
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                </a>
              </AccordionContent>
            </AccordionItem>

            {/* Step 2: Windows Audio Permissions */}
            <AccordionItem value="s2" className="border-border">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary">
                    2
                  </span>
                  <span className="text-foreground font-semibold">
                    Enable Windows Microphone Permissions
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2.5 text-sm text-muted-foreground pb-4">
                <p>Ensure Windows grants desktop apps permission to access your microphone:</p>
                <div className="rounded-lg border border-border bg-slate-50 p-3 font-mono text-xs text-muted-foreground">
                  Settings &gt; Privacy &amp; security &gt; Microphone &gt; Allow desktop apps to
                  access your microphone (ON)
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 3: Launch VESPER & Configure */}
            <AccordionItem value="s3" className="border-border">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-semibold text-primary">
                    3
                  </span>
                  <span className="text-foreground font-semibold">
                    Launch VESPER &amp; Paste Your License Key
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm text-muted-foreground pb-4">
                <p>Run the installer or click the desktop shortcut.</p>
                <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                  <li>
                    Press{" "}
                    <span className="kbd font-mono text-[11px] text-foreground bg-slate-100 border border-slate-300 px-1 py-0.5 rounded">
                      Ctrl + Shift + Space
                    </span>{" "}
                    (or click the system tray icon) to open the VESPER Flow Dashboard.
                  </li>
                  <li>
                    Navigate to Settings, paste your{" "}
                    <span className="font-mono text-foreground font-medium">VESPER_LICENSE_KEY</span>, and pick your
                    preferred mode (Direct Dictation or Smart Copilot).
                  </li>
                  <li>
                    Click <span className="font-mono text-foreground font-medium">Save Settings</span>: you are
                    now ready to hold{" "}
                    <span className="kbd font-mono text-[11px] text-foreground bg-slate-100 border border-slate-300 px-1 py-0.5 rounded">F8</span> and
                    speak anywhere!
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Step 4: Run From Source (Developers) */}
            <AccordionItem value="s4" className="border-none">
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 font-mono text-[10px] font-semibold text-slate-700">
                    4
                  </span>
                  <span className="text-foreground font-semibold">
                    Private Developer Setup (Authorized Contributors)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm text-muted-foreground pb-4">
                <p className="text-xs">
                  Source code repositories are private. Authorized contributors with organization
                  access can run and test locally:
                </p>
                <div className="relative rounded-lg border border-border bg-slate-50 p-3 font-mono text-xs text-foreground">
                  <button
                    onClick={copyCode}
                    className="absolute right-2.5 top-2.5 rounded p-1 text-muted-foreground transition-colors hover:bg-slate-200 hover:text-foreground cursor-pointer"
                    title="Copy commands"
                  >
                    {copiedCode ? (
                      <Check className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <pre className="overflow-x-auto text-[11px] leading-5">
                    {`# Authorized internal developer access\ncd vesper-desktop\nnpm install\nnpm run dev`}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SpotlightCard>
      </div>

      {/* Interactive Download & Deployment Modal */}
      {isDownloadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsDownloadModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl border border-titanium-border/80 bg-[#121217]/95 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-6 sm:p-7 text-stark animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-titanium-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary">
                    <WindowsIcon className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-stark">VESPER Installation Center</h3>
                  <span className="rounded bg-emerald/10 text-emerald border border-emerald/30 px-2 py-0.5 font-mono text-[10px] font-semibold">
                    v1.0.0 Stable
                  </span>
                </div>
                <p className="mt-1 text-xs text-titanium-silver">
                  Native Windows 10 &amp; 11 (64-bit) · Low-latency Win32 caret injection
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(false)}
                className="rounded-lg p-1.5 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-titanium-border bg-titanium-elevated/70 p-4 transition-all hover:border-primary/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary">
                      <Download className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stark">Direct Installer (.exe)</p>
                      <p className="font-mono text-[11px] text-titanium-silver">
                        VESPER-Setup-1.0.0.exe · ~170 MB · Standard NSIS
                      </p>
                    </div>
                  </div>
                  <a
                    href="/api/download/windows"
                    download="VESPER-Flow-Setup.exe"
                    onClick={() => {
                      toast.success("Starting download of VESPER-Setup-1.0.0.exe...");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-titanium-border bg-titanium-elevated/70 p-4 transition-all hover:border-primary/40">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-stark">Windows Package Manager (winget)</span>
                  </div>
                  <span className="font-mono text-[10px] text-titanium-silver">Recommended for CLI</span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-titanium-border bg-obsidian px-3 py-2 font-mono text-xs text-stark">
                  <span className="truncate">winget install vesper</span>
                  <button
                    type="button"
                    onClick={copyWinget}
                    className="shrink-0 rounded p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors cursor-pointer"
                    title="Copy command"
                  >
                    {copiedWinget ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-titanium-border bg-titanium-elevated/70 p-4 transition-all hover:border-primary/40">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-stark">PowerShell One-Liner Install</span>
                  </div>
                  <span className="font-mono text-[10px] text-titanium-silver">Auto-fetch &amp; run</span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-titanium-border bg-obsidian px-3 py-2 font-mono text-[11px] text-stark">
                  <span className="truncate text-titanium-silver">irm .../api/download/windows -OutFile ...</span>
                  <button
                    type="button"
                    onClick={copyPowerShell}
                    className="shrink-0 rounded p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors cursor-pointer"
                    title="Copy PowerShell script"
                  >
                    {copiedPowerShell ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-titanium-border/80 bg-titanium/60 p-3.5 text-xs text-titanium-silver space-y-1.5">
              <p className="font-semibold text-stark flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Windows SmartScreen Note</span>
              </p>
              <p className="text-[11px] leading-relaxed text-titanium-silver">
                Because VESPER installs low-level Win32 keyboard hooks for zero-focus text injection, Windows SmartScreen may show an initial prompt on unsigned previews. Simply click <strong className="text-stark">More info &gt; Run anyway</strong>.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-titanium-border pt-4 text-xs">
              <a
                href="/guidance"
                className="inline-flex items-center gap-1.5 font-medium text-emerald hover:text-emerald/80 transition-colors"
              >
                <Key className="h-3.5 w-3.5" />
                <span>Validate License Key in Guidance</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(false)}
                className="rounded-lg border border-titanium-border bg-titanium-elevated hover:bg-titanium-border px-4 py-2 text-xs font-semibold text-stark transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DownloadSetup;
