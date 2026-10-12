import { useState } from "react";
import {
  Code2,
  Briefcase,
  PenTool,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Volume2,
} from "lucide-react";
import { SpotlightCard } from "@/components/reactbits";

interface PersonaWorkflow {
  id: string;
  name: string;
  role: string;
  category: string;
  icon: typeof Code2;
  environment: string;
  hardware: string;
  spokenRaw: string;
  polishedResult: string;
  metrics: { label: string; value: string }[];
  quote: string;
}

const PERSONAS: PersonaWorkflow[] = [
  {
    id: "alex",
    name: "Alex Chen",
    role: "Senior Full-Stack Engineer",
    category: "AI Coding in Cursor Composer",
    icon: Code2,
    environment: "Cursor, VS Code, Windows Terminal",
    hardware: "Mechanical Keyboard, Windows 11 Dev Box",
    spokenRaw:
      "Refactor this auth middleware to check for bearer tokens in the authorization header and return a four zero one if missing.",
    polishedResult:
      "Refactor this auth middleware to check for bearer tokens in the Authorization header and return a 401 if missing.",
    metrics: [
      { label: "Target App", value: "Cursor Composer" },
      { label: "Latency", value: "172ms" },
      { label: "Focus Preserved", value: "100%" },
    ],
    quote:
      "I formulate complex code prompts at 180 WPM without ever touching the mouse or losing my cursor in Composer.",
  },
  {
    id: "elena",
    name: "Elena Rostova",
    role: "Co-Founder & CEO",
    category: "Executive Message Triage",
    icon: Briefcase,
    environment: "Slack, Gmail, Superhuman, Notion",
    hardware: "Dell XPS 13, AirPods",
    spokenRaw:
      "Hey team, um, let's reschedule our product review to, uh, tomorrow at three PM instead of four because investor call ran late, thanks!",
    polishedResult:
      "Hey team, let's reschedule our product review to tomorrow at 3:00 PM instead of 4:00 PM because investor call ran late, thanks!",
    metrics: [
      { label: "Target App", value: "Slack Desktop" },
      { label: "Fillers Stripped", value: "100% ('um', 'uh')" },
      { label: "Time Saved", value: "45 min/day" },
    ],
    quote:
      "All my spoken rambling and restarts disappear instantly. My Slack replies look like I sat and drafted them for minutes.",
  },
  {
    id: "marcus",
    name: "Marcus Vance",
    role: "DevRel Lead & Tech Author",
    category: "Long-Form Technical Writing",
    icon: PenTool,
    environment: "Obsidian, Notion, Substack",
    hardware: "USB Studio Microphone, Windows 11",
    spokenRaw:
      "Modern AI infrastructure requires sub-second streaming pipelines. [pause 4s] By moving inference directly to client hardware, we eliminate round-trip network variance.",
    polishedResult:
      "Modern AI infrastructure requires sub-second streaming pipelines. By moving inference directly to client hardware, we eliminate round-trip network variance.",
    metrics: [
      { label: "Target App", value: "Obsidian Vault" },
      { label: "Silence Hallucinations", value: "0" },
      { label: "Mode", value: "Persistent Hands-Free" },
    ],
    quote:
      "Persistent Mode lets me pace my room and talk through architectural essays. Pauses don't cause Whisper repetition loops.",
  },
  {
    id: "maya",
    name: "Maya Patel",
    role: "Senior Data Analyst",
    category: "RSI & Ergonomic Voice Control",
    icon: Activity,
    environment: "Excel, PowerBI, Jupyter",
    hardware: "Ergonomic Split Keyboard, Rebound to F8",
    spokenRaw:
      "Calculate quarterly growth rate by dividing fourth quarter revenue by first quarter revenue minus one and format as percentage.",
    polishedResult: "=(Q4_Revenue / Q1_Revenue) - 1",
    metrics: [
      { label: "Target App", value: "Microsoft Excel" },
      { label: "Typing Replaced", value: "85%" },
      { label: "Trigger Reliability", value: "100% (50/50 runs)" },
    ],
    quote:
      "Severe wrist tendonitis made typing agony. Remapping VESPER to my F8 key saved my engineering career.",
  },
  {
    id: "david",
    name: "David Miller",
    role: "Legal Counsel & Compliance Director",
    category: "Air-Gapped Enterprise Privacy",
    icon: ShieldCheck,
    environment: "Microsoft Word, Outlook, Adobe Acrobat",
    hardware: "Corporate Locked Laptop, VPN",
    spokenRaw:
      "The recipient shall not disclose proprietary algorithmic weights to any third party without explicit prior written authorization.",
    polishedResult:
      "The Recipient shall not disclose proprietary algorithmic weights to any third party without explicit prior written authorization.",
    metrics: [
      { label: "Egress Packets", value: "0 bytes" },
      { label: "Engine", value: "Local INT8 ONNX" },
      { label: "Compliance", value: "HIPAA / SOC2" },
    ],
    quote:
      "Our security audit confirmed zero outbound packets in Local Mode. We can dictate confidential legal clauses safely.",
  },
];

