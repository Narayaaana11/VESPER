export interface DictationHistoryItem {
  id: string
  timestamp: number
  targetApp: string
  windowTitle?: string
  rawTranscript: string
  polishedText: string
  durationMs: number
  wordCount: number
  mode: 'direct' | 'smart_assistant'
}

export interface VoiceSnippet {
  id: string
  trigger: string
  expansion: string
  category: string
  createdAt: number
}

export interface CustomVocabularyItem {
  id: string
  term: string
  category?: string
  addedAt: number
}

export interface AppProfileStyle {
  id: string
  appName: string
  appPattern: string
  badgeColor: string
  tone: string
  formattingGuide: string
  enabled: boolean
}

const STORAGE_KEYS = {
  HISTORY: 'vesper_dictation_history',
  SNIPPETS: 'vesper_voice_snippets',
  VOCABULARY: 'vesper_custom_vocabulary',
  PROFILES: 'vesper_app_profiles'
}

// Cross-window synchronization channel (syncs dashboard and floating capsule)
export const syncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('vesper_flow_sync')
    : null

// Clean start: only real user dictations appear in History
const SEED_HISTORY: DictationHistoryItem[] = []

// Default voice expansion snippets
const SEED_SNIPPETS: VoiceSnippet[] = [
  {
    id: 'snip-1',
    trigger: 'my calendar link',
    expansion: 'Feel free to pick any time that works best for you on my calendar: https://cal.com/vesper/sync',
    category: 'Productivity',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'snip-2',
    trigger: 'review checklist',
    expansion: '- [ ] Automated tests passing\n- [ ] UI visual inspection across DPI scaling\n- [ ] Error boundary & network fallbacks verified\n- [ ] Documentation updated in Brain.md',
    category: 'Development',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  {
    id: 'snip-3',
    trigger: 'standard email signoff',
    expansion: 'Best regards,\nNarayan\nAI Systems & Engineering Lead',
    category: 'Communication',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7
  },
  {
    id: 'snip-4',
    trigger: 'bug report template',
    expansion: '**Summary:** \n**Steps to Reproduce:** \n1. \n2. \n**Expected:** \n**Actual:** ',
    category: 'Development',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10
  }
]

// Default custom vocabulary (teaches Whisper specific domain terms)
const SEED_VOCABULARY: CustomVocabularyItem[] = [
  { id: 'voc-1', term: 'VESPER', category: 'Product', addedAt: Date.now() },
  { id: 'voc-2', term: 'Groq', category: 'AI', addedAt: Date.now() },
  { id: 'voc-3', term: 'Whisper-large-v3', category: 'AI', addedAt: Date.now() },
  { id: 'voc-4', term: 'Llama 3.3', category: 'AI', addedAt: Date.now() },
  { id: 'voc-5', term: 'TypeScript', category: 'Dev', addedAt: Date.now() },
  { id: 'voc-6', term: 'TailwindCSS', category: 'Dev', addedAt: Date.now() },
  { id: 'voc-7', term: 'Vitest', category: 'Testing', addedAt: Date.now() },
  { id: 'voc-8', term: 'Electron', category: 'Architecture', addedAt: Date.now() }
]

// Default per-app polishing style profiles (signature VESPER feature)
const SEED_PROFILES: AppProfileStyle[] = [
  {
    id: 'prof-cursor',
    appName: 'Cursor & VS Code',
    appPattern: 'cursor|code|visual studio code',
    badgeColor: '#007acc',
    tone: 'Technical & Concise',
    formattingGuide: 'Code comments format, markdown symbols, precise technical terms, commit msg format when git mentioned.',
    enabled: true
  },
  {
    id: 'prof-slack',
    appName: 'Slack & Teams',
    appPattern: 'slack|teams|discord',
    badgeColor: '#ec4899',
    tone: 'Casual & Direct',
    formattingGuide: 'Friendly chat tone, concise sentences, natural punctuation, appropriate emojis when conversational.',
    enabled: true
  },
  {
    id: 'prof-gmail',
    appName: 'Gmail & Outlook',
    appPattern: 'gmail|outlook|mail',
    badgeColor: '#ea4335',
    tone: 'Professional & Courteous',
    formattingGuide: 'Polite business correspondence, clean paragraph breaks, proper salutations and sign-offs.',
    enabled: true
  },
  {
    id: 'prof-notion',
    appName: 'Notion & Obsidian',
    appPattern: 'notion|obsidian|notes',
    badgeColor: '#8b5cf6',
    tone: 'Structured Markdown',
    formattingGuide: 'Clean bullet points, bold key concepts, hierarchical structure, readable notes.',
    enabled: true
  },
  {
    id: 'prof-terminal',
    appName: 'Terminal & PowerShell',
    appPattern: 'powershell|cmd|bash|terminal|wt',
    badgeColor: '#10b981',
    tone: 'CLI Commands & Syntax',
    formattingGuide: 'Exact shell commands, single quotes for args, zero decorative punctuation or greetings.',
    enabled: true
  }
]

// Storage helpers with safe SSR/browser fallbacks
export const getHistory = (): DictationHistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(SEED_HISTORY))
      return SEED_HISTORY
    }
    return JSON.parse(raw)
  } catch {
    return SEED_HISTORY
  }
}

