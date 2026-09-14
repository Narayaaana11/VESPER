import { describe, it, expect, beforeEach } from 'vitest'
import { ContextNormalizer } from '../../src/main/context/context-normalizer'
import { PrivacyShield } from '../../src/main/context/privacy-shield'
import { ContextEventBus } from '../../src/main/context/context-event-bus'
import { ContextStore } from '../../src/main/context/context-store'
import { ContextRetriever } from '../../src/main/context/context-retriever'
import { DeviceContext, TaskRecord } from '../../src/main/context/context-types'

describe('Central Context Engine', () => {
  describe('ContextNormalizer & Categorization', () => {
    it('normalizes code editor processes and extracts file and project', () => {
      const normalized = ContextNormalizer.normalize({
        processName: 'code',
        windowTitle: 'App.tsx - VayroApp - Visual Studio Code',
        clipboardText: 'const x = 10;'
      })

      expect(normalized.activeApp).toBe('VS Code')
      expect(normalized.category).toBe('code')
      expect(normalized.projectWorkspace).toBe('VayroApp')
      expect(normalized.activeFile).toBe('App.tsx')
      expect(normalized.clipboardContent).toBe('const x = 10;')
      expect(normalized.isProtected).toBeFalsy()
    })

    it('categorizes communication apps and email titles correctly', () => {
      const slack = ContextNormalizer.normalize({
        processName: 'slack',
        windowTitle: '#general - Engineering'
      })
      expect(slack.activeApp).toBe('Slack')
      expect(slack.category).toBe('communication')

      const gmail = ContextNormalizer.normalize({
        processName: 'chrome',
        windowTitle: 'Inbox (5) - user@gmail.com - Google Chrome'
      })
      expect(gmail.category).toBe('communication')
    })
  })

  describe('PrivacyShield', () => {
    it('redacts password managers and sensitive titles', () => {
      const bitwarden = ContextNormalizer.normalize({
        processName: 'bitwarden',
        windowTitle: 'Bitwarden - Vault'
      })
      expect(bitwarden.isProtected).toBe(true)
      expect(bitwarden.windowTitle).toBe('[Protected Application]')
      expect(bitwarden.clipboardContent).toBeUndefined()
    })

    it('redacts sensitive private keys from clipboard', () => {
      const sensitiveClip = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...'
      const normalized = ContextNormalizer.normalize({
        processName: 'notepad',
        windowTitle: 'keys.txt - Notepad',
        clipboardText: sensitiveClip
      })
      expect(normalized.clipboardContent).toBe('[Protected Content]')
    })
  })

  describe('ContextEventBus', () => {
    it('publishes and receives typed context events', () => {
      const bus = ContextEventBus.getInstance()
      bus.clear()

      let receivedEvent: any = null
      const unsub = bus.onEvent('APPLICATION_CHANGED', (evt) => {
        receivedEvent = evt
      })

      const dummyContext: DeviceContext = {
        activeApp: 'Cursor',
        windowTitle: 'main.ts - Vayro',
        category: 'code',
        timestamp: Date.now(),
        confidence: 0.95
      }

      bus.publish('APPLICATION_CHANGED', dummyContext, { previousApp: 'Chrome' })

      expect(receivedEvent).not.toBeNull()
      expect(receivedEvent.type).toBe('APPLICATION_CHANGED')
      expect(receivedEvent.context.activeApp).toBe('Cursor')
      expect(receivedEvent.payload.previousApp).toBe('Chrome')

      unsub()
    })
  })

  describe('ContextStore (Local SQLite Store)', () => {
    let store: ContextStore

    beforeEach(async () => {
      store = ContextStore.getInstance()
      await store.initialize()
    })

    it('records and queries task history with project mapping', async () => {
      const sampleTask: TaskRecord = {
        taskId: 'task_test_123',
        timestamp: Date.now(),
        rawSpeech: 'Build a restaurant website',
        intent: {
          domain: 'coding',
          category: 'development',
          action: 'create_project'
        },
        requirements: ['restaurant website', 'responsive'],
        targetApp: 'Cursor',
        project: 'RestaurantPro',
        taskObject: { goal: 'restaurant website' },
        status: 'created'
      }

      store.recordTask(sampleTask)

      const recent = store.getRecentTasks(5)
      expect(recent.length).toBeGreaterThan(0)
      const found = recent.find((t) => t.taskId === 'task_test_123')
      expect(found).toBeDefined()
      expect(found?.rawSpeech).toBe('Build a restaurant website')
      expect(found?.project).toBe('RestaurantPro')

      const projectTasks = store.getTasksByProject('RestaurantPro', 5)
      expect(projectTasks.length).toBeGreaterThan(0)
      expect(projectTasks[0].taskId).toBe('task_test_123')
    })

    it('updates task execution status correctly', () => {
      store.updateTaskStatus('task_test_123', 'executed')
      const recent = store.getRecentTasks(5)
      const found = recent.find((t) => t.taskId === 'task_test_123')
      expect(found?.status).toBe('executed')
    })
  })

  describe('ContextRetriever & Real Context Chaining', () => {
    it('detects anaphoric chaining when follow-up speech says "Make it dark"', async () => {
      const store = ContextStore.getInstance()
      await store.initialize()

      const task1: TaskRecord = {
        taskId: 'task_chain_1',
        timestamp: Date.now(),
        rawSpeech: 'Build a restaurant website',
        intent: { domain: 'coding', category: 'development', action: 'create_project' },
        requirements: ['restaurant website'],
        targetApp: 'Cursor',
        project: 'RestaurantPro',
        taskObject: { goal: 'restaurant website' },
        status: 'executed'
      }
      store.recordTask(task1)

      const retriever = new ContextRetriever(store, ContextEventBus.getInstance())

      const currentContext: DeviceContext = {
        activeApp: 'Cursor',
        windowTitle: 'App.tsx - RestaurantPro - Cursor',
        category: 'code',
        projectWorkspace: 'RestaurantPro',
        timestamp: Date.now(),
        confidence: 0.95
      }

      const result = await retriever.retrieve(currentContext, {
        currentApp: 'Cursor',
        speech: 'Make it dark'
      })

      expect(result.matchedChainedTask).toBeDefined()
      expect(result.matchedChainedTask?.taskId).toBe('task_chain_1')
      expect(result.matchedChainedTask?.rawSpeech).toBe('Build a restaurant website')
    })

    it('detects follow-up when speech adds section "Add reservations"', async () => {
      const store = ContextStore.getInstance()
      const retriever = new ContextRetriever(store, ContextEventBus.getInstance())

      const currentContext: DeviceContext = {
        activeApp: 'Cursor',
        windowTitle: 'App.tsx - RestaurantPro - Cursor',
        category: 'code',
        projectWorkspace: 'RestaurantPro',
        timestamp: Date.now(),
        confidence: 0.95
      }

      const result = await retriever.retrieve(currentContext, {
        currentApp: 'Cursor',
        speech: 'Add the reservation section'
      })

      expect(result.matchedChainedTask).toBeDefined()
      expect(result.matchedChainedTask?.taskId).toBe('task_chain_1')
    })

    it('computes accurate stats and returns recent events for audit verification', async () => {
      const store = ContextStore.getInstance()
      store.insertEvent({
        id: 'evt_audit_stat_1',
        type: 'ACTION_EXECUTED',
        timestamp: Date.now(),
        context: {
          activeApp: 'Cursor',
          windowTitle: 'audit.ts',
          category: 'code',
          timestamp: Date.now(),
          confidence: 0.95
        }
      })

      const stats = store.getStats()
      expect(stats.taskCount).toBeGreaterThanOrEqual(1)
      expect(stats.eventCount).toBeGreaterThanOrEqual(1)

      const events = store.getRecentEvents(5)
      expect(events.length).toBeGreaterThanOrEqual(1)
      expect(events[0].id).toBeDefined()
    })
  })
})
