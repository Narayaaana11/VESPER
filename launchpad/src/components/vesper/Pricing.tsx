import { Check, Sparkles, Shield, Cpu, Zap, ArrowRight, X, Key, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { BorderGlow, SpotlightCard, StarBorder, Magnet, ShinyText } from "@/components/reactbits";

interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: string;
  priceAnnual: string;
  priceLifetime?: string;
  billingPeriod: string;
  description: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Tier",
    badge: "30m Daily Allowance",
    priceMonthly: "$0",
    priceAnnual: "$0",
    billingPeriod: "daily quota resets at 12:00 AM",
    description:
      "Essential ambient voice dictation with 30 minutes daily usage limit for individual developers.",
    features: [
      "30 minutes daily voice dictation",
      "Automatic quota reset at 12:00 AM midnight",
      "Silero Voice Activity Detection (VAD)",
      "Win32 zero-focus caret pasting",
      "Sub-5ms on-device vector context search",
      "Local SQLite history & session memory",
    ],
    ctaText: "Download Free Installer",
    ctaHref: "#download",
  },
  {
    id: "pro",
    name: "VESPER Pro",
    badge: "Instant License",
    popular: true,
    priceMonthly: "$10",
    priceAnnual: "$8",
    billingPeriod: "per month",
    description:
      "Unlimited ambient dictation, high-speed Neural LPU pipeline, and priority cloud acceleration.",
    features: [
      "Unlimited daily dictation (no 30m cap)",
      "Sub-180ms ultra-low latency Neural LPU pipeline",
      "Instant license generation & automated key delivery",
      "In-place Selection Transformer (Edit Mode)",
      "Multi-utterance context chaining & memory",
      "Custom vocabulary & voice expansion snippets",
      "Automatic multilingual speech-to-English letters",
    ],
    ctaText: "Activate VESPER Pro ($10/mo)",
    ctaHref: "#pricing",
  },
  {
    id: "team",
    name: "Team & Enterprise",
    badge: "Enterprise SLA",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    billingPeriod: "tailored SLA & seats",
    description:
      "Dedicated infrastructure, custom fine-tuned Whisper models, centralized team seat management, and zero-retention privacy for engineering teams.",
    features: [
      "Everything in VESPER Pro",
      "Dedicated enterprise Neural LPU & local GPU clusters",
      "Centralized team dictionary synchronization",
      "SOC2 Type II & HIPAA compliant zero-retention",
      "Centralized admin console & license seats",
      "24/7 dedicated support engineer & SLA",
    ],
    ctaText: "Contact the Team",
    ctaHref: "#pricing",
  },
];

export interface PricingProps {
  onOpenEnterpriseModal?: () => void;
}

