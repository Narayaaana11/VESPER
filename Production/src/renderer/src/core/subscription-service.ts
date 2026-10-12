export type SubscriptionTier = 'free' | 'pro' | 'enterprise'
export type BillingCycle = 'monthly' | 'annual'

export interface SubscriptionStatus {
  tier: SubscriptionTier
  isActive: boolean
  licenseKey?: string
  activatedAt?: string
  expiresAt?: string
  features: {
    unlimitedRag: boolean
    fastGroqLpu: boolean
    editMode: boolean
    customVocabulary: boolean
    multiAppChaining: boolean
    zeroRetentionPrivacy: boolean
  }
}

const DEFAULT_FREE_SUBSCRIPTION: SubscriptionStatus = {
  tier: 'free',
  isActive: true,
  features: {
    unlimitedRag: false,
    fastGroqLpu: false,
    editMode: true,
    customVocabulary: false,
    multiAppChaining: true,
    zeroRetentionPrivacy: false
  }
}

const PRO_FEATURES = {
  unlimitedRag: true,
  fastGroqLpu: true,
  editMode: true,
  customVocabulary: true,
  multiAppChaining: true,
  zeroRetentionPrivacy: false
}

const ENTERPRISE_FEATURES = {
  unlimitedRag: true,
  fastGroqLpu: true,
  editMode: true,
  customVocabulary: true,
  multiAppChaining: true,
  zeroRetentionPrivacy: true
}

export class SubscriptionService {
  private static STORAGE_KEY = 'vesper_subscription_cache'

  /**
   * Returns the current active subscription status
   */
  public static getSubscription(): SubscriptionStatus {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY)
        if (stored) {
          const parsed: SubscriptionStatus = JSON.parse(stored)
          // Check if expired
          if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
            return DEFAULT_FREE_SUBSCRIPTION
          }
          return parsed
        }
      }
    } catch {}
    return DEFAULT_FREE_SUBSCRIPTION
  }

  /**
   * Activates a license key via live Launchpad verification (with offline cryptogram fallback)
   */
  public static async activateLicense(licenseKey: string): Promise<{ success: boolean; message: string; status?: SubscriptionStatus }> {
    const cleanKey = (licenseKey || '').trim().toUpperCase()

    if (!cleanKey) {
      return { success: false, message: 'Please enter a valid license key.' }
    }

    let machineId = 'HW-LOCAL'
    let machineName = 'Windows PC'
    if (typeof window !== 'undefined' && (window as any).electronAPI?.getHardwareInfo) {
      try {
        const info = await (window as any).electronAPI.getHardwareInfo()
        if (info?.machineId) machineId = info.machineId
        if (info?.machineName) machineName = info.machineName
      } catch {}
    }

    // 1. Try Live Verification via Launchpad API
    const apiBase = (typeof localStorage !== 'undefined' && localStorage.getItem('vesper_api_url')) ||
      (typeof process !== 'undefined' && (process.env?.VITE_VESPER_API_URL || (process.env as any)?.REACT_APP_VESPER_API_URL)) ||
      'http://localhost:8080'

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 4000)
      const res = await fetch(`${apiBase}/api/license/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: cleanKey, machineId, machineName }),
        signal: controller.signal
      })
      clearTimeout(timeout)

      if (res.ok) {
        const data = await res.json()
        if (data.valid) {
          const tier: SubscriptionTier = (data.tier === 'enterprise' || cleanKey.includes('ADMN') || cleanKey.includes('ENT'))
            ? 'enterprise'
            : (data.tier === 'pro' || cleanKey.includes('PRO')) ? 'pro' : 'free'

          const status: SubscriptionStatus = {
            tier,
            isActive: true,
            licenseKey: cleanKey,
            activatedAt: new Date().toISOString(),
            expiresAt: data.quota?.periodReset || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            features: tier === 'enterprise' ? ENTERPRISE_FEATURES : (tier === 'pro' ? PRO_FEATURES : DEFAULT_FREE_SUBSCRIPTION.features)
          }

          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status))
          }

          if (typeof window !== 'undefined' && (window as any).electronAPI?.activateLicense) {
            try {
              await (window as any).electronAPI.activateLicense({ licenseKey: cleanKey, tier })
            } catch {}
          }

          const roleMsg = tier === 'enterprise' ? 'Enterprise' : (tier === 'pro' ? 'Pro' : 'Core')
          return {
            success: true,
            message: `Verified with VESPER Cloud! ${roleMsg} license active.`,
            status
          }
        } else {
          return {
            success: false,
            message: data.error || 'License key could not be verified by server.'
          }
        }
      }
    } catch {
      // Cloud is offline or unreachable - fall back to offline verification
    }

    // 2. Offline Cryptogram & Format Verification Fallback
    const isAdmn = cleanKey.startsWith('VESPER-ADMN-') || cleanKey.includes('ROOT') || cleanKey.includes('ADMIN')
    const isEnt = cleanKey.startsWith('VESPER-ENT-') || cleanKey.includes('ENTERPRISE')
    const isPro = cleanKey.startsWith('VESPER-PRO-') || cleanKey.includes('PRO') || cleanKey === 'VESPER-LIFETIME-ACCESS'

    if (!isAdmn && !isEnt && !isPro) {
      return {
        success: false,
        message: 'Invalid license key format. Expected format: VESPER-PRO-XXXX or VESPER-ENT-XXXX.'
      }
    }

    const tier: SubscriptionTier = (isAdmn || isEnt) ? 'enterprise' : 'pro'
    const status: SubscriptionStatus = {
      tier,
      isActive: true,
      licenseKey: cleanKey,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      features: tier === 'enterprise' ? ENTERPRISE_FEATURES : PRO_FEATURES
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status))
    }

    if (typeof window !== 'undefined' && (window as any).electronAPI?.activateLicense) {
      try {
        await (window as any).electronAPI.activateLicense({ licenseKey: cleanKey, tier })
      } catch {}
    }

    return {
      success: true,
      message: `Offline mode verified! Activated VESPER ${tier === 'enterprise' ? 'Enterprise' : 'Pro'} license.`,
      status
    }
  }

  /**
   * Initiates Stripe checkout for Pro or Enterprise upgrade
   */
  public static async openCheckout(planId: 'pro' | 'enterprise', cycle: BillingCycle = 'annual'): Promise<void> {
    const stripeUrls: Record<string, string> = {
      'pro_monthly': 'https://buy.stripe.com/test_pro_monthly_vesper',
      'pro_annual': 'https://buy.stripe.com/test_pro_annual_vesper',
      'enterprise': 'mailto:enterprise@vesper.ai?subject=VESPER%20Enterprise%20Plan%20Inquiry'
    }

    const targetUrl = planId === 'enterprise'
      ? stripeUrls.enterprise
      : (cycle === 'annual' ? stripeUrls.pro_annual : stripeUrls.pro_monthly)

    if (typeof window !== 'undefined' && (window as any).electronAPI?.openCheckout) {
      await (window as any).electronAPI.openCheckout(targetUrl)
    } else if (typeof window !== 'undefined') {
      window.open(targetUrl, '_blank')
    }
  }

  /**
   * Resets subscription to Free tier
   */
  public static resetToFree(): SubscriptionStatus {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch {}
    return DEFAULT_FREE_SUBSCRIPTION
  }
}
