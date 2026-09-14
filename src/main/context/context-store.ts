import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import initSqlJs, { Database, SqlJsStatic } from 'sql.js'
import {
  ContextEvent,
  TaskRecord,
  SearchUserContextOptions,
  SearchUserContextResult,
  DayReconstructionResult,
  LittlebirdReceipt,
  LittlebirdTimelineEntry
} from './context-types'

export class ContextStore {
  private static instance: ContextStore | null = null
  private db: Database | null = null
  private SQL: SqlJsStatic | null = null
  private dbPath: string = ''
  private initPromise: Promise<void> | null = null
  private saveDebounceTimer: NodeJS.Timeout | null = null

  private constructor() {
    this.dbPath = this.resolveDbPath()
  }

  public static getInstance(): ContextStore {
    if (!ContextStore.instance) {
      ContextStore.instance = new ContextStore()
    }
    return ContextStore.instance
  }

  private resolveDbPath(): string {
    try {
      if (typeof app !== 'undefined' && app.getPath) {
        return path.join(app.getPath('userData'), 'vayro-context.sqlite')
      }
    } catch {}
    const baseDir = process.env.APPDATA || process.env.HOME || process.cwd()
    return path.join(baseDir, '.qevra', 'vayro-context.sqlite')
  }

  public async initialize(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      try {
        this.SQL = await initSqlJs()

        const dir = path.dirname(this.dbPath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }

        if (fs.existsSync(this.dbPath)) {
          const buffer = fs.readFileSync(this.dbPath)
          this.db = new this.SQL.Database(buffer)
        } else {
          this.db = new this.SQL.Database()
        }

        this.createSchema()
        this.pruneOldRecords(7) // Prune records older than 7 days
      } catch (err) {
        console.error('[QEVRA ContextStore] SQLite initialization failed:', err)
        // Fallback to in-memory database
        if (this.SQL) {
          this.db = new this.SQL.Database()
          this.createSchema()
        }
      }
    })()

    return this.initPromise
  }

  private createSchema(): void {
    if (!this.db) return

    this.db.run(`
      CREATE TABLE IF NOT EXISTS context_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        source TEXT NOT NULL,
        active_app TEXT NOT NULL,
        window_title TEXT,
        project_workspace TEXT,
        payload_json TEXT,
        timestamp INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_events_timestamp ON context_events(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_events_project ON context_events(project_workspace);

      CREATE TABLE IF NOT EXISTS task_history (
        task_id TEXT PRIMARY KEY,
        raw_speech TEXT NOT NULL,
        intent_domain TEXT NOT NULL,
        intent_category TEXT NOT NULL,
        intent_action TEXT NOT NULL,
        active_app TEXT NOT NULL,
        project TEXT,
        full_task_json TEXT NOT NULL,
        execution_status TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_timestamp ON task_history(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_tasks_project ON task_history(project);

      CREATE TABLE IF NOT EXISTS project_workspaces (
        id TEXT PRIMARY KEY,
        project_name TEXT NOT NULL UNIQUE,
        root_path TEXT,
        last_active_app TEXT,
        last_active_file TEXT,
        last_active_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS context_summaries (
        id TEXT PRIMARY KEY,
        scope TEXT NOT NULL,
        summary_text TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `)
  }

  public insertEvent(event: ContextEvent): void {
    if (!this.db) return
    try {
      this.db.run(
        `INSERT OR REPLACE INTO context_events (id, event_type, source, active_app, window_title, project_workspace, payload_json, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.type,
          event.context.sourceInfo?.source || 'native_window',
          event.context.activeApp,
          event.context.windowTitle,
          event.context.projectWorkspace || null,
          event.payload ? JSON.stringify(event.payload) : null,
          event.timestamp
        ]
      )

      if (event.context.projectWorkspace) {
        this.updateProjectWorkspace(
          event.context.projectWorkspace,
          event.context.activeApp,
          event.context.activeFile
        )
      }

      this.scheduleDiskSave()
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error inserting event:', err)
    }
  }

  public recordTask(task: TaskRecord): void {
    if (!this.db) return
    try {
      this.db.run(
        `INSERT OR REPLACE INTO task_history (task_id, raw_speech, intent_domain, intent_category, intent_action, active_app, project, full_task_json, execution_status, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.taskId,
          task.rawSpeech,
          task.intent.domain,
          task.intent.category,
          task.intent.action,
          task.targetApp,
          task.project || null,
          JSON.stringify(task.taskObject),
          task.status,
          task.timestamp
        ]
      )
      this.scheduleDiskSave()
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error recording task:', err)
    }
  }

  public updateTaskStatus(taskId: string, status: 'executed' | 'failed'): void {
    if (!this.db) return
    try {
      this.db.run(`UPDATE task_history SET execution_status = ? WHERE task_id = ?`, [
        status,
        taskId
      ])
      this.scheduleDiskSave()
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error updating task status:', err)
    }
  }

  public updateProjectWorkspace(projectName: string, activeApp?: string, activeFile?: string): void {
    if (!this.db || !projectName) return
    try {
      this.db.run(
        `INSERT INTO project_workspaces (id, project_name, last_active_app, last_active_file, last_active_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(project_name) DO UPDATE SET
           last_active_app = excluded.last_active_app,
           last_active_file = excluded.last_active_file,
           last_active_at = excluded.last_active_at`,
        [`proj_${projectName}`, projectName, activeApp || null, activeFile || null, Date.now()]
      )
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error updating project:', err)
    }
  }

  public getRecentTasks(limit = 10): TaskRecord[] {
    if (!this.db) return []
    try {
      const stmt = this.db.prepare(
        `SELECT task_id, raw_speech, intent_domain, intent_category, intent_action, active_app, project, full_task_json, execution_status, timestamp
         FROM task_history
         ORDER BY timestamp DESC
         LIMIT ?`
      )
      stmt.bind([limit])
      const results: TaskRecord[] = []
      while (stmt.step()) {
        const row = stmt.getAsObject()
        results.push({
          taskId: row.task_id as string,
          rawSpeech: row.raw_speech as string,
          intent: {
            domain: row.intent_domain as string,
            category: row.intent_category as string,
            action: row.intent_action as string
          },
          requirements: [],
          targetApp: row.active_app as string,
          project: (row.project as string) || undefined,
          taskObject: row.full_task_json ? JSON.parse(row.full_task_json as string) : {},
          status: row.execution_status as any,
          timestamp: row.timestamp as number
        })
      }
      stmt.free()
      return results
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error fetching recent tasks:', err)
      return []
    }
  }

  public getRecentEvents(limit = 20): any[] {
    if (!this.db) return []
    try {
      const stmt = this.db.prepare(
        `SELECT id, event_type, source, active_app, window_title, project_workspace, payload_json, timestamp
         FROM context_events
         ORDER BY timestamp DESC
         LIMIT ?`
      )
      stmt.bind([limit])
      const results: any[] = []
      while (stmt.step()) {
        const row = stmt.getAsObject()
        results.push({
          id: row.id,
          type: row.event_type,
          source: row.source,
          activeApp: row.active_app,
          windowTitle: row.window_title,
          project: row.project_workspace,
          payload: row.payload_json ? JSON.parse(row.payload_json as string) : null,
          timestamp: row.timestamp
        })
      }
      stmt.free()
      return results
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error fetching recent events:', err)
      return []
    }
  }

  public getStats(): {
    eventCount: number
    taskCount: number
    projectCount: number
    dbSizeBytes: number
  } {
    if (!this.db) {
      return { eventCount: 0, taskCount: 0, projectCount: 0, dbSizeBytes: 0 }
    }
    try {
      let eventCount = 0
      let taskCount = 0
      let projectCount = 0

      const r1 = this.db.exec(`SELECT COUNT(*) as c FROM context_events`)
      if (r1 && r1[0] && r1[0].values && r1[0].values[0]) {
        eventCount = Number(r1[0].values[0][0])
      }

      const r2 = this.db.exec(`SELECT COUNT(*) as c FROM task_history`)
      if (r2 && r2[0] && r2[0].values && r2[0].values[0]) {
        taskCount = Number(r2[0].values[0][0])
      }

      const r3 = this.db.exec(`SELECT COUNT(*) as c FROM project_workspaces`)
      if (r3 && r3[0] && r3[0].values && r3[0].values[0]) {
        projectCount = Number(r3[0].values[0][0])
      }

      let dbSizeBytes = 0
      if (this.dbPath && fs.existsSync(this.dbPath)) {
        dbSizeBytes = fs.statSync(this.dbPath).size
      }

      return { eventCount, taskCount, projectCount, dbSizeBytes }
    } catch {
      return { eventCount: 0, taskCount: 0, projectCount: 0, dbSizeBytes: 0 }
    }
  }

  public getTasksByProject(project: string, limit = 5): TaskRecord[] {
    if (!this.db || !project) return []
    try {
      const stmt = this.db.prepare(
        `SELECT task_id, raw_speech, intent_domain, intent_category, intent_action, active_app, project, full_task_json, execution_status, timestamp
         FROM task_history
         WHERE project = ?
         ORDER BY timestamp DESC
         LIMIT ?`
      )
      stmt.bind([project, limit])
      const results: TaskRecord[] = []
      while (stmt.step()) {
        const row = stmt.getAsObject()
        results.push({
          taskId: row.task_id as string,
          rawSpeech: row.raw_speech as string,
          intent: {
            domain: row.intent_domain as string,
            category: row.intent_category as string,
            action: row.intent_action as string
          },
          requirements: [],
          targetApp: row.active_app as string,
          project: (row.project as string) || undefined,
          taskObject: row.full_task_json ? JSON.parse(row.full_task_json as string) : {},
          status: row.execution_status as any,
          timestamp: row.timestamp as number
        })
      }
      stmt.free()
      return results
    } catch (err) {
      return []
    }
  }

  /**
   * Formats an evidence receipt complying with the Littlebird standards:
   * [DayOfWeek, Month Day, Year HH:MM | App | Title]
   */
  public formatReceipt(timestamp: number, activeApp: string, title?: string): LittlebirdReceipt {
    const d = new Date(timestamp)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
    const timeStr = d.toLocaleDateString('en-US', options)
    const appStr = (activeApp || 'Desktop').trim()
    const titleStr = (title || 'Active Window').trim()
    const formatted = `[${timeStr} | ${appStr} | ${titleStr}]`

    return {
      timestamp: timeStr,
      app: appStr,
      title: titleStr,
      formatted
    }
  }

  /**
   * Ambient Context Search compliant with Littlebird's search_user_context MCP tool.
   * Performs hybrid relevance query across timeline events and historical tasks.
   */
  public searchUserContext(options: SearchUserContextOptions = {}): SearchUserContextResult {
    if (!this.db) {
      return { tableOfContents: [], entries: [], totalMatches: 0 }
    }

    const queries: string[] = []
    if (options.search_queries && Array.isArray(options.search_queries)) {
      queries.push(...options.search_queries.filter(Boolean))
    }
    if (options.standalone_query && options.standalone_query.trim()) {
      queries.push(options.standalone_query.trim())
    }

    const limit = options.limit || 15
    const appFilter = options.app?.toLowerCase().trim()
    const entries: LittlebirdTimelineEntry[] = []

    try {
      // 1. Search Timeline Context Events
      const eventStmt = this.db.prepare(`
        SELECT id, active_app, window_title, project_workspace, payload_json, timestamp
        FROM context_events
        ORDER BY timestamp DESC
        LIMIT 100
      `)

      while (eventStmt.step()) {
        const row = eventStmt.getAsObject()
        const appName = (row.active_app as string) || ''
        const title = (row.window_title as string) || ''
        const payload = (row.payload_json as string) || ''

        if (appFilter && !appName.toLowerCase().includes(appFilter)) {
          continue
        }

        const combinedText = `${appName} ${title} ${payload}`.toLowerCase()
        let score = 3 // baseline observation score

        if (queries.length > 0) {
          let matched = false
          for (const q of queries) {
            const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
            const matchCount = words.filter((w) => combinedText.includes(w)).length
            if (matchCount > 0) {
              matched = true
              score = matchCount >= 3 ? 5 : 4
              break
            }
          }
          if (!matched) continue
        }

        const timestamp = row.timestamp as number
        const receipt = this.formatReceipt(timestamp, appName, title)
        const content = title ? `${appName}: ${title}` : `${appName} active`

        entries.push({
          id: row.id as string,
          timestamp,
          receipt,
          source: 'snapshots',
          content,
          score
        })
      }
      eventStmt.free()

      // 2. Search Tasks & Voice Directives
      const taskStmt = this.db.prepare(`
        SELECT task_id, raw_speech, intent_domain, intent_action, active_app, project, execution_status, timestamp
        FROM task_history
        ORDER BY timestamp DESC
        LIMIT 50
      `)

      while (taskStmt.step()) {
        const row = taskStmt.getAsObject()
        const appName = (row.active_app as string) || ''
        const speech = (row.raw_speech as string) || ''
        const action = (row.intent_action as string) || ''

        if (appFilter && !appName.toLowerCase().includes(appFilter)) {
          continue
        }

        const combinedText = `${appName} ${speech} ${action}`.toLowerCase()
        let score = 4

        if (queries.length > 0) {
          let matched = false
          for (const q of queries) {
            const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
            const matchCount = words.filter((w) => combinedText.includes(w)).length
            if (matchCount > 0) {
              matched = true
              score = 5
              break
            }
          }
          if (!matched) continue
        }

        const timestamp = row.timestamp as number
        const receipt = this.formatReceipt(timestamp, appName, `Task: ${action}`)

        entries.push({
          id: row.task_id as string,
          timestamp,
          receipt,
          source: 'tasks',
          content: `Spoken Task: "${speech}" -> Executed in ${appName} (${row.execution_status})`,
          score
        })
      }
      taskStmt.free()
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error during searchUserContext:', err)
    }

    // Sort by relevance score desc, then timestamp desc
    entries.sort((a, b) => (b.score || 0) - (a.score || 0) || b.timestamp - a.timestamp)
    const finalEntries = entries.slice(0, limit)

    // Build Littlebird Table of Contents
    const tableOfContents = finalEntries.map((e, idx) => {
      const chars = e.content.length
      return `#${idx + 1} | ${e.receipt.formatted} | ~${chars} chars | score ${e.score || 3}`
    })

    return {
      tableOfContents,
      entries: finalEntries,
      totalMatches: entries.length
    }
  }

  /**
   * Day Reconstructor: Rebuilds a work session from context into an actionable dev log.
   */
  public getDayReconstruction(targetDateMs?: number): DayReconstructionResult {
    const target = targetDateMs ? new Date(targetDateMs) : new Date()
    target.setHours(0, 0, 0, 0)
    const dayStart = target.getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000

    const appTimeMap: Record<string, number> = {}
    const projectsSet = new Set<string>()
    const filesSet = new Set<string>()
    const tasksExecuted: { time: string; task: string; targetApp: string }[] = []
    const decisionsMade: string[] = []

    if (this.db) {
      try {
        // Collect Events
        const stmt = this.db.prepare(`
          SELECT active_app, window_title, project_workspace, timestamp
          FROM context_events
          WHERE timestamp >= ? AND timestamp < ?
          ORDER BY timestamp ASC
        `)
        stmt.bind([dayStart, dayEnd])

        let lastTimestamp = dayStart
        let lastApp = 'Desktop'

        while (stmt.step()) {
          const row = stmt.getAsObject()
          const appName = (row.active_app as string) || 'Desktop'
          const title = (row.window_title as string) || ''
          const project = (row.project_workspace as string) || ''
          const ts = row.timestamp as number

          const diffMins = Math.min(Math.max(Math.round((ts - lastTimestamp) / 60000), 1), 30)
          appTimeMap[lastApp] = (appTimeMap[lastApp] || 0) + diffMins
          lastTimestamp = ts
          lastApp = appName

          if (project) projectsSet.add(project)

          // Extract files from title (e.g. "App.tsx - QEVRA" or "main.py")
          const fileMatch = title.match(/([a-zA-Z0-9_\-.]+\.(?:tsx|ts|jsx|js|py|json|md|html|css|cs|rs|go|cpp|c))/i)
          if (fileMatch) {
            filesSet.add(fileMatch[1])
          }
        }
        stmt.free()

        // Collect Tasks
        const taskStmt = this.db.prepare(`
          SELECT raw_speech, intent_action, active_app, timestamp
          FROM task_history
          WHERE timestamp >= ? AND timestamp < ?
          ORDER BY timestamp ASC
        `)
        taskStmt.bind([dayStart, dayEnd])

        while (taskStmt.step()) {
          const row = taskStmt.getAsObject()
          const d = new Date(row.timestamp as number)
          const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
          const speech = row.raw_speech as string
          const targetApp = row.active_app as string

          tasksExecuted.push({
            time: timeStr,
            task: speech,
            targetApp
          })

          if (speech.toLowerCase().includes('fix') || speech.toLowerCase().includes('refactor')) {
            decisionsMade.push(`Refactored / Fixed: ${speech} in ${targetApp}`)
          }
        }
        taskStmt.free()
      } catch (err) {
        console.warn('[QEVRA ContextStore] Error during getDayReconstruction:', err)
      }
    }

    const appsUsage = Object.entries(appTimeMap)
      .map(([app, minutes]) => ({ app, minutes }))
      .sort((a, b) => b.minutes - a.minutes)

    const totalMinutes = appsUsage.reduce((acc, curr) => acc + curr.minutes, 0)
    const sessionDurationHours = Math.round((totalMinutes / 60) * 10) / 10

    const dateStr = target.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })

    const topApps = appsUsage.slice(0, 3).map((a) => `${a.app} (${a.minutes}m)`).join(', ') || 'General development'
    const filesList = Array.from(filesSet).slice(0, 8).join(', ') || 'Source files'

    const changelogBlock = `### [${dateStr}] - Work Session Summary
- **Primary Focus**: Active in ${topApps}
- **Files Modified**: ${filesList}
- **Completed Directives**:
${tasksExecuted.map((t) => `  - [${t.time}] ${t.task} (${t.targetApp})`).join('\n') || '  - Direct coding and research'}
`

    return {
      date: dateStr,
      sessionDurationHours,
      summary: `Worked ~${sessionDurationHours}h across ${appsUsage.length} apps. Focus: ${topApps}.`,
      appsUsage,
      projectsTouched: Array.from(projectsSet),
      filesEdited: Array.from(filesSet),
      tasksExecuted,
      decisionsMade,
      changelogBlock
    }
  }

  public pruneOldRecords(retentionDays = 7): void {
    if (!this.db) return
    try {
      const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000
      this.db.run(`DELETE FROM context_events WHERE timestamp < ?`, [cutoff])
      // Keep at most 2,000 recent events
      this.db.run(`
        DELETE FROM context_events WHERE id NOT IN (
          SELECT id FROM context_events ORDER BY timestamp DESC LIMIT 2000
        )
      `)
      this.scheduleDiskSave()
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error pruning records:', err)
    }
  }

  private scheduleDiskSave(): void {
    if (this.saveDebounceTimer) return
    this.saveDebounceTimer = setTimeout(() => {
      this.saveDebounceTimer = null
      this.saveToDisk()
    }, 1500)
  }

  public saveToDisk(): void {
    if (!this.db || !this.dbPath) return
    try {
      const data = this.db.export()
      const buffer = Buffer.from(data)
      fs.writeFileSync(this.dbPath, buffer)
    } catch (err) {
      console.warn('[QEVRA ContextStore] Error exporting database to disk:', err)
    }
  }
}
