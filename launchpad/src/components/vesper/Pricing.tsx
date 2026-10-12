import { Check, Sparkles, Shield, Cpu, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";
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
    badge: "Stripe Instant",
    popular: true,
    priceMonthly: "$19",
    priceAnnual: "$15",
    billingPeriod: "per month, billed annually",
    description:
      "Unlimited ambient dictation, high-speed Neural LPU pipeline, and priority cloud acceleration.",
    features: [
      "Unlimited daily dictation (no 30m cap)",
      "Sub-180ms ultra-low latency Neural LPU pipeline",
      "Instant Stripe Checkout & automated licensing",
      "In-place Selection Transformer (Edit Mode)",
      "Multi-utterance context chaining & memory",
      "Custom vocabulary & voice expansion snippets",
      "Automatic multilingual speech-to-English letters",
    ],
    ctaText: "Upgrade with Stripe",
    ctaHref: "#pricing",
  },
  {
    id: "team",
    name: "Team & Enterprise",
    badge: "Enterprise Ready",
    priceMonthly: "$79",
    priceAnnual: "$65",
    billingPeriod: "per user / month",
    description:
      "Dedicated infrastructure, custom fine-tuned Whisper models, and zero-retention privacy for engineering teams.",
    features: [
      "Everything in VESPER Pro",
      "Dedicated enterprise Neural LPU & local GPU clusters",
      "Centralized team dictionary synchronization",
      "SOC2 Type II & HIPAA compliant zero-retention",
      "Centralized admin console & license seats",
      "24/7 dedicated support engineer & SLA",
    ],
    ctaText: "Contact for Enterprise Pilot",
    ctaHref: "#pricing",
  },
];

export interface PricingProps {
  onOpenEnterpriseModal?: () => void;
}

export function Pricing({ onOpenEnterpriseModal }: PricingProps = {}) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

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
                  <span className="text-xs text-titanium-silver">/{plan.billingPeriod}</span>
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
                      as="a"
                      href={plan.ctaHref}
                      color="#ff6b00"
                      speed="3s"
                      thickness={1.5}
                      backgroundColor="#ff6b00"
                      textColor="#ffffff"
                      className="w-full text-xs font-bold shadow-md transition-all hover:opacity-95"
                    >
                      <div className="flex items-center justify-center gap-2 py-3 px-4 text-white font-bold">
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-white" />
                      </div>
                    </StarBorder>
                  </Magnet>
                ) : plan.id === "team" && onOpenEnterpriseModal ? (
                  <button
                    type="button"
                    onClick={onOpenEnterpriseModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary active:scale-[0.99] cursor-pointer"
                  >
                    <span>{plan.ctaText}</span>
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
    </section>
  );
}

export default Pricing;
