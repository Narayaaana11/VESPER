/**
 * VESPER Terminal Command Extractor
 * Translates natural speech requests describing terminal, git, shell, or CLI operations
 * into executable, syntax-perfect command sequences.
 */
export interface TerminalCommandResult {
  isTerminalCommand: boolean
  command: string
  explanation: string
  operations: string[]
}

export class TerminalCommandExtractor {
  /**
   * Evaluates whether a spoken request is asking for terminal / shell execution
   */
  public static isTerminalIntent(speech: string, activeApp = ''): boolean {
    const text = speech.toLowerCase().trim()
    const app = activeApp.toLowerCase()

    // Explicit terminal mentions
    if (
      text.includes('in the terminal') ||
      text.includes('in terminal') ||
      text.includes('write the command') ||
      text.includes('write commands for') ||
      text.includes('command for that') ||
      text.includes('commands for that') ||
      text.includes('run in terminal') ||
      text.includes('bash command') ||
      text.includes('powershell command')
    ) {
      return true
    }

    // Git operations
    if (
      (text.includes('git ') || text.includes('github') || text.includes('git status') || text.includes('commit')) &&
      (text.includes('status') || text.includes('add') || text.includes('push') || text.includes('commit') || text.includes('branch') || text.includes('checkout') || text.includes('pull'))
    ) {
      return true
    }

    // NPM / package manager operations
    if (
      /^(run |execute )?(npm|pnpm|yarn|bun|cargo|pip|poetry|docker|kubectl)\b/i.test(text) ||
      text.includes('npm run') ||
      text.includes('npm install') ||
      text.includes('npm test') ||
      text.includes('npx ')
    ) {
      return true
    }

    // If active app is a shell/terminal window and input has CLI action keywords
    const isTerminalApp = app.includes('terminal') || app.includes('powershell') || app.includes('cmd') || app.includes('bash') || app.includes('wsl')
    if (isTerminalApp && (text.startsWith('run ') || text.startsWith('check ') || text.startsWith('install ') || text.startsWith('kill '))) {
      return true
    }

    return false
  }

  /**
   * Synthesizes executable command line string from natural speech
   */
  public static extractCommand(speech: string): TerminalCommandResult {
    const text = speech.toLowerCase().trim()
    const operations: string[] = []

    // 1. Git Status + Add + Commit + Push Workflow
    const hasGit = text.includes('git') || text.includes('github')
    const hasStatus = text.includes('status') || text.includes('check status')
    const hasAdd = text.includes('add all') || text.includes('add files') || text.includes('stage') || text.includes('commit all')
    const hasCommit = text.includes('commit')
    const hasPush = text.includes('push') || text.includes('push to main') || text.includes('push to github')

    if (hasGit || hasCommit || hasPush || hasStatus) {
      const gitCmds: string[] = []

      if (hasStatus) {
        gitCmds.push('git status')
        operations.push('Check working tree status')
      }

      if (hasAdd || (hasCommit && !text.includes('commit -m') && !text.includes('git commit '))) {
        gitCmds.push('git add -A')
        operations.push('Stage all modified and untracked files')
      }

      if (hasCommit) {
        let commitMsg = 'update: sync changes'

        // Extract custom commit message
        const msgMatch = speech.match(/(?:with message|message is|message|saying)\s+["']?([^"'\n]+?)["']?(?:\s+(?:and\s+)?push|$)/i)
        if (msgMatch && msgMatch[1]) {
          let rawMsg = msgMatch[1].trim()
          // Clean up formatting: e.g. "fixauth bugs" -> "fix: auth bugs"
          rawMsg = rawMsg
            .replace(/\bfixauth\b/gi, 'fix: auth')
            .replace(/\bfix\s*auth\b/gi, 'fix: auth')
            .replace(/\baddauth\b/gi, 'feat: auth')
            .replace(/\bbugfix\b/gi, 'fix: bug')
            .replace(/^["']|["']$/g, '')
            .trim()

          // Add conventional prefix if missing
          if (!/^(feat|fix|refactor|docs|style|test|chore|perf):/i.test(rawMsg)) {
            if (/fix|bug|broken|error/i.test(rawMsg)) {
              commitMsg = `fix: ${rawMsg.replace(/^(fix:?\s*)+/i, '')}`
            } else if (/feat|new|add/i.test(rawMsg)) {
              commitMsg = `feat: ${rawMsg.replace(/^(feat:?\s*|add:?\s*)+/i, '')}`
            } else {
              commitMsg = rawMsg
            }
          } else {
            commitMsg = rawMsg
          }
        } else if (text.includes('fixauth') || text.includes('fix auth')) {
          commitMsg = 'fix: auth bugs'
        }

        gitCmds.push(`git commit -m "${commitMsg}"`)
        operations.push(`Commit changes with message "${commitMsg}"`)
      }

      if (hasPush) {
        let targetBranch = 'main'
        if (text.includes('master')) targetBranch = 'master'
        else if (text.includes('origin')) {
          const bMatch = text.match(/origin\s+([a-zA-Z0-9_\-\/]+)/i)
          if (bMatch) targetBranch = bMatch[1]
        }
        gitCmds.push(`git push origin ${targetBranch}`)
        operations.push(`Push commits to origin/${targetBranch}`)
      }

      if (gitCmds.length > 0) {
        return {
          isTerminalCommand: true,
          command: gitCmds.join(' && '),
          explanation: `Git sequence: ${operations.join(' -> ')}`,
          operations
        }
      }
    }

    // 2. NPM / Node commands
    if (text.includes('npm run dev') || text.includes('start dev server') || text.includes('run dev')) {
      return {
        isTerminalCommand: true,
        command: 'npm run dev',
        explanation: 'Start local development server',
        operations: ['npm run dev']
      }
    }
    if (text.includes('npm install') || text.includes('install dependencies') || text.includes('install packages')) {
      const pkgMatch = text.match(/install\s+([a-zA-Z0-9_\-@\/]+)/i)
      const cmd = pkgMatch && !['dependencies', 'packages', 'all', 'the'].includes(pkgMatch[1])
        ? `npm install ${pkgMatch[1]}`
        : 'npm install'
      return {
        isTerminalCommand: true,
        command: cmd,
        explanation: 'Install project dependencies',
        operations: [cmd]
      }
    }
    if (text.includes('npm test') || text.includes('run tests') || text.includes('run test suite')) {
      return {
        isTerminalCommand: true,
        command: 'npm test',
        explanation: 'Execute project test suite',
        operations: ['npm test']
      }
    }
    if (text.includes('npm run build') || text.includes('build production') || text.includes('build project')) {
      return {
        isTerminalCommand: true,
        command: 'npm run build',
        explanation: 'Compile production bundle',
        operations: ['npm run build']
      }
    }

    // 3. Port / Process Management
    const killPortMatch = text.match(/kill\s+(?:process\s+on\s+)?port\s+(\d+)/i)
    if (killPortMatch) {
      const port = killPortMatch[1]
      return {
        isTerminalCommand: true,
        command: `npx kill-port ${port}`,
        explanation: `Terminate running process on port ${port}`,
        operations: [`npx kill-port ${port}`]
      }
    }

    // 4. Default Clean Pass-through if already looks like a command
    if (/^[a-z0-9_\-]+\s+--?[a-z0-9_\-]+/i.test(speech.trim())) {
      return {
        isTerminalCommand: true,
        command: speech.trim(),
        explanation: 'Execute command',
        operations: [speech.trim()]
      }
    }

    return {
      isTerminalCommand: false,
      command: speech.trim(),
      explanation: 'Not a recognized terminal command',
      operations: []
    }
  }
}
