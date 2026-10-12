# Master Specification: Target Users, ICPs & Product Validation Personas

> **File:** `employees/users.md`  
> **Purpose:** User Archetypes, Jobs-to-be-Done (JTBD), Acceptance Criteria & Validation Test Scenarios  
> **Audience:** Entire Startup Team (Executive, Product, Engineering, Design, Growth)  

---

## 🎯 Overview & Product Validation Framework

In a real startup, features are never considered "done" simply because code compiles or unit tests pass. A feature is only validated when it satisfies the acute **Jobs-to-be-Done (JTBD)** of real users under realistic conditions.

This document outlines VESPER’s **5 Core User Personas (Ideal Customer Profiles - ICPs)**, their exact workflow environments, how they use VESPER, their dealbreaker failure modes, and the specific validation tests the team must execute before every release.

---

## 👤 Persona 1: Alex Chen — The AI-Assisted Software Engineer

```
Role: Senior Full-Stack Engineer @ High-Growth AI Startup
Primary Tools: Cursor Composer, VS Code, Windows Terminal, GitHub, Linear, Slack
Hardware: Dual 4K monitors, Mechanical Keyboard, Windows 11 Dev Box
Key Characteristic: Speaks faster than he types; heavily relies on Cursor Composer to write code.
```

### 1. Jobs-to-be-Done (JTBD)
- *"When I am formulating complex code refactoring prompts in Cursor Composer, I want to dictate my architectural intent naturally without typing 300 words, so that I can maintain flow state and iterate 3x faster."*
- *"When I notice a typo or want to rewrite a commit message, I want to dictate concise shell commands or git messages directly into my terminal."*

### 2. Daily Dictation Volume
- 40–80 dictations per day. Average duration: 4.2 seconds.

### 3. Pain Points with Traditional Tools
- Cloud Dictation Competitors is cloud-only and triggers corporate security concerns regarding proprietary source code leaks.
- Windows Speech Recognition hallucinates punctuation and scrambles technical terms (`camelCase`, `tsconfig`, `async/await`).
- Focus stealing: If the dictation window steals cursor focus from Cursor Composer, the entire prompt target is lost.

### 4. Validation Test Scenario for Alex
- **Test:** Open Cursor Composer (`Ctrl + I`), place cursor in prompt input. Hold `Right Alt`, speak:  
  *"Refactor this auth middleware to check for bearer tokens in the authorization header and return a four zero one if missing."* Release key.
- **Acceptance Criteria:**
  - Auto-pastes directly into Composer within $<250\text{ms}$.
  - Numbers formatted as digits (`401`).
  - No focus stolen; cursor remains ready in Cursor Composer.
  - Zero proprietary code audio packets leave the local machine if in Local Mode.

---

## 👤 Persona 2: Elena Rostova — The Fast-Paced Startup Founder / Executive

```
Role: Co-Founder & CEO @ Series A B2B SaaS
Primary Tools: Slack, Gmail, Superhuman, Notion, Google Docs, WhatsApp Web
Hardware: Ultra-thin Windows Laptop (Dell XPS 13 / Surface Laptop), Bluetooth AirPods
Key Characteristic: Back-to-back meetings, constantly triaging hundreds of messages on the go.
```

### 1. Jobs-to-be-Done (JTBD)
- *"When I am replying to 50 urgent Slack messages and emails between investor meetings, I want to dictate quick, professional replies that automatically strip out my rambling and verbal 'umms', so that I look polished without typing all afternoon."*

### 2. Daily Dictation Volume
- 60–120 dictations per day. Average duration: 8.5 seconds.

### 3. Pain Points with Traditional Tools
- Standard voice typing writes every "um", "ah", and mid-sentence restart verbatim, forcing her to manually edit text anyway.
- Disambiguation dialogs that ask multiple annoying questions interrupt her speed.

### 4. Validation Test Scenario for Elena
- **Test:** Open Slack message input. Hold `Right Alt`, speak:  
  *"Hey team, um, let's reschedule our product review to, uh, tomorrow at three PM instead of four because investor call ran late, thanks!"* Release key.
- **Acceptance Criteria:**
  - Pastes: *"Hey team, let's reschedule our product review to tomorrow at 3:00 PM instead of 4:00 because investor call ran late, thanks!"*
  - All filler words (`um`, `uh`) stripped seamlessly.
  - Times formatted cleanly as `3:00 PM` and `4:00 PM`.

---

## 👤 Persona 3: Marcus Vance — The Content Creator & Technical Writer

```
Role: DevRel Lead & Tech Substack Author
Primary Tools: Obsidian, Notion, Google Docs, X/Twitter, Substack Editor
Hardware: Windows 11 PC with Studio USB Condenser Microphone
Key Characteristic: Writes 3,000+ words per day; prefers voice drafting to overcome writer's block.
```

