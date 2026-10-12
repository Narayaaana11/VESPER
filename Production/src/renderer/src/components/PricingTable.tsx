import React, { useState, useEffect } from 'react'
import { Check, Shield, ArrowRight, Key, CheckCircle, X, Lock } from 'lucide-react'
import { SubscriptionService, SubscriptionStatus } from '../core/subscription-service'

export interface PricingPlan {
  id: string
  name: string
  badge?: string
  popular?: boolean
  description: string
  monthlyPrice: number
  annualPrice: number
  features: string[]
  ctaText: string
  ctaVariant: 'primary' | 'secondary' | 'gradient'
}

const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Essential ambient voice dictation with 30 minutes daily limit for solo developers.',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '30 minutes daily voice dictation (hybrid local & cloud)',
      'Automatic daily quota reset at 12:00 AM midnight',
      'Silero Voice Activity Detection (VAD)',
      'Sub-5ms on-device vector context search',
      'Basic text insertion into any active app',
      'Local SQLite history & session memory'
    ],
    ctaText: 'Current Free Tier',
    ctaVariant: 'secondary'
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Stripe Instant',
    popular: true,
    description: 'Unlimited daily dictation, high-speed Groq LPU pipeline, and priority cloud acceleration.',
    monthlyPrice: 19,
    annualPrice: 15,
    features: [
      'Unlimited daily dictation (no 30m cap)',
      'Sub-800ms ultra-low latency Groq LPU pipeline',
      'Instant Stripe Checkout & auto-provisioning',
      'In-place Selection Transformer (Edit Mode)',
      'Multi-utterance context chaining & memory',
      'Custom vocabulary & snippet expansion',
      'Automatic multilingual speech-to-English letters'
    ],
    ctaText: 'Upgrade with Stripe',
    ctaVariant: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Dedicated infrastructure, custom fine-tuned Whisper models, and zero-retention privacy.',
    monthlyPrice: 79,
    annualPrice: 65,
    features: [
      'Unlimited team dictation & central management',
      'Dedicated enterprise Groq & local GPU clusters',
      'Custom vocabulary training on your codebase',
      'SOC2 Type II & HIPAA compliant zero-retention',
      '24/7 dedicated support engineer & SLA'
    ],
    ctaText: 'Contact Enterprise',
    ctaVariant: 'primary'
  }
]

