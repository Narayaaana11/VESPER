import { Keyboard, Cpu, Sparkles, Check, Zap, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { SpotlightCard, DecryptedText, ShinyText, Magnet } from "@/components/reactbits";

interface ShortcutRow {
  keys: string[];
  timing?: string;
  action: string;
  context: string;
}

const SHORTCUT_ROWS: ShortcutRow[] = [
  {
    keys: ["Hold", "Right Alt"],
    timing: "≥180ms",
    action: "Push-to-Talk Voice Dictation",
    context:
      "Transcribes audio on release and pastes directly at active cursor without losing focus.",
  },
  {
    keys: ["Double-tap", "Right Alt"],
    timing: "≤380ms",
    action: "Toggle Persistent HUD Capsule",
    context:
      "Locks the floating capsule open with manual Record, Pause, Stop, and Discard controls.",
  },
  {
    keys: ["Ctrl", "Shift", "Space"],
    action: "Open / Hide VESPER Flow Dashboard",
    context: "Summons the full workspace overlay, intent history, memory hub, and settings panel.",
  },
  {
    keys: ["Esc"],
    action: "Discard Active Recording / Dismiss Prompt",
    context: "Instantly aborts in-progress recording without pasting, or closes active modals.",
  },
  {
    keys: ["1", "2", "3"],
    action: "Instant Option Disambiguation",
    context: "Selects numbered clarification pills when the AI detects ambiguous instructions.",
  },
];

// WebAudio discrete tactile click sound
function playKeyClick(enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // AudioContext blocked
  }
}

export function Shortcuts() {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [lastTiming, setLastTiming] = useState<string>("Press any key to test native hook");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vesper_sound_fx");
      if (stored !== null) setSoundEnabled(stored === "true");
    } catch (_err) {
      // Ignore storage access restrictions
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vesper_sound_fx", String(next));
      } catch (_err) {
        // Ignore storage access restrictions
      }
      return next;
    });
  };

  useEffect(() => {
    let startTime = 0;
    const onDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (!startTime) startTime = performance.now();
      const code = e.code === "AltRight" ? "Right Alt" : e.code === "Space" ? "Space" : e.key;
      setPressedKey(code);
      playKeyClick(soundEnabled);
    };

    const onUp = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      const duration = startTime ? Math.round(performance.now() - startTime) : 0;
      startTime = 0;
      setPressedKey(null);
      if (duration > 0) {
        if (duration >= 180) {
          setLastTiming(`${duration}ms hold : Push-to-Talk Triggered!`);
        } else {
          setLastTiming(`${duration}ms tap : (<180ms standard keypress pass-through)`);
        }
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [soundEnabled]);

  return (
    <section id="shortcuts" className="mx-auto max-w-6xl px-5 py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="font-mono text-[11px] tracking-[0.2em] text-titanium-silver">
            KEYBOARD ARCHITECTURE
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-stark sm:text-4xl">
            Global Shortcuts &amp; Hardware Keycap Matrix
          </h2>
          <p className="mt-2 text-sm text-titanium-silver">
            Zero-delay low-level Win32 hardware hooks. Works across any active window without
            stealing caret position.
          </p>
        </div>

        {/* Sound FX Toggle Pill */}
        <button
          type="button"
          onClick={toggleSound}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-titanium-border bg-titanium px-3 py-1.5 font-mono text-xs text-titanium-silver hover:border-emerald/40 hover:text-stark transition-all"
          title={soundEnabled ? "Disable tactile sound FX" : "Enable tactile sound FX"}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-emerald" />
              <span>Sound FX: On</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
              <span>Sound FX: Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Physical Keycap Tester Bar */}
      <div className="mt-10 rounded-2xl border border-[#262632] bg-[#121217] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262632] pb-5">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-emerald" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#f4f4f7]">
              Live Win32 Virtual Key Tester
            </span>
          </div>
          <span className="font-mono text-xs text-emerald bg-emerald/10 border border-emerald/20 px-2.5 py-1 rounded-md">
            {lastTiming}
          </span>
        </div>

        {/* 3D Mechanical Keycaps Row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 py-2">
          {[
            { label: "Right Alt", hint: "PTT Hold", width: "w-28" },
            { label: "Left Alt", hint: "Secondary", width: "w-24" },
            { label: "Space", hint: "Simulator", width: "w-36" },
            { label: "Ctrl", hint: "Modifier", width: "w-20" },
            { label: "Shift", hint: "Modifier", width: "w-20" },
            { label: "Esc", hint: "Dismiss", width: "w-20" },
            { label: "F8", hint: "Function", width: "w-20" },
          ].map((k) => {
            const isDown = pressedKey?.toLowerCase().includes(k.label.toLowerCase());
            return (
              <button
                key={k.label}
                onMouseDown={() => {
                  setPressedKey(k.label);
                  playKeyClick();
                }}
                onMouseUp={() => {
                  setPressedKey(null);
                  setLastTiming(`Clicked ${k.label} : Low-level simulated hook`);
                }}
                className={`relative flex flex-col items-center justify-center ${k.width} h-16 rounded-xl border font-mono transition-all duration-100 select-none ${
                  isDown
                    ? "border-emerald bg-emerald/20 translate-y-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                    : "border-[#262632] bg-[#181820] shadow-[0_4px_0_#262632,0_8px_16px_rgba(0,0,0,0.5)] hover:border-[#38384a]"
                }`}
              >
                <span className={`text-xs font-bold ${isDown ? "text-emerald" : "text-[#f4f4f7]"}`}>
                  {k.label}
                </span>
                <span className="text-[9px] text-[#8e8e9f] mt-0.5">{k.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reference Table */}
      <SpotlightCard
        spotlightColor="rgba(16, 185, 129, 0.12)"
        className="mt-8 overflow-hidden rounded-xl border border-[#262632] bg-[#121217] shadow-xl backdrop-blur-md p-0"
      >
        <div className="divide-y divide-[#262632]">
          {SHORTCUT_ROWS.map((r) => (
            <div
              key={r.action}
              className="group flex flex-col gap-4 p-5 transition-colors hover:bg-[#181820] sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                {r.keys.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center justify-center rounded-lg border border-[#262632] bg-[#0a0a0c] px-3 py-1.5 font-mono text-xs font-bold text-[#f4f4f7] shadow-sm transition-transform group-hover:border-emerald/40"
                  >
                    {k}
                  </span>
                ))}
                {r.timing && (
                  <span className="rounded-md border border-emerald/20 bg-emerald/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald">
                    {r.timing}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:items-end sm:text-right">
                <span className="text-sm font-semibold text-[#f4f4f7]">
                  <DecryptedText
                    text={r.action}
                    speed={35}
                    maxIterations={8}
                    animateOn="hover"
                    className="text-[#f4f4f7] font-semibold"
                    encryptedClassName="text-emerald font-mono"
                  />
                </span>
                <span className="mt-0.5 text-xs text-[#8e8e9f]">{r.context}</span>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </section>
  );
}

export default Shortcuts;
