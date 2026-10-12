import {
  ArrowDown,
  Globe,
  Gauge,
  Shield,
  Crosshair,
  Terminal,
  Check,
  Copy,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BlurText,
  ShinyText,
  StarBorder,
  Magnet,
  SpotlightCard,
  Particles,
} from "@/components/reactbits";

function WindowsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="currentColor">
      <path d="M0 12.402l35.687-4.86.016 34.423-35.67.248L0 12.402zm35.67 33.529l.028 34.453L.028 75.48.003 46.179l35.667-.248zM40.97 6.479L87.977 0v41.526l-47.008.377V6.479zm47.037 39.467l-.03 41.602-46.99-6.613-.013-34.612 47.033-.377z" />
    </svg>
  );
}

export function Hero() {
  const [copiedWinget, setCopiedWinget] = useState(false);

  const copyWinget = () => {
    void navigator.clipboard?.writeText("winget install vesper");
    setCopiedWinget(true);
    toast.success("Command copied to clipboard", {
      description: "Paste in Windows Terminal or PowerShell to install.",
    });
    setTimeout(() => setCopiedWinget(false), 2200);
  };

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20">
      {/* Precision WebGL Particles in Background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <Particles
          particleCount={75}
          particleSpread={10}
          speed={0.06}
          particleColors={["#ff7a1a", "#ea580c", "#fed7aa", "#cbd5e1"]}
          alphaParticles={true}
          particleBaseSize={70}
        />
      </div>

      {/* Structured focal ambient lighting */}
      <div className="pointer-events-none absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent)] -z-10" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.08),transparent_70%)] blur-3xl -z-10" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        {/* Launch status pill */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 backdrop-blur-md shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#ff6b00]" />
          </span>
          <ShinyText
            text="THE SOFTWARE 3.0 AMBIENT INTELLIGENCE PLATFORM"
            speed={2.2}
            color="#ea580c"
            shineColor="#ffffff"
            className="font-mono text-[11px] font-bold tracking-[0.16em]"
          />
          <span className="hidden sm:inline text-orange-300">|</span>
          <span className="hidden sm:inline font-mono text-[11px] font-semibold text-slate-600">
            Sub-180ms Latency
          </span>
        </div>

        {/* Hero headline with BlurText */}
        <div className="mt-8 flex flex-col items-center">
          <BlurText
            text="Say what you mean."
            delay={90}
            animateBy="words"
            direction="top"
            className="text-balance text-4xl font-extrabold leading-[1.12] tracking-[-0.035em] text-slate-900 sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-7xl justify-center text-center"
          />
          <BlurText
            text="Get it done at the speed of speech."
            delay={110}
            animateBy="words"
            direction="bottom"
            className="mt-2 text-balance text-4xl font-extrabold leading-[1.12] tracking-[-0.035em] text-slate-500 sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-7xl justify-center text-center"
          />
        </div>

        {/* Sub-headline */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
          The high-bandwidth biological bridge to your Windows PC. Hold{" "}
          <span className="kbd font-mono text-slate-900 font-bold bg-slate-100 border border-slate-300 px-2 py-0.5 rounded shadow-sm">
            Right Alt
          </span>
          , speak naturally, and watch dense, pre-polished text paste directly at
          your cursor in sub-180ms. Follows the Zero-Backspace Rule.
        </p>

        {/* Action CTAs */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnet padding={50} magnetStrength={3}>
            <StarBorder
              as="a"
              href="#download"
              color="#ff6b00"
              speed="3.5s"
              thickness={1.5}
              backgroundColor="#ffffff"
              className="group relative flex w-full items-center justify-center text-slate-900 transition-all active:scale-[0.98] sm:w-auto shadow-[0_4px_20px_rgba(255,107,0,0.18)] border border-orange-200"
            >
              <div className="flex items-center gap-3 px-5 py-3">
                <WindowsIcon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <div className="flex flex-col items-start text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold tracking-tight text-slate-900">
                      Download VESPER for Windows (.exe)
                    </span>
                    <ArrowDown className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-y-0.5" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    v1.0.0 Release · ~74 MB · 64-bit · Native Windows 11 / 10
                  </span>
                </div>
              </div>
            </StarBorder>
          </Magnet>

          <Magnet padding={40} magnetStrength={3}>
            <a
              href="#simulator"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-4 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-orange-50/50 hover:text-primary sm:w-auto shadow-sm active:scale-[0.98]"
            >
              <span>Try Interactive Simulator</span>
              <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded font-bold">
                Live WebAudio
              </span>
            </a>
          </Magnet>
        </div>

        {/* Winget terminal quick-install pill */}
        <div className="mt-5 flex items-center justify-center">
          <button
            onClick={copyWinget}
            className="group flex items-center gap-2.5 rounded-lg border border-border bg-white px-3.5 py-1.5 font-mono text-xs text-slate-600 transition-all hover:border-primary/40 hover:text-slate-900 shadow-sm"
            title="Click to copy winget command"
          >
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span>winget install vesper</span>
            {copiedWinget ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3 w-3 text-slate-400 transition-colors group-hover:text-primary" />
            )}
          </button>
        </div>

        {/* Sub-metrics row wrapped in SpotlightCards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Metric 1 */}
          <SpotlightCard
            spotlightColor="rgba(255, 107, 0, 0.12)"
            className="p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50">
              <Gauge className="h-4 w-4 text-primary" />
            </div>
            <dt className="mt-3.5 text-sm font-bold text-slate-900 flex items-center gap-1">
              <span>&lt;180ms Latency</span>
            </dt>
            <dd className="mt-1 text-xs text-slate-500">Sub-second biological feedback</dd>
          </SpotlightCard>

          {/* Metric 2 */}
          <SpotlightCard
            spotlightColor="rgba(255, 107, 0, 0.12)"
            className="p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50">
              <Crosshair className="h-4 w-4 text-primary" />
            </div>
            <dt className="mt-3.5 text-sm font-bold text-slate-900">
              <span>Zero Focus Loss</span>
            </dt>
            <dd className="mt-1 text-xs text-slate-500">Native Win32 caret preservation</dd>
          </SpotlightCard>

          {/* Metric 3 */}
          <SpotlightCard
            spotlightColor="rgba(255, 107, 0, 0.12)"
            className="p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <dt className="mt-3.5 text-sm font-bold text-slate-900">
              <span>Zero-Backspace Rule</span>
            </dt>
            <dd className="mt-1 text-xs text-slate-500">Deterministic filler stripping</dd>
          </SpotlightCard>

          {/* Metric 4 */}
          <SpotlightCard
            spotlightColor="rgba(255, 107, 0, 0.12)"
            className="p-5 text-left border-border bg-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <dt className="mt-3.5 text-sm font-bold text-slate-900">
              <span>Secure Local Audio</span>
            </dt>
            <dd className="mt-1 text-xs text-slate-500">In-memory 16kHz PCM buffer</dd>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

export default Hero;
