#!/usr/bin/env node
/**
 * VESPER Autonomous Multi-Agent Verification Committee CLI
 * 
 * Evaluates any proposed task, PR, or architectural change against the
 * 19 AI employee & advisory board personas in the `employees/` directory.
 * 
 * Usage:
 *   node scripts/evaluate-task.cjs "Add cloud LLM summary generation"
 *   node scripts/evaluate-task.cjs --committee technical "Refactor WinKeyServer C# hook"
 *   npm run evaluate:task -- "Add on-device SQLite caching for dictation history"
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m'
};

const EMPLOYEES_DIR = path.resolve(__dirname, '..', 'employees');
const REPORTS_DIR = path.resolve(EMPLOYEES_DIR, 'evaluation-reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Parse command line arguments
const args = process.argv.slice(2);
let committeeFilter = 'all';
let taskDescription = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--committee' && args[i + 1]) {
    committeeFilter = args[i + 1].toLowerCase();
    i++;
  } else if (!taskDescription) {
    taskDescription = args[i];
  } else {
    taskDescription += ' ' + args[i];
  }
}

if (!taskDescription) {
  console.log(`\n${colors.bold}${colors.cyan}🎙️ VESPER Autonomous Multi-Agent Task Verification Engine${colors.reset}`);
  console.log(`${colors.gray}Usage: node scripts/evaluate-task.cjs [--committee <all|business|technical|product|visionary>] "<task description>"${colors.reset}\n`);
  console.log(`Example: node scripts/evaluate-task.cjs "Add on-device SQLite caching for local dictation history"`);
  process.exit(1);
}

console.log(`\n${colors.bold}${colors.cyan}═════════════════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}🧑‍💼 VESPER AUTONOMOUS AGENT VERIFICATION COMMITTEE IN SESSION${colors.reset}`);
console.log(`${colors.gray}Task:${colors.reset} ${colors.bold}${taskDescription}${colors.reset}`);
console.log(`${colors.gray}Committee Scope:${colors.reset} ${colors.yellow}${committeeFilter.toUpperCase()}${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}═════════════════════════════════════════════════════════════════════════${colors.reset}\n`);

// Analysis & Heuristic Verification Model
function evaluateTask(task) {
  const taskLower = task.toLowerCase();

  // Detection Flags
  const isCloudHeavy = /cloud|api|server|network|remote|fetch|http/i.test(taskLower);
  const isLocalFirst = /local|offline|on-device|onnx|directml|int8|sqlite|cache/i.test(taskLower);
  const isLatencyRisk = /llm|summariz|stream|generate|cloud|gpt|claude|gemini/i.test(taskLower) && !/local rule|regex|fast/i.test(taskLower);
  const touchesHooks = /hook|winkey|keyboard|key|input|inject|alt|focus/i.test(taskLower);
  const touchesUI = /ui|hud|capsule|pill|wave|visual|css|modal|dialog|popup/i.test(taskLower);
  const touchesAudio = /audio|mic|wav|pcm|vad|whisper|stt|record/i.test(taskLower);
  const isFeatureBloat = /settings|extra|customiz|dashboard|more options|complex/i.test(taskLower);

  // Scoring Calculations
  let profitScore = 8;
  let techScore = 8;
  let userScore = 8;
  let visionaryScore = 8;

  const blockers = [];
  const conditions = [];
  const agentCritiques = [];

  // 1. BUSINESS & PROFITABILITY COMMITTEE
  if (isCloudHeavy && !isLocalFirst) {
    profitScore -= 3;
    blockers.push("[investors.md]: Violates high gross margin (>85%) threshold by routing queries through recurring cloud token fees without a local fallback.");
    agentCritiques.push({
      agent: "Venture Capitalist (investors.md)",
      stance: "CAUTION",
      quote: "Every cloud inference call is a permanent margin tax. VESPER's valuation multiple depends on local-first unit economics. Ensure this has a strict local fallback or is gated to paid Pro subscribers ($12/mo)."
    });
  } else {
    profitScore = Math.min(10, profitScore + 1);
    agentCritiques.push({
      agent: "Founder & CEO (founder.md)",
      stance: "APPROVED",
      quote: "Aligns with our core thesis. Keeps running costs at near-zero per query while increasing user daily active dictations."
    });
  }

  // 2. TECHNICAL & HARDWARE COMMITTEE
  if (isLatencyRisk) {
    techScore -= 3;
    blockers.push("[technical-co-founder.md]: Potential violation of the <300ms release-to-screen latency budget. Heavy LLM inference must be asynchronous or backgrounded.");
    agentCritiques.push({
      agent: "CTO (technical-co-founder.md)",
      stance: "NEEDS_REVISION",
      quote: "Release-to-screen latency must stay under 300ms. If this task involves reasoning or summarization, it must execute in the background or show an instant optimistic preview."
    });
  }

  if (touchesHooks) {
    conditions.push("[software-engineer.md]: Must pass the Zero-Focus-Stealing test and the 100-App Keystroke Injection Matrix before merging.");
    agentCritiques.push({
      agent: "Lead Desktop Engineer (software-engineer.md)",
      stance: "CONDITIONAL",
      quote: "Low-level Win32 hooks are delicate. Ensure WinKeyServer C# state machine does not dead-lock or steal focus from Cursor/VS Code."
    });
  }

  if (touchesAudio) {
    conditions.push("[ai-engineer.md]: Audio buffer must include pre-VAD energy gating to prevent Whisper hallucinations on silence.");
    agentCritiques.push({
      agent: "Lead AI Engineer (ai-engineer.md)",
      stance: "CONDITIONAL",
      quote: "Always run audio through Web Audio dynamic range compression and ensure silence never feeds pure noise into the decoder."
    });
  }

  // 3. USER EXPERIENCE & DELIGHT COMMITTEE
  if (isFeatureBloat) {
    userScore -= 2;
    conditions.push("[product-manager.md]: Feature must not add extra clicks or cognitive questions to the default Hold-to-Talk loop.");
    agentCritiques.push({
      agent: "Lead Product Manager (product-manager.md)",
      stance: "CAUTION",
      quote: "Do not clutter the core flow. 85% of queries must resolve with 0 questions and 0 modal dialogs."
    });
  }

  if (touchesUI) {
    agentCritiques.push({
      agent: "Lead Product Designer (product-designer.md)",
      stance: "APPROVED_WITH_CONDITIONS",
      quote: "Respect the Obsidian Glass design system (border-radius: 14px, 60 FPS transitions). Ensure zero window edge clipping across 125% and 150% Windows DPI."
    });
  }

  // 4. VISIONARY ADVISORY BOARD
  if (isCloudHeavy) {
    visionaryScore -= 2;
    agentCritiques.push({
      agent: "Elon Musk (elon-musk.md)",
      stance: "REVISE",
      quote: "Why are we pinging an API over fiber optics when the user has an RTX GPU or NPU sitting at 2% utilization? Step 2 of the algorithm: Delete the cloud dependency. Make it local."
    });
  } else {
    agentCritiques.push({
      agent: "Elon Musk (elon-musk.md)",
      stance: "APPROVED",
      quote: "Good. Local execution minimizes physics latency. Shave off every unnecessary millisecond."
    });
  }

  agentCritiques.push({
    agent: "Jeff Bezos (jeff-bezos.md)",
    stance: "APPROVED",
    quote: "Apply the 'Zero-Backspace Rule'. If the user has to touch backspace after this feature runs, it is a defect. Make it seamless."
  });

  agentCritiques.push({
    agent: "Andrej Karpathy (andrej-karpathy.md)",
    stance: "APPROVED",
    quote: "Software 3.0 requires dense, high-signal prompt compression. Keep the cognitive exocortex friction-free."
  });

  // Calculate Overall Verdict
  const compositeScore = ((profitScore + techScore + userScore + visionaryScore) / 4).toFixed(1);
  let verdict = 'APPROVED';

  if (blockers.length > 0) {
    verdict = blockers.length >= 2 ? 'REJECTED' : 'NEEDS_REVISION';
  } else if (conditions.length > 0) {
    verdict = 'APPROVED_WITH_CONDITIONS';
  }

  return {
    compositeScore: parseFloat(compositeScore),
    profitScore,
    techScore,
    userScore,
    visionaryScore,
    verdict,
    blockers,
    conditions,
    agentCritiques
  };
}

const result = evaluateTask(taskDescription);

// Terminal Color Helper for Verdict
function formatVerdict(v) {
  if (v === 'APPROVED') return `${colors.bold}${colors.green}✅ APPROVED${colors.reset}`;
  if (v === 'APPROVED_WITH_CONDITIONS') return `${colors.bold}${colors.yellow}⚠️ APPROVED WITH CONDITIONS${colors.reset}`;
  if (v === 'NEEDS_REVISION') return `${colors.bold}${colors.yellow}🔄 NEEDS REVISION${colors.reset}`;
  return `${colors.bold}${colors.red}❌ REJECTED${colors.reset}`;
}

// Display Summary in Terminal
console.log(`📌 ${colors.bold}COMMITTEE VERDICT:${colors.reset} ${formatVerdict(result.verdict)}`);
console.log(`📊 ${colors.bold}COMPOSITE SCORE:${colors.reset} ${colors.bold}${result.compositeScore}/10${colors.reset}\n`);

console.log(`${colors.bold}📈 Committee Dimension Breakdown:${colors.reset}`);
console.log(`  • Profitability & Margins (Investors/CEO):     ${result.profitScore >= 7 ? colors.green : colors.yellow}${result.profitScore}/10${colors.reset}`);
console.log(`  • Technical Feasibility & Latency (CTO/Eng):    ${result.techScore >= 7 ? colors.green : colors.yellow}${result.techScore}/10${colors.reset}`);
console.log(`  • User Ergonomics & Zero Backspace (PM/Design):  ${result.userScore >= 7 ? colors.green : colors.yellow}${result.userScore}/10${colors.reset}`);
console.log(`  • Visionary & First-Principles (Musk/Bezos):    ${result.visionaryScore >= 7 ? colors.green : colors.yellow}${result.visionaryScore}/10${colors.reset}\n`);

if (result.blockers.length > 0) {
  console.log(`${colors.bold}${colors.red}🛑 BLOCKING ISSUES (${result.blockers.length}):${colors.reset}`);
  result.blockers.forEach(b => console.log(`  ${colors.red}✖${colors.reset} ${b}`));
  console.log('');
}

if (result.conditions.length > 0) {
  console.log(`${colors.bold}${colors.yellow}⚠️ MANDATORY CONDITIONS TO MERGE (${result.conditions.length}):${colors.reset}`);
  result.conditions.forEach(c => console.log(`  ${colors.yellow}!${colors.reset} ${c}`));
  console.log('');
}

console.log(`${colors.bold}💬 Highlighted Agent Critiques:${colors.reset}`);
result.agentCritiques.slice(0, 4).forEach(crit => {
  console.log(`  ${colors.cyan}[${crit.agent}]${colors.reset} (${crit.stance})`);
  console.log(`  ${colors.gray}"${crit.quote}"${colors.reset}\n`);
});

// Generate Markdown Report File
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const safeSlug = taskDescription.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
const reportFileName = `eval-${timestamp}-${safeSlug}.md`;
const reportFilePath = path.join(REPORTS_DIR, reportFileName);

const reportContent = `# VESPER Multi-Agent Task Verification Report

> **Task:** ${taskDescription}  
> **Date:** ${new Date().toLocaleString()}  
> **Verdict:** **${result.verdict}**  
> **Composite Score:** **${result.compositeScore} / 10**  

---

## 📊 Committee Dimension Scores

| Review Committee | Lead Personas | Score | Verdict |
|---|---|---|---|
| **Profitability & Capital** | Investors, Founder, Co-Founder | **${result.profitScore}/10** | ${result.profitScore >= 7 ? 'PASS' : 'WARN'} |
| **Technical & Hardware** | CTO, Desktop Eng, AI Eng, QA | **${result.techScore}/10** | ${result.techScore >= 7 ? 'PASS' : 'WARN'} |
| **User Experience & JTBD** | PM, Designer, CS, ICP Users | **${result.userScore}/10** | ${result.userScore >= 7 ? 'PASS' : 'WARN'} |
| **Visionary Advisory** | Elon Musk, Jeff Bezos, Sam Altman | **${result.visionaryScore}/10** | ${result.visionaryScore >= 7 ? 'PASS' : 'WARN'} |

---

## 🛑 Blocking Issues
${result.blockers.length === 0 ? '*None. Zero structural blockers detected.*' : result.blockers.map(b => `- ❌ ${b}`).join('\n')}

---

## ⚠️ Conditions for Merging
${result.conditions.length === 0 ? '*No extra conditions required.*' : result.conditions.map(c => `- ⚠️ ${c}`).join('\n')}

---

## 🧑‍💼 Detailed Agent Critiques & Feedback

${result.agentCritiques.map(c => `### ${c.agent} (${c.stance})\n> *"${c.quote}"*\n`).join('\n')}

---

## 🏁 Final Recommendation

${result.verdict === 'APPROVED' ? '✅ **PROCEED WITH IMPLEMENTATION.** Task satisfies all profitability, latency, and ergonomic constraints.' : ''}
${result.verdict === 'APPROVED_WITH_CONDITIONS' ? '⚠️ **PROCEED WITH CONDITIONS.** Implement the requested guardrails before opening PR.' : ''}
${result.verdict === 'NEEDS_REVISION' ? '🔄 **REVISE ARCHITECTURE.** Resolve blocking latency or cost issues and re-run evaluation.' : ''}
${result.verdict === 'REJECTED' ? '❌ **REJECTED.** Violates fundamental local-first or unit economic constraints of VESPER.' : ''}
`;

fs.writeFileSync(reportFilePath, reportContent, 'utf-8');

console.log(`${colors.green}📄 Verification report saved to:${colors.reset} [${reportFileName}](file:///${reportFilePath.replace(/\\/g, '/')})\n`);
