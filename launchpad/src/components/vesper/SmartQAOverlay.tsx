import { useEffect } from "react";
import { HelpCircle, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export interface DisambiguationOption {
  key: string;
  label: string;
  value: string;
  description?: string;
  isRecommended?: boolean;
}

export interface DisambiguationQuestion {
  id: string;
  question: string;
  contextPrompt: string;
  options: DisambiguationOption[];
}

interface SmartQAOverlayProps {
  question: DisambiguationQuestion;
  onSelectOption: (key: string, value: string) => void;
  onDismiss?: () => void;
}

export function SmartQAOverlay({ question, onSelectOption, onDismiss }: SmartQAOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onDismiss) {
        e.preventDefault();
        onDismiss();
        return;
      }

      const match = question.options.find((opt) => opt.key === e.key);
      if (match) {
        e.preventDefault();
        onSelectOption(match.key, match.value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question, onSelectOption, onDismiss]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald/40 bg-obsidian-elevated/95 p-5 shadow-[0_12px_40px_-8px_rgba(16,185,129,0.25)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-3 border-b border-titanium-border/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald/15 text-emerald border border-emerald/30">
            <HelpCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald">
                Layer 4: Smart Q&amp;A Disambiguation
              </span>
              <span className="rounded-full bg-titanium-border/60 px-1.5 py-0.2 font-mono text-[9px] text-titanium-silver">
                0–3 Questions Max
              </span>
            </div>
            <h4 className="text-sm font-semibold text-stark mt-0.5">{question.question}</h4>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium/80 px-2.5 py-1 font-mono text-[11px] text-titanium-silver">
          <span>Press</span>
          <kbd className="rounded border border-emerald/40 bg-emerald/10 px-1 py-0.5 font-bold text-emerald">
            1
          </kbd>
          <span>–</span>
          <kbd className="rounded border border-emerald/40 bg-emerald/10 px-1 py-0.5 font-bold text-emerald">
            {question.options.length}
          </kbd>
          <span>to select</span>
        </div>
      </div>

      {/* Voice Context Bubble */}
      <div className="mt-3 rounded-lg border border-titanium-border/60 bg-titanium/40 px-3 py-2 text-xs font-mono text-titanium-silver flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-emerald shrink-0" />
        <span className="text-titanium-silver/80">Spoken intent:</span>
        <span className="text-stark font-medium truncate">"{question.contextPrompt}"</span>
      </div>

      {/* Option Buttons Grid */}
      <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
        {question.options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelectOption(opt.key, opt.value)}
            className={`group relative flex items-start gap-3 rounded-xl border p-3 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
              opt.isRecommended
                ? "border-emerald/50 bg-emerald/5 hover:border-emerald hover:bg-emerald/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]"
                : "border-titanium-border bg-titanium/60 hover:border-titanium-silver/40 hover:bg-titanium"
            }`}
          >
            {/* Keycap Badge */}
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                opt.isRecommended
                  ? "border border-emerald/50 bg-emerald text-obsidian shadow-[0_0_8px_var(--emerald)]"
                  : "border border-titanium-border bg-titanium-elevated text-stark group-hover:border-emerald/40 group-hover:text-emerald"
              }`}
            >
              {opt.key}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-stark group-hover:text-emerald transition-colors">
                  {opt.label}
                </span>
                {opt.isRecommended && (
                  <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-emerald bg-emerald/10 px-1.5 py-0.5 rounded-full border border-emerald/30">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Recommended
                  </span>
                )}
              </div>
              {opt.description && (
                <p className="mt-0.5 text-[11px] text-titanium-silver line-clamp-1">
                  {opt.description}
                </p>
              )}
            </div>

            <ArrowRight className="h-3 w-3 text-titanium-silver/40 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" />
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-titanium-silver/70 font-mono">
        <span>Sub-180ms zero-backspace synthesis</span>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="hover:text-stark transition-colors underline"
          >
            Dismiss (Esc)
          </button>
        )}
      </div>
    </div>
  );
}
