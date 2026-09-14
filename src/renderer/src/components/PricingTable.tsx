import React, { useState } from 'react'
import { Check, Sparkles, Zap, Shield, ArrowRight, Star } from 'lucide-react'

export interface PricingPlan {
  id: string
  name: string
  badge?: string
  description: string
  monthlyPrice: number
  annualPrice: number
  popular?: boolean
  features: string[]
  ctaText: string
  ctaVariant: 'primary' | 'secondary' | 'gradient'
}

const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Essential ambient voice dictation and local context memory for solo developers.',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Unlimited local Whisper transcription',
      'Silero Voice Activity Detection (VAD)',
      'Sub-5ms on-device vector context search',
      'Basic text insertion into any active app',
      'Local SQLite history & session memory'
    ],
    ctaText: 'Get Started Free',
    ctaVariant: 'secondary'
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Popular',
    popular: true,
    description: 'High-speed Groq LPU processing, multi-app context chaining, and in-place edit mode.',
    monthlyPrice: 19,
    annualPrice: 15,
    features: [
      'Everything in Free, plus:',
      'Sub-800ms ultra-low latency Groq LPU pipeline',
      'In-place Selection Transformer (Edit Mode)',
      'Multi-utterance context chaining & memory',
      'Custom vocabulary & snippet expansion',
      'Automatic multilingual speech-to-English letters',
      'Priority Discord & community support'
    ],
    ctaText: 'Upgrade to Pro',
    ctaVariant: 'gradient'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Dedicated infrastructure, custom fine-tuned Whisper models, and strict zero-retention privacy.',
    monthlyPrice: 79,
    annualPrice: 65,
    features: [
      'Everything in Pro, plus:',
      'Dedicated enterprise Groq & local GPU clusters',
      'Custom vocabulary training on your codebase',
      'Centralized team analytics & license management',
      'SOC2 Type II & HIPAA compliant zero-retention',
      '24/7 dedicated support engineer & custom SLA'
    ],
    ctaText: 'Contact Enterprise',
    ctaVariant: 'primary'
  }
]

export const PricingTable: React.FC<{ onSelectPlan?: (planId: string) => void }> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCopyComponentCode = () => {
    const code = `// Google Stitch-Generated Responsive Pricing Table
export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Pricing cards */}
    </div>
  )
}`
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="w-full text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 animate-fadeIn">
      {/* Header Section (Stitch Zoom-Out Context) */}
      <div className="text-center max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Stitch UI Studio</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Predictable, Transparent Pricing
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-400 leading-relaxed">
          Supercharge your workflow with real-time speech copilot intelligence, ambient context memory, and instant native typing.
        </p>

        {/* Billing Toggle (Monthly / Annual with Discount) */}
        <div className="mt-7 inline-flex items-center bg-slate-900/90 border border-slate-800 rounded-full p-1 shadow-inner">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Annual</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Tier Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => {
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
          const isPopular = plan.popular

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-300 ${
                isPopular
                  ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/15 md:-translate-y-2'
                  : 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/80 shadow-lg'
              } backdrop-blur-xl`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 border border-cyan-300/30">
                  <Star className="w-3 h-3 fill-current text-yellow-300" />
                  <span>{plan.badge || 'Popular'}</span>
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.id === 'pro' && (
                    <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                  )}
                  {plan.id === 'enterprise' && (
                    <Shield className="w-5 h-5 text-indigo-400" />
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400 min-h-[36px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-6 flex items-baseline gap-1.5 border-b border-slate-800/60 pb-6">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-400">
                    / month {billingCycle === 'annual' && price > 0 ? '(billed annually)' : ''}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Included Features:
                  </p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div
                        className={`rounded-full p-0.5 mt-0.5 shrink-0 ${
                          isPopular
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPlan?.(plan.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-2 group ${
                  plan.ctaVariant === 'gradient'
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-[0.98]'
                    : plan.ctaVariant === 'primary'
                      ? 'bg-slate-100 text-slate-900 hover:bg-white active:scale-[0.98]'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-[0.98]'
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer Meta Details */}
      <div className="mt-8 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-6">
        <span>✓ 14-day free trial on Pro</span>
        <span>✓ Cancel anytime with 1-click</span>
        <span>✓ Local models are 100% offline & free forever</span>
      </div>
    </div>
  )
}
