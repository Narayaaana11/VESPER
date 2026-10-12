import {
  Code2,
  Terminal,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  Activity,
  Layers,
  Zap,
  ShieldCheck,
  FileJson,
  Eye,
  Radio,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SpotlightCard, ShinyText, DecryptedText, Magnet } from "@/components/reactbits";
import { SmartQAOverlay, type DisambiguationQuestion } from "./SmartQAOverlay";
import { AgentApprovalCard } from "./AgentApprovalCard";
import { ContextInspector } from "./ContextInspector";
import { UtoExplorerModal } from "./UtoExplorerModal";

type AppType = "cursor" | "vscode" | "slack" | "terminal";
type Mode = "direct" | "smart" | "smart_qa" | "pilot";

const SAMPLES: Record<
  AppType,
  {
    direct: string;
    smart: string;
    filename: string;
    comment: string;
    process: string;
    qaQuestion: DisambiguationQuestion;
    pilotProposal: {
      initial: string;
      summary: string;
    };
  }
> = {
  cursor: {
    direct: "Refactor auth.middleware.ts to check for bearer tokens and return 401 if missing.",
    smart:
      "You are a senior backend architect. Refactor auth.middleware.ts to support bearer JWTs with zero downtime, and add per-IP token-bucket rate limiting with sane defaults.",
    filename: "cursor : auth.middleware.ts",
    comment: "// Composer Prompt (Ctrl+I)",
    process: "Cursor.exe (PID 14208)",
    qaQuestion: {
      id: "qa-cursor-auth",
      question: "Which authentication architecture should be synthesized?",
      contextPrompt: "Create rate-limited auth check for API endpoints",
      options: [
        {
          key: "1",
          label: "Bearer JWT + Per-IP Token Bucket",
          value:
            "export const auth = createRateLimitedAuth({ scheme: 'Bearer JWT', algorithm: 'HS256', rateLimit: { capacity: 60, refillPerSec: 1 } });",
          description: "Production grade rate-limited bearer authentication",
          isRecommended: true,
        },
        {
          key: "2",
          label: "Session Cookies + Redis Store",
          value:
            "export const auth = createSessionAuth({ store: 'redis', cookieName: 'vesper_session', httpOnly: true, secure: true });",
          description: "Stateful session validation for web applications",
        },
        {
          key: "3",
          label: "OAuth 2.0 PKCE Flow",
          value:
            "export const auth = createOAuthPkceVerifier({ audience: 'https://api.vesper.dev', tokenEndpoint: '/oauth/token' });",
          description: "Modern Single Page Application standard",
        },
        {
          key: "4",
          label: "HMAC Signed Header Token",
          value:
            "export const auth = createHmacSignatureGuard({ secretEnv: 'HMAC_SECRET', maxAgeMs: 30000 });",
          description: "Microservice-to-microservice internal RPC",
        },
      ],
    },
    pilotProposal: {
      initial:
        "Refactor auth.middleware.ts: Added Bearer JWT guard with token-bucket limiter (60 req/min). Handled expired tokens with 401 Unauthorized.",
      summary: "Verified in Cursor active editor buffer",
    },
  },
  vscode: {
    direct: "Add a native Windows keyboard hook to detect Right Alt key release within 180ms.",
    smart:
      "Write a Win32 native hook in C++ using SetWindowsHookEx(WH_KEYBOARD_LL) to track Right Alt press and release duration with sub-millisecond precision.",
    filename: "vscode : win-hook.cc",
    comment: "// Copilot Inline Instruction",
    process: "Code.exe (PID 9184)",
    qaQuestion: {
      id: "qa-vscode-hook",
      question: "What Win32 hook threading model should be applied?",
      contextPrompt: "Set up keyboard hook for Right Alt key detection",
      options: [
        {
          key: "1",
          label: "Dedicated Background Message Pump (Thread Isolated)",
          value:
            "HANDLE hThread = CreateThread(NULL, 0, HookThreadProc, NULL, 0, NULL); // Sub-millisecond latency isolation",
          description: "Zero stutter; guarantees zero UI thread interference",
          isRecommended: true,
        },
        {
          key: "2",
          label: "Standard Main Loop SetWindowsHookEx",
          value:
            "HHOOK hHook = SetWindowsHookExW(WH_KEYBOARD_LL, LowLevelKeyboardProc, hInstance, 0);",
          description: "Standard single-process event loop",
        },
        {
          key: "3",
          label: "RawInput Intercept (WM_INPUT)",
          value:
            "RAWINPUTDEVICE rid = { 0x01, 0x06, RIDEV_INPUTSINK, hWnd }; RegisterRawInputDevices(&rid, 1, sizeof(rid));",
          description: "Ultra-low overhead raw input stream",
        },
        {
          key: "4",
          label: "WinKeyServer IPC Named Pipe Bridge",
          value:
            'HANDLE hPipe = CreateNamedPipeW(L"\\\\\\\\.\\\\pipe\\\\VesperWinKey", PIPE_ACCESS_DUPLEX, PIPE_TYPE_MESSAGE, 1, 512, 512, 0, NULL);',
          description: "Electron-to-C++ binary micro-service",
        },
      ],
    },
    pilotProposal: {
      initial:
        "Generated C++ SetWindowsHookEx(WH_KEYBOARD_LL) with dedicated message pump thread to track VK_RMENU timing.",
      summary: "Win32 low-level keyboard hook injection",
    },
  },
  slack: {
    direct:
      "Hey team, the Windows v1.0.0 installer is built and passed all 241 tests. Ready for testing!",
    smart:
      "Team update: The VESPER v1.0.0 Production installer has been compiled and verified with 100% test coverage (241/241 passing). Download links are live in the channel.",
    filename: "slack : #product-launch",
    comment: "// Message #product-launch",
    process: "slack.exe (PID 1804)",
    qaQuestion: {
      id: "qa-slack-triage",
      question: "Select executive announcement tone for Slack #product-launch:",
      contextPrompt: "Post update about production installer ready for team testing",
      options: [
        {
          key: "1",
          label: "Concise Engineering Release Note",
          value:
            "🚀 VESPER v1.0.0 Production installer is compiled & SHA-256 verified. All 241 tests passing. Ready for deployment on Windows 10/11.",
          description: "High signal, zero fluff, immediate test links",
          isRecommended: true,
        },
        {
          key: "2",
          label: "Casual Developer Ping",
          value:
            "Hey squad! Fresh Windows build is ready in releases. Give Hold-to-Talk a spin and drop any latency feedback in this thread.",
          description: "Friendly peer notification for rapid testing",
        },
        {
          key: "3",
          label: "Executive Brief for Investors / Leadership",
          value:
            "Milestone reached: The native Windows engine has achieved sub-180ms TTFT with 100% test coverage. Initial distribution begins today.",
          description: "Formal progress summary highlighting KPIs",
        },
        {
          key: "4",
          label: "Bullet-Point Changelog Breakdown",
          value:
            "• WinKeyServer: Low-level Right Alt hook attached\n• Audio: 16kHz PCM zero-backspace pipeline active\n• Installer: 170MB signed production package ready",
          description: "Structured technical bullets",
        },
      ],
    },
    pilotProposal: {
      initial:
        "Team update: The VESPER v1.0.0 Production installer has been compiled and verified with 100% test coverage (241/241 passing). Ready for deployment.",
      summary: "Slack #product-launch channel message",
    },
  },
  terminal: {
    direct: "git commit -m 'feat: optimize native Win32 window detection for zero focus stealing'",
    smart:
      "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'",
    filename: "powershell : ~/projects/vesper",
    comment: "# PowerShell 7.4 (x64)",
    process: "pwsh.exe (PID 2284)",
    qaQuestion: {
      id: "qa-terminal-git",
      question: "Which Git commit convention format should be executed?",
      contextPrompt: "Commit changes optimizing native Win32 focus detector",
      options: [
        {
          key: "1",
          label: "Conventional Commits: feat(win32): ...",
          value:
            "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'",
          description: "Standard semantic commit structure",
          isRecommended: true,
        },
        {
          key: "2",
          label: "Short Imperative Message",
          value: "git commit -m 'Optimize native Win32 window detection for zero focus stealing'",
          description: "Clean single-line git log",
        },
        {
          key: "3",
          label: "Multi-line Detailed Changelog",
          value:
            "git commit -m 'feat: optimize window detection' -m '- Preserves foreground window handle\n- Zero focus stealing during push-to-talk\n- Sub-15ms SendInput caret injection'",
          description: "Includes bulleted breakdown in commit body",
        },
        {
          key: "4",
          label: "Commit & Push to Remote Branch",
          value:
            "git commit -m 'feat(win32): zero focus stealing detector' && git push origin HEAD",
          description: "Atomic commit with immediate branch push",
        },
      ],
    },
    pilotProposal: {
      initial:
        "git commit -m 'feat(win32): implement GetForegroundWindow preservation with zero focus stealing in context-detector'",
      summary: "PowerShell terminal git command",
    },
  },
};

