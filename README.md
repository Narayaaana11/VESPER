# QEVRA Desktop (Wispr Flow Ambient Intelligence)

> **Local-First Context-Aware AI Voice-to-Action & Direct Dictation Platform**  
> *Say what you mean. Get it done.*

---

## 🌟 Key Capabilities

### 1. 🎙️ Hold-to-Talk (Wispr Flow Default)
- **Zero Focus Stealing:** Hold `Right Alt` (or `F8` / `Fn` / configured key) $\ge 180\text{ms}$. The floating capsule appears seamlessly at the top of your screen *without stealing focus from your cursor*.
- **Auto-Paste at Cursor:** Release the key to immediately finalize transcription and auto-paste directly into your active application (`Cursor`, `VS Code`, `Google Chrome`, `Slack`, `Notepad`, `Discord`, etc.).

### 2. ⚡ Double-Tap Persistent Mode
- **Interactive Floating Capsule:** Double-tap `Right Alt` (or configured key) within $380\text{ms}$ to open the persistent control overlay.
- **Granular Controls:**
  - **Record / Speak:** Begin voice recording.
  - **Pause / Resume:** Temporarily pause microphone capture while preserving your transcript.
  - **Done / Stop & Insert:** Complete dictation and inject into the active window.
  - **Cancel:** Discard recording and return to idle.

### 3. 🎯 Direct Voice Dictation vs. Smart AI Assistant
- **Direct Dictation (Default):** Types exactly what you say verbatim with proper capitalization and punctuation. No unwanted prompt engineering, XML tags, or markdown templates.
- **Smart AI Assistant Mode:** Toggle in ⚙️ Settings for tailored coding prompts (`Cursor Composer`, `VS Code Copilot`, `Claude XML`, `ChatGPT Prompts`, `Gmail Drafts`).

### 4. 🌐 Multilingual Whisper-large-v3 STT & Llama 3.3 Polishing
- **Groq Cloud STT:** Ultra-fast (<180ms) inference using state-of-the-art `whisper-large-v3`.
- **99+ Languages:** Supports Auto-Detect or explicit selection (English, Hindi, Spanish, French, German, Japanese, Chinese, etc.).
- **Whisper & Noise Robustness:** Greedy decoding (`temperature: 0.0`) captures quiet whispers without hallucinating during silence or loud background noise.
- **Llama 3.3 Post-Processor:** Removes verbal filler words (`um`, `uh`) and applies natural punctuation while strictly preserving spoken words.

### 5. 🤖 Autonomous Screen & Chat Copilot Agent + HITL Safety Gate
- **Multimodal Visual Context:** Automatically inspects active screens via Electron's `desktopCapturer` and Groq Vision (`llama-3.2-11b-vision-preview`).
- **Targeted Conversation & Sales Guidance:** Resolves customer objections, crafts replies for WhatsApp, LinkedIn, Slack, and CRM leads.
- **Human-in-the-Loop (HITL) Safety Gate:** Destructive or autonomous agent actions stop at the floating **Approval Card**. Review, edit the response with one click, or hit `Enter` to approve & paste or `Esc` to reject.

### 6. 🛡️ Native Context & Security Gate
- **Active Window Detection:** Ultra-fast native foreground window and process detection on Windows.
- **Prompt Injection Defense:** Intercepts malicious instructions and enforces user confirmation for destructive actions.
- **Local Privacy Guard:** Operates in strict local rule mode or hybrid cloud mode.

---

## 🚀 How to Run the App

### 1. Start Development Mode
```powershell
npm run dev
```

### 2. Run Test Suite (57 Unit & Integration Tests)
```powershell
npm run test
```

### 3. Build Production Executable
```powershell
npm run build
```

---

## ⚙️ Quick Setup for Free Groq Speech-to-Text

1. Open QEVRA and click the **⚙️ Settings** icon on the floating capsule.
2. Select **⚡ Groq Cloud (Whisper-large-v3 + Llama 3.3)**.
3. Paste your free Groq API key (starts with `gsk_` from [groq.com](https://console.groq.com)).
4. Choose **Dictation Mode:** `Direct Dictation (Wispr Flow Style)`.
5. Choose **Speech Language:** `Auto-Detect (99+ Languages)`.
6. Click **Save Settings**.

---

## ⌨️ Global Keybindings

| Key / Shortcut | Action | Behavior |
|---|---|---|
| **Hold `Right Alt`** (or `F8` / `Fn`) | Hold-to-Talk | Starts recording on press; auto-pastes on release |
| **Double-tap `Right Alt`** | Persistent Mode | Opens interactive capsule with Record, Pause, Stop, Cancel |
| **`Ctrl + Shift + Space`** | Toggle HUD | Manually opens/hides the floating HUD |
| **`F8`** | Global Shortcut | Quick toggle hotkey |
| **`1` / `2` / `3` / `4`** | Smart Q&A | Quick keyboard selection during disambiguation |
| **`Esc`** | Cancel / Hide | Minimizes HUD to background |
