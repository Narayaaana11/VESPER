# VESPER Autonomous Multi-Agent Verification Committee & Startup Operating System

> **Directory:** `/employees`  
> **System:** Autonomous AI Employee Review Board & Task Verification Engine  
> **Target Product:** VESPER — Local-First Context-Aware AI Voice-to-Action Platform  
> **Core Mandate:** Every task, PR, or architecture proposal must be autonomously verified across **Profitability, Technical Soundness, User Ergonomics, and First-Principles Feasibility** before implementation.

---

## 🏛️ Multi-Agent Review Architecture

When working on any task or feature, the files in this directory act as **autonomous AI review agents**. Rather than building features blindly, tasks are submitted to the committee to answer:
1. **Is it profitable?** (Does it protect gross margins, expand LTV, or burn unnecessary runway?)
2. **Is it technically sound?** (Does it respect the <300ms latency budget, prevent focus stealing, and maintain local-first stability?)
3. **Does it solve a real Job-to-be-Done?** (Does it eliminate cognitive load and backspacing for users?)
4. **Does it pass First-Principles scrutiny?** (Would Elon, Bezos, Altman, Jensen, or Karpathy approve the design?)

```
                                      ┌──────────────────────────────────────────────┐
                                      │             PROPOSED TASK / PR               │
                                      │       "Add Cloud Summary LLM Feature"        │
                                      └──────────────────────┬───────────────────────┘
                                                             │
                              ┌──────────────────────────────┼──────────────────────────────┐
                              │                              │                              │
                              ▼                              ▼                              ▼
               ┌─────────────────────────────┐┌─────────────────────────────┐┌─────────────────────────────┐
               │    PROFITABILITY & GTM      ││    TECHNICAL & HARDWARE     ││   USER DELIGHT & ERGONOMICS │
               │          COMMITTEE          ││          COMMITTEE          ││          COMMITTEE          │
               ├─────────────────────────────┤├─────────────────────────────┤├─────────────────────────────┤
               │ • investors.md (VC Thesis)  ││ • technical-co-founder.md   ││ • product-manager.md        │
               │ • founder.md (PMF & Moat)   ││ • software-engineer.md      ││ • product-designer.md       │
               │ • co-founder.md (Ops & Cash)││ • ai-engineer.md (Audio ML) ││ • customer-success.md       │
               │ • marketer.md (Distribution)││ • qa-validation-engineer.md ││ • users.md (5 ICP Personas) │
               └──────────────┬──────────────┘└──────────────┬──────────────┘└──────────────┬──────────────┘
                              │                              │                              │
                              └──────────────────────────────┼──────────────────────────────┘
                                                             │
                                                             ▼
                                              ┌─────────────────────────────┐
                                              │  VISIONARY ADVISORY BOARD   │
                                              ├─────────────────────────────┤
                                              │ • elon-musk.md (5-Step Alg) │
                                              │ • jeff-bezos.md (Flywheel)  │
                                              │ • sam-altman.md (Platform)  │
                                              │ • jensen-huang.md (Silicon) │
                                              │ • andrej-karpathy.md (Exo)  │
                                              └──────────────┬──────────────┘
                                                             │
                                                             ▼
                                      ┌──────────────────────────────────────────────┐
                                      │        UNIFIED VERIFICATION VERDICT          │
                                      │      [APPROVED | REJECTED | REVISE]          │
                                      └──────────────────────────────────────────────┘
```

---

## 📋 The Standardized Verification Request & Response Protocol (VRRP)

Every employee agent implements this universal verification protocol:

### 1. Verification Request Schema (What the Agent Receives)
```json
{
  "taskTitle": "Feature / Architecture / Task Name",
  "proposedSolution": "Detailed technical or product design summary",
  "targetAudience": "Developers / Executives / Writers / Enterprise",
  "estimatedLatencyImpactMs": 15,
  "cloudComputeCostPerQuery": "$0.0004",
  "affectedComponents": ["src/main/action-executor.ts", "src/renderer/src/App.tsx"]
}
```

### 2. Verification Response Schema (What the Agent Returns)
```markdown
### 🧑‍💼 Agent Verification: [Role Name]
- **Verdict:** [APPROVED | APPROVED_WITH_CONDITIONS | NEEDS_REVISION | REJECTED]
- **Confidence:** [HIGH | MEDIUM | LOW]

#### 📊 Quantitative Dimension Scores (1–10)
| Dimension | Score | Anchor Justification |
|---|---|---|
| Profitability / Margin Impact | 8/10 | Zero cloud token burn; runs on local ONNX cache |
| Technical Feasibility & Latency | 9/10 | Adds <5ms execution overhead in background worker |
| User Cognitive Ergonomics | 9/10 | Requires 0 user configuration; auto-detected |
| Defensibility & Moat | 7/10 | Native Win32 hook cannot be easily copied by web apps |

#### 🔍 Critical Critique & Reasoning (Chain-of-Thought)
[Detailed domain-specific analysis of why this task succeeds or fails]

#### 🛑 Blocking Issues (Must fix before merging):
- [ ] Item 1...
- [ ] Item 2...

#### 💡 Unblocking Recommendations:
- Recommendation 1...
```

