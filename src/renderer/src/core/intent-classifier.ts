import { SystemContext } from '../types/task'

export type CanonicalIntentType =
  | 'write'
  | 'rewrite'
  | 'summarize'
  | 'explain'
  | 'generate'
  | 'code'
  | 'debug'
  | 'search'
  | 'reply'
  | 'create'
  | 'edit'
  | 'execute'

export type SpeechInteractionType = 'dictation' | 'query' | 'task'

export interface ExtractedRequirements {
  technologies: string[]
  styling: string[]
  sections: string[]
  tone?: string
  targetEntity?: string
  constraints: string[]
  isExplicitCode: boolean
  isAgentAction?: boolean
  agentGoal?: string
  isTask?: boolean
}

export interface IntentClassificationResult {
  intent: CanonicalIntentType
  domain: 'coding' | 'communication' | 'research' | 'document' | 'system'
  action: string
  confidence: number
  requirements: ExtractedRequirements
  isTask?: boolean
  interactionType?: SpeechInteractionType
}

/**
 * 12-Intent Taxonomy Classifier with Context-Aware Disambiguation
 */
export function classifyIntent(
  rawSpeech: string,
  context: SystemContext
): IntentClassificationResult {
  const text = rawSpeech.trim().toLowerCase()
  const app = context.activeApp.toLowerCase()
  const cat = context.detectedCategory

  // 1. Detect Intent Type
  let intent: CanonicalIntentType = 'write'
  let domain: IntentClassificationResult['domain'] = 'document'
  let action = 'draft_content'
  let confidence = 0.85

  // Vague commands: "Fix this", "Make this better", "Improve this"
  const isVagueCommand =
    text === 'fix this' ||
    text === 'fix this.' ||
    text === 'make this better' ||
    text === 'make this better.' ||
    text === 'improve this' ||
    text === 'clean this up'

  const isAgentAction =
    text.includes('understand this chat') ||
    text.includes('understand the chat') ||
    text.includes('understand this conversation') ||
    text.includes('understand the conversation') ||
    text.includes('make this sale') ||
    text.includes('close this deal') ||
    text.includes('sell this product') ||
    text.includes('help me sell') ||
    text.includes('converse with') ||
    text.includes('chat with this person') ||
    text.includes('reply to this conversation') ||
    text.includes('understand the context and') ||
    text.includes('read the screen and')

  const isAuditOrVerification =
    text.includes('check whether the') ||
    text.includes('check whether') ||
    text.includes('check if the') ||
    text.includes('check if') ||
    text.includes('is working or not') ||
    text.includes('working or not') ||
    text.includes('system is working') ||
    text.includes('entire system is working') ||
    text.includes('fully check') ||
    text.includes('audit the') ||
    text.includes('perform an audit') ||
    text.includes('verify whether') ||
    text.includes('verify if') ||
    text.includes('test those things') ||
    text.includes('test everything') ||
    text.includes('test whether') ||
    text.includes('rightly working') ||
    text.includes('make sure everything is working')

  if (isAgentAction) {
    intent = 'reply'
    domain = 'communication'
    action = 'agent_screen_copilot'
    confidence = 0.99
  } else if (isVagueCommand) {
    if (cat === 'code' || app.includes('cursor') || app.includes('code')) {
      intent = 'debug'
      domain = 'coding'
      action = 'debug_active_code'
      confidence = 0.95
    } else if (cat === 'communication' || app.includes('gmail') || app.includes('slack') || app.includes('mail')) {
      intent = 'rewrite'
      domain = 'communication'
      action = 'refine_communication'
      confidence = 0.95
    } else {
      intent = 'rewrite'
      domain = 'document'
      action = 'refine_selected_text'
      confidence = 0.9
    }
  } else if (
    text.startsWith('reply') ||
    text.startsWith('tell ') ||
    text.includes('tell him') ||
    text.includes('tell her') ||
    text.includes('tell them') ||
    text.includes('reply to this') ||
    text.includes('reply saying') ||
    (cat === 'communication' && (text.includes('i will') || text.includes("i'll") || text.includes('meeting') || text.includes('late')))
  ) {
    intent = 'reply'
    domain = 'communication'
    action = 'draft_reply'
    confidence = 0.98
  } else if (
    text.startsWith('summarize') ||
    text.includes('summary of') ||
    text.includes('give me 5 points') ||
    text.includes('five most important points') ||
    text.includes('tldr')
  ) {
    intent = 'summarize'
    domain = cat === 'browser' ? 'research' : 'document'
    action = 'generate_summary'
    confidence = 0.95
  } else if (
    text.startsWith('explain') ||
    text.includes('how does this work') ||
    text.includes('what does this do') ||
    text.includes('walk me through')
  ) {
    intent = 'explain'
    domain = cat === 'code' ? 'coding' : 'document'
    action = 'explain_concept'
    confidence = 0.95
  } else if (isAuditOrVerification) {
    intent = 'debug'
    domain = 'coding'
    action = 'system_audit_and_verification'
    confidence = 0.98
  } else if (
    text.startsWith('debug') ||
    text.includes('fix the bug') ||
    text.includes('find what\'s wrong') ||
    text.includes('why is this failing') ||
    text.includes('syntax error')
  ) {
    intent = 'debug'
    domain = 'coding'
    action = 'debug_code'
    confidence = 0.95
  } else if (
    text.startsWith('search') ||
    text.includes('look up') ||
    text.includes('find me the cheapest') ||
    text.includes('find alternatives') ||
    text.includes('compare these')
  ) {
    intent = 'search'
    domain = 'research'
    action = 'web_search'
    confidence = 0.95
  } else if (
    text.startsWith('delete') ||
    text.includes('remove file') ||
    text.includes('delete this file')
  ) {
    intent = 'execute'
    domain = 'system'
    action = 'delete_file'
    confidence = 0.99
  } else if (
    text.startsWith('create file') ||
    text.includes('make a file') ||
    text.includes('create a file called') ||
    text.startsWith('rename file') ||
    text.startsWith('move file')
  ) {
    intent = 'create'
    domain = 'system'
    action = 'file_operation'
    confidence = 0.95
  } else if (
    text.startsWith('rewrite') ||
    text.includes('make this') ||
    text.includes('make it') ||
    text.includes('paraphrase') ||
    text.includes('rephrase') ||
    text.includes('professional tone')
  ) {
    intent = 'rewrite'
    domain = cat === 'communication' ? 'communication' : 'document'
    action = 'rewrite_text'
    confidence = 0.95
  } else if (
    text.includes('create a') ||
    text.includes('build a') ||
    text.includes('generate a') ||
    text.includes('scaffold') ||
    text.includes('website') ||
    text.includes('portfolio') ||
    text.includes('login page') ||
    text.includes('dashboard') ||
    text.includes('component')
  ) {
    intent = 'code'
    domain = 'coding'
    action = 'scaffold_and_prompt'
    confidence = 0.92
  } else if (text.startsWith('write tests') || text.includes('add unit tests') || text.includes('test this')) {
    intent = 'code'
    domain = 'coding'
    action = 'generate_tests'
    confidence = 0.95
  } else if (
    text.includes('rest api') ||
    text.includes('jwt') ||
    text.includes('authentication') ||
    text.includes('password hashing') ||
    text.includes('endpoint') ||
    text.includes('api root')
  ) {
    intent = 'code'
    domain = 'coding'
    action = 'implement_backend_auth'
    confidence = 0.95
  } else if (
    text.includes('refactor') ||
    text.includes('refit') ||
    text.includes('clean up code') ||
    text.includes('clean up the state') ||
    text.includes('make this cleaner')
  ) {
    intent = 'edit'
    domain = 'coding'
    action = 'refactor_code'
    confidence = 0.95
  } else if (text.includes('add dark mode') || text.includes('add animation') || text.includes('modify')) {
    intent = 'edit'
    domain = 'coding'
    action = 'modify_feature'
    confidence = 0.92
  }

  // 2. Wispr Flow Task vs Query vs Natural Text Classifier
  const queryStarters = /^(what|where|who|why|when|how|which|whose|tell me|can you|could you|is there|are there|do you know|did i|have i|am i|should i|what's|how's|who's|where's)\b/i
  const isQuestion = text.endsWith('?') || queryStarters.test(text) || text.includes('what was i') || text.includes('where is') || text.includes('how to')

  const taskStarters =
    /^(build|create|make a|make it|generate|scaffold|code|refactor|refit|implement|update|fix|debug|clean up|improve|optimize|modify|edit|delete|remove|kill|run|execute|open|start|install|search for|look up|find|summarize|tldr|explain|walk me through|write tests|reply to|tell him|tell her|tell them|prompt:|task:|check|verify|audit|test|validate|inspect|examine|make sure|(so\s+)?here's a task|(so\s+)?task for you|(so\s+)?the goal is to|(so\s+)?the end of the goal is to)\b/i
  const hasTaskKeyword =
    text.includes('build a') ||
    text.includes('create a') ||
    text.includes('generate a') ||
    text.includes('landing page') ||
    text.includes('portfolio') ||
    text.includes('restaurant') ||
    text.includes('component') ||
    text.includes('dashboard') ||
    text.includes('fix the bug') ||
    text.includes('why is this failing') ||
    text.includes('unit test') ||
    text.includes('rest api') ||
    text.includes('custom hook') ||
    text.includes('export to csv') ||
    text.includes('need a prompt') ||
    text.includes('give me a prompt') ||
    text.includes('system is working') ||
    text.includes('is working or not') ||
    text.includes('working or not') ||
    text.includes('check whether') ||
    text.includes('check if') ||
    text.includes('verify if') ||
    text.includes('verify whether') ||
    text.includes('fully check') ||
    text.includes('task for you') ||
    text.includes("here's a task") ||
    text.includes('audit') ||
    text.includes('end to end') ||
    text.includes('rightly working')

  let interactionType: SpeechInteractionType = 'dictation'

  if (isQuestion) {
    interactionType = 'query'
    intent = 'explain'
    domain = 'research'
    action = 'answer_user_query'
    confidence = 0.95
  } else if (isAgentAction || isVagueCommand || isAuditOrVerification || taskStarters.test(text) || hasTaskKeyword || intent !== 'write') {
    interactionType = 'task'
  } else {
    interactionType = 'dictation'
    intent = 'write'
    domain = 'document'
    action = 'direct_dictation'
    confidence = 0.98
  }

  const isTask = interactionType === 'task'

  // 3. Semantic Requirement Extraction
  const technologies: string[] = []
  if (text.includes('react')) technologies.push('React')
  if (text.includes('next.js') || text.includes('nextjs') || text.includes('next js')) technologies.push('Next.js')
  if (text.includes('html')) technologies.push('HTML5')
  if (text.includes('css')) technologies.push('CSS3')
  if (text.includes('vanilla js') || text.includes('javascript') || text.includes(' js ')) technologies.push('JavaScript')
  if (text.includes('typescript') || text.includes(' ts ')) technologies.push('TypeScript')
  if (text.includes('tailwind')) technologies.push('Tailwind CSS')
  if (text.includes('python')) technologies.push('Python')
  if (text.includes('node')) technologies.push('Node.js')
  if (text.includes('vue')) technologies.push('Vue.js')
  if (text.includes('jwt') || text.includes('token refresh') || text.includes('authorization')) technologies.push('JWT')
  if (text.includes('bcrypt') || text.includes('crypt') || text.includes('password hashing')) technologies.push('Bcrypt / Password Hashing')
  if (text.includes('custom hook') || text.includes('react hook') || text.includes('hook')) technologies.push('React Custom Hooks')
  if (text.includes('csv')) technologies.push('CSV Export')
  if (text.includes('restaurant') && technologies.length === 0) {
    technologies.push('HTML5', 'Modern CSS / Tailwind', 'JavaScript')
  }
  if (isAuditOrVerification) {
    if (!technologies.includes('Vitest / Unit Tests')) technologies.push('Vitest / Unit Tests')
    if (!technologies.includes('TypeScript')) technologies.push('TypeScript')
    if (!technologies.includes('Electron IPC')) technologies.push('Electron IPC')
  }

  const styling: string[] = []
  if (text.includes('dark mode') || text.includes('dark theme') || text.includes('dark')) styling.push('Dark mode')
  if (text.includes('light mode') || text.includes('light theme')) styling.push('Light mode')
  if (text.includes('animation') || text.includes('animations') || text.includes('animated')) styling.push('Animations')
  if (text.includes('responsive') || text.includes('mobile')) styling.push('Responsive mobile design')
  if (text.includes('modern')) styling.push('Modern aesthetic')
  if (text.includes('premium')) styling.push('Premium design')
  if (text.includes('minimal') || text.includes('clean')) styling.push('Minimal clean')
  if (text.includes('restaurant') && styling.length === 0) {
    styling.push('Dark luxury theme (warm charcoal, gold accents)', 'Micro-animations', 'Fully responsive layout')
  }

  const sections: string[] = []
  if (text.includes('hero')) sections.push('Hero section')
  if (text.includes('about')) sections.push('About section')
  if (text.includes('projects') || text.includes('project')) sections.push('Projects')
  if (text.includes('skills') || text.includes('skill')) sections.push('Skills')
  if (text.includes('contact')) sections.push('Contact form & details')
  if (text.includes('login') || text.includes('auth')) sections.push('Authentication')
  if (text.includes('pricing')) sections.push('Pricing tables')
  if (text.includes('csv') || text.includes('button')) sections.push('Export to CSV')
  if (text.includes('menu')) sections.push('Interactive Menu with Pricing & Dietary Tags')
  if (text.includes('reservation')) sections.push('Table Reservation Booking Modal')
  if (text.includes('testimonials') || text.includes('reviews')) sections.push('Customer Testimonials & Reviews')
  if (text.includes('footer')) sections.push('Footer with Hours & Social Links')
  if (text.includes('gallery')) sections.push('Culinary Photo Gallery')
  if (text.includes('restaurant') || text.includes('food') || text.includes('dining')) {
    if (!sections.some((s) => s.includes('Menu'))) sections.push('Interactive Menu with Pricing & Dietary Tags')
    if (!sections.some((s) => s.includes('Reservation'))) sections.push('Table Reservation Booking Modal')
    if (!sections.some((s) => s.includes('About') || s.includes('Story'))) sections.push('Chef / Culinary Story')
    if (!sections.some((s) => s.includes('Reviews') || s.includes('Testimonials'))) sections.push('Customer Testimonials & Reviews')
    if (!sections.some((s) => s.includes('Footer') || s.includes('Hours'))) sections.push('Location, Business Hours & Interactive Map')
  }
  if (isAuditOrVerification) {
    sections.push(
      'Hold-to-Talk Key Detection (WinKeyServer & Key Release)',
      'Ambient Window Context Tracking & OCR/Vision',
      '3-Way Speech Intent Classifier (Dictation, Query, Task)',
      'Universal Application Output Adapters & Auto-Paste'
    )
  }

  let tone: string | undefined = undefined
  if (text.includes('professional') || text.includes('formal')) tone = 'Professional'
  else if (text.includes('casual') || text.includes('friendly')) tone = 'Casual & Friendly'
  else if (text.includes('concise') || text.includes('short') || text.includes('brief')) tone = 'Concise'

  const constraints: string[] = []
  if (text.includes('without changing behavior') || text.includes('without changing runtime behavior')) {
    constraints.push('Preserve exact runtime behavior')
  }
  if (text.includes('no external') || text.includes('vanilla')) constraints.push('Zero external dependencies')
  if (text.includes('cleaner') || text.includes('dry')) constraints.push('DRY and readable')
  if (isAuditOrVerification) {
    constraints.push('Ensure 0 TypeScript compilation errors (tsc --noEmit)')
    constraints.push('Verify all unit and integration test suites pass (137+ tests)')
    constraints.push('Confirm Hold-to-Talk Alt release immediately stops and auto-pastes without manual clicks')
  }

  return {
    intent,
    domain,
    action,
    confidence,
    isTask,
    interactionType,
    requirements: {
      technologies,
      styling,
      sections,
      tone,
      constraints,
      isExplicitCode: domain === 'coding' || technologies.length > 0,
      isAgentAction,
      agentGoal: isAgentAction ? rawSpeech : undefined,
      isTask
    }
  }
}
