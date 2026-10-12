import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SubscriptionService } from '../../src/renderer/src/core/subscription-service'
import { VesperMcpServer } from '../../src/main/mcp/vesper-mcp-server'
import { ContextStore } from '../../src/main/context/context-store'
import { executeAction } from '../../src/main/action-executor'

describe('VESPER Commercial Release & Companion API', () => {
  const mockStorage: Record<string, string> = {}
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k])
    globalThis.localStorage = {
      getItem: (k: string) => mockStorage[k] || null,
      setItem: (k: string, v: string) => {
        mockStorage[k] = v
      },
      removeItem: (k: string) => {
        delete mockStorage[k]
      },
      clear: () => {
        Object.keys(mockStorage).forEach((k) => delete mockStorage[k])
      }
    } as any
  })

  describe('SubscriptionService', () => {

    it('defaults to active Free tier with standard features', () => {
      const sub = SubscriptionService.getSubscription()
      expect(sub.tier).toBe('free')
      expect(sub.isActive).toBe(true)
      expect(sub.features.editMode).toBe(true)
      expect(sub.features.unlimitedRag).toBe(false)
    })

    it('rejects invalid license key formats', async () => {
      const res = await SubscriptionService.activateLicense('INVALID-KEY')
      expect(res.success).toBe(false)
      expect(res.message).toContain('Invalid license key format')
    })

    it('activates Pro tier with valid VESPER-PRO-XXXX key', async () => {
      const res = await SubscriptionService.activateLicense('VESPER-PRO-ABCD-1234')
      expect(res.success).toBe(true)
      expect(res.status?.tier).toBe('pro')
      expect(res.status?.features.unlimitedRag).toBe(true)
      expect(res.status?.features.fastGroqLpu).toBe(true)

      const active = SubscriptionService.getSubscription()
      expect(active.tier).toBe('pro')
      expect(active.licenseKey).toBe('VESPER-PRO-ABCD-1234')
    })

    it('activates Enterprise tier with valid VESPER-ENT-XXXX key', async () => {
      const res = await SubscriptionService.activateLicense('VESPER-ENT-CORP-9999')
      expect(res.success).toBe(true)
      expect(res.status?.tier).toBe('enterprise')
      expect(res.status?.features.zeroRetentionPrivacy).toBe(true)
    })

    it('resets subscription back to Free tier on demand', async () => {
      await SubscriptionService.activateLicense('VESPER-PRO-ABCD-1234')
      const reset = SubscriptionService.resetToFree()
      expect(reset.tier).toBe('free')
      expect(SubscriptionService.getSubscription().tier).toBe('free')
    })
  })

  describe('Companion Context Feed & MCP Server Ingestion', () => {
    let mcpServer: VesperMcpServer
    let contextStore: ContextStore

    beforeEach(async () => {
      contextStore = ContextStore.getInstance()
      await contextStore.initialize()
      mcpServer = VesperMcpServer.getInstance()
    })

    it('ingests external IDE context payload and updates store event', async () => {
      const result = await mcpServer.ingestExternalContext({
        source: 'vscode',
        file: 'PricingTable.tsx',
        filePath: 'C:/src/components/PricingTable.tsx',
        project: 'VESPER',
        cursor: { line: 42, col: 10 },
        selection: 'export const PricingTable'
      })

      expect(result.activeApp).toBe('VS Code')
      expect(result.file).toBe('C:/src/components/PricingTable.tsx')
      expect(result.project).toBe('VESPER')

      // Verify event was saved to SQLite
      const recentEvents = contextStore.getRecentEvents(5)
      const ideEvent = recentEvents.find((e) => e.source === 'ide_extension' || e.activeApp === 'VS Code')
      expect(ideEvent).toBeDefined()
      expect(ideEvent.project).toBe('VESPER')
    })

    it('supports browser context feed with URL and domain categorization', async () => {
      const result = await mcpServer.ingestExternalContext({
        source: 'chrome',
        url: 'https://internal.vesper.dev/workspace',
        selection: 'VESPER Workspace'
      })

      expect(result.activeApp).toBe('Google Chrome')
      const recentEvents = contextStore.getRecentEvents(5)
      const chromeEvent = recentEvents.find((e) => e.activeApp === 'Google Chrome')
      expect(chromeEvent).toBeDefined()
    })
  })

  describe('User Preference Storage in ContextStore', () => {
    it('saves and retrieves user preferences cleanly in SQLite', async () => {
      const store = ContextStore.getInstance()
      await store.initialize()

      store.setUserPreference('test_pref', 'active_test_val')
      const val = store.getUserPreference('test_pref')
      expect(val).toBe('active_test_val')

      store.setUserPreference('test_pref', 'updated_val')
      expect(store.getUserPreference('test_pref')).toBe('updated_val')
    })
  })

  describe('Cross-Platform Action Executor Safety', () => {
    it('executes without crashing on current OS platform', async () => {
      const res = await executeAction('Hello from cross-platform test', false)
      expect(res.success).toBe(true)
      expect(res.actionType).toBe('clipboard')
    })
  })
})
