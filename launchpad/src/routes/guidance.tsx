import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Cpu,
  Shield,
  Key,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  Mic,
  ArrowRight,
  Code2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/guidance")({
  component: GuidancePage,
});

const sections = [
  { id: "quickstart", title: "Quickstart & Setup", icon: Sparkles },
  { id: "hardware-hooks", title: "Hardware & Win32 Hooks", icon: Cpu },
  { id: "zero-backspace", title: "Zero-Backspace Philosophy", icon: Terminal },
  { id: "licensing", title: "Licensing & Desktop Gate", icon: Key },
  { id: "privacy", title: "Privacy Sandbox & Inference", icon: Shield },
  { id: "troubleshooting", title: "Troubleshooting & Diagnostics", icon: AlertCircle },
];

function GuidancePage() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [copiedKey, setCopiedKey] = useState(false);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseStatus, setLicenseStatus] = useState<any>(null);
  const [isCheckingLicense, setIsCheckingLicense] = useState(false);
  const { user, verifyLicense } = useAuth();

  // Check URL params for verification status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") {
      toast.success("Account & License Verified!", {
        description: "Your VESPER software license is active. You can now use the desktop application.",
      });
      const licenseParam = params.get("license");
      if (licenseParam) {
        setLicenseInput(licenseParam);
      }
    }
  }, []);

  const handleTestLicense = async () => {
    const key = licenseInput.trim() || user?.licenseKey || "";
    if (!key) {
      toast.error("Please enter a VESPER license key to verify.");
      return;
    }

    setIsCheckingLicense(true);
    setLicenseStatus(null);
    try {
      const res = await verifyLicense(key);
      setLicenseStatus(res);
      if (res.valid) {
        toast.success(`License Active [${res.tier?.toUpperCase()}]`, {
          description: "Authorized for unlimited native desktop client sessions.",
        });
      } else {
        toast.error(res.error || "License verification failed.");
      }
    } catch {
      toast.error("Error connecting to license verification service.");
    } finally {
      setIsCheckingLicense(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-obsidian text-stark pt-24 pb-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs text-titanium-silver mb-3">
            <Link to="/" className="hover:text-emerald transition-colors">
              VESPER
            </Link>
            <span>/</span>
            <span className="text-emerald">Guidance & Documentation</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-titanium-border pb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                VESPER Guidance & Operational Manual
              </h1>
              <p className="text-base text-titanium-silver max-w-3xl leading-relaxed">
                The technical manual for configuring VESPER's local-first speech pipeline, low-level Win32
                event hooks, ambient context MCP protocol, and subscription license verification.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                className="rounded-lg border border-titanium-border bg-titanium px-4 py-2 text-xs font-semibold text-titanium-silver hover:text-white hover:border-titanium-silver/40 transition-all"
              >
                Launchpad Home
              </Link>
              <a
                href="/#download"
                className="flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-bold text-obsidian shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all"
              >
                <span>Download Desktop Client</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-titanium-border bg-titanium/60 p-3 backdrop-blur-md">
              <div className="px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-titanium-silver/70 font-semibold">
                Documentation Index
              </div>
              <nav className="flex flex-col gap-1 mt-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-left transition-all ${
                        isActive
                          ? "bg-emerald/15 text-emerald font-semibold border border-emerald/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                          : "text-titanium-silver hover:bg-titanium-elevated hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald" : "text-titanium-silver"}`} />
                      <span>{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              {/* User License Key Card in Sidebar */}
              {user && (
                <div className="mt-6 pt-4 border-t border-titanium-border/60 px-2">
                  <div className="font-mono text-[10px] uppercase text-titanium-silver/70 mb-1">
                    Your Active License
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-titanium-border bg-obsidian px-2.5 py-1.5">
                    <span className="font-mono text-xs font-bold text-emerald truncate">
                      {user.licenseKey || "VESPER-PRO-ACTIVE"}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(user.licenseKey || "VESPER-PRO-ACTIVE")}
                      className="text-titanium-silver hover:text-white ml-1 shrink-0"
                      title="Copy Key"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-titanium-silver">
                    <span>Tier: {user.tier?.toUpperCase() || "PRO"}</span>
                    <span className="text-emerald font-medium">● Verified</span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-12">
            {/* Section 1: Quickstart & Setup */}
            {activeSection === "quickstart" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-emerald mb-2 font-mono text-xs">
                    <Sparkles className="h-4 w-4" />
                    <span>01 // ONBOARDING</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Quickstart & Initial Setup</h2>
                  <p className="text-sm text-titanium-silver leading-relaxed mb-6">
                    VESPER runs as a local-first Windows service with a lightweight system tray companion. It binds
                    directly to your global keyboard and audio input drivers to enable zero-latency voice dictation
                    across all active software.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="font-mono text-xs text-emerald mb-1 font-bold">1. Install</div>
                      <div className="text-xs text-white font-medium mb-1">Download Native Package</div>
                      <p className="text-[11px] text-titanium-silver">
                        Grab the Windows 64-bit installer (.exe) or portable build. Run the installer to register low-level hooks.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="font-mono text-xs text-emerald mb-1 font-bold">2. Activate</div>
                      <div className="text-xs text-white font-medium mb-1">Enter License Key</div>
                      <p className="text-[11px] text-titanium-silver">
                        Paste your verified VESPER License Key generated upon account registration into the desktop setup prompt.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="font-mono text-xs text-emerald mb-1 font-bold">3. Speak</div>
                      <div className="text-xs text-white font-medium mb-1">Hold F8 to Talk</div>
                      <p className="text-[11px] text-titanium-silver">
                        Hold F8 anywhere in Windows. Speak naturally. Release F8 to paste polished text instantly at your cursor.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-3">System Prerequisites</h3>
                  <ul className="space-y-2 text-xs text-titanium-silver font-mono">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                      <span>Windows 10 (Build 19041+) or Windows 11 (64-bit architecture)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                      <span>DirectML / AVX2 capable processor for offline ONNX neural fallback</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                      <span>Active microphone input with standard 16kHz or 48kHz sampling support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                      <span>Administrative privileges required only for first-time low-level hook registration</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 2: Hardware & Win32 Hooks */}
            {activeSection === "hardware-hooks" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-emerald mb-2 font-mono text-xs">
                    <Cpu className="h-4 w-4" />
                    <span>02 // ARCHITECTURE</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Hardware & Win32 Hooks Deep-Dive</h2>
                  <p className="text-sm text-titanium-silver leading-relaxed mb-6">
                    Unlike web-based or Electron overlay tools that take window focus, VESPER uses direct Windows OS
                    subsystems to maintain completely transparent execution.
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-emerald font-bold">WH_KEYBOARD_LL Interception</span>
                        <span className="font-mono text-[10px] text-titanium-silver">Sub-0.5ms Polling</span>
                      </div>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        VESPER registers a low-level keyboard hook callback via the Win32 API. Key presses (such as F8 or
                        configured modifiers) are intercepted before reaching standard message loops, eliminating any
                        delay or interference with foreground applications.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-emerald font-bold">Raw 16kHz Audio Ring Buffer</span>
                        <span className="font-mono text-[10px] text-titanium-silver">Volatile RAM Storage</span>
                      </div>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        Microphone capture operates on a dedicated background audio thread. As soon as the trigger key
                        is depressed, the driver records 16-bit PCM chunks into an in-memory ring buffer. No temporary
                        audio files are ever written to disk.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-emerald font-bold">Zero-Focus Window Text Injection</span>
                        <span className="font-mono text-[10px] text-titanium-silver">SendInput API</span>
                      </div>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        When speech finishes, transcribed text is emitted into the exact focused control using native
                        keystroke events. You can dictate into VS Code, Cursor Composer, Windows Terminal, Slack, or any
                        custom desktop application without the focus stealing or window switching of traditional assistants.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Zero-Backspace Philosophy */}
            {activeSection === "zero-backspace" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-emerald mb-2 font-mono text-xs">
                    <Terminal className="h-4 w-4" />
                    <span>03 // SPEECH PHILOSOPHY</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">The Zero-Backspace Rule</h2>
                  <p className="text-sm text-titanium-silver leading-relaxed mb-6">
                    Real-time dictation engines typically stream partial tokens into the active cursor, causing rapid
                    backspacing, cursor jumping, and disruption of code indentations. VESPER eliminates this entirely.
                  </p>

                  <div className="rounded-xl border border-emerald/30 bg-emerald/5 p-5 mb-6">
                    <div className="font-mono text-xs text-emerald font-bold mb-2">CORE PRINCIPLE: ATOMIC SYNTHESIS</div>
                    <p className="text-xs text-titanium-silver leading-relaxed">
                      VESPER holds transcription until speech finishes. The neural engine cleans hesitation fillers,
                      formats code symbols and punctuation, and injects the final string as an atomic keystroke sequence.
                      The cursor moves once, exactly where it belongs. Zero backspaces. Zero cursor jitter.
                    </p>
                  </div>

                  <h3 className="text-base font-bold text-white mb-3">Spoken Formatting Shortcuts</h3>
                  <div className="overflow-x-auto rounded-xl border border-titanium-border">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="border-b border-titanium-border bg-titanium-elevated text-titanium-silver">
                        <tr>
                          <th className="p-3">You Say</th>
                          <th className="p-3">VESPER Injects</th>
                          <th className="p-3">Behavior</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-titanium-border/60 text-titanium-silver">
                        <tr>
                          <td className="p-3 text-white">"new line" or "line break"</td>
                          <td className="p-3 text-emerald font-bold">\n</td>
                          <td className="p-3">Inserts Enter keystroke</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-white">"function parse user token camel case"</td>
                          <td className="p-3 text-emerald font-bold">parseUserToken</td>
                          <td className="p-3">Converts to code identifier</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-white">"open brace close brace"</td>
                          <td className="p-3 text-emerald font-bold">{"{}"}</td>
                          <td className="p-3">Inserts brackets</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-white">"git status dash s"</td>
                          <td className="p-3 text-emerald font-bold">git status -s</td>
                          <td className="p-3">Formats CLI arguments</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Licensing & Desktop Gate */}
            {activeSection === "licensing" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-emerald mb-2 font-mono text-xs">
                    <Key className="h-4 w-4" />
                    <span>04 // SOFTWARE LICENSING</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Desktop App Subscription & License Verification</h2>
                  <p className="text-sm text-titanium-silver leading-relaxed mb-6">
                    Similar to professional developer toolchains, VESPER protects its proprietary neural runtime
                    and ambient memory protocol through authenticated software licenses. Users must verify their account
                    to unlock desktop client access.
                  </p>

                  {/* Interactive License Key Checker Widget */}
                  <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-5 mb-8">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald" />
                      <span>Live License Gate Verification</span>
                    </h3>
                    <p className="text-xs text-titanium-silver mb-4">
                      Test your license key against the live MongoDB verification engine (/api/license/verify).
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={licenseInput}
                        onChange={(e) => setLicenseInput(e.target.value)}
                        placeholder={user?.licenseKey || "VESPER-XXXX-XXXX-XXXX"}
                        className="flex-1 rounded-lg border border-titanium-border bg-obsidian px-3.5 py-2 font-mono text-xs text-white placeholder:text-titanium-silver/50 focus:border-emerald focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleTestLicense}
                        disabled={isCheckingLicense}
                        className="rounded-lg bg-emerald px-5 py-2 text-xs font-bold text-obsidian hover:bg-emerald-400 disabled:opacity-50 transition-all shrink-0"
                      >
                        {isCheckingLicense ? "Verifying..." : "Validate Key"}
                      </button>
                    </div>

                    {licenseStatus && (
                      <div
                        className={`mt-4 rounded-lg p-3 text-xs font-mono border ${
                          licenseStatus.valid
                            ? "border-emerald/40 bg-emerald/10 text-emerald"
                            : "border-red-500/40 bg-red-500/10 text-red-400"
                        }`}
                      >
                        <div className="font-bold mb-1">
                          {licenseStatus.valid ? "✓ LICENSE VALID & ACTIVE" : "✗ VERIFICATION REJECTED"}
                        </div>
                        {licenseStatus.valid ? (
                          <div>
                            <div>Key: {licenseStatus.licenseKey}</div>
                            <div>Tier: {licenseStatus.tier?.toUpperCase()}</div>
                            <div>Quota: {licenseStatus.quota?.totalSeconds}s total speech capacity</div>
                            <div>Engine: {licenseStatus.engineConfig?.neuralPipeline}</div>
                          </div>
                        ) : (
                          <div>{licenseStatus.error}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-3">Subscription Tier Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-titanium-border bg-titanium p-4">
                      <div className="font-mono text-xs text-titanium-silver uppercase mb-1">Free Community</div>
                      <div className="text-xl font-bold text-white mb-2">$0</div>
                      <p className="text-xs text-titanium-silver mb-3">
                        Ideal for evaluating local Hold-to-Talk and offline ONNX models.
                      </p>
                      <div className="text-[11px] font-mono text-titanium-silver space-y-1">
                        <div>• 3,600s speech quota</div>
                        <div>• Direct dictation mode</div>
                        <div>• Local model support</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald/50 bg-emerald/5 p-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                      <div className="font-mono text-xs text-emerald uppercase mb-1 font-bold">Pro Developer</div>
                      <div className="text-xl font-bold text-white mb-2">$12/mo</div>
                      <p className="text-xs text-titanium-silver mb-3">
                        For engineers, founders, and power writers seeking sub-180ms neural latency.
                      </p>
                      <div className="text-[11px] font-mono text-emerald space-y-1">
                        <div>• 72,000s speech quota</div>
                        <div>• Sub-180ms Neural Pipeline</div>
                        <div>• VESPER Ambient Context MCP</div>
                        <div>• Priority model routing</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium p-4">
                      <div className="font-mono text-xs text-titanium-silver uppercase mb-1">Enterprise</div>
                      <div className="text-xl font-bold text-white mb-2">Custom</div>
                      <p className="text-xs text-titanium-silver mb-3">
                        Air-gapped on-premise clusters, HIPAA compliance, and seat governance.
                      </p>
                      <div className="text-[11px] font-mono text-titanium-silver space-y-1">
                        <div>• Unlimited seat capacity</div>
                        <div>• Zero-data-retention SLA</div>
                        <div>• Dedicated hardware cluster</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Privacy Sandbox & Inference */}
            {activeSection === "privacy" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-emerald mb-2 font-mono text-xs">
                    <Shield className="h-4 w-4" />
                    <span>05 // SECURITY GOVERNANCE</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Privacy Sandbox & Neural Runtime</h2>
                  <p className="text-sm text-titanium-silver leading-relaxed mb-6">
                    Developer workstations contain critical keys, SSH credentials, and private intellectual property.
                    VESPER is architected with strict confidentiality boundaries at every tier.
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="font-mono text-xs text-emerald font-bold mb-1">
                        1. Local Credential Sanitization
                      </div>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        Before context is passed to the ambient memory MCP or neural speech models, regex filters
                        automatically detect and redact bearer tokens, API keys, passwords, and sensitive environment
                        strings locally on your CPU.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="font-mono text-xs text-emerald font-bold mb-1">
                        2. 100% Offline Air-Gapped Fallback
                      </div>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        For defense, legal, or medical institutions where outbound internet traffic is forbidden,
                        VESPER includes a DirectML INT8 ONNX offline speech engine that executes entirely on local GPUs or
                        NPUs without sending a single packet over the network.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <div className="font-mono text-xs text-emerald font-bold mb-1">
                        3. Zero Cloud Audio Retention
                      </div>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        When using high-speed private cloud inference, audio is streamed over encrypted TLS, transcribed
                        statelessly, and immediately freed from RAM. No audio files or transcripts are ever stored,
                        cached, or used to train third-party models.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Troubleshooting & Diagnostics */}
            {activeSection === "troubleshooting" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-titanium-border bg-titanium/50 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-emerald mb-2 font-mono text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <span>06 // DIAGNOSTICS</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Troubleshooting & Diagnostic FAQ</h2>
                  <p className="text-sm text-titanium-silver leading-relaxed mb-6">
                    Resolutions for common Windows hardware, permissions, and network setup questions.
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <h4 className="text-xs font-bold text-white mb-1">
                        Q: Why does F8 not trigger when running terminal or IDE as Administrator?
                      </h4>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        Windows User Interface Privilege Isolation (UIPI) prevents applications running at standard
                        integrity from injecting keystrokes into elevated Administrator windows. To resolve this, run
                        VESPER as Administrator, or launch both processes under the same privilege level.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <h4 className="text-xs font-bold text-white mb-1">
                        Q: Windows Defender or Antivirus flags the keyboard hook executable. Is it safe?
                      </h4>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        Low-level keyboard hooks (WH_KEYBOARD_LL) are common triggers for heuristic scanner warnings
                        because malware keyloggers use similar OS hooks. VESPER is code-signed and strictly reads the
                        trigger key without logging background keystrokes. Add VESPER to your Defender whitelist if
                        prompted.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <h4 className="text-xs font-bold text-white mb-1">
                        Q: Microphone audio shows zero volume or transcription times out.
                      </h4>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        Check Windows Settings &gt; Privacy &amp; Security &gt; Microphone. Ensure "Let desktop apps access your
                        microphone" is toggled ON. In VESPER Settings, ensure your primary recording device is selected
                        instead of a virtual audio loopback cable.
                      </p>
                    </div>

                    <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                      <h4 className="text-xs font-bold text-white mb-1">
                        Q: How do I change the default trigger key from F8?
                      </h4>
                      <p className="text-xs text-titanium-silver leading-relaxed">
                        Open the VESPER system tray icon &gt; Preferences &gt; Shortcuts. You can assign any single key or
                        combination (e.g., Caps Lock, Right Alt, Ctrl+Shift+Space, or dedicated mouse thumb buttons).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
