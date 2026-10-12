import { ContextCollector } from './context-collector'
import { ContextEventBus } from './context-event-bus'
import { ContextStore } from './context-store'
import { ContextRetriever } from './context-retriever'
import { ContextRevalidator, ContextRevalidationResult } from './context-revalidator'
import { ScreenTracker, ScreenActivityRecord } from './screen-tracker'
import {
  DeviceContext,
  ContextRetrievalQuery,
  ContextRetrievalResult,
  TaskRecord,
  SearchUserContextOptions,
  SearchUserContextResult,
  DayReconstructionResult
} from './context-types'

export class ContextManager {
  private static instance: ContextManager | null = null
  private store: ContextStore
  private eventBus: ContextEventBus
  private retriever: ContextRetriever
  private lastContext: DeviceContext | null = null
  private pollInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.store = ContextStore.getInstance()
    this.eventBus = ContextEventBus.getInstance()
    this.retriever = new ContextRetriever(this.store, this.eventBus)
  }

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager()
    }
    return ContextManager.instance
  }

  public async initialize(): Promise<void> {
    await this.store.initialize()

    // Capture initial context
    this.lastContext = await ContextCollector.collect()
    this.eventBus.publish('CONTEXT_UPDATED', this.lastContext)

    // Start ambient screen tracking (Screenpipe / Littlebird style)
    ScreenTracker.getInstance().start(20000)

    // Monitor for active window changes periodically
    this.startBackgroundMonitor()
  }

  private startBackgroundMonitor(): void {
    if (this.pollInterval) clearInterval(this.pollInterval)

    this.pollInterval = setInterval(async () => {
      try {
        const current = await ContextCollector.collect()
        if (
          !this.lastContext ||
          current.activeApp !== this.lastContext.activeApp ||
          current.windowTitle !== this.lastContext.windowTitle
        ) {
          const prev = this.lastContext
          this.lastContext = current

          if (prev && prev.activeApp !== current.activeApp) {
            this.eventBus.publish('APPLICATION_CHANGED', current, {
              previousApp: prev.activeApp
            })
          } else {
            this.eventBus.publish('WINDOW_CHANGED', current)
          }

          if (current.projectWorkspace && (!prev || prev.projectWorkspace !== current.projectWorkspace)) {
            this.eventBus.publish('PROJECT_CHANGED', current)
          }

          this.store.insertEvent({
            id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'CONTEXT_UPDATED',
            timestamp: Date.now(),
            context: current
          })
        }
      } catch {
        // Silently catch background poll errors
      }
    }, 1500)
  }

  public async getCurrentContext(): Promise<DeviceContext> {
    const fresh = await ContextCollector.collect()
    this.lastContext = fresh
    return fresh
  }

  public async queryContext(query?: ContextRetrievalQuery): Promise<ContextRetrievalResult> {
    const current = await this.getCurrentContext()
    return await this.retriever.retrieve(current, query)
  }

  public searchUserContext(options: SearchUserContextOptions = {}): SearchUserContextResult {
    return this.store.searchUserContext(options)
  }

  public getDayReconstruction(targetDateMs?: number): DayReconstructionResult {
    return this.store.getDayReconstruction(targetDateMs)
  }

  public recordVoiceEvent(type: 'VOICE_STARTED' | 'VOICE_FINISHED', payload?: any): void {
    if (this.lastContext) {
      const event = this.eventBus.publish(type, this.lastContext, payload)
      this.store.insertEvent(event)
    }
  }

  public recordTask(task: TaskRecord): void {
    this.store.recordTask(task)
    if (this.lastContext) {
      this.eventBus.publish('TASK_CREATED', this.lastContext, { taskId: task.taskId })
    }
  }

  public recordTaskCompletion(taskId: string, status: 'executed' | 'failed'): void {
    this.store.updateTaskStatus(taskId, status)
    if (this.lastContext) {
      const type = status === 'executed' ? 'TASK_COMPLETED' : 'ACTION_FAILED'
      this.eventBus.publish(type, this.lastContext, { taskId })
    }
  }

  public async revalidateBeforeAction(
    targetContext: DeviceContext
  ): Promise<ContextRevalidationResult> {
    return await ContextRevalidator.revalidate(targetContext)
  }

  public getScreenActivities(limit = 20): ScreenActivityRecord[] {
    return ScreenTracker.getInstance().getRecentActivities(limit)
  }

  public toggleScreenTracker(enable?: boolean): boolean {
    const tracker = ScreenTracker.getInstance()
    const shouldEnable = enable !== undefined ? enable : !tracker.isEnabled()
    if (shouldEnable) {
      tracker.start(20000)
    } else {
      tracker.stop()
    }
    return tracker.isEnabled()
  }

  public isScreenTrackerEnabled(): boolean {
    return ScreenTracker.getInstance().isEnabled()
  }

  public destroy(): void {
    ScreenTracker.getInstance().stop()
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    this.store.saveToDisk()
  }
}
