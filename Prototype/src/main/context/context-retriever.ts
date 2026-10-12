import { ContextRetrievalQuery, ContextRetrievalResult, DeviceContext, TaskRecord } from './context-types'
import { ContextStore } from './context-store'
import { ContextEventBus } from './context-event-bus'

export class ContextRetriever {
  private store: ContextStore
  private eventBus: ContextEventBus

  constructor(store = ContextStore.getInstance(), eventBus = ContextEventBus.getInstance()) {
    this.store = store
    this.eventBus = eventBus
  }

  public async retrieve(
    currentContext: DeviceContext,
    query?: ContextRetrievalQuery
  ): Promise<ContextRetrievalResult> {
    const limit = query?.limit ?? 5
    const recentTasks = this.store.getRecentTasks(limit)
    const projectTasks = currentContext.projectWorkspace
      ? this.store.getTasksByProject(currentContext.projectWorkspace, limit)
      : []

    const recentEvents = this.eventBus.getRecentEvents(10)

    // Identify if the query is referring to an active previous task (Chaining)
    const matchedChainedTask = this.findChainedTask(
      query?.speech,
      currentContext,
      recentTasks
    )

    return {
      currentContext,
      recentTasks,
      relevantProjectTasks: projectTasks,
      recentEvents,
      matchedChainedTask
    }
  }

  /**
   * Evaluates whether the incoming speech refers to the previous task
   */
  public findChainedTask(
    speech: string | undefined,
    currentContext: DeviceContext,
    recentTasks: TaskRecord[]
  ): TaskRecord | undefined {
    if (!speech || recentTasks.length === 0) return undefined

    const s = speech.toLowerCase().trim()
    const latestTask = recentTasks[0]

    // Time window: only chain tasks created within the last 15 minutes
    const isRecent = Date.now() - latestTask.timestamp < 15 * 60 * 1000
    if (!isRecent) return undefined

    // Explicit anaphoric pronouns or follow-up connectors
    const anaphoricMarkers = [
      /\b(it|that|this|them)\b/i,
      /\b(also|too|as well)\b/i,
      /\b(add|make|change|update|fix|improve|refactor)\s+(the|a)\b/i,
      /\b(more|continue|next)\b/i,
      /\b(instead|rather)\b/i
    ]

    const hasAnaphoricMarker = anaphoricMarkers.some((pattern) => pattern.test(s))

    // Same application or workspace check
    const sameApp = latestTask.targetApp.toLowerCase() === currentContext.activeApp.toLowerCase()
    const sameProject =
      latestTask.project && currentContext.projectWorkspace
        ? latestTask.project.toLowerCase() === currentContext.projectWorkspace.toLowerCase()
        : false

    if (hasAnaphoricMarker && (sameApp || sameProject)) {
      return latestTask
    }

    // Keyword overlap check between speech and previous requirements / specs
    const previousKeywords = this.extractKeywords(latestTask.rawSpeech)
    const currentKeywords = this.extractKeywords(s)
    const shared = previousKeywords.filter((k) => currentKeywords.includes(k))

    if (shared.length > 0 && (sameApp || isRecent)) {
      return latestTask
    }

    return undefined
  }

  private extractKeywords(text: string): string[] {
    const stopwords = new Set([
      'the', 'and', 'for', 'with', 'that', 'this', 'have', 'from', 'build', 'create',
      'make', 'some', 'what', 'when', 'where', 'your', 'please', 'into'
    ])
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopwords.has(w))
  }
}
