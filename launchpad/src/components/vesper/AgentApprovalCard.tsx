import { useState, useEffect } from "react";
import { Check, X, Send, Eye, ShieldCheck, Sparkles } from "lucide-react";

interface AgentApprovalCardProps {
  initialText: string;
  targetApp: string;
  contextSummary: string;
  onApprove: (finalText: string) => void;
  onReject: () => void;
}

export function AgentApprovalCard({
  initialText,
  targetApp,
  contextSummary,
  onApprove,
  onReject,
}: AgentApprovalCardProps) {
  const [draft, setDraft] = useState(initialText);

  useEffect(() => {
    setDraft(initialText);
  }, [initialText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onReject();
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onApprove(draft);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [draft, onApprove, onReject]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-titanium-border bg-obsidian-elevated/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-titanium-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald/15 text-emerald border border-emerald/30">
            <Eye className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-stark">
                Screen Agent Pilot Verification
              </span>
              <span className="rounded-full bg-emerald/10 border border-emerald/30 px-2 py-0.5 font-mono text-[9px] text-emerald">
                {targetApp}
              </span>
            </div>
            <p className="text-[11px] text-titanium-silver mt-0.5">{contextSummary}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-titanium-silver/80">
          <ShieldCheck className="h-3 w-3 text-emerald" />
          <span>Human-in-the-Loop</span>
        </div>
      </div>

      {/* Editable Body */}
      <div className="mt-3">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-titanium-silver mb-1.5 flex items-center justify-between">
          <span>Drafted Intent Response (Click to edit)</span>
          <span className="text-emerald flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            Zero-Backspace Pre-Polished
          </span>
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-titanium-border bg-titanium/80 p-3 font-mono text-xs text-stark placeholder-titanium-silver/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/40 transition-all resize-none"
        />
      </div>

      {/* Footer Actions */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-titanium-border/50 text-xs font-mono">
        <div className="flex items-center gap-2 text-[11px] text-titanium-silver">
          <span>Press</span>
          <kbd className="rounded border border-titanium-border bg-titanium px-1.5 py-0.5 font-bold text-stark">
            Ctrl+Enter
          </kbd>
          <span>to inject</span>
          <span>•</span>
          <kbd className="rounded border border-titanium-border bg-titanium px-1.5 py-0.5 font-bold text-stark">
            Esc
          </kbd>
          <span>to cancel</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium/60 px-3 py-1.5 text-xs text-titanium-silver hover:border-red-500/40 hover:text-red-400 transition-all"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reject</span>
          </button>
          <button
            type="button"
            onClick={() => onApprove(draft)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/50 bg-emerald px-3.5 py-1.5 text-xs font-semibold text-obsidian shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:opacity-95 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Approve &amp; Paste (Ctrl+Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