export function Pricing({ onOpenEnterpriseModal }: PricingProps = {}) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const { user, openAuthModal } = useAuth();

  const handleProClick = () => {
    if (!user) {
      toast.info("Create a free account or sign in to activate your VESPER Pro license.", {
        description: "Your license key is generated immediately upon registration.",
      });
      openAuthModal();
    } else {
      setIsProModalOpen(true);
    }
  };

  const copyLicense = (key: string) => {
    void navigator.clipboard?.writeText(key);
    setCopiedKey(true);
    toast.success("License key copied to clipboard!");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-28 relative">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-titanium-border bg-titanium-elevated px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium-silver">
          <Zap className="h-3 w-3 text-emerald" />
          <span>Transparent Unit Economics</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-stark sm:text-4xl">
          Free on-device compute. High-leverage Pro cloud.
        </h2>
        <p className="mt-3 text-sm text-titanium-silver max-w-2xl mx-auto">
          VESPER never holds your local PC hostage. Use unlimited on-device Whisper for zero dollars,
          or unlock sub-180ms neural cloud speed and VESPER Context Protocol MCP memory.
        </p>

        {/* Billing Switcher */}
        <div className="mt-8 inline-flex items-center rounded-xl border border-titanium-border bg-titanium p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-titanium-elevated text-stark shadow-sm"
                : "text-titanium-silver hover:text-stark"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`relative flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
              billingCycle === "annual"
                ? "bg-titanium-elevated text-stark shadow-sm"
                : "text-titanium-silver hover:text-stark"
            }`}
          >
            <span>Annual</span>
            <span className="rounded-full bg-emerald/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3 items-stretch">
        {PLANS.map((plan) => {
          const isPro = plan.popular;
          const displayPrice = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

          const cardContent = (
            <div className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-mono text-sm font-bold tracking-tight text-stark">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                        isPro
                          ? "border border-emerald/50 bg-emerald/10 text-emerald"
                          : "border border-titanium-border bg-titanium-elevated text-titanium-silver"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-bold tracking-tight text-stark">
                    {displayPrice}
                  </span>
                  <span className="text-xs text-titanium-silver">
                    {displayPrice === "Custom" ? " — tailored SLA & seats" : `/${plan.billingPeriod}`}
                  </span>
                </div>

                {isPro && (
                  <p className="mt-1 font-mono text-[11px] text-emerald">
                    Or $99 one-time Founder Lifetime Pass
                  </p>
                )}

                <p className="mt-3 text-xs leading-relaxed text-titanium-silver">
                  {plan.description}
                </p>

                <div className="mt-6 border-t border-titanium-border/60 pt-6">
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-titanium-silver uppercase">
                    Included Capabilities
                  </span>
                  <ul className="mt-3 space-y-2.5 text-xs text-titanium-silver">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald mt-0.5" />
                        <span className="text-stark/90">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                {isPro ? (
                  <Magnet padding={40} magnetStrength={3} wrapperClassName="w-full">
                    <StarBorder
                      as="button"
                      type="button"
                      onClick={handleProClick}
                      color="#ff6b00"
                      speed="3s"
                      thickness={1.5}
                      backgroundColor="#ff6b00"
                      textColor="#ffffff"
                      className="w-full text-xs font-bold shadow-md transition-all hover:opacity-95 cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-2 py-3 px-4 text-white font-bold">
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                      </div>
                    </StarBorder>
                  </Magnet>
                ) : plan.id === "team" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenEnterpriseModal) {
                        onOpenEnterpriseModal();
                      } else {
                        toast.info("Opening enterprise inquiry channel...");
                      }
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-4 py-3 text-xs font-bold text-primary transition-all hover:bg-primary/20 hover:border-primary active:scale-[0.99] cursor-pointer shadow-sm"
                  >
                    <span>Contact the Team</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </button>
                ) : (
                  <a
                    href={plan.ctaHref}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-titanium-border bg-titanium-elevated px-4 py-3 text-xs font-semibold text-stark transition-all hover:border-titanium-silver/50 hover:bg-titanium-border active:scale-[0.99]"
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-titanium-silver" />
                  </a>
                )}
              </div>
            </div>
          );

          if (isPro) {
            return (
              <BorderGlow
                key={plan.id}
                borderRadius={20}
                glowColor="25 95% 53%"
                glowRadius={28}
                glowIntensity={0.7}
                colors={["#ff6b00", "#ff8533", "#ea580c"]}
                className="h-full"
              >
                <div className="h-full rounded-2xl bg-titanium border border-titanium-border shadow-2xl">
                  {cardContent}
                </div>
              </BorderGlow>
            );
          }

          return (
            <SpotlightCard
              key={plan.id}
              spotlightColor="rgba(255, 255, 255, 0.04)"
              className="h-full rounded-2xl border border-titanium-border bg-titanium/90 shadow-xl backdrop-blur-xl transition-all hover:border-titanium-border/80"
            >
              {cardContent}
            </SpotlightCard>
          );
        })}
      </div>

      {/* Enterprise & Security Assurance Card */}
      <div className="mt-14 rounded-2xl border border-titanium-border bg-titanium-elevated/80 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald border border-emerald/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stark">
                Zero Cloud Audio Lock-In Guarantee
              </h4>
              <p className="mt-1 text-xs text-titanium-silver max-w-xl leading-relaxed">
                Both Free and Pro tiers include complete access to on-device ONNX execution. If you
                ever cancel Pro, VESPER remains 100% operational on your local machine with zero
                downtime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs text-titanium-silver">Hardware Verified:</span>
            <span className="rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark">
              RTX CUDA
            </span>
            <span className="rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark">
              DirectML
            </span>
            <span className="rounded-md border border-titanium-border bg-titanium px-2 py-1 font-mono text-[10px] text-stark">
              Intel NPU
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Pro License Modal */}
      {isProModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-titanium-border/80 bg-[#121217]/95 backdrop-blur-xl p-6 shadow-[0_24px_64px_rgba(0,0,0,0.85)] text-stark">
            <button
              type="button"
              onClick={() => setIsProModalOpen(false)}
              className="rounded-lg p-1.5 text-titanium-silver hover:bg-titanium-elevated hover:text-stark transition-colors absolute right-4 top-4"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-titanium-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stark">VESPER Pro Subscription</h3>
                <p className="text-xs text-titanium-silver">Account &amp; Software License Status</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-4">
                <span className="font-mono text-[10px] text-titanium-silver uppercase tracking-wider">
                  Assigned Desktop License Key
                </span>
                <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-titanium-border bg-obsidian px-3 py-2 font-mono text-xs font-semibold text-emerald">
                  <span className="truncate">{user?.licenseKey || "VSP-PRO-ACTIVE-KEY"}</span>
                  <button
                    type="button"
                    onClick={() => copyLicense(user?.licenseKey || "VSP-PRO-ACTIVE-KEY")}
                    className="text-titanium-silver hover:text-stark transition-colors p-1"
                    title="Copy License Key"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-emerald" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-3">
                  <span className="text-titanium-silver text-[11px]">Tier Status</span>
                  <div className="mt-1 font-bold text-stark flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald" />
                    <span>{user?.tier ? user.tier.toUpperCase() : "PRO"} Active</span>
                  </div>
                </div>
                <div className="rounded-xl border border-titanium-border bg-titanium-elevated p-3">
                  <span className="text-titanium-silver text-[11px]">Speech Latency</span>
                  <div className="mt-1 font-mono font-bold text-stark">&lt;180ms Neural</div>
                </div>
              </div>

              <p className="text-xs text-titanium-silver leading-relaxed">
                Your Pro license key is authorized for unlimited on-device dictation and the high-speed Neural LPU pipeline. Paste this key into the desktop client setup gate or inspect guidance below.
              </p>

              <div className="flex gap-2 pt-2">
                <Link
                  to="/guidance"
                  onClick={() => setIsProModalOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-orange-600 px-4 py-2.5 text-xs font-bold text-white transition-colors"
                >
                  <span>Open License Validator</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsProModalOpen(false)}
                  className="rounded-xl border border-titanium-border bg-titanium-elevated px-4 py-2.5 text-xs font-semibold text-stark hover:bg-titanium-border transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Pricing;
