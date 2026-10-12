import { useState } from "react";
import {
  X,
  Layers,
  Cpu,
  Network,
  Terminal,
  Activity,
  Check,
  Copy,
  ExternalLink,
  Shield,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MCP_SCHEMA_SAMPLE = `{
  "name": "search_user_context",
  "description": "Semantic vector search over local desktop window history, active code references, and recent user actions.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "Natural language query, e.g. 'recent auth middleware refactoring'" },
      "limit": { "type": "number", "default": 5 },
      "windowTitleFilter": { "type": "string", "optional": true }
    },
    "required": ["query"]
  }
}`;

const MCP_SCREEN_SCHEMA = `{
  "name": "get_active_screen_context",
  "description": "Zero focus-loss Win32 inspection of the current foreground process, window title, and active text selection bounds.",
  "parameters": {
    "type": "object",
    "properties": {
      "includeClipboard": { "type": "boolean", "default": false },
      "processFilter": { "type": "string", "optional": true }
    }
  }
}`;

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState<"mcp" | "waterfall" | "layers">("mcp");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyConfig = () => {
    const config = JSON.stringify(
      {
        mcpServers: {
          vesper: {
            command: "npx",
            args: ["-y", "@vesper/mcp-server@latest"],
            env: { VESPER_PORT: "32123" },
          },
        },
      },
      null,
      2,
    );
    void navigator.clipboard?.writeText(config);
    setCopied(true);
    toast.success("MCP configuration copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-titanium-border/80 bg-[#121217]/95 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-stark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-titanium-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-stark">
                VESPER Architecture &amp; MCP Telemetry
              </h3>
              <p className="text-[11px] text-titanium-silver">
                VESPER Ambient Context Protocol, low-level Win32 hooks, and deterministic latency
                budgets.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-titanium-border bg-titanium-elevated px-6 py-2 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("mcp")}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === "mcp"
                ? "bg-titanium text-stark font-semibold border border-titanium-border"
                : "text-titanium-silver hover:text-stark"
            }`}
          >
            VESPER Context Protocol MCP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("waterfall")}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === "waterfall"
                ? "bg-titanium text-stark font-semibold border border-titanium-border"
                : "text-titanium-silver hover:text-stark"
            }`}
          >
            Latency Waterfall (&lt;180ms)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("layers")}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === "layers"
                ? "bg-titanium text-stark font-semibold border border-titanium-border"
                : "text-titanium-silver hover:text-stark"
            }`}
          >
            8-Layer Brain Pipeline
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 text-xs space-y-4">
          {activeTab === "mcp" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-emerald">
                    <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                    <span>http://127.0.0.1:32123/mcp &amp; stdio</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyConfig}
                    className="flex items-center gap-1.5 font-mono text-[10px] text-titanium-silver hover:text-stark transition-colors"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copied ? "Copied" : "Copy claude_desktop_config.json"}</span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-titanium-silver leading-relaxed">
                  External AI agents running in Cursor, Claude Code, Windsurf, or Antigravity can
                  connect to VESPER's local MCP server to retrieve ground-truth screen telemetry
                  without cloud round-trips.
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-titanium-silver mb-2">
                  Tool 1: Semantic User Context Query
                </h4>
                <pre className="overflow-x-auto rounded-xl border border-titanium-border bg-[#0a0a0c] p-3 font-mono text-[11px] text-emerald leading-relaxed">
                  {MCP_SCHEMA_SAMPLE}
                </pre>
              </div>

              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-titanium-silver mb-2">
                  Tool 2: Zero Focus-Loss Screen State
                </h4>
                <pre className="overflow-x-auto rounded-xl border border-titanium-border bg-[#0a0a0c] p-3 font-mono text-[11px] text-cyan-400 leading-relaxed">
                  {MCP_SCREEN_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "waterfall" && (
            <div className="space-y-4">
              <p className="text-titanium-silver leading-relaxed">
                Every millisecond is measured under hardware constraints. VESPER eliminates the
                latency variance of traditional multi-hop cloud bots.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-titanium-silver text-[11px]">
                    <span>1. Ring Buffer Audio Ingestion</span>
                    <span className="text-emerald">&lt;15ms</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-titanium-elevated overflow-hidden">
                    <div className="h-full bg-emerald w-[8%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-titanium-silver text-[11px]">
                    <span>2. Energy-Gated Silero VAD Chunking</span>
                    <span className="text-emerald">&lt;12ms</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-titanium-elevated overflow-hidden">
                    <div className="h-full bg-emerald w-[7%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-titanium-silver text-[11px]">
                    <span>3. High-Speed Neural Speech Pipeline</span>
                    <span className="text-emerald">&lt;145ms</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-titanium-elevated overflow-hidden">
                    <div className="h-full bg-emerald w-[76%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-titanium-silver text-[11px]">
                    <span>4. Deterministic Zero-Backspace Polisher</span>
                    <span className="text-emerald">&lt;3ms</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-titanium-elevated overflow-hidden">
                    <div className="h-full bg-emerald w-[3%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-titanium-silver text-[11px]">
                    <span>5. Win32 SendInput Native Caret Insertion</span>
                    <span className="text-emerald">&lt;2ms</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-titanium-elevated overflow-hidden">
                    <div className="h-full bg-emerald w-[2%]" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4 flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm font-bold text-stark">
                    Total Latency Waterfall
                  </div>
                  <div className="text-[11px] text-titanium-silver">
                    Sub-second biological threshold
                  </div>
                </div>
                <div className="font-mono text-lg font-bold text-emerald">177ms End-to-End</div>
              </div>
            </div>
          )}

          {activeTab === "layers" && (
            <div className="space-y-3 font-mono text-xs">
              {[
                {
                  layer: "L1",
                  name: "Physical Audio Hook",
                  desc: "16kHz PCM ring buffer with WinKeyServer low-level keyboard hook",
                },
                {
                  layer: "L2",
                  name: "Window Context Engine",
                  desc: "Win32 GetForegroundWindow caret preservation and process telemetry",
                },
                {
                  layer: "L3",
                  name: "Hybrid Inference Engine",
                  desc: "High-speed private neural cloud + DirectML INT8 ONNX offline local fallback",
                },
                {
                  layer: "L4",
                  name: "Zero-Backspace Polisher",
                  desc: "Regex-compiled filler stripping, punctuation injection, code formatting",
                },
                {
                  layer: "L5",
                  name: "Universal Task Object",
                  desc: "Standardized typed task dispatch envelope",
                },
                {
                  layer: "L6",
                  name: "Action Router",
                  desc: "Determines direct text paste vs Cursor prompt expansion vs CLI command",
                },
                {
                  layer: "L7",
                  name: "Risk Governance Gate",
                  desc: "3-tier safety verification (Safe, Moderate, Destructive)",
                },
                {
                  layer: "L8",
                  name: "SendInput Native Injection",
                  desc: "Physical keystroke synthesis with zero focus loss",
                },
              ].map((l) => (
                <div
                  key={l.layer}
                  className="flex items-start gap-3 rounded-xl border border-titanium-border bg-titanium-elevated p-3"
                >
                  <span className="rounded bg-obsidian border border-titanium-border px-2 py-0.5 text-emerald font-bold">
                    {l.layer}
                  </span>
                  <div>
                    <div className="font-semibold text-stark">{l.name}</div>
                    <div className="text-[11px] text-titanium-silver font-sans">{l.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-titanium-border bg-titanium/50 px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-titanium-border bg-titanium-elevated hover:bg-[#262632] px-5 py-2 font-semibold text-xs text-stark transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchitectureModal;
