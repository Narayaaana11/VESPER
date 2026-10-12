# BRAIN.md — Master Architecture & Product Specification

> **Project / Working Title:** VESPER (Brand Shortlist: VAYRO, ZOVYN, VORQA)  
> **Category:** Local-First Context-Aware Voice-to-Intent-to-Action Platform  
> **Core Tagline:** *Say what you mean. Get it done.*  
> **Document Version:** 1.0.0 (Master Blueprint)

---

## Table of Contents
1. [Executive Summary & Vision](#1-executive-summary--vision)
2. [The Core Paradigm Shift](#2-the-core-paradigm-shift)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [Deep-Dive: The Pipeline Layers](#4-deep-dive-the-pipeline-layers)
   - [Layer 1: Voice Capture & Local Speech-to-Text (STT)](#layer-1-voice-capture--local-speech-to-text-stt)
   - [Layer 2: Multimodal Context Engine](#layer-2-multimodal-context-engine)
   - [Layer 3: Local AI Core (Intent, Extraction & Reasoning)](#layer-3-local-ai-core-intent-extraction--reasoning)
   - [Layer 4: Smart Q&A Disambiguation Engine](#layer-4-smart-qa-disambiguation-engine)
   - [Layer 5: Universal Task Object (UTO) Specification](#layer-5-universal-task-object-uto-specification)
   - [Layer 6: Action Router & Target Adapters](#layer-6-action-router--target-adapters)
   - [Layer 7: Security Gate & Risk Governance](#layer-7-security-gate--risk-governance)
   - [Layer 8: Action Execution & Feedback Engine](#layer-8-action-execution--feedback-engine)
5. [User Experience (UX) & Interaction Flow](#5-user-experience-ux--interaction-flow)
6. [Personalization & User Preference Memory](#6-personalization--user-preference-memory)
7. [Supported Domains & Application Adapters](#7-supported-domains--application-adapters)
8. [Concrete End-to-End Walkthrough Scenarios](#8-concrete-end-to-end-walkthrough-scenarios)
9. [Competitive Landscape & Defensibility Moat](#9-competitive-landscape--defensibility-moat)
10. [Brand Strategy & Naming Analysis](#10-brand-strategy--naming-analysis)
11. [MVP Milestone Roadmap & Phased Execution](#11-mvp-milestone-roadmap--phased-execution)

---

## 1. Executive Summary & Vision

### 1.1 The Vision
A privacy-first, context-aware AI computing layer that bridges human speech and digital execution. 

Unlike traditional dictation software (which merely transcribes speech into text) or generic prompt assistants (which require manual copy-pasting and manual engineering), this platform:
1. **Listens** to natural, messy human speech.
2. **Understands** the active environment (open window, focused editor, highlighted code/text, clipboard, active URL).
3. **Extracts Intent** and identifies missing variables.
4. **Clarifies Ambiguity** dynamically via a non-intrusive 0–3 question Smart Q&A overlay.
5. **Synthesizes a Canonical Task Object**.
6. **Routes & Executes** the optimal action across AI engines (ChatGPT, Claude, Cursor), productivity suites (Gmail, Slack, Notion), developer environments, and native OS interfaces.

```
                    OLD COMPUTING PARADIGM
Human → Think → Type → Search → Copy → Paste → Explain → Correct → Execute

                    THE VESPER / VAYRO PARADIGM
Human → Speak → [Context + Local LLM + Smart Q&A] → Execute → Done
```

---

## 2. The Core Paradigm Shift

| Dimension | Traditional Dictation (e.g. Wispr Flow, Whisper) | Generic AI Chatbot (ChatGPT, Claude) | VESPER / VAYRO Platform |
|---|---|---|---|
| **Input** | Speech audio | Text prompt entered into a chat box | Speech audio + Live system context |
| **Interpretation** | Phonetic speech-to-text | Natural language text prompt | Intent extraction + Context fusion |
| **Application Awareness** | Zero (just types text wherever cursor is) | Zero (isolated in web/app sandbox) | Full system context (App, window, file, selection, clipboard) |
| **Ambiguity Handling** | None | Over-answers or hallucinates assumptions | Dynamic Smart Q&A (0–3 multiple-choice questions) |
| **Output** | Raw transcribed text | Long chat responses | Structured Task Object executed directly into target app |
| **Privacy Model** | Often cloud API streaming | Cloud hosted | **Local-First Core** (STT + Intent LLM on device) |

---

## 3. System Architecture Overview

```
                                👤 USER SPEECH
                                       │
                                       ▼
                        ┌───────────────────────────────┐
                        │   Layer 1: Voice & STT Engine │
                        │  (Local Whisper / Moonshine)  │
                        └──────────────┬────────────────┘
                                       │ Raw Transcript
                                       ▼
    ┌──────────────────────┐   ┌───────────────────────────────┐
    │  System Telemetry    │──▶│ Layer 2: Multimodal Context   │
    │  (App, Selection,    │   │ Engine (OS Accessibility API, │
    │  Clipboard, Window)  │   │ Active Tabs, File Metadata)   │
    └──────────────────────┘   └──────────────┬────────────────┘
                                              │ Transcript + Context Bundle
                                              ▼
                               ┌───────────────────────────────┐
                               │ Layer 3: Local AI Core        │
                               │ (Llama 3.2 / Qwen 2.5 / Gemma)│
                               │ - Intent Classification       │
                               │ - Slot Filling & Parameters   │
                               │ - Ambiguity Assessment        │
                               └──────────────┬────────────────┘
                                              │
                       ┌──────────────────────┴──────────────────────┐
                       │ (Ambiguity Detected?)                       │
                      YES                                            NO
                       ▼                                             │
        ┌─────────────────────────────┐                              │
        │ Layer 4: Smart Q&A Engine   │                              │
        │ Minimalist Overlay (0-3 Qs) │                              │
        │ User taps keyboard / voice  │                              │
        └──────────────┬──────────────┘                              │
                       │ User Selections                             │
                       └──────────────────────┬──────────────────────┘
                                              │ Complete Specification
                                              ▼
                               ┌───────────────────────────────┐
                               │ Layer 5: Universal Task       │
                               │ Object (UTO) Builder          │
                               └──────────────┬────────────────┘
                                              │ Canonical JSON Task
                                              ▼
                               ┌───────────────────────────────┐
                               │ Layer 6: Action Router        │
                               │ Adapters: AI / App / OS       │
                               └──────────────┬────────────────┘
                                              │
                                              ▼
                               ┌───────────────────────────────┐
                               │ Layer 7: Security Gate        │
                               │ Risk Scoring (Low/Med/High)   │
                               │ Permission Enforcement        │
                               └──────────────┬────────────────┘
                                              │ Safe Action Payload
                                              ▼
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
   🤖 AI / Code Adapters      💬 Comms Adapters          🖥️ OS & Automation
  (Cursor, VS Code, Claude,   (Gmail, Slack, Outlook,    (File Manager, App
   ChatGPT, Gemini API)        Teams, Discord)            Launcher, Browser)
         │                            │                            │
         └────────────────────────────┼────────────────────────────┘
                                      ▼
                         Layer 8: Execution & Result
```

---

## 4. Deep-Dive: The Pipeline Layers

### Layer 1: Voice Capture & Local Speech-to-Text (STT)
- **Mechanism:** Global hotkey (e.g. `Ctrl + Space` or long-press configurable key) activates low-latency audio capture.
- **Engine:** On-device local STT:
  - *Whisper.cpp* / *faster-whisper* (Medium/Small quantized models).
  - Alternatives: *Moonshine* or *SenseVoice* for ultra-low latency (<200ms TTFT).
- **Output:** Normalized audio stream converted into raw text string with timestamps and vocal pauses preserved.

### Layer 2: Multimodal Context Engine
Runs silently in background with strict user-permission boundaries:
1. **Active Application:** Win32 / macOS accessibility APIs detect process name (e.g., `cursor.exe`, `chrome.exe`, `slack.exe`).
2. **Window & Document Title:** Extracts active tab title, document name, or project workspace path.
3. **Selected Text:** Captures active highlighted text without modifying clipboard buffer.
4. **Clipboard State:** Reads current clipboard snippet (if recent and relevant).
5. **DOM / Web Inspector (Browser Extension / Accessibility):** For Chrome/Brave/Edge, captures active URL and page context.
6. **Optional Vision/Screen OCR:** Tesseract or fast screen-crop analysis enabled only when explicitly toggled on by user.

### Layer 3: Local AI Core (Intent, Extraction & Reasoning)
- **Model:** Lightweight local quantized LLM (e.g., *Qwen-2.5-3B/7B-Instruct*, *Llama-3.2-3B*, or *Gemma-2-2B*) running via llama.cpp or Ollama.
- **Role:**
  - **Intent Classification:** Maps user request into canonical domain intent (e.g. `code.generate`, `email.reply`, `doc.rewrite`, `search.compare`, `sys.control`).
  - **Entities & Slots:** Identifies tone, constraints, technologies, recipients, dates, deadlines.
  - **Ambiguity Detection:** Evaluates whether critical parameters are missing before execution can proceed deterministically.

### Layer 4: Smart Q&A Disambiguation Engine
- **Philosophy:** Never interrogate the user. Ask **0 to 3 questions maximum**, and only when executing without an answer would produce unsatisfactory results or guess incorrectly.
- **Form Factor:** Fast keyboard-navigable overlay (Keys `1`, `2`, `3`, `4` or direct voice response).
- **Example:**
  - User: *"Build me a dashboard for tracking crypto prices."*
  - Local Core recognizes `tech_stack` is ambiguous.
  - Overlay:
    ```
    ┌──────────────────────────────────────────────┐
    │ Technology Stack?                            │
    │ [1] Next.js + Tailwind  (Your Default)       │
    │ [2] HTML + CSS + Vanilla JS                  │
    │ [3] React + Vite                             │
    │ [4] Python Streamlit                         │
    └──────────────────────────────────────────────┘
    ```
  - User presses `1` → Instant resolution.

### Layer 5: Universal Task Object (UTO) Specification
All actions are serialized into a standardized, deterministic JSON contract:

```json
{
  "$schema": "https://vesper.dev/schemas/task-v1.json",
  "taskId": "task_8923a1fc",
  "timestamp": "2026-09-07T23:00:00Z",
  "source": {
    "rawSpeech": "Create a modern portfolio website with HTML CSS and JS dark theme with contact form",
    "sttConfidence": 0.98
  },
  "context": {
    "activeApp": "Cursor",
    "windowTitle": "portfolio-dev - Cursor",
    "projectRoot": "C:/Projects/portfolio",
    "selectedText": null,
    "clipboardPreview": null
  },
  "intent": {
    "domain": "coding",
    "category": "generate_project",
    "action": "scaffold_and_prompt"
  },
  "specifications": {
    "technology": ["html", "css", "javascript"],
    "styling": ["dark_theme", "modern", "responsive", "smooth_animations"],
    "components": ["hero", "about", "skills", "projects", "contact_form"],
    "targetFiles": ["index.html", "style.css", "app.js"]
  },
  "targetRouting": {
    "adapter": "cursor_composer",
    "deliveryMethod": "ipc_or_keystroke_injection",
    "optimizedPrompt": "Create a modern, responsive personal portfolio website with a sleek dark theme, smooth micro-animations, and a functional contact form. Technology stack: HTML5, modern CSS3, and vanilla JavaScript. Provide complete, production-ready code split across index.html, style.css, and app.js."
  },
  "security": {
    "riskLevel": "low",
    "requiresUserConfirmation": false
  },
  "rawTranscript": "Create a modern portfolio website with HTML CSS and JS dark theme with contact form",
  "normalizedTranscript": "Create a modern portfolio website with HTML CSS and JS dark theme with contact form",
  "finalInterpretation": {
    "action": "scaffold_and_prompt",
    "intent": "generate",
    "recipient": null
  },
  "inputMode": "voice",
  "activeApplication": "Cursor",
  "activeWindow": "portfolio-dev - Cursor",
  "executionState": "planned",
  "verificationState": "pending"
}
```

#### 🛡️ Semantic Drift Guard
VESPER enforces strict immutability of the original user speech:
- `rawTranscript`: Stored immutably without mutation.
- `normalizedTranscript`: Polished/expanded text.
- `finalInterpretation`: Structured action intent.
- **Negation Inversion Protection:** Evaluates negative phrases (*"don't send"*, *"do not send"*, *"never"*, *"draft only"*). If user says *"Reply saying I will send the report tomorrow, but don't send it yet"*, the semantic drift guard guarantees the action remains strictly `compose_draft_only` and prevents accidental transmission.

### Layer 6: Action Router & Target Adapters
Translates the UTO into the dialect of the target ecosystem:
- **AI Coding Assistants (Cursor / VS Code Copilot):** Generates structured system-prompted coding instructions, opens composer/chat window, pastes formatted spec.
- **Cloud LLM APIs (ChatGPT / Claude / Gemini / Groq):** If user selects cloud generation, passes an expertly engineered prompt with context markdown.
- **Communication (Gmail / Outlook / Slack / WhatsApp):** Prepares clean, professionally phrased replies directly into the draft composition window.
- **Universal Action System:** Modular execution subsystem supporting `typeText`, `pasteText`, `openApp` (OS launcher), `openURL`, `createFile`, `editFile`, `saveFile`, and `runCommand`.
- **Reversal & Undo Stack:** Reversible actions (file creations, file edits) push state to an undo stack allowing instant rollback via `undoLastAction`.

### Layer 7: Security Gate & Risk Governance
Strict security tiers prevent unauthorized autonomous operations:

| Risk Level | Operations | Verification Protocol |
|---|---|---|
| **Low Risk** | Typing text into active field, copying to clipboard, drafting an email, opening apps | **Autonomous Execution** (per user settings) with instant undo |
| **Medium Risk** | Creating new files, editing files, navigating browser tabs, running safe commands | **Soft Confirmation / Verification** with pre-flight check |
| **High Risk** | Sending emails, sending chat messages, deleting files, running destructive shell commands | **Explicit Confirmation Required** (User must press [Enter] or confirm via voice) |

### Layer 8: Action Execution, Verification & Screen Guidance
- **Pre-flight Context Revalidation:** Validates target HWND and application before injection. If the user switched from Cursor to WhatsApp or Notepad during AI generation, auto-paste safely pauses to protect against unintended data injection.
- **Post-Action Verification:** Verifies clipboard contents, file timestamps, process launches, and execution success.
- **AI Visual Cursor & Screen Guidance:** Dedicated non-destructive overlay displaying concentric radar pulses, directional arrow pointers, and step-by-step guidance cards for navigating complex software without stealing keyboard focus.
- **Context & Privacy Inspector:** Provides transparent visibility into *"What VESPER Knows"*, context relevance ranking scores, explanation of why context was selected, and automatic secret redaction logs.

---

## 5. User Experience (UX) & Interaction Flow

### 5.1 Dual-Window Desktop Architecture
VESPER adopts the authentic Wispr Flow desktop architecture:
1. **Primary Desktop Application Window (`dashboardWindow`):**
   - **Launch Flow:** When the user searches for VESPER in Windows, clicks the Start Menu entry, or clicks the desktop shortcut, the **VESPER Flow Hub Dashboard** opens immediately.
   - **Second-Instance Guard:** If already running, searching and clicking VESPER in Windows triggers `app.on('second-instance')`, instantly restoring and focusing the Dashboard window.
   - **Background Persistence:** Closing the Dashboard with `✕` hides it to the background/system tray without exiting the process, keeping voice dictation available 24/7.
   - **Standard Wispr Flow Hub (Zero Fake AI Data):**
     - **History:** Authentic logs of actual user dictations only (empty state on fresh install), duration, word count, one-click copy, and re-paste.
     - **Dictionary:** Custom vocabulary to teach Whisper technical jargon.
     - **Snippets:** Voice trigger phrases that expand into rich templates.
     - **Style:** Context polishing tone, formatting preferences, and "English Letters Only" transliteration.
     - **Settings:** Hotkey selection (`RIGHT ALT`, `LEFT ALT`, `F8`), Groq API key, model toggles, and auto-paste behavior.

2. **Floating Voice Capsule Window (`capsuleWindow`):**
   - Compact floating overlay (140×58) with the React Bits Pro AI Chat 8 live waveform.
   - Intercepts **`RIGHT ALT`** globally across any active Windows application.
   - Transcribes via Groq Whisper-large-v3, polishes via Llama, auto-pastes directly into the focused input, and syncs to the Dashboard via `BroadcastChannel('vesper_flow_sync')`.

```
[Any Windows Application: VS Code, Chrome, Slack, Word] 
  │
  │ Hold [RIGHT ALT] (or single-tap)
  ▼
┌─────────────────────────────────────────┐
│ 🎙️ Waveform Active (React Bits Pro)     │
│ "Reply to John saying 3 PM works best"  │
└─────────────────────────────────────────┘
  │ Release [RIGHT ALT]
  ▼
┌─────────────────────────────────────────┐
│ ⚡ Polishing with Screen Context...      │
│ Whisper-large-v3 → Validation → Llama   │
└─────────────────────────────────────────┘
  │ Auto-Paste (Ctrl + V)
  ▼
┌─────────────────────────────────────────┐
│ ✅ Inserted into active text field      │
│ Logged directly to Flow Hub History     │
└─────────────────────────────────────────┘
```

---

## 6. Personalization & User Preference Memory

The system learns preferences over time through a local vector/JSON store without leaking data:
- **Coding Stack Defaults:** Automatically infers developer preferences (e.g. Next.js vs Vite, Tailwind vs Vanilla CSS, TypeScript vs JS) based on past choices.
- **Communication Tone:** Adapts to user's habitual tone (Concise, Warm, Formal, Casual) across specific contacts or apps.
- **Privacy & Telemetry Controls:** Complete user inspection of all stored memories; one-click purge or edit.

---

## 7. Supported Domains & Application Adapters

### 💻 Developer & AI Tools
- **Cursor / VS Code:** Detects project tree, active file, syntax errors, and sends optimized refactor or generation tasks.
- **ChatGPT / Claude Web & Desktop:** Turns casual voice requests into multi-shot engineered prompts matching the respective model’s strengths.

### 💬 Communication & Collaboration
- **Gmail & Outlook:** Ingests incoming email thread context; drafts contextually relevant replies.
- **Slack & Microsoft Teams:** Formats quick standups, message rewrites, bullet summaries, channel announcements.

### 🌐 Browsing & Web Research
- **Chrome / Brave / Edge:** Extracts active webpage content, triggers comparison queries, summarizes long documentation.

### 📄 Documents & Notes
- **Notion, Google Docs, Obsidian:** Formats brain dumps into structured markdown, task lists, or meeting minutes.

### 🖥️ Native OS & Desktop Automation
- Application launch, workspace switching, file tagging, batch renaming, screenshot extraction.

---

## 8. Concrete End-to-End Walkthrough Scenarios

### Scenario A: Complex Coding Directive in Cursor
1. **User Action:** User is in `Cursor` with `App.tsx` open. Presses hotkey.
2. **User Voice:** *"I want a floating action button at the bottom right with smooth hover animations and a tooltip that links to support."*
3. **Context Harvest:** Active App = Cursor, File = `App.tsx`, Technology = React + Tailwind (inferred from `package.json`).
4. **Local LLM Processing:** Identifies missing placement specifics (fixed vs absolute).
5. **Q&A Trigger:** Prompts: *"Should the button open an email link, modal, or custom URL?"*
6. **User:** *"Modal."*
7. **Execution:** Constructs optimized Cursor Composer prompt with exact component specs, Tailwind tokens, and modal state hook instructions.

### Scenario B: Sensitive Email Reply in Gmail
1. **User Action:** Viewing a client email requesting a project deadline extension.
2. **User Voice:** *"Tell him we can accept Monday, but we need the signed contract today."*
3. **Context Harvest:** Sender = `David`, Subject = `Project Schedule Extension`, Tone = Professional.
4. **Risk Gate:** Drafting = Low Risk; Sending = High Risk.
5. **Execution:** Types draft into Gmail reply box. Keeps the "Send" button guarded until the user explicitly confirms.

---

## 9. Competitive Landscape & Defensibility Moat

### Why competitors cannot easily replicate this:
1. **Not just a Speech Model:** A faster Whisper model does not solve the context-routing problem.
2. **Not just a Wrapper:** The **Multimodal Context Engine + Universal Task Object (UTO)** standard is the proprietary glue that translates messy human input into multi-app execution.
3. **Local Privacy Guarantee:** Enterprises and power users refuse to stream entire desktop telemetry and microphone audio to third-party cloud servers. Local inference is a non-negotiable differentiator.
4. **The Adapter Ecosystem:** Once deep integration exists across 20+ applications (IDEs, browsers, email, messaging, OS shells), switching costs become high.

---

## 10. Brand Strategy & Naming Analysis

### Final Candidate Review:
- **VESPER (Current Workspace Working Title):** Strong, punchy, 5 letters. Distinctive sound.
- **VAYRO (Top Strategic Alternative):** Fast, intelligent, non-constraining (*"Say what you mean. Get it done"*). High brand scalability beyond voice.
- **ZOVYN / VORQA / ZEVON:** Futuristic, high-tech alternatives.

---

## 11. MVP Milestone Roadmap & Phased Execution

```mermaid
gantt
    title VESPER / VAYRO Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Engine (Weeks 1-3)
    Local STT (Whisper/Moonshine Integration)     :done,    p1_1, 2026-09-01, 2026-09-08
    OS Context Harvest Engine (Win32/Accessibility):active,  p1_2, 2026-09-08, 2026-09-18
    Local LLM Intent Classification Pipeline      :         p1_3, 2026-09-15, 2026-09-24
    section Phase 2: MVP UI & Routing (Weeks 4-6)
    Smart Q&A Minimalist Overlay (Electron / Rust):         p2_1, 2026-09-22, 2026-10-06
    Universal Task Object (UTO) Serialization     :         p2_2, 2026-10-01, 2026-10-12
    Adapters: Cursor, ChatGPT, Gmail, Slack       :         p2_3, 2026-10-08, 2026-10-20
    section Phase 3: Security & Polish (Weeks 7-8)
    Security Gate & Risk Governance Layer         :         p3_1, 2026-10-18, 2026-10-28
    Local Memory & Adaptive Preference Engine     :         p3_2, 2026-10-25, 2026-11-05
```

### Phase 1: MVP Core (Deliverable)
- Global hotkey listener + audio recorder.
- Local STT transcription (<300ms).
- Active window / app detection.
- Local LLM intent detection (Qwen-2.5-3B or Llama-3.2-3B).
- 0–3 Question interactive disambiguation modal.
- Targeted text/prompt delivery into Cursor, ChatGPT, and Gmail.

---

## 12. Active Codebase Architecture, Implemented Components & Current State

### 12.1 Real-Time Audio Capture & Hardware Integration
- **Hold-to-Talk & Persistent Mode (`src/main/hold-to-talk.ts`):**
  - Uses `node-global-key-listener` with bundled native server `WinKeyServer.exe`.
  - Default activation key: **`RIGHT ALT`** (or configured via settings).
  - **Hold-to-Talk:** Depressing key triggers immediate recording (`onHoldToTalkStart`). Releasing key triggers immediate stop and paste (`onHoldToTalkEnd`).
  - **Persistent Click-to-Record:** Double-tap or single-tap activates locked recording mode with on-screen cancel (`✕`) and finish controls.
  - Software debounce (`DEBOUNCE_MS = 80ms`) and safety timeout (`SAFETY_TIMEOUT_MS = 120s`) prevent orphaned recording sessions.
- **Audio Lifecycle & Leak Prevention (`src/renderer/src/core/audio-recorder.ts`):**
  - Zero-latency recording start using Web Audio API `AudioContext` and `AnalyserNode`.
  - Clean lifecycle: buffer array `audioChunks = []` is cleared on both `start()` and `stop()`.
  - `stop()` returns a `RecordingSessionResult` confirming that `MediaRecorder.state === 'inactive'`, returning duration in ms, byte size, chunk count, and MIME type.
  - Developer debug tap: raw recordings automatically dumped to `debug-recordings/recording-...webm` during development.

### 12.2 Single Authoritative STT & Anti-Hallucination Pipeline
- **Engine Selection (`src/renderer/src/core/groq-service.ts`):**
  - Authoritative Engine: Groq Whisper-large-v3 (`whisper-large-v3`).
  - Completely detached legacy Chromium `webkitSpeechRecognition` to eliminate production `Speech error: network` exceptions in Electron.
  - Default Whisper request prompt purged (`prompt: ''`), completely eliminating Whisper prompt-echo hallucinations (such as `"EVRA voice dictation"` or `"END OF TRANSCRIPT END OF TRANSCRIPT"`).
- **Dual-Gate Transcription Validation (`src/renderer/src/core/transcription-validator.ts`):**
  - **Pre-Llama Gate (`validateWhisperTranscript`):**
    - Enforces physical recording thresholds: duration `>= 300ms`, audio byte size `>= 500 bytes`. Silent taps are safely rejected with *"Transcription unclear — please try again"*.
    - Rejects pure punctuation, empty audio, or known Whisper hallucination strings.
    - Halts word/phrase repetition loops before reaching downstream LLMs.
  - **Post-Llama Gate (`validatePolishedOutput`):**
    - Traps AI conversational preambles (`"Here is the polished text:"`) and token leakage before auto-pasting.
- **Multilingual Support with Romanized/English Letters:**
  - Setting: `englishLettersOnly: true`.
  - Transcribes and translates non-English languages (Hindi, Spanish, Telugu, Tamil, French, etc.) into clean English letters, allowing international users to speak naturally while producing Romanized output.

### 12.3 Context-Aware Polishing & Autonomous Agent
- **Screen-Aware Context Engine (`src/main/context-detector.ts`):**
  - Uses native Win32 C# executable `detect-window.exe` to harvest foreground window title, process name, and active application context in <15ms.
- **Active Polishing Engine (`src/renderer/src/core/groq-service.ts`):**
  - Fast cloud inference via Groq Llama-3.3-70b-versatile, with fallback to local Ollama (`llama3.2`).
  - Injects target application context (e.g. Cursor, Slack, Gmail, Terminal) to adjust tone, formatting, and markdown semantics.
- **Autonomous Desktop Agent (`src/renderer/src/core/screen-agent.ts`):**
  - Autonomous task planning with multi-step action execution.
  - Human-in-the-Loop (HITL) safety gate: destructive or high-impact actions display an interactive `AgentApprovalCard` before running.

### 12.4 Floating Capsule Design System & Zero-Clipping HUD
- **Obsidian Glass Design Language (`src/renderer/src/styles/hud.css`):**
  - Modern floating voice capsule styled with a rounded rectangle format (`border-radius: 14px`), obsidian gradients (`#1c1c20` to `#111114`), and subtle ambient glow.
  - Left drag-handle section (`.wf-drag-handle-section`) enabling fluid window repositioning anywhere on screen.
- **React Bits Pro AI Chat 8 Audio Levels Waveform (`src/renderer/src/components/AudioVisualizer.tsx`):**
  - 20 symmetrical, center-weighted rounded pills (`4px` wide, `3px` gap).
  - Dynamic volume expansion: smoothly transitions from subtle idle circular dots (`5px`) to active vertical audio capsules (up to `24px`) based on real-time microphone amplitude.
- **Dynamic Window Headroom & Zero-Clipping Architecture:**
  - Transparent, frameless Electron window (`transparent: true, frame: false`).
  - Generous transparent breathing room prevents high-DPI Windows edge clipping and box-shadow cut-off:
    - **Idle / Ready:** `140px × 58px`
    - **Active Listening (Hold-to-Talk):** `240px × 58px` (pill is ~180px, with 30px transparent buffer on each side)
    - **Active Listening (Persistent Mode):** `280px × 58px` (accommodates `✕` cancel button)
    - **Status / Polishing:** `270px – 360px × 58px`
    - **Attached Popover Menu:** `245px × 205px`
  - Streamlined UX: Removed legacy preset clutter and expand bars; the options menu (`...`) is hidden during active speech so the capsule remains focused exclusively on the live waveform.

### 12.5 Codebase Inventory & Verification Status

```
C:\Users\gowri\Videos\___WS_VESPER_PATH___
├── .agents
│   └── mcp_config.json            # Antigravity & IDE Model Context Protocol configuration
├── resources
│   ├── models/transformers-cache  # Local ONNX weights (all-MiniLM-L6-v2, whisper-tiny.en)
│   └── scripts/preload-models.cjs # Local model asset verification and preloader
├── src
│   ├── main
│   │   ├── action-executor.ts         # Clipboard & keyboard injection (auto-paste)
│   │   ├── binary-resolver.ts         # Bulletproof native executable locator
│   │   ├── context-detector.ts        # Win32 active window telemetry
│   │   ├── detect-window.exe          # Native foreground window detector
│   │   ├── hold-to-talk.ts            # Global key listener (RIGHT ALT hold/double-tap)
│   │   ├── hotkey.ts                  # Electron global shortcuts
│   │   ├── index.ts                   # BrowserWindow lifecycle & HTTP MCP listener (32123)
│   │   ├── ipc-handlers.ts            # Main-Renderer IPC (local vector RAG + local Whisper STT)
│   │   ├── mcp-runner.ts              # Standalone stdio MCP runner
│   │   ├── mcp/vesper-mcp-server.ts    # Ambient computer context Littlebird MCP server
│   │   ├── send-input.exe             # High-speed native keystroke injector
│   │   ├── WinKeyServer.cs            # Native Win32 C# low-level keyboard hook server source
│   │   └── WinKeyServer.exe           # Zero-dependency 64-bit Windows keyboard server
│   ├── preload
│   │   └── index.ts                   # Context-isolated safe bridge (electronAPI)
│   └── renderer
│       ├── src
│       │   ├── App.tsx                # Central state orchestrator with intelligent local/cloud failover
│       │   ├── components
│       │   │   ├── AgentApprovalCard.tsx  # HITL action approval card
│       │   │   ├── AudioVisualizer.tsx    # React Bits Pro AI Chat 8 audio waveform
│       │   │   ├── ContextBadge.tsx       # Active app indicator
│       │   │   ├── SettingsModal.tsx      # Config modal (API keys, models, hotkeys, local mode)
│       │   │   ├── SmartQAOverlay.tsx     # Disambiguation question card
│       │   │   ├── TaskPreviewCard.tsx    # Canonical task preview
│       │   │   └── WisprFlowDashboard.tsx # Flow Hub (History, Dictionary, Snippets, Style)
│       │   ├── core
│       │   │   ├── adapters.ts            # App-specific payload formats (Cursor, Slack, etc.)
│       │   │   ├── ai
│       │   │   │   ├── ai-factory.ts      # Provider factory (Groq, Local Ollama, Rule-Based)
│       │   │   │   ├── local-provider.ts  # Local Ollama provider with deterministic fallback
│       │   │   │   └── rule-provider.ts   # 100% offline deterministic rule engine
│       │   │   ├── audio-recorder.ts      # Web Audio API capture with clean lifecycle
│       │   │   ├── disambiguation.ts      # Intent clarification & slot filling
│       │   │   ├── groq-service.ts        # Hybrid STT dispatcher & local rule polisher
│       │   │   ├── intent-classifier.ts   # Intent classification engine
│       │   │   ├── intent-engine.ts       # Intent orchestrator
│       │   │   ├── local-vector-rag.ts    # In-process semantic vector indexing via Transformers.js
│       │   │   ├── memory-manager.ts      # User preferences and adaptive context
│       │   │   ├── screen-agent.ts        # Autonomous desktop agent
│       │   │   ├── security-gate.ts       # 3-tier risk governance (Safe/Moderate/Destructive)
│       │   │   ├── selection-transformer.ts # In-place text transformation (Edit Mode)
│       │   │   ├── task-validator.ts      # Universal Task Object validator
│       │   │   └── transcription-validator.ts # Pre- & post-Llama validation gates
│       │   ├── styles
│       │   │   ├── dashboard.css          # Flow Hub styles
│       │   │   └── hud.css                # Obsidian glass design system & waveforms
│       │   └── types
│       │       └── task.ts                # Master TypeScript schemas
│       └── tests                          # 27 Test suites, 197 unit & integration tests
```

- **Testing Status:** 100% Passing (197 of 197 tests pass across 27 test files via Vitest).
- **Build Status:** Clean SSR Main, Preload, and Renderer production bundle via `electron-vite build`.

---

## 13. Local-First Compute Engine, Zero-API Offline Mode & MCP Integration

### 13.1 100% On-Device Compute Architecture (Zero Cloud Dependency)
VESPER functions as a completely autonomous, local-first computing platform when no cloud API keys are provided or when the user is working completely offline:

1. **Push-to-Talk Native Voice Capture (Hold `Right Alt` / `Any Alt`):**
   - Managed via native `HoldToTalkManager` and `WinKeyServer.exe` with low-level keyboard hooks.
   - Holding down Right Alt triggers instant microsecond audio streaming via `AudioRecorder` with visual Obsidian-glass audio visualizers.
   - Releasing Right Alt seamlessly finalizes the audio buffer and initiates the transcription & rephrasing pipeline.

2. **Whisper Turbo v3 Speech-to-Text Pipeline (`transcribeAudio`):**
   - **Whisper Turbo v3 Model:** Defaults to `whisper-large-v3-turbo` for state-of-the-art dictation accuracy and ultra-fast inference speed.
   - **Intelligent Dual-Engine Dispatcher:** When a Groq API key is present and online, requests run on Groq LPUs at ~250 words per second. If offline, in local mode, or if no API key is configured, VESPER automatically routes to the local on-device Whisper ONNX engine.
   - **Local Inference (`vesper:transcribe-local`):** Native Web Audio API decodes audio into 16kHz mono `Float32Array` PCM samples. Electron IPC invokes `@xenova/transformers` with local ONNX models cached in `resources/models/transformers-cache` with zero network calls.

3. **Context-Aware LLM Rephrasing & Dictation Polishing:**
   - **Ollama Local LLM (`polishWithOllama`):** Connects to on-device Ollama (`http://localhost:11434`, model `llama3.2` or configurable) to rephrase raw speech, fix domain jargon, and format syntax.
   - **Cloud Llama 3.3 70B (`polishWithGroqLlama`):** When Groq is connected, leverages 70B parameters for deep reasoning and complex prompt formatting.
   - **Deterministic Local Rule-Based Engine (`polishWithLocalRules`):** 100% offline fallback (<2ms latency). Eliminates fillers (`um`, `uh`, `you know`), resolves spoken self-corrections (`"three no wait four PM"` $\rightarrow$ `"4:00 PM"`), cleans stutter, formats numbers/code tokens (`camelCase`, `Pull Request`), and strips trailing Whisper silence hallucinations.

4. **Prompt Engineering & Application Adapter Routing:**
   - The polished text is ingested into `processIntent` and the Universal Task Object (UTO) pipeline.
   - `ApplicationAdapterRegistry` detects active window context (Cursor Composer, Antigravity IDE, VS Code, Gmail, Slack, Terminal, Browser) and generates engineered prompts tailored for that environment.
   - `executeAction` automatically types or pastes the engineered prompt directly at the user's cursor.

5. **In-Process Semantic Vectors (`LocalVectorRAG`):**
   - Employs `Xenova/all-MiniLM-L6-v2` locally cached in `resources/models/transformers-cache` for 384-dimensional vector embeddings with zero external API calls.

### 13.2 Model Asset Preloader (`preload-models.cjs`)
A turnkey script pre-caches and verifies all required ONNX models locally:
```powershell
npm run preload-models
```
- Downloads and verifies `Xenova/all-MiniLM-L6-v2` (semantic search and Littlebird receipts).
- Downloads and verifies `Xenova/whisper-tiny.en` (quantized local speech recognition).

### 13.3 Littlebird Parity Context MCP Server
VESPER includes a dual-mode Model Context Protocol (MCP) server providing real-time desktop context to AI assistants (Antigravity, Cursor, Claude Desktop):
- **HTTP Transport:** Runs continuously on `http://127.0.0.1:32123/mcp` with CORS support.
- **Stdio Transport:** Executable via `npm run mcp` or configured in `.agents/mcp_config.json`:
  ```json
  {
    "mcpServers": {
      "vesper-context": {
        "command": "node",
        "args": ["out/main/mcp-runner.js"]
      }
    }
  }
  ```
- **Tools Exposed:**
  1. `search_user_context`: Hybrid semantic & keyword recall over user desktop timeline, active windows, and speech with verifiable Littlebird receipts.
  2. `get_day_reconstruction`: Rebuilds ambient context into dev logs, application usage minutes, files edited, and ready-to-paste changelogs.
  3. `get_active_screen_context`: Real-time active foreground window, application, category, and workspace path.

### 13.4 Native Standalone Windows Keyboard Hook Server (`WinKeyServer.cs`)
- **Diagnosis of Prior Flaw:** Third-party npm package `node-global-key-listener` packaged an outdated 32-bit `WinKeyServer.exe` compiled with MinGW, which had an unbundled dependency on `libgcc_s_dw2-1.dll`. When spawned on Windows systems without this MinGW DLL, Windows exited with `"The system cannot execute the specified program"`, producing silent Node `spawn UNKNOWN` (errno -4094) errors and preventing global keyboard hooks from attaching.
- **Native C# Architecture:** Replaced with `src/main/WinKeyServer.cs`, compiled using Windows' built-in .NET 64-bit compiler (`C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe`).
- **Hook Mechanics:**
  - Installs a global `WH_KEYBOARD_LL` (id: 13) hook via Win32 `SetWindowsHookEx`.
  - Captures `WM_KEYDOWN` (0x0100), `WM_SYSKEYDOWN` (0x0104), `WM_KEYUP` (0x0101), and `WM_SYSKEYUP` (0x0105). Capturing `WM_SYSKEY*` is essential for catching single Alt modifier key presses (`VK_RMENU` / 165, `VK_LMENU` / 164, and `VK_MENU` / 18).
  - Emits normalized stdout lines (`1,{DOWN|UP},{vKey},{scanCode},0,0,{eventId}`) directly consumed by `HoldToTalkManager`.
  - **Zero External Dependencies:** Statically linked against standard Windows system runtimes with a file footprint of only 6.6 KB.
  - Automatically distributed to `src/main/WinKeyServer.exe`, `resources/bin/WinKeyServer.exe`, `out/bin/WinKeyServer.exe`, and `node_modules/node-global-key-listener/bin/WinKeyServer.exe`.

### 13.5 Floating Capsule UI Lifecycle & Visibility
- **Instant Display on Ready:** In `src/main/index.ts`, `capsuleWindow.on('ready-to-show')` executes `capsuleWindow.showInactive()` and `capsuleWindow.setAlwaysOnTop(true, 'screen-saver')`. The floating pill appears immediately at the top center of the screen (`y = 45`) without stealing focus from the active foreground window.
- **Adaptive Resizing:** The capsule dynamically resizes via IPC (`vesper:resize-window`):
  - **Idle Capsule:** 140px × 58px.
  - **Active Listening:** 240px × 58px (or 280px in persistent mode) with animated 20-bar audio waveform.
  - **Analyzing / Status:** 270px–360px × 58px.
  - **Settings / Disambiguation / Proposal:** 580px × 240px–430px.
  - **Dashboard Mode:** 1040px × 680px.

### 13.6 Windows Environment & PowerShell Execution Policy
- If running bare `npm` triggers a Windows Execution Policy error (`File ... npm.ps1 cannot be loaded because running scripts is disabled`), execute:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
  ```
  Or alternatively use the Windows Command batch wrapper:
  ```powershell
  npm.cmd run dev
  ```

### 13.7 VESPER Mobile (Flutter Android Client Architecture)
- **Directory:** `vesper_mobile/`
- **Architectural Pattern:** Layered MVVM (Data, Domain, Presentation) following Flutter official best practices.
- **Capabilities Matrix:**
  - **100% On-Device Offline Speech Processing:** Local Android STT coupled with a pure Dart deterministic rule polisher (`LocalPolisherService`) running in <1ms without any external network dependency.
  - **Dynamic Audio Waveform:** 20-bar animated audio wave reacting to live microphone decibel amplitude (`AnimatedWaveform`).
  - **Auditory Cues & Tactile Haptics:** Synthesized start, stop, and success chimes (`AudioChimesService`) and micro-haptic pulses (`HapticService`).
  - **Flow Hub Parity:** Dictation History timeline, Voice Snippets expansion, Custom Vocabulary phonetic replacement, Polishing Tone profiles (Natural, Concise, Formal, Bullets, Transliteration), and Ambient AI thought assistant.
  - **System-Level Android Integration:** Floating microphone capsule (`SYSTEM_ALERT_WINDOW`), auto-copy to clipboard, and native Android sharing sheet (`share_plus`).
