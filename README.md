# QEVRA Desktop (Wispr Flow Ambient Intelligence)

> **Local-First Context-Aware AI Voice-to-Action & Direct Dictation Platform**  
> *Say what you mean. Get it done.*

---

## 🌟 Key Capabilities

### 1. 🎙️ Hold-to-Talk (Wispr Flow Default)
- **Zero Focus Stealing:** Hold `Right Alt` (or `Left Alt` / `F8` / `Fn` / configured key) $\ge 180\text{ms}$. The floating capsule appears seamlessly at the top of your screen *without stealing focus from your cursor*.
- **Auto-Paste at Cursor:** Release the key to immediately finalize transcription and auto-paste directly into your active application (`Cursor`, `VS Code`, `Google Chrome`, `Slack`, `Notepad`, `Discord`, etc.).

### 2. ⚡ Double-Tap Persistent Mode
- **Interactive Floating Capsule:** Double-tap `Right Alt` (or configured key) within $380\text{ms}$ to open the persistent control overlay.
- **Granular Controls:**
  - **Record / Speak:** Begin voice recording.
  - **Pause / Resume:** Temporarily pause microphone capture while preserving your transcript.
  - **Done / Stop & Insert:** Complete dictation and inject into the active window.
  - **Cancel:** Discard recording and return to idle.

### 3. 💻 100% Local Compute & Zero-API Offline Mode
- **On-Device Whisper ONNX (`Xenova/whisper-tiny.en`):** Runs 100% locally on CPU/DirectML with zero external API calls or network latency.
- **Automatic Cloud-to-Local Failover:** When using cloud acceleration (Groq), any network disruption or rate limit instantly fails over to local on-device Whisper.
- **Deterministic Local Rule Polisher:** Cleans filler words (`um`, `uh`, `you know`), fixes speech self-corrections, removes stutter, formats currency/numbers/dates, capitalizes sentences, and removes Whisper trailing hallucinations in <2ms on device.
- **Local Ollama Integration:** Supports local `llama3.2` on `http://localhost:11434` for on-device reasoning and text polishing.

### 4. 🌐 Multilingual Cloud STT (Groq Whisper-large-v3)
- **Groq Cloud STT (Optional):** Ultra-fast (<180ms) inference using state-of-the-art `whisper-large-v3`.
- **99+ Languages:** Supports Auto-Detect or explicit selection (English, Hindi, Spanish, French, German, Japanese, Chinese, etc.).
- **Greedy Decoding:** `temperature: 0.0` captures quiet whispers without hallucinating during silence or loud background noise.

### 5. 🤖 Littlebird Context MCP Server (Tools for AI Agents)
- **Model Context Protocol (MCP) Server:** Runs on `http://127.0.0.1:32123/mcp` and via stdio `npm run mcp` (configured in `.agents/mcp_config.json`).
- **Exposed Tools:**
  - `search_user_context`: Hybrid semantic & keyword recall over user desktop timeline with Littlebird evidence receipts.
  - `get_day_reconstruction`: Reconstructs work sessions into dev logs, application usage minutes, files edited, and ready-to-paste changelogs.
  - `get_active_screen_context`: Real-time active foreground window, application, category, and workspace path.

### 6. 🛡️ Native Context & Security Gate
- **Active Window Detection:** Ultra-fast native foreground window telemetry on Windows via `detect-window.exe`.
- **Prompt Injection Defense:** Intercepts malicious instructions and enforces user confirmation for destructive actions.
- **Human-in-the-Loop (HITL) Gate:** Destructive actions display an interactive Approval Card before running.

---

## 🚀 How to Run the App

### 1. Preload Local AI Models (Offline Whisper & Embeddings)
```powershell
npm run preload-models
```

### 2. Start Development Mode
```powershell
npm run dev
```

### 3. Run Test Suite (197 Unit & Integration Tests across 27 Suites)
```powershell
npm run test
```

### 4. Build Production Executable
```powershell
npm run build
```

### 5. Run Standalone MCP Context Server
```powershell
npm run mcp
```

---

## ⚙️ Configuration & Modes

### Option A: 100% Offline / Local Compute (Zero Cloud Dependency)
1. Open QEVRA — automatically activates `Local Whisper (ONNX)` and local compute if no API key is set.
2. Voice is captured via **Right Alt**, transcribed via on-device Whisper, and rephrased via local deterministic rules or Ollama (`llama3.2`).
3. Formats tailored prompts for Cursor Composer, Antigravity, VS Code, Slack, Gmail, or Terminal and types them directly.

### Option B: Cloud-Accelerated Mode (Whisper Turbo v3 + Llama 3.3)
1. Open QEVRA and click **⚙️ Settings**.
2. Select **Inference Engine:** `Groq Cloud (Whisper Turbo v3 + Llama 3.3)`.
3. Paste your Groq API key (starts with `gsk_` from [groq.com](https://console.groq.com)).
4. Choose **Whisper Model:** `whisper-large-v3-turbo` for ultra-fast ~250 wps speech-to-text.
5. If offline or if the cloud API is unreachable, QEVRA automatically fails over to the local on-device Whisper engine without interrupting your workflow.

---

## ⌨️ Global Keybindings

| Key / Shortcut | Action | Behavior |
|---|---|---|
| **Hold `Right Alt`** (or `Left Alt` / `F8` / `Fn`) | Hold-to-Talk | Starts recording on press; auto-pastes on release |
| **Double-tap `Right Alt`** | Persistent Mode | Opens interactive capsule with Record, Pause, Stop, Cancel |
| **`Ctrl + Shift + Space`** | Toggle HUD | Manually opens/hides the floating HUD |
| **`F8`** | Global Shortcut | Quick toggle hotkey |
| **`1` / `2` / `3` / `4`** | Smart Q&A | Quick keyboard selection during disambiguation |
| **`Esc`** | Cancel / Hide | Minimizes HUD to background |
