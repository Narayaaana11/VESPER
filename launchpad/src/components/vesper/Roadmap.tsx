import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { SpotlightCard, ShinyText } from "@/components/reactbits";

interface PhaseItem {
  tag: string;
  badge: string;
  state: "live" | "building" | "planned";
  title: string;
  description: string;
  features: string[];
}

const PHASES: PhaseItem[] = [
  {
    tag: "PHASE 1: CURRENT",
    badge: "Production v1.0 Active",
    state: "live",
    title: "Windows Native Push-to-Talk & Context Engine",
    description:
      "Full native Windows client with sub-180ms neural speech pipeline transcription, zero-focus cursor pasting, and direct verbatim dictation.",
    features: [
      "Hardware-hooked Right Alt via WinKeyServer.exe",
      "Win32 foreground window and caret preservation",
      "Direct Dictation and Smart Copilot prompt modes",
      "Human-in-the-Loop safety approval system",
    ],
  },
  {
    tag: "PHASE 2: UPCOMING",
    badge: "In Active Build",
    state: "building",
    title: "Air-Gapped On-Device Whisper (ONNX + Transformers)",
    description:
      "Zero internet connection required. Run compact Whisper models entirely on local GPU and NPU hardware with INT8 quantized weights.",
    features: [
      "Local ONNX Runtime engine execution",
      "NVIDIA TensorRT and Intel NPU acceleration",
      "Zero egress network guarantees for classified workflows",
      "Local vector semantic index for clipboard memory",
    ],
  },
  {
    tag: "PHASE 3",
    badge: "Planned",
    state: "planned",
    title: "macOS & Linux Companion Architecture",
    description:
      "Cross-platform parity with global accessibility hooks, native Wayland/X11 support, and per-app prompt templates.",
    features: [
      "macOS Apple Silicon (Metal) native binary",
      "Application-specific prompt presets (Cursor, Slack, Word)",
      "Global multi-monitor capsule positioning",
      "Unified local telemetry and history sync",
    ],
  },
  {
    tag: "PHASE 4",
    badge: "Architecture Roadmap",
    state: "planned",
    title: "Team Dictionary & Enterprise Vocabulary Sync",
    description:
      "Collaborative domain dictionaries for engineering organizations, medical terminology, and proprietary codebase symbols.",
    features: [
      "Real-time synchronized custom vocabulary",
      "Enterprise audit logging and compliance verification",
      "Self-hosted team dictionary relays",
      "Role-based access controls for corporate deployments",
    ],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-28 relative">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver">
          <Clock className="h-3 w-3 text-emerald" />
          <span>Product Trajectory</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl">
          Engineered for privacy. Built for speed.
        </h2>
        <p className="mt-2 text-sm text-titanium-silver max-w-2xl">
          From today's live Windows MVP to a 100% air-gapped, offline ambient intelligence platform.
        </p>
      </div>

      <div className="mt-16 relative border-l border-titanium-border pl-6 sm:pl-10 ml-2 sm:ml-4 space-y-12">
        {PHASES.map((p) => {
          const isLive = p.state === "live";
          const isBuilding = p.state === "building";

          return (
            <div key={p.tag} className="relative group">
              {/* Timeline node marker */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border bg-obsidian transition-transform group-hover:scale-125 ${
                  isLive
                    ? "border-emerald/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : isBuilding
                      ? "border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                      : "border-titanium-border"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    isLive
                      ? "bg-emerald animate-pulse"
                      : isBuilding
                        ? "bg-amber-400"
                        : "bg-titanium-silver/40"
                  }`}
                />
              </div>

              {/* Card Content wrapped in SpotlightCard */}
              <SpotlightCard
                spotlightColor={
                  isLive
                    ? "rgba(16, 185, 129, 0.14)"
                    : isBuilding
                      ? "rgba(245, 158, 11, 0.12)"
                      : "rgba(255, 255, 255, 0.04)"
                }
                className="rounded-2xl border border-titanium-border bg-titanium/90 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-titanium-border/80"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-titanium-silver">
                    {p.tag}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium ${
                      isLive
                        ? "border-emerald/40 bg-emerald/10 text-emerald"
                        : isBuilding
                          ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                          : "border-titanium-border bg-titanium-elevated text-titanium-silver"
                    }`}
                  >
                    {isLive ? (
                      <ShinyText text={p.badge} speed={2} color="#ff6b00" shineColor="#ffffff" />
                    ) : isBuilding ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-2.5 w-2.5 text-amber-400 animate-spin" />
                        <span>{p.badge}</span>
                      </span>
                    ) : (
                      p.badge
                    )}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-stark tracking-tight">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-titanium-silver">
                  {p.description}
                </p>

                <div className="mt-5 grid gap-2.5 pt-4 border-t border-titanium-border/60 sm:grid-cols-2">
                  {p.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 text-xs text-titanium-silver"
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isLive
                            ? "text-emerald"
                            : isBuilding
                              ? "text-amber-400"
                              : "text-titanium-silver/60"
                        }`}
                      />
                      <span className="text-stark/90">{feat}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Roadmap;