### 1. Jobs-to-be-Done (JTBD)
- *"When I am drafting long-form technical essays, I want to use Persistent Mode to speak continuous paragraphs, pause to collect my thoughts, and review the live waveform without worrying about holding down a physical key for 5 minutes."*
- *"When I highlight an awkward sentence, I want an Edit Mode shortcut to rephrase it into concise prose."*

### 2. Daily Dictation Volume
- 20–30 long-form dictations (30 seconds to 3 minutes each).

### 3. Pain Points with Traditional Tools
- Push-to-talk keys cause physical finger fatigue during long speeches.
- Long audio recordings frequently timeout or drop connection on cloud APIs.

### 4. Validation Test Scenario for Marcus
- **Test:** Open Obsidian. Double-tap `Right Alt` to enter Persistent Mode. Speak 3 sentences, click `Pause`, wait 10 seconds, click `Resume`, speak 2 more sentences, click `Done / Stop`.
- **Acceptance Criteria:**
  - Entire 5-sentence paragraph materializes in Obsidian cleanly formatted.
  - Paused interval does NOT accumulate blank audio or trigger Whisper hallucinations.
  - Persistent HUD controls (`Record`, `Pause`, `Resume`, `Done`, `Cancel`) respond instantly.

---

## 👤 Persona 4: Maya Patel — The Ergonomics & RSI-Impaired Knowledge Worker

```
Role: Senior Data Analyst
Primary Tools: Excel, PowerBI, Jupyter Notebooks, Microsoft Teams
Hardware: Ergonomic vertical mouse, split keyboard, Foot pedal / Hotkey setups
Key Characteristic: Severe Repetitive Strain Injury (RSI); typing causes acute tendon wrist pain.
```

### 1. Jobs-to-be-Done (JTBD)
- *"Because physical keyboard typing causes me severe physical pain, I want to navigate and input text into my spreadsheets and reports purely using my voice, with customizable hotkeys so I don't strain my thumbs."*

### 2. Daily Dictation Volume
- 150+ dictations per day. Replaces 80% of daily typing.

### 3. Pain Points with Traditional Tools
- Tools that hardcode `Right Alt` without letting users remap to `Left Alt`, `F8`, `Fn`, or a mouse side-button are unusable for ergonomic split keyboards.
- Low reliability forces them back into painful manual typing.

### 4. Validation Test Scenario for Maya
- **Test:** Open VESPER Settings, remap Hold-to-Talk hotkey from `Right Alt` to `F8`. Open Microsoft Excel, hold `F8`, speak a column formula description, release.
- **Acceptance Criteria:**
  - Rebound hotkey works instantly without needing an app restart.
  - Zero missed triggers across 50 consecutive invocations.

---

## 👤 Persona 5: David Miller — The Privacy-Obsessed Enterprise Professional

```
Role: Legal Counsel & Compliance Director @ Healthcare Tech Firm
Primary Tools: Microsoft Word, Outlook, PDF Acrobat, Internal Intranet
Hardware: Corporate-locked Windows Enterprise Laptop (Vulnerability scanners, VPN)
Key Characteristic: Strict HIPAA/SOC2 compliance obligations; forbidden from using unauthorized cloud AI.
```

### 1. Jobs-to-be-Done (JTBD)
- *"When I dictate sensitive contract terms and patient data summaries, I must guarantee that zero audio bytes or text transcripts leave my physical workstation, while maintaining high transcription accuracy."*

### 2. Daily Dictation Volume
- 30–50 dictations per day.

### 3. Pain Points with Traditional Tools
- Cloud-based dictation tools (Cloud Dictation Competitors, Cloud Transcription Services, Remote Cloud Speech APIs) violate enterprise compliance and data sovereignty policies.

### 4. Validation Test Scenario for David
- **Test:** Enable "100% Local Offline Mode" in VESPER Settings. Run network packet capture (Wireshark) while dictating a sensitive contract clause.
- **Acceptance Criteria:**
  - Zero outbound HTTP/WebSocket network packets to external servers.
  - Local ONNX `whisper-tiny.en` transcribes the clause with full capitalization and punctuation on-device.

---

## 📊 Summary: Release Validation Scorecard

Before any build is promoted to production, the team validates against this 5-Persona Matrix:

| Persona | Core Test | Target Metric | Status Gate |
|---|---|---|---|
| **Alex (Developer)** | Cursor Composer prompt injection | Latency $<250\text{ms}$, 0 focus stealing | Mandatory Pass |
| **Elena (Executive)** | Slack rapid-fire filler word removal | 100% "um/uh" stripped, correct time/date format | Mandatory Pass |
| **Marcus (Writer)** | Persistent Mode 3-minute recording | Zero audio clipping, zero silence hallucinations | Mandatory Pass |
| **Maya (RSI / Ergonomics)** | Hotkey remapping to `F8` / `Left Alt` | 50 consecutive invocations with 0 dropped events | Mandatory Pass |
| **David (Privacy / Enterprise)** | 100% Offline Local Mode Wireshark audit | 0 outbound network requests | Mandatory Pass |