export const addHistoryItem = (item: Omit<DictationHistoryItem, 'id' | 'timestamp'>): DictationHistoryItem => {
  const fullItem: DictationHistoryItem = {
    ...item,
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now()
  }
  try {
    const existing = getHistory()
    const updated = [fullItem, ...existing].slice(0, 200) // Keep latest 200 items
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated))
    syncChannel?.postMessage({ type: 'HISTORY_CHANGED' })
  } catch {}
  return fullItem
}

export const deleteHistoryItem = (id: string): DictationHistoryItem[] => {
  try {
    const existing = getHistory()
    const updated = existing.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated))
    syncChannel?.postMessage({ type: 'HISTORY_CHANGED' })
    return updated
  } catch {
    return []
  }
}

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY)
    syncChannel?.postMessage({ type: 'HISTORY_CHANGED' })
  } catch {}
}

export const getSnippets = (): VoiceSnippet[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNIPPETS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(SEED_SNIPPETS))
      return SEED_SNIPPETS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_SNIPPETS
  }
}

export const saveSnippet = (snippet: Omit<VoiceSnippet, 'id' | 'createdAt'>): VoiceSnippet => {
  const full: VoiceSnippet = {
    ...snippet,
    id: `snip-${Date.now()}`,
    createdAt: Date.now()
  }
  try {
    const existing = getSnippets()
    const updated = [full, ...existing]
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(updated))
  } catch {}
  return full
}

export const deleteSnippet = (id: string): VoiceSnippet[] => {
  try {
    const existing = getSnippets()
    const updated = existing.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

export const getVocabulary = (): CustomVocabularyItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCABULARY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(SEED_VOCABULARY))
      return SEED_VOCABULARY
    }
    return JSON.parse(raw)
  } catch {
    return SEED_VOCABULARY
  }
}

export const addVocabularyWord = (term: string, category: string = 'General'): CustomVocabularyItem => {
  const full: CustomVocabularyItem = {
    id: `voc-${Date.now()}`,
    term: term.trim(),
    category,
    addedAt: Date.now()
  }
  try {
    const existing = getVocabulary()
    if (!existing.some((v) => v.term.toLowerCase() === term.toLowerCase())) {
      const updated = [full, ...existing]
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated))
    }
  } catch {}
  return full
}

export const deleteVocabularyWord = (id: string): CustomVocabularyItem[] => {
  try {
    const existing = getVocabulary()
    const updated = existing.filter((v) => v.id !== id)
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

export const getAppProfiles = (): AppProfileStyle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(SEED_PROFILES))
      return SEED_PROFILES
    }
    return JSON.parse(raw)
  } catch {
    return SEED_PROFILES
  }
}

export const updateAppProfile = (updated: AppProfileStyle): AppProfileStyle[] => {
  try {
    const existing = getAppProfiles()
    const list = existing.map((p) => (p.id === updated.id ? updated : p))
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(list))
    return list
  } catch {
    return []
  }
}
