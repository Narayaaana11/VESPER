# VESPER Platform

> **Local-First Context-Aware AI Voice-to-Action & Ambient Desktop Platform**  
> *Say what you mean. Get it done.*

---

## 📂 Repository Organization

| Directory | Purpose | Status |
|---|---|---|
| [`Production/`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/Production) | **Commercial Desktop Application Suite** (Electron, React Bits, Anime.js, Native Win32 Hooks, MCP) | **Active / Production** |
| [`launchpad/`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/launchpad) | **Official Web Launchpad & Landing Page** (TanStack Start, Tailwind, ReactBits, Cloudflare Nitro) | **Active / Landing** |
| [`Prototype/`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/Prototype) | Self-Contained Archive of MVP & Exploratory Proof-of-Concepts | **Archived** |
| [`docs/`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/docs) | Architecture Specifications ([`Brain.md`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/docs/Brain.md)) & Master Plan ([`vesper_startup_master_plan.md`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/docs/vesper_startup_master_plan.md)) | **Reference** |
| [`mobile/`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/mobile) | Native Android Accessibility Service & Release APK ([`mobile/release/`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/mobile/release/)) | **Active** |
| [`employees/`](file:///c:/Users/gowri/Videos/___WS_VESPER_PATH___/employees) | Autonomous Multi-Agent Verification Committee & Advisory Board | **Governance** |

---

## 🚀 Quick Start

To run or build either the Desktop Suite or the Launchpad:

```powershell
# Desktop Suite (Production):
npm run dev               # Boots the Desktop Suite in dev mode
npm run test              # Runs 241 unit & integration tests
npm run build             # Bundles the desktop application
npm run pack              # Packages the standalone Windows build

# Web Launchpad (Landing Page):
npm run launchpad:dev     # Starts the TanStack Start dev server at http://localhost:3000
npm run launchpad:build   # Builds the SSR Nitro client/server bundles
```

---

## 🎙️ Core Features (Production Suite)

1. **Ambient Push-to-Talk:** Hold `Right Alt` (or configured key) anywhere in Windows. A floating Obsidian glass HUD appears with live React Bits waveform without stealing focus from your cursor.
2. **Sub-250ms Direct Injection:** Release the key to immediately format and paste into your active application (VS Code, Cursor, Chrome, Slack, Word).
3. **24/7 Context Engine & MCP:** SQLite operations journal and stdio MCP server for Cursor, Windsurf, and VS Code.
4. **Dual-Engine Speech Inference:** Groq Cloud Whisper-Turbo (<180ms) with seamless fallback to on-device Whisper ONNX when offline.
5. **Zero Focus-Stealing:** System tray daemon and non-focusable HUD ensure your editor never loses active cursor focus.
