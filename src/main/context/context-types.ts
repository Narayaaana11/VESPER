export type ContextEventType =
  | 'APPLICATION_CHANGED'
  | 'WINDOW_CHANGED'
  | 'PROJECT_CHANGED'
  | 'FILE_CHANGED'
  | 'BROWSER_CONTEXT_CHANGED'
  | 'VOICE_STARTED'
  | 'VOICE_FINISHED'
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'ACTION_EXECUTED'
  | 'ACTION_FAILED'
  | 'CONTEXT_UPDATED'

export type AppCategory =
  | 'code'
  | 'communication'
  | 'browser'
  | 'document'
  | 'terminal'
  | 'general'

export interface ContextSourceInfo {
  available: boolean
  confidence: number
  timestamp: number
  source: 'native_window' | 'title_parser' | 'clipboard' | 'event' | 'fallback'
}

export interface DeviceContext {
  activeApp: string
  windowTitle: string
  category: AppCategory
  projectWorkspace?: string
  activeFile?: string
  clipboardContent?: string
  url?: string
  timestamp: number
  confidence: number
  isProtected?: boolean
  hwnd?: number
  sourceInfo?: ContextSourceInfo
}

export interface ContextEvent {
  id: string
  type: ContextEventType
  timestamp: number
  context: DeviceContext
  payload?: any
}

export interface TaskRecord {
  taskId: string
  timestamp: number
  rawSpeech: string
  intent: {
    domain: string
    category: string
    action: string
  }
  requirements: string[]
  targetApp: string
  project?: string
  taskObject: any
  status: 'created' | 'executed' | 'failed'
}

export interface ContextRetrievalQuery {
  currentApp: string
  currentProject?: string
  speech?: string
  limit?: number
}

export interface ContextRetrievalResult {
  currentContext: DeviceContext
  recentTasks: TaskRecord[]
  relevantProjectTasks: TaskRecord[]
  recentEvents: ContextEvent[]
  matchedChainedTask?: TaskRecord
}

/**
 * Littlebird Evidence Standards & MCP Schema
 */
export interface LittlebirdReceipt {
  timestamp: string
  app: string
  title: string
  formatted: string // e.g. "[Monday, September 14, 2026 00:22 IST | Cursor | App.tsx]"
}

export interface LittlebirdTimelineEntry {
  id: string
  timestamp: number
  receipt: LittlebirdReceipt
  source: 'snapshots' | 'inputs' | 'messages' | 'tasks' | 'summaries'
  content: string
  score?: number
}

export interface SearchUserContextOptions {
  search_queries?: string[]
  standalone_query?: string
  app?: string
  data_source?: 'snapshots' | 'inputs' | 'messages' | 'tasks' | 'summaries' | 'all'
  date_range?: {
    start?: string | number
    end?: string | number
  }
  limit?: number
}

export interface SearchUserContextResult {
  tableOfContents: string[]
  entries: LittlebirdTimelineEntry[]
  totalMatches: number
}

export interface DayReconstructionResult {
  date: string
  sessionDurationHours: number
  summary: string
  appsUsage: { app: string; minutes: number }[]
  projectsTouched: string[]
  filesEdited: string[]
  tasksExecuted: { time: string; task: string; targetApp: string }[]
  decisionsMade: string[]
  changelogBlock: string
}