---

## 📂 Master Directory Manifest

### 1. Executive Leadership & Profitability Committee
- [`investors.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/investors.md) — **Venture Capitalist:** Reviews Unit Economics, Gross Margin (>85%), CAC Payback, Defensibility Moat vs Big Tech.
- [`founder.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/founder.md) — **Founder & CEO:** Reviews Product-Market Fit (Sean Ellis >40%), Core Company Vision, Competitive Moats.
- [`co-founder.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/co-founder.md) — **Co-Founder & COO:** Reviews Operational Overhead, EV Code Signing, Legal/Privacy Compliance, Burn Velocity.
- [`marketer.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/marketer.md) — **Head of Growth:** Reviews Positioning vs Cloud Dictation Competitors, Product Hunt viral mechanics, Landing page conversion.

### 2. Technical, Hardware & Security Committee
- [`technical-co-founder.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/technical-co-founder.md) — **Technical Co-Founder & CTO:** Reviews <300ms Latency Budget, 8-Layer Architecture Integrity, Memory Leaks (<180MB RAM).
- [`software-engineer.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/software-engineer.md) — **Lead Desktop Engineer:** Reviews Win32 Hooks (`WinKeyServer`), Zero-Focus-Stealing, Clipboard Preservation, Multi-DPI Zero-Clipping.
- [`ai-engineer.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/ai-engineer.md) — **Lead AI & Audio ML Engineer:** Reviews Whisper ONNX Quantization, Deterministic Polisher Regex, VAD Energy Gating, Token Costs.
- [`qa-validation-engineer.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/qa-validation-engineer.md) — **Lead QA & Reliability Engineer:** Reviews 197+ Vitest Test Suite pass rate, Cross-App Injection Matrix, Security Red-Teaming.

### 3. User Experience & Customer Delight Committee
- [`product-manager.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/product-manager.md) — **Lead Product Manager:** Reviews RICE Score, PRD Clarity, Smart Q&A friction (<1 question max), Feature Bloat Prevention.
- [`product-designer.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/product-designer.md) — **Lead Product Designer:** Reviews Obsidian Glass Design System, 20-band Waveform Visualizer, Peripheral Distraction Score.
- [`customer-success.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/customer-success.md) — **Customer Success Lead:** Reviews Time-to-First-Value (<60s), Onboarding Friction, Custom Vocabulary Triage, NPS.
- [`users.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/users.md) — **5 ICP Personas:** Evaluates against Developer (Alex), Executive (Elena), Writer (Marcus), RSI (Maya), and Privacy (David) acceptance criteria.
- [`employee.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/employee.md) — **Startup Contributor Standards:** High-agency ownership tenets, universal dogfooding mandate, 4 pre-merge validation checks.

### 4. Visionary Advisory Board
- [`elon-musk.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/elon-musk.md) — **Elon Musk:** Audits against First-Principles Physics & the 5-Step Algorithm ("Delete the process step").
- [`jeff-bezos.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/jeff-bezos.md) — **Jeff Bezos:** Audits against Customer Obsession, Day 1 Flywheel, and the "Zero-Backspace" Rule.
- [`sam-altman.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/sam-altman.md) — **Sam Altman:** Audits against the Ambient AI Platform Shift, avoiding thin wrapper traps, YC 100-lovers doctrine.
- [`jensen-huang.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/jensen-huang.md) — **Jensen Huang:** Audits against Silicon acceleration, DirectML/NPU offloading, zero-watt background compute.
- [`andrej-karpathy.md`](file:///c:/Users/gowri\Videos/___WS_VESPER_PATH___/employees/andrej-karpathy.md) — **Andrej Karpathy:** Audits against Software 3.0 Cognitive Exocortex, Whisper autoregressive hallucination traps, Littlebird MCP synergy.

---

## ⚡ How to Run an Automated Task Verification

You can run the multi-agent task evaluator from the terminal at any time:

```powershell
# Evaluate a proposed task across the entire committee:
npm run evaluate:task -- "Add on-device SQLite caching for recent dictation transcripts"

# Or run the script directly:
node scripts/evaluate-task.cjs "Add local transcription summary caching"
```
