import {
  Mic,
  Zap,
  Target,
  Cloud,
  ScanEye,
  Keyboard,
  ShieldAlert,
  Cpu,
  ArrowRight,
  Activity,
  Terminal,
  Network,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { SpotlightCard, ShinyText, BorderGlow } from "@/components/reactbits";

function BentoCard({
  icon: Icon,
  badge,
  title,
  children,
  className = "",
  spotlightColor = "rgba(16, 185, 129, 0.12)",
}: {
  icon: typeof Mic;
  badge?: string;
  title: string;
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  return (
    <SpotlightCard
      spotlightColor={spotlightColor}
      className={`group relative overflow-hidden rounded-xl border border-titanium-border bg-titanium p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-titanium-border/80 hover:bg-titanium-elevated hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-titanium-border bg-titanium-elevated transition-colors group-hover:border-emerald/40">
          <Icon className="h-4.5 w-4.5 text-emerald" />
        </div>
        {badge && (
          <span className="rounded-md border border-titanium-border bg-obsidian px-2.5 py-0.5 font-mono text-[10px] text-titanium-silver">
            <ShinyText text={badge} speed={3} color="#8e8e9f" shineColor="#ff6b00" />
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight text-stark">{title}</h3>
      <div className="mt-2.5 space-y-2 text-sm leading-relaxed text-titanium-silver">
        {children}
      </div>
    </SpotlightCard>
  );
}

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Low-Level Hardware Hook",
    component: "WinKeyServer.exe",
    desc: "C++ raw Windows keyboard hook intercepts VK_MENU Right/Left Alt with <1ms timing.",
    color: "#ff6b00",
  },
  {
    step: "02",
    title: "Silero VAD & Stream Chunking",
    component: "16kHz In-Memory PCM",
    desc: "On-device speech boundary detection; zero background noise leakage into audio buffer.",
    color: "#f59e0b",
  },
  {
    step: "03",
    title: "Sub-180ms Neural Inference",
    component: "Whisper-large-v3 Pipeline",
    desc: "Greedy beam-free decoding runs in <180ms on specialized neural hardware with 0 cloud retention.",
    color: "#ff8533",
  },
  {
    step: "04",
    title: "Win32 Caret Injection",
    component: "AttachThreadInput API",
    desc: "Native SendInput writes text directly into the foreground window without stealing focus.",
    color: "#ff6b00",
  },
];

export interface CapabilitiesProps {
  onOpenArchitectureModal?: () => void;
  onOpenContextInspector?: () => void;
  onOpenUtoModal?: () => void;
}

export function Capabilities({
  onOpenArchitectureModal,
  onOpenContextInspector,
  onOpenUtoModal,
}: CapabilitiesProps = {}) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="pipeline" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-28">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver">
          <Terminal className="h-3 w-3 text-emerald" />
          <span>8-Layer System Architecture</span>
        </div>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.03em] text-stark sm:text-4xl">
          Engineered as a native Windows power-tool. Not another browser wrapper.
        </h2>
        <p className="mt-2.5 max-w-xl text-sm text-titanium-silver">
          Discover how VESPER achieves sub-220ms end-to-end voice-to-action execution while
          guaranteeing zero window focus loss.
        </p>
      </div>

      {/* Interactive 4-Stage Execution Pipeline */}
      <div className="mt-12 rounded-2xl border border-titanium-border bg-titanium p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-titanium-border pb-4 gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stark">
              End-to-End Latency Waterfall (&lt;220ms Total)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {onOpenArchitectureModal && (
              <button
                type="button"
                onClick={onOpenArchitectureModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/40 bg-emerald/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald hover:bg-emerald/20 transition-all cursor-pointer"
              >
                <Terminal className="h-3 w-3" />
                <span>Inspect MCP Schemas</span>
              </button>
            )}
            <span className="font-mono text-[11px] text-titanium-silver">
              Click steps to inspect mechanics
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((s, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`relative flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "border-emerald/60 bg-titanium-elevated shadow-[0_0_24px_rgba(16,185,129,0.15)] ring-1 ring-emerald/30"
                    : "border-titanium-border bg-obsidian hover:border-titanium-silver/40 hover:bg-titanium"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald">{s.step}</span>
                  <span className="rounded bg-titanium border border-titanium-border px-1.5 py-0.5 font-mono text-[9px] text-titanium-silver">
                    {s.component}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-semibold text-stark">{s.title}</h4>
                <p className="mt-1.5 text-xs text-titanium-silver leading-relaxed">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Hold-to-Talk with BorderGlow */}
        <div className="lg:col-span-2">
          <BorderGlow
            borderRadius={12}
            glowColor="255 107 0"
            glowRadius={20}
            glowIntensity={0.5}
            colors={["#ff6b00", "#ea580c"]}
            className="w-full h-full"
          >
            <div className="p-6 bg-titanium rounded-xl h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-titanium-border bg-titanium-elevated">
                    <Mic className="h-4.5 w-4.5 text-emerald" />
                  </div>
                  <span className="rounded-md border border-titanium-border bg-obsidian px-2.5 py-0.5 font-mono text-[10px] text-titanium-silver">
                    <ShinyText
                      text="Native Win32 Hook"
                      speed={2.5}
                      color="#ff6b00"
                      shineColor="#ffffff"
                    />
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold tracking-tight text-stark">
                  Hold-to-Talk: Sub-180ms Trigger
                </h3>
                <div className="mt-2.5 space-y-2 text-sm leading-relaxed text-titanium-silver">
                  <p>
                    Press and hold <span className="kbd font-mono text-stark">Right Alt</span> (or{" "}
                    <span className="kbd font-mono text-stark">F8</span> /{" "}
                    <span className="kbd font-mono text-stark">Fn</span>) for ≥180ms. The
                    non-activating obsidian capsule floats at the top without stealing window focus.
                  </p>
                  <p>
                    Release the key to transcribe via the high-speed neural engine and paste directly at your exact cursor
                    position across any active Windows application.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 pt-3 border-t border-titanium-border">
                {[
                  "Cursor Composer",
                  "VS Code",
                  "Google Chrome",
                  "Slack Desktop",
                  "Microsoft Excel",
                  "Obsidian Vault",
                  "Windows Terminal",
                ].map((app) => (
                  <span
                    key={app}
                    className="rounded-md border border-titanium-border bg-obsidian px-2 py-0.5 font-mono text-[10px] text-titanium-silver hover:text-emerald hover:border-emerald/30 transition-colors"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Card 2: VESPER Context Protocol MCP Server */}
        <BentoCard icon={Network} badge="Port 32123" title="VESPER Context Protocol MCP Server">
          <p>
            VESPER runs an embedded Model Context Protocol (MCP) server. External AI agents in
            Cursor, Claude Code, Windsurf, and Antigravity can directly query active desktop memory.
          </p>
          <div className="mt-2 rounded-lg border border-titanium-border bg-obsidian p-2.5 font-mono text-[11px] text-emerald">
            <code>http://127.0.0.1:32123/mcp</code>
          </div>
          <p className="text-xs text-titanium-silver pt-1">
            Exposes <code>search_user_context</code> and <code>get_active_screen_context</code> with
            zero cloud transmission.
          </p>
        </BentoCard>

        {/* Card 3: Double-Tap Persistent Mode */}
        <BentoCard icon={Zap} badge="380ms Window" title="Double-Tap Persistent Mode">
          <p>
            Double-tap <span className="kbd font-mono text-stark">Right Alt</span> within 380ms to
            lock the HUD open for long-form dictation, meetings, or multi-step prompt drafting.
          </p>
          <p>
            Features interactive on-screen controls for <span className="text-stark">Record</span>,{" "}
            <span className="text-stark">Pause / Resume</span>,{" "}
            <span className="text-stark">Stop &amp; Insert</span>, and{" "}
            <span className="text-stark">Discard</span>.
          </p>
        </BentoCard>

        {/* Card 4: Direct Dictation vs Smart Assistant */}
        <BentoCard icon={Target} badge="Dual Pipeline" title="Direct Dictation vs. Smart Copilot">
          <div className="space-y-3">
            <div className="rounded-lg border border-titanium-border bg-obsidian p-3">
              <span className="font-mono text-[11px] font-semibold text-emerald">
                DIRECT MODE (VERBATIM)
              </span>
              <p className="mt-1 text-xs text-titanium-silver">
                Pure verbatim transcription with strict capitalization, punctuation, and code
                formatting. Zero hallucinations.
              </p>
            </div>
            <div className="rounded-lg border border-titanium-border bg-obsidian p-3">
              <span className="font-mono text-[11px] font-semibold text-emerald">
                SMART COPILOT MODE
              </span>
              <p className="mt-1 text-xs text-titanium-silver">
                Contextual prompt engineering designed specifically for Claude 3.7, ChatGPT, and
                Cursor Composer workflows.
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Card 5: Autonomous Screen Copilot & HITL Safety */}
        <BentoCard
          icon={ScanEye}
          badge="Strict HITL Gate"
          title="Autonomous Screen Copilot & Safety"
        >
          <p>
            Multimodal visual inspection of active windows via low-latency native screen capture.
          </p>
          <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="font-mono text-[11px] font-semibold">
                HUMAN-IN-THE-LOOP SAFETY GATE
              </span>
            </div>
            <p className="mt-1 text-xs text-titanium-silver">
              Actions with external side effects require explicit approval: press{" "}
              <span className="kbd font-mono text-xs text-stark">Enter</span> to execute or{" "}
              <span className="kbd font-mono text-xs text-stark">Esc</span> to reject.
            </p>
          </div>
        </BentoCard>

        {/* Card 6: Silicon Acceleration & NPU Engine */}
        <BentoCard
          icon={Cpu}
          badge="DirectML & CUDA"
          title="Hardware Acceleration (Jensen's Law)"
          className="lg:col-span-2"
        >
          <p>
            Co-designed for modern AI PC silicon. Operates on dedicated NVIDIA RTX Tensor Cores,
            Intel Core Ultra NPUs, or AMD Ryzen AI via DirectML execution providers.
          </p>
          <p>
            Runs quantized INT8 models under 60 MB RAM with less than 1W background power, keeping
            laptop thermals whisper-quiet.
          </p>
        </BentoCard>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {onOpenArchitectureModal && (
          <button
            type="button"
            onClick={onOpenArchitectureModal}
            className="inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium-elevated px-5 py-3 font-mono text-xs font-semibold text-stark transition-all hover:border-emerald/50 hover:bg-titanium-border active:scale-[0.99] cursor-pointer shadow-lg"
          >
            <Network className="h-4 w-4 text-emerald" />
            <span>Open 8-Layer Architecture Modal</span>
            <ArrowRight className="h-3.5 w-3.5 text-titanium-silver" />
          </button>
        )}

        {onOpenContextInspector && (
          <button
            type="button"
            onClick={onOpenContextInspector}
            className="inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium px-4 py-3 font-mono text-xs text-stark transition-all hover:border-emerald/50 hover:text-emerald cursor-pointer"
          >
            <ScanEye className="h-4 w-4 text-emerald" />
            <span>Context &amp; Privacy Shield (Layer 2)</span>
          </button>
        )}

        {onOpenUtoModal && (
          <button
            type="button"
            onClick={onOpenUtoModal}
            className="inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium px-4 py-3 font-mono text-xs text-stark transition-all hover:border-emerald/50 hover:text-emerald cursor-pointer"
          >
            <Cpu className="h-4 w-4 text-emerald" />
            <span>Universal Task Object (Layer 5)</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default Capabilities;