export function Personas() {
  const [activeId, setActiveId] = useState("alex");
  const active = PERSONAS.find((p) => p.id === activeId) || PERSONAS[0];
  const Icon = active.icon;

  return (
    <section id="workflows" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-28 relative">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver">
          <Sparkles className="h-3 w-3 text-emerald" />
          <span>Validated User Ergonomics</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl">
          Engineered for high-frequency daily workflows.
        </h2>
        <p className="mt-2 text-sm text-titanium-silver max-w-2xl">
          Not generic speech-to-text. Tested and certified across 5 acute jobs-to-be-done with the
          Zero-Backspace Rule.
        </p>
      </div>

      {/* Persona Pill Switcher */}
      <div className="mt-10 flex flex-wrap gap-2.5">
        {PERSONAS.map((p) => {
          const isSelected = p.id === activeId;
          const PillIcon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? "border-emerald/50 bg-emerald/10 text-emerald shadow-sm"
                  : "border-titanium-border bg-titanium text-titanium-silver hover:border-titanium-silver/40 hover:text-stark"
              }`}
            >
              <PillIcon className="h-3.5 w-3.5" />
              <span>{p.name}</span>
              <span className="hidden sm:inline text-[10px] opacity-70">
                ({p.role.split(" ")[0]})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Persona Detail Card wrapped in SpotlightCard */}
      <div className="mt-6">
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.12)"
          className="rounded-2xl border border-titanium-border bg-titanium/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Metadata & Quote */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald border border-emerald/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stark">{active.name}</h3>
                  <p className="text-xs text-titanium-silver">{active.role}</p>
                  <span className="mt-1 inline-block rounded-md border border-titanium-border bg-titanium-elevated px-2 py-0.5 font-mono text-[10px] text-emerald">
                    {active.category}
                  </span>
                </div>
              </div>

              <blockquote className="rounded-xl border border-titanium-border/70 bg-titanium-elevated/60 p-4 text-xs italic leading-relaxed text-stark/90">
                "{active.quote}"
              </blockquote>

              <div className="space-y-2 text-xs text-titanium-silver">
                <div>
                  <span className="font-mono text-[10px] uppercase text-titanium-silver/70">
                    Primary Tools:
                  </span>
                  <p className="text-stark/90 font-medium">{active.environment}</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-titanium-silver/70">
                    Hardware Setup:
                  </span>
                  <p className="text-stark/90 font-medium">{active.hardware}</p>
                </div>
              </div>

              {/* Persona Quantitative Metrics */}
              <div className="grid grid-cols-3 gap-2.5 border-t border-titanium-border/60 pt-4">
                {active.metrics.map((m) => (
                  <div key={m.label} className="rounded-lg bg-titanium-elevated p-2 text-center">
                    <span className="block font-mono text-[9px] uppercase text-titanium-silver/70 truncate">
                      {m.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs font-bold text-emerald truncate">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Spoken vs Polished Comparison */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-xl border border-titanium-border bg-obsidian p-4 sm:p-5">
                <div className="flex items-center justify-between pb-2 border-b border-titanium-border/60">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-3.5 w-3.5 text-titanium-silver" />
                    <span className="font-mono text-[11px] font-semibold text-titanium-silver uppercase">
                      Raw Spoken Audio Input
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80">
                    With verbal pauses &amp; missteps
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-titanium-silver/80 font-mono italic">
                  "{active.spokenRaw}"
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 font-mono text-[10px] text-emerald">
                  <Sparkles className="h-3 w-3" />
                  <span>VESPER Deterministic Polish &amp; Caret Injection</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              <div className="rounded-xl border border-emerald/40 bg-titanium-elevated p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-titanium-border/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                    <span className="font-mono text-[11px] font-semibold text-stark uppercase">
                      Target Caret Output (Zero Backspace)
                    </span>
                  </div>
                  <span className="rounded bg-emerald/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald">
                    Sub-180ms
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stark font-medium">
                  {active.polishedResult}
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}

export default Personas;
