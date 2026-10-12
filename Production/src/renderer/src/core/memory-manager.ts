export interface UserPreferences {
  preferredFramework?: string // e.g. 'React'
  preferredLanguage?: string // e.g. 'TypeScript'
  preferredStyling?: string // e.g. 'Tailwind CSS'
  preferredTone?: string // e.g. 'Professional'
  preferredEditor?: string // e.g. 'Cursor'
  defaultAiDecision?: boolean // whether to auto-resolve ambiguities
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredFramework: 'React',
  preferredLanguage: 'TypeScript',
  preferredStyling: 'Tailwind CSS',
  preferredTone: 'Professional',
  preferredEditor: 'Cursor',
  defaultAiDecision: false
}

const STORAGE_KEY = 'vesper_user_memory_v1'

export class MemoryManager {
  private static cachedPrefs: UserPreferences | null = null

  public static getPreferences(): UserPreferences {
    if (this.cachedPrefs) return { ...this.cachedPrefs }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          this.cachedPrefs = { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) }
          return { ...this.cachedPrefs }
        }
      }
    } catch (err) {
      console.warn('[VESPER Memory] Failed to read preferences from localStorage:', err)
    }

    this.cachedPrefs = { ...DEFAULT_PREFERENCES }
    return { ...this.cachedPrefs }
  }

  public static savePreferences(updated: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences()
    const merged = { ...current, ...updated }
    this.cachedPrefs = merged

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      }
    } catch (err) {
      console.warn('[VESPER Memory] Failed to save preferences to localStorage:', err)
    }

    return { ...merged }
  }

  public static clearPreferences(): void {
    this.cachedPrefs = { ...DEFAULT_PREFERENCES }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch (err) {
      console.warn('[VESPER Memory] Failed to clear preferences:', err)
    }
  }

  /**
   * Resolves effective preferences for a given user command.
   * CRITICAL RULE: Explicit speech instructions ALWAYS override stored memory!
   */
  public static resolveEffectiveStack(
    speechText: string,
    extractedTech: string[]
  ): { framework: string; styling: string; isFromMemory: boolean } {
    const text = speechText.toLowerCase()
    const prefs = this.getPreferences()

    // 1. Check if user explicitly mentioned a framework
    let framework = ''
    let isFromMemory = false

    if (text.includes('vue')) framework = 'Vue.js'
    else if (text.includes('next')) framework = 'Next.js'
    else if (text.includes('html') || text.includes('vanilla')) framework = 'HTML5 + Vanilla JS'
    else if (text.includes('react')) framework = 'React'
    else if (extractedTech.length > 0) framework = extractedTech[0]
    else if (prefs.preferredFramework) {
      framework = prefs.preferredFramework
      isFromMemory = true
    } else {
      framework = 'HTML5 + CSS + Vanilla JS'
    }

    // 2. Check if user explicitly mentioned styling
    let styling = ''
    if (text.includes('tailwind')) styling = 'Tailwind CSS'
    else if (text.includes('bootstrap')) styling = 'Bootstrap'
    else if (text.includes('vanilla css') || text.includes('pure css')) styling = 'Vanilla CSS'
    else if (prefs.preferredStyling) {
      styling = prefs.preferredStyling
    } else {
      styling = 'Modern CSS'
    }

    return { framework, styling, isFromMemory }
  }
}
