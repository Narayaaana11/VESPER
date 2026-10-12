export interface UserProfile {
  email: string
  displayName: string
  isLoggedIn: boolean
  isVerified: boolean
  tier: 'free' | 'pro' | 'enterprise'
  joinedDate: string
  cloudApiKey: string
  autoStartup: boolean
}

const STORAGE_KEY = 'vesper_user_profile'

const DEFAULT_PROFILE: UserProfile = {
  email: '',
  displayName: '',
  isLoggedIn: false,
  isVerified: false,
  tier: 'free',
  joinedDate: '',
  cloudApiKey: '',
  autoStartup: true
}

export class ProfileService {
  static getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
      }
    } catch {}
    return DEFAULT_PROFILE
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {}
  }

  static login(email: string, _password?: string): UserProfile {
    const current = this.getProfile()
    const nameFromEmail = email.split('@')[0] || 'User'
    const updated: UserProfile = {
      ...current,
      email: email.trim(),
      displayName: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      isLoggedIn: true,
      isVerified: true,
      joinedDate: current.joinedDate || new Date().toISOString()
    }
    this.saveProfile(updated)
    return updated
  }

  static logout(): UserProfile {
    const cleared: UserProfile = {
      ...DEFAULT_PROFILE,
      cloudApiKey: this.getProfile().cloudApiKey // Retain API key on logout
    }
    this.saveProfile(cleared)
    return cleared
  }

  static updateCloudApiKey(key: string): UserProfile {
    const profile = this.getProfile()
    profile.cloudApiKey = key.trim()
    this.saveProfile(profile)
    return profile
  }
}