// WebAudio synthetic tactile sound generator
function playHapticTone(type: "press" | "release", enabled: boolean) {
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

    if (type === "press") {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    }
  } catch {
    // Ignore audio failures
  }
}

export function Simulator() {
  const [activeApp, setActiveApp] = useState<AppType>("cursor");
  const [mode, setMode] = useState<Mode>("direct");
  const [phase, setPhase] = useState<"idle" | "recording" | "transcribing" | "typing">("idle");
  const [typed, setTyped] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const typingTimer = useRef<number | null>(null);

  // Modals & Overlays state
  const [showSmartQA, setShowSmartQA] = useState(false);
  const [showApprovalCard, setShowApprovalCard] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isUtoOpen, setIsUtoOpen] = useState(false);

  // Live Browser Microphone state
  const [isLiveMicActive, setIsLiveMicActive] = useState(false);
  const [micAudioLevel, setMicAudioLevel] = useState<number[]>(new Array(24).fill(4));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vesper_sound_fx");
      if (stored !== null) {
        setSoundEnabled(stored === "true");
      }
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

  // Live Mic Toggle
  const toggleLiveMic = async () => {
    if (isLiveMicActive) {
      // Stop mic
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsLiveMicActive(false);
      setMicAudioLevel(new Array(24).fill(4));
    } else {
      // Start mic
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const ctx = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        setIsLiveMicActive(true);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateWave = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const bars: number[] = [];
          for (let i = 0; i < 24; i++) {
            const val = dataArray[i % dataArray.length] || 0;
            bars.push(Math.max(4, Math.round((val / 255) * 26)));
          }
          setMicAudioLevel(bars);
          animFrameRef.current = requestAnimationFrame(updateWave);
        };
        updateWave();
      } catch (err) {
        alert("Microphone access could not be acquired or is blocked by browser permissions.");
        setIsLiveMicActive(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const currentSample = SAMPLES[activeApp];
  const targetText = mode === "direct" ? currentSample.direct : currentSample.smart;

  const startHold = () => {
    if (phase !== "idle") return;
    playHapticTone("press", soundEnabled);
    setPhase("recording");
    setTyped("");
    setShowSmartQA(false);
    setShowApprovalCard(false);
  };

  const endHold = () => {
    if (phase !== "recording") return;
    playHapticTone("release", soundEnabled);
    setPhase("transcribing");

    window.setTimeout(() => {
      // In Smart Q&A mode, trigger the disambiguation overlay!
      if (mode === "smart_qa") {
        setPhase("idle");
        setShowSmartQA(true);
        return;
      }

      // In Pilot mode, trigger the screen agent approval card!
      if (mode === "pilot") {
        setPhase("idle");
        setShowApprovalCard(true);
        return;
      }

      // Direct & Smart Dictation: stream text directly to active buffer
      setPhase("typing");
      let i = 0;
      if (typingTimer.current) window.clearInterval(typingTimer.current);

      typingTimer.current = window.setInterval(() => {
        i += 3;
        setTyped(targetText.slice(0, i));
        if (i >= targetText.length) {
          if (typingTimer.current) window.clearInterval(typingTimer.current);
          setPhase("idle");
        }
      }, 16);
    }, 280);
  };

  const handleSelectQAOption = (_key: string, value: string) => {
    setShowSmartQA(false);
    setPhase("typing");
    let i = 0;
    if (typingTimer.current) window.clearInterval(typingTimer.current);

    typingTimer.current = window.setInterval(() => {
      i += 3;
      setTyped(value.slice(0, i));
      if (i >= value.length) {
        if (typingTimer.current) window.clearInterval(typingTimer.current);
        setPhase("idle");
      }
    }, 16);
  };

  const handleApprovePilot = (finalText: string) => {
    setShowApprovalCard(false);
    setPhase("typing");
    let i = 0;
    if (typingTimer.current) window.clearInterval(typingTimer.current);

    typingTimer.current = window.setInterval(() => {
      i += 3;
      setTyped(finalText.slice(0, i));
      if (i >= finalText.length) {
        if (typingTimer.current) window.clearInterval(typingTimer.current);
        setPhase("idle");
      }
    }, 16);
  };

  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearInterval(typingTimer.current);
    };
  }, []);

  return (
    <section id="simulator" className="mx-auto max-w-5xl scroll-mt-28 px-5 py-28 relative">
      <span id="demo" className="sr-only" aria-hidden="true" />
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver">
            <Activity className="h-3 w-3 text-emerald" />
            <span>Interactive Software 3.0 Sandbox</span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl">
            Test the physical push-to-talk mechanic.
          </h2>
          <p className="mt-2 text-sm text-titanium-silver">
            Hold the button or press and hold{" "}
            <span className="kbd font-mono text-stark">Space</span> to experience the exact
            sub-180ms flow with synthetic audio feedback. Follows the Zero-Backspace Rule.
          </p>
        </div>

        {/* Top Control Cluster */}
        <div className="flex flex-wrap items-center gap-2 self-center sm:self-start shrink-0 sm:mt-1">
          {/* Live Mic Toggle */}
          <button
            type="button"
            onClick={toggleLiveMic}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${
              isLiveMicActive
                ? "border-emerald bg-emerald/15 text-emerald shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"
                : "border-titanium-border bg-titanium text-titanium-silver hover:border-emerald/40 hover:text-stark"
            }`}
            title="Toggle live microphone frequency analyser"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>{isLiveMicActive ? "Mic Active (16kHz)" : "Live Mic Test"}</span>
          </button>

          {/* Sound FX Toggle Pill */}
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-2 rounded-xl border border-titanium-border bg-titanium px-3 py-1.5 font-mono text-xs text-titanium-silver hover:border-emerald/40 hover:text-stark transition-all"
            title={soundEnabled ? "Disable tactile sound FX" : "Enable tactile sound FX"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-emerald" />
                <span>Sound: On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
                <span>Sound: Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Architecture Inspectors Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-titanium-border/60 py-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-titanium-silver">
          <span className="text-emerald flex h-2 w-2 rounded-full bg-emerald shadow-[0_0_8px_var(--emerald)]" />
          <span>WinKeyServer IPC: Connected</span>
          <span className="text-titanium-silver/40">|</span>
          <span className="hidden sm:inline">Silero VAD: Active</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInspectorOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 text-stark hover:border-emerald hover:text-emerald transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
            <span>Inspect Context &amp; Privacy (L2)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUtoOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-titanium-border bg-titanium px-2.5 py-1 text-stark hover:border-emerald hover:text-emerald transition-colors"
          >
            <FileJson className="h-3.5 w-3.5 text-emerald" />
            <span>View UTO Contract (L5)</span>
          </button>
        </div>
      </div>

      {/* Target Application Tabs */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-titanium-silver">
          Foreground Target Window:
        </span>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-titanium-border bg-titanium p-1 shadow-inner">
          {[
            { id: "cursor", label: "Cursor IDE", icon: Code2 },
            { id: "vscode", label: "VS Code", icon: Code2 },
            { id: "slack", label: "Slack Desktop", icon: MessageSquare },
            { id: "terminal", label: "Windows Terminal", icon: Terminal },
          ].map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setActiveApp(app.id as AppType);
                setPhase("idle");
                setTyped("");
                setShowSmartQA(false);
                setShowApprovalCard(false);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeApp === app.id
                  ? "border border-titanium-border bg-titanium-elevated text-stark shadow-sm"
                  : "text-titanium-silver hover:text-stark"
              }`}
            >
              <app.icon className="h-3.5 w-3.5" />
              <span>{app.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mock Windows desktop / IDE window wrapped in SpotlightCard */}
      <SpotlightCard
        spotlightColor="rgba(16, 185, 129, 0.12)"
        className="relative mt-6 overflow-hidden rounded-2xl border border-titanium-border bg-titanium shadow-2xl p-0"
      >
        {/* Window title bar with process metadata */}
        <div className="flex items-center justify-between border-b border-titanium-border bg-titanium-elevated px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700/80" />
            <span className="ml-3 font-mono text-[11px] text-titanium-silver">
              {currentSample.filename}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            <DecryptedText
              text={`HWND Attached: ${currentSample.process}`}
              speed={40}
              maxIterations={8}
              animateOn="hover"
              className="text-emerald font-semibold"
              encryptedClassName="text-titanium-silver font-mono"
            />
          </div>
        </div>

        {/* Floating Capsule Overlay (Simulating VESPER Capsule) */}
        <div className="pointer-events-none relative flex justify-center">
          <div
            className={`absolute top-4 z-20 flex items-center gap-3.5 rounded-full border border-white/10 bg-titanium/95 shadow-[0_16px_45px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 ${
              phase === "idle" && !isLiveMicActive
                ? "px-4 py-2 opacity-85"
                : phase === "recording" || isLiveMicActive
                  ? "scale-105 px-5 py-2.5 opacity-100 shadow-[0_0_35px_-8px_rgba(255,107,0,0.5)] ring-1 ring-primary/50"
                  : "px-4 py-2 opacity-100 shadow-[0_0_25px_-5px_rgba(255,107,0,0.25)]"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                phase === "recording" || isLiveMicActive
                  ? "bg-primary text-white shadow-[0_0_12px_#ff6b00]"
                  : phase === "transcribing"
                    ? "bg-amber-400 text-slate-900"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              <Mic className="h-3 w-3" />
            </div>

            <span className="font-mono text-xs font-medium tracking-tight text-stark">
              {isLiveMicActive && "Live Microphone Stream · Listening..."}
              {!isLiveMicActive && phase === "idle" && "VESPER Ready · Hold Alt"}
              {!isLiveMicActive && phase === "recording" && "Listening at 16kHz PCM..."}
              {!isLiveMicActive && phase === "transcribing" && "Neural Speech Pipeline (140ms)..."}
              {!isLiveMicActive && phase === "typing" && "Injecting via SendInput..."}
            </span>

            {/* Live Audio Waveform (Real mic or simulated) */}
            <div className="flex h-4 items-center gap-0.5">
              {(isLiveMicActive
                ? micAudioLevel
                : [
                    6, 14, 8, 18, 12, 16, 9, 20, 11, 7, 15, 10, 19, 8, 13, 17, 10, 14, 6, 12, 16, 9,
                    14, 8,
                  ]
              ).map((h, idx) => (
                <span
                  key={idx}
                  className={`w-0.5 rounded-full transition-all duration-150 ${
                    phase === "recording" || isLiveMicActive
                      ? "bg-emerald animate-pulse"
                      : phase === "transcribing"
                        ? "bg-amber-400"
                        : "bg-titanium-silver/40"
                  }`}
                  style={{
                    height: isLiveMicActive
                      ? `${h}px`
                      : phase === "recording"
                        ? `${Math.max(4, h * (idx % 2 === 0 ? 1.2 : 0.8))}px`
                        : "4px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Editor buffer viewport with dedicated top clearance for floating pill */}
        <div className="relative min-h-[350px] bg-obsidian px-6 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-20 font-mono text-sm">
          <div className="text-titanium-silver/50 select-none pb-3 border-b border-titanium-border/40 mb-4 flex items-center justify-between">
            <span>{currentSample.comment}</span>
            <span className="text-[11px] text-emerald/80">Caret Focused in Foreground Window</span>
          </div>

          {/* Overlays inside the sandbox buffer */}
          {showSmartQA && (
            <div className="mb-4">
              <SmartQAOverlay
                question={currentSample.qaQuestion}
                onSelectOption={handleSelectQAOption}
                onDismiss={() => setShowSmartQA(false)}
              />
            </div>
          )}

          {showApprovalCard && (
            <div className="mb-4">
              <AgentApprovalCard
                initialText={currentSample.pilotProposal.initial}
                targetApp={currentSample.process}
                contextSummary={currentSample.pilotProposal.summary}
                onApprove={handleApprovePilot}
                onReject={() => setShowApprovalCard(false)}
              />
            </div>
          )}

          <div className="leading-relaxed text-stark pt-1">
            <span>{typed}</span>
            {phase === "typing" && (
              <span className="inline-block h-4 w-2 bg-primary animate-pulse ml-0.5 align-middle shadow-[0_0_8px_#ff6b00]" />
            )}
            {phase === "idle" && typed.length === 0 && !showSmartQA && !showApprovalCard && (
              <span className="text-titanium-silver/50 italic">
                Press and hold the button below to stream spoken intent here...
              </span>
            )}
          </div>
        </div>
      </SpotlightCard>

      {/* Simulator Control Dock */}
      <div className="mt-8 flex flex-col items-center justify-center gap-4">
        <Magnet padding={40} magnetStrength={3}>
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className={`group relative flex items-center gap-3 rounded-2xl border px-8 py-4 text-sm font-semibold transition-all duration-200 select-none ${
              phase === "recording"
                ? "border-primary bg-primary text-white shadow-[0_0_35px_rgba(255,107,0,0.4)] scale-[0.98]"
                : "border-border bg-white text-slate-900 hover:border-primary/50 hover:shadow-[0_0_24px_-4px_rgba(255,107,0,0.18)]"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform ${
                phase === "recording" ? "scale-110" : "group-hover:scale-105"
              }`}
            >
              <Mic
                className={`h-4 w-4 ${phase === "recording" ? "text-white" : "text-primary"}`}
              />
            </div>
            <span>
              {phase === "recording" ? "Release Key to Inject Text" : "Press & Hold to Dictate"}
            </span>
            <span className="rounded-md border border-border bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 group-hover:text-slate-900 font-bold">
              {phase === "recording" ? "ACTIVE" : "SPACE"}
            </span>
          </button>
        </Magnet>

        {/* 4-Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <div className="flex flex-wrap items-center justify-center rounded-xl border border-border bg-slate-50 p-1 shadow-inner gap-1">
            {[
              { id: "direct", label: "Direct Dictation", icon: null },
              { id: "smart", label: "Smart Expansion", icon: Sparkles },
              { id: "smart_qa", label: "Smart Q&A (Layer 4)", icon: Layers },
              { id: "pilot", label: "Screen Pilot (L7/8)", icon: Eye },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id as Mode);
                  setPhase("idle");
                  setTyped("");
                  setShowSmartQA(false);
                  setShowApprovalCard(false);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  mode === m.id
                    ? "border border-border bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {m.icon && <m.icon className="h-3.5 w-3.5 text-primary shrink-0" />}
                {mode === m.id ? (
                  <ShinyText text={m.label} speed={2.5} color="#0f172a" shineColor="#ff6b00" />
                ) : (
                  <span>{m.label}</span>
                )}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5 font-mono text-[10px] text-emerald font-semibold whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse shrink-0" />
            <span>Zero-Backspace Rule Active</span>
          </div>
        </div>
      </div>

      {/* Sub-components & Modals */}
      <ContextInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        activeApp={currentSample.process}
        activeWindow={currentSample.filename}
      />

      <UtoExplorerModal isOpen={isUtoOpen} onClose={() => setIsUtoOpen(false)} />
    </section>
  );
}

export default Simulator;