export const PricingTable: React.FC<{ onSelectPlan?: (planId: string) => void }> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [subscription, setSubscription] = useState<SubscriptionStatus>(SubscriptionService.getSubscription)
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [licenseKeyInput, setLicenseKeyInput] = useState('')
  const [licenseFeedback, setLicenseFeedback] = useState<{ success?: boolean; message?: string } | null>(null)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  useEffect(() => {
    setSubscription(SubscriptionService.getSubscription())
  }, [])

  const handlePlanClick = async (planId: string) => {
    onSelectPlan?.(planId)

    if (planId === 'free') {
      const updated = SubscriptionService.resetToFree()
      setSubscription(updated)
      setActionFeedback('Switched to Free Tier.')
      setTimeout(() => setActionFeedback(null), 3000)
    } else if (planId === 'pro') {
      setActionFeedback('Opening Stripe Checkout in browser...')
      await SubscriptionService.openCheckout('pro', billingCycle)
      setTimeout(() => setActionFeedback(null), 3000)
    } else if (planId === 'enterprise') {
      setActionFeedback('Opening Enterprise consultation...')
      await SubscriptionService.openCheckout('enterprise')
      setTimeout(() => setActionFeedback(null), 3000)
    }
  }

  const handleActivateLicense = async () => {
    const res = await SubscriptionService.activateLicense(licenseKeyInput)
    setLicenseFeedback({ success: res.success, message: res.message })
    if (res.success && res.status) {
      setSubscription(res.status)
      setTimeout(() => {
        setShowLicenseModal(false)
        setLicenseFeedback(null)
        setLicenseKeyInput('')
      }, 1500)
    }
  }

  return (
    <div className="pt-root">
      {/* Header Section */}
      <div className="pt-header">
        <div className="pt-header-tag">
          <span>PLANS & LICENSES</span>
        </div>
        <h2>Predictable, Transparent Pricing</h2>
        <p>
          Local-first voice dictation, low-latency Groq cloud intelligence, and offline context memory.
        </p>

        {/* Billing Toggle (Monthly / Annual) & Stripe Badge */}
        <div className="pt-toggle-row">
          <div className="pt-toggle-wrap">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`pt-toggle-btn ${billingCycle === 'monthly' ? 'is-active' : ''}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`pt-toggle-btn ${billingCycle === 'annual' ? 'is-active' : ''}`}
            >
              Annual (Save 20%)
            </button>
          </div>
          <div className="pt-stripe-badge" title="Stripe 256-bit SSL encrypted checkout">
            <Lock size={11} className="text-emerald-400" />
            <span>Powered by Stripe</span>
          </div>
        </div>
      </div>

      {/* Grid of 3 Tier Cards */}
      <div className="pt-grid">
        {PLANS.map((plan) => {
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
          const isPopular = plan.popular

          return (
            <div
              key={plan.id}
              className={`pt-card ${isPopular ? 'is-popular' : ''}`}
            >
              {isPopular && (
                <div className="pt-popular-badge">
                  {plan.badge || 'Standard'}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 className="pt-card-title">{plan.name}</h3>
                  {plan.id === 'enterprise' && (
                    <Shield size={14} style={{ color: 'var(--wf-text-muted)' }} />
                  )}
                </div>
                <p className="pt-card-desc">{plan.description}</p>

                {/* Price Display */}
                <div className="pt-price-box">
                  <span className="pt-price-num">${price}</span>
                  <span className="pt-price-period">
                    / mo {billingCycle === 'annual' && price > 0 ? '(billed annually)' : ''}
                  </span>
                </div>

                {/* Features List */}
                <div className="pt-features-list">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="pt-feature-item">
                      <Check className="pt-feature-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePlanClick(plan.id)}
                disabled={subscription.tier === plan.id}
                className={`pt-card-btn ${
                  subscription.tier === plan.id
                    ? 'btn-outline'
                    : isPopular
                      ? 'btn-solid'
                      : 'btn-outline'
                }`}
                style={subscription.tier === plan.id ? { color: 'var(--wf-success)', borderColor: 'rgba(16, 185, 129, 0.3)' } : undefined}
              >
                {subscription.tier === plan.id ? (
                  <>
                    <CheckCircle size={12} />
                    <span>Current Plan</span>
                  </>
                ) : (
                  <>
                    <span>{plan.ctaText}</span>
                    <ArrowRight size={11} />
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div
          style={{
            marginTop: 14,
            padding: '5px 12px',
            borderRadius: 'var(--wf-radius-sm)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--wf-border)',
            fontSize: '11px',
            color: 'var(--wf-text-secondary)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          {actionFeedback}
        </div>
      )}

      {/* License Key Activation Option */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          onClick={() => setShowLicenseModal(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--wf-text-muted)',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            textDecoration: 'underline',
            textUnderlineOffset: '3px'
          }}
        >
          <Key size={11} />
          <span>Already have a license key? Activate Pro or Enterprise</span>
        </button>
      </div>

      {/* Footer Meta Details */}
      <div
        style={{
          marginTop: 20,
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--wfd-text-muted, #94a3b8)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <span>Secure checkout via Stripe</span>
        <span>·</span>
        <span>Instant license activation</span>
      </div>

      {/* License Key Activation Modal */}
      {showLicenseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              maxWidth: 420,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => {
                setShowLicenseModal(false)
                setLicenseFeedback(null)
              }}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'transparent',
                border: 'none',
                color: 'var(--wf-text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <Key size={14} style={{ color: 'var(--wf-text-secondary)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wf-text-primary)' }}>
                Activate VESPER License
              </h3>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--wf-text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
              Enter your subscription license key received via Stripe confirmation email or procurement. (Instant test key: <code style={{ color: '#38bdf8', userSelect: 'all' }}>VESPER-PRO-UNLIMITED</code>)
            </p>

            <input
              type="text"
              placeholder="e.g. VESPER-PRO-XXXX or VESPER-PRO-UNLIMITED"
              value={licenseKeyInput}
              onChange={(e) => setLicenseKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleActivateLicense()}
              className="wfd-input-text"
              style={{ width: '100%', marginBottom: 10, padding: '6px 10px', fontSize: '12px' }}
            />

            {licenseFeedback && (
              <div
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--wf-radius-sm)',
                  fontSize: '11px',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: licenseFeedback.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                  color: licenseFeedback.success ? 'var(--wf-success)' : '#fda4af',
                  border: licenseFeedback.success ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.25)'
                }}
              >
                {licenseFeedback.success && <CheckCircle size={12} />}
                <span>{licenseFeedback.message}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 12 }}>
              <button
                onClick={() => {
                  setShowLicenseModal(false)
                  setLicenseFeedback(null)
                }}
                className="wfd-btn-subtle"
              >
                Cancel
              </button>
              <button
                onClick={handleActivateLicense}
                className="wfd-btn-primary"
              >
                Activate License
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
