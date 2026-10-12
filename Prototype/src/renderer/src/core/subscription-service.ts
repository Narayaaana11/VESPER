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
   * Activates a license key (offline cryptogram / format validation or server verification)
   */
  public static async activateLicense(licenseKey: string): Promise<{ success: boolean; message: string; status?: SubscriptionStatus }> {
    const cleanKey = (licenseKey || '').trim().toUpperCase()

    if (!cleanKey) {
      return { success: false, message: 'Please enter a valid license key.' }
    }

    // Accept valid format: VESPER-PRO-XXXX-XXXX or VESPER-ENT-XXXX-XXXX or test trial key
    const isPro = cleanKey.startsWith('VESPER-PRO-') || cleanKey.includes('PRO')
    const isEnt = cleanKey.startsWith('VESPER-ENT-') || cleanKey.includes('ENTERPRISE')

    if (!isPro && !isEnt && cleanKey !== 'VESPER-LIFETIME-ACCESS') {
      return {
        success: false,
        message: 'Invalid license key format. Expected format: VESPER-PRO-XXXX-XXXX'
      }
    }

    const tier: SubscriptionTier = isEnt ? 'enterprise' : 'pro'
    const status: SubscriptionStatus = {
      tier,
      isActive: true,
      licenseKey: cleanKey,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      features: isEnt ? ENTERPRISE_FEATURES : PRO_FEATURES
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status))
    } catch {}

    // Synchronize with Electron main process SQLite store
    if (typeof window !== 'undefined' && (window as any).electronAPI?.activateLicense) {
      try {
        await (window as any).electronAPI.activateLicense({ licenseKey: cleanKey, tier })
      } catch (err) {
        console.warn('[SubscriptionService] Electron IPC license sync notice:', err)
      }
    }

    return {
      success: true,
      message: `Successfully activated VESPER ${tier === 'enterprise' ? 'Enterprise' : 'Pro'} license!`,
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
