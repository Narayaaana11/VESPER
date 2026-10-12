import { useState } from "react";
import { X, Copy, Check, FileJson, Sparkles, Code2, ShieldCheck, Cpu } from "lucide-react";
import { toast } from "sonner";

interface UtoExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PresetKey = "cursor" | "slack" | "terminal" | "vision";

const PRESETS: Record<
  PresetKey,
  {
    name: string;
    app: string;
    description: string;
    uto: Record<string, unknown>;
  }
> = {
  cursor: {
    name: "Cursor Composer Refactor",
    app: "Cursor.exe",
    description: "Code generation intent with context fusion from open TypeScript file",
    uto: {
      $schema: "https://vesper.dev/schemas/task-v1.json",
      taskId: "task_9f42c1ae",
      timestamp: "2026-10-09T00:30:00Z",
      source: {
        rawSpeech: "Refactor auth middleware to verify bearer token with per IP token bucket",
        sttConfidence: 0.992,
        inferenceLatencyMs: 84,
      },
      context: {
        activeApp: "Cursor",
        processId: 14208,
        windowTitle: "auth.middleware.ts - VESPER",
        activeFilePath: "src/server/auth.middleware.ts",
        caretSelectedTokens: 142,
        privacyShieldStatus: "CLEAN (0 secrets detected)",
      },
      intent: {
        domain: "code.refactor",
        action: "inject_composer_prompt",
        slots: {
          authentication_scheme: "Bearer JWT",
          rate_limiting: "token-bucket",
          downtime_policy: "zero-downtime",
        },
        ambiguityScore: 0.04,
      },
      routing: {
        targetAdapter: "adapters.ai.cursor_composer",
        hotkeyTrigger: "Ctrl+I",
        riskLevel: "LOW",
        permissionGranted: true,
      },
      executionPayload: {
        method: "Win32_SendInput_Unicode",
        focusStealing: false,
        zeroBackspaceCompliant: true,
      },
    },
  },
  slack: {
    name: "Slack Executive Standup",
    app: "Slack.exe",
    description: "Communication triage with automatic tone polishing and channel routing",
    uto: {
      $schema: "https://vesper.dev/schemas/task-v1.json",
      taskId: "task_3c1780b2",
      timestamp: "2026-10-09T00:30:00Z",
      source: {
        rawSpeech: "Drop a quick update in product launch that the MVP installer passed all tests",
        sttConfidence: 0.985,
        inferenceLatencyMs: 78,
      },
      context: {
        activeApp: "Slack",
        processId: 1804,
        windowTitle: "#product-launch - Slack",
        channel: "C0842910F",
        privacyShieldStatus: "CLEAN",
      },
      intent: {
        domain: "comms.post_update",
        action: "draft_message",
        slots: {
          channelName: "#product-launch",
          tone: "concise_executive",
          verdict: "passed_all_tests",
        },
        ambiguityScore: 0.02,
      },
      routing: {
        targetAdapter: "adapters.comms.slack_caret",
        riskLevel: "LOW",
        screenAgentVerified: true,
      },
      executionPayload: {
        renderedText:
          "Team update: The VESPER v0.1.0 MVP installer has been compiled and verified with 100% test coverage (241/241 passing). Download links are live in the channel.",
      },
    },
  },
  terminal: {
    name: "PowerShell Git Automation",
    app: "pwsh.exe",
    description: "System command execution with safety checks",
    uto: {
      $schema: "https://vesper.dev/schemas/task-v1.json",
      taskId: "task_6b829e01",
      timestamp: "2026-10-09T00:30:00Z",
      source: {
        rawSpeech: "Commit changes with message feat win32 get foreground window preservation",
        sttConfidence: 0.994,
        inferenceLatencyMs: 81,
      },
      context: {
        activeApp: "Windows Terminal (PowerShell 7.4)",
        processId: 2284,
        workingDirectory: "C:/Users/VESPER/projects/vesper",
        gitBranch: "feature/win32-hooks",
      },
      intent: {
        domain: "system.terminal.git",
        action: "git_commit",
        slots: {
          commit_type: "feat",
          scope: "win32",
          subject: "implement GetForegroundWindow preservation with zero focus stealing",
        },
        ambiguityScore: 0.0,
      },
      routing: {
        targetAdapter: "adapters.os.terminal",
        riskLevel: "MEDIUM",
        requiresReview: false,
      },
      executionPayload: {
        command:
          "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'",
      },
    },
  },
  vision: {
    name: "Visual Screen Pilot",
    app: "Browser / Desktop",
    description: "Multimodal visual bounding box targeting and automated action",
    uto: {
      $schema: "https://vesper.dev/schemas/task-v1.json",
      taskId: "task_vis_7721",
      timestamp: "2026-10-09T00:30:00Z",
      source: {
        rawSpeech: "Export the last 30 days of telemetry into CSV and save to downloads",
        sttConfidence: 0.978,
      },
      context: {
        activeApp: "Chrome (VESPER Dashboard)",
        screenResolution: "3840x2160 (DPI 150%)",
        detectedUIElement: "button#export-csv",
        coordinates: { x: 1840, y: 320 },
      },
      intent: {
        domain: "pilot.ui_click",
        action: "trigger_export",
        slots: { format: "csv", timeframe: "30d" },
      },
      routing: {
        targetAdapter: "adapters.pilot.win32_mouse_action",
        riskLevel: "LOW",
      },
    },
  },
};

export function UtoExplorerModal({ isOpen, onClose }: UtoExplorerModalProps) {
  const [activePreset, setActivePreset] = useState<PresetKey>("cursor");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const current = PRESETS[activePreset];
  const jsonString = JSON.stringify(current.uto, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("Universal Task Object (UTO) copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-titanium-border/80 bg-[#121217]/95 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.85)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-titanium-border px-6 py-4 bg-titanium/50">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald/40 bg-emerald/10 text-emerald shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <FileJson className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-stark">
                  Universal Task Object (UTO) Contract Explorer
                </h3>
                <span className="rounded-full border border-emerald/40 bg-emerald/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald">
                  Layer 5 Canonical Spec
                </span>
              </div>
              <p className="text-xs text-titanium-silver">
                Deterministic JSON interface bridging messy human speech with target OS/AI adapters
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-titanium-silver hover:bg-titanium hover:text-stark transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Selector Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-titanium-border bg-titanium/20 px-6 py-3">
          <span className="font-mono text-xs text-titanium-silver mr-2">Preset Scenario:</span>
          {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
            const p = PRESETS[key];
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActivePreset(key)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                  isSelected
                    ? "border border-emerald/50 bg-emerald/15 font-semibold text-emerald shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : "border border-titanium-border bg-titanium text-titanium-silver hover:border-titanium-silver/40 hover:text-stark"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* JSON Code Viewer */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-2 text-xs font-mono">
            <span className="text-titanium-silver">{current.description}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 text-stark hover:border-emerald hover:text-emerald transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy JSON Contract"}</span>
            </button>
          </div>

          <pre className="overflow-x-auto rounded-xl border border-titanium-border/80 bg-obsidian p-4 font-mono text-xs text-emerald/90 leading-relaxed shadow-inner">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-titanium-border bg-titanium/50 px-6 py-3 font-mono text-xs text-titanium-silver">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald">
              <ShieldCheck className="h-3.5 w-3.5" />
              Immutable Contract
            </span>
            <span>•</span>
            <span>Zero Hallucination Guarantee</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-titanium-border bg-titanium px-4 py-1.5 text-stark hover:border-emerald hover:text-emerald transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
