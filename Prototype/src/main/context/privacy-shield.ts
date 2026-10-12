import { DeviceContext } from './context-types'

const SENSITIVE_PROCESSES = [
  '1password',
  'bitwarden',
  'keepass',
  'keepassxc',
  'lastpass',
  'dashlane',
  'enpass',
  'authenticator',
  'windows security',
  'credentialmanager'
]

const SENSITIVE_TITLE_KEYWORDS = [
  'password',
  'master password',
  'bitwarden',
  '1password',
  'keepass',
  'bank of america',
  'chase online',
  'wells fargo',
  'citibank',
  'paypal',
  'stripe dashboard',
  'crypto',
  'metamask',
  'ledger live'
]

const SENSITIVE_CLIPBOARD_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /gsk_[a-zA-Z0-9]{32,}/,
  /sk-[a-zA-Z0-9]{32,}/,
  /\b[A-Za-z0-9+/]{40,}={0,2}\b/, // High entropy base64 tokens
  /\b(?:\d[ -]*?){13,16}\b/ // Credit card format
]

export class PrivacyShield {
  private static userExclusions: Set<string> = new Set()
  private static userExcludedFolders: Set<string> = new Set()
  private static userExcludedDomains: Set<string> = new Set()
  private static isContextCollectionPaused = false

  public static setPaused(paused: boolean): void {
    PrivacyShield.isContextCollectionPaused = paused
  }

  public static isPaused(): boolean {
    return PrivacyShield.isContextCollectionPaused
  }

  public static addExclusion(appName: string): void {
    PrivacyShield.userExclusions.add(appName.toLowerCase().trim())
  }

  public static removeExclusion(appName: string): void {
    PrivacyShield.userExclusions.delete(appName.toLowerCase().trim())
  }

  public static setExclusions(apps: string[]): void {
    PrivacyShield.userExclusions = new Set(apps.map((a) => a.toLowerCase().trim()))
  }

  public static getExclusions(): string[] {
    return Array.from(PrivacyShield.userExclusions)
  }

  public static addExcludedFolder(folderPath: string): void {
    PrivacyShield.userExcludedFolders.add(folderPath.toLowerCase().trim())
  }

  public static setExcludedFolders(folders: string[]): void {
    PrivacyShield.userExcludedFolders = new Set(folders.map((f) => f.toLowerCase().trim()))
  }

  public static getExcludedFolders(): string[] {
    return Array.from(PrivacyShield.userExcludedFolders)
  }

  public static setExcludedDomains(domains: string[]): void {
    PrivacyShield.userExcludedDomains = new Set(domains.map((d) => d.toLowerCase().trim()))
  }

  public static getExcludedDomains(): string[] {
    return Array.from(PrivacyShield.userExcludedDomains)
  }

  public static scrubContent(text: string): string {
    if (!text) return ''
    let scrubbed = text.replace(/(?:password|passwd|pwd)[\s:=]+([^\s,;]+)/gi, 'password: [REDACTED_PASSWORD]')
    scrubbed = scrubbed.replace(/(?:gsk_|sk-|ghp_|glpat-)[a-zA-Z0-9_\-]{16,}/g, '[REDACTED_TOKEN]')
    scrubbed = scrubbed.replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]')
    return scrubbed
  }

  public static isAppExcluded(appName: string): boolean {
    const norm = (appName || '').toLowerCase()
    return (
      SENSITIVE_PROCESSES.some((p) => norm.includes(p)) ||
      PrivacyShield.userExclusions.has(norm)
    )
  }

  public static isTitleSensitive(title: string): boolean {
    const norm = (title || '').toLowerCase()
    return SENSITIVE_TITLE_KEYWORDS.some((kw) => norm.includes(kw))
  }

  public static isClipboardSensitive(text: string): boolean {
    if (!text || text.length === 0) return false
    return SENSITIVE_CLIPBOARD_PATTERNS.some((regex) => regex.test(text))
  }

  public static sanitizeContext(rawContext: DeviceContext): DeviceContext {
    if (PrivacyShield.isPaused()) {
      return {
        ...rawContext,
        windowTitle: '[Context Collection Paused]',
        clipboardContent: undefined,
        isProtected: true,
        projectWorkspace: undefined,
        activeFile: undefined
      }
    }

    const folderExcluded = rawContext.projectWorkspace
      ? Array.from(PrivacyShield.userExcludedFolders).some((f) =>
          rawContext.projectWorkspace?.toLowerCase().includes(f)
        )
      : false

    const domainExcluded = rawContext.url
      ? Array.from(PrivacyShield.userExcludedDomains).some((d) =>
          rawContext.url?.toLowerCase().includes(d)
        )
      : false

    const isExcluded =
      PrivacyShield.isAppExcluded(rawContext.activeApp) ||
      PrivacyShield.isTitleSensitive(rawContext.windowTitle) ||
      folderExcluded ||
      domainExcluded

    const isClipSensitive = rawContext.clipboardContent
      ? PrivacyShield.isClipboardSensitive(rawContext.clipboardContent)
      : false

    if (isExcluded) {
      return {
        ...rawContext,
        windowTitle: '[Protected Application]',
        clipboardContent: undefined,
        isProtected: true,
        projectWorkspace: undefined,
        activeFile: undefined
      }
    }

    if (isClipSensitive) {
      return {
        ...rawContext,
        clipboardContent: '[Protected Content]',
        isProtected: false
      }
    }

    return rawContext
  }

  public static sanitizeSpeech(text: string): string {
    let result = text || ''
    result = result.replace(/gsk_[a-zA-Z0-9]{20,}/g, '[REDACTED_API_KEY]')
    result = result.replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_API_KEY]')
    result = result.replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_CREDIT_CARD]')
    return result
  }
}
