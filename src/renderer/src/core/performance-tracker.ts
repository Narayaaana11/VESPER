export interface PerformanceBreakdown {
  sttMs?: number
  contextCollectionMs?: number
  contextRetrievalMs?: number
  aiReasoningMs?: number
  taskGenerationMs?: number
  actionExecutionMs?: number
  totalMs: number
}

export class PerformanceTracker {
  private static marks: Map<string, Record<string, number>> = new Map()

  public static start(id = 'interaction'): void {
    this.marks.set(id, { start: performance.now() })
  }

  public static mark(stage: string, id = 'interaction'): void {
    const record = this.marks.get(id)
    if (record) {
      record[stage] = performance.now()
    }
  }

  public static stop(id = 'interaction'): PerformanceBreakdown {
    const record = this.marks.get(id)
    const now = performance.now()
    if (!record || !record.start) {
      return { totalMs: 0 }
    }

    const totalMs = Math.round(now - record.start)
    const breakdown: PerformanceBreakdown = { totalMs }

    if (record.stt_start && record.stt_end) {
      breakdown.sttMs = Math.round(record.stt_end - record.stt_start)
    }
    if (record.context_start && record.context_end) {
      breakdown.contextRetrievalMs = Math.round(record.context_end - record.context_start)
    }
    if (record.ai_start && record.ai_end) {
      breakdown.aiReasoningMs = Math.round(record.ai_end - record.ai_start)
    }
    if (record.task_start && record.task_end) {
      breakdown.taskGenerationMs = Math.round(record.task_end - record.task_start)
    }
    if (record.action_start && record.action_end) {
      breakdown.actionExecutionMs = Math.round(record.action_end - record.action_start)
    }

    console.log(`[QEVRA Performance Metrics]:`, breakdown)
    this.marks.delete(id)
    return breakdown
  }
}
