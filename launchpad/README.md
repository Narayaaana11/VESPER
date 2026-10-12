# VESPER Launchpad

Build a world-class, editorial-grade product landing page and launchpad for "VESPER Desktop" — a local-first, context-aware AI voice-to-action and ambient dictation platform for Windows.

### 🎨 DESIGN SYSTEM & AESTHETIC PRINCIPLES (STRICT: ZERO AI SLOP)

- **Vibe & Inspiration**: Linear, Raycast, Wispr Flow, Vercel. Obsidian minimalism, hairline borders, precision typography, restrained lighting, and buttery-smooth micro-animations.

- **Palette**:

  - Background Canvas: `#090A0F` and `#0E1017`

  - Cards & Surfaces: `rgba(255, 255, 255, 0.02)` to `rgba(255, 255, 255, 0.04)` with `1px solid rgba(255, 255, 255, 0.08)`

  - Primary Typography: Pure crisp white `#F4F4F5`, secondary `#A1A1AA`, muted `#71717A`

  - Functional Accents: Subtle emerald `#10B981` (active/ready), cyan `#38BDF8` (audio wave), and subtle violet glow

- **Fonts**: Modern sans-serif (Inter / Plus Jakarta Sans) for body/headers, and JetBrains Mono for keyboard hotkeys and technical tags.

- **Avoid**: Cliché purple-and-pink AI gradients, floating robot 3D cartoons, stock photos, generic buzzwords, or rainbow glows. Everything must look like a high-performance Windows native power-tool.

---

### 🚀 PAGE STRUCTURE & SECTIONS

#### 1. NAVIGATION BAR

- Left: Minimalist logo icon with glowing pill badge: **VESPER** + `v0.1.0 MVP` badge.

- Center Links: `Features`, `Live Demo`, `Prerequisites`, `Roadmap`, `FAQ`.

- Right: "Download for Windows" (Primary button with Windows icon) and "GitHub / Docs".

#### 2. HERO SECTION

- **Top Badge**: Subtle pill container with pulse dot: `🟢 LIVE MVP LAUNCH • BUILT FOR WINDOWS 10/11`

- **Headline**: "Say what you mean. Get it done at the speed of thought."

- **Sub-headline**: "Local-first ambient voice dictation and context-aware copilot. Hold Right Alt anywhere on your PC — speak naturally, and watch text paste instantly at your cursor without ever stealing window focus."

- **CTAs**:

  - Primary: Glowing dark button **"Download VESPER for Windows (.exe)"** (v0.1.0 | 64-bit | Free MVP) with download arrow icon.

  - Secondary: **"Join Pro Cloud Waitlist"** (Smoothly scrolls to the waitlist section).

- **Sub-metrics row**:

  - `⚡ <180ms Latency` via High-Speed Neural Speech Pipeline

  - `🎯 Zero Focus Stealing` native Windows cursor injection

  - `🌐 99+ Languages` with auto-detection

  - `🛡️ 100% Privacy Guarded`

#### 3. INTERACTIVE HERO CAPSULE SIMULATOR (HIGH-ENGAGEMENT DEMO)

Create an interactive live interactive widget simulating VESPER’s floating pill:

- Displays a mock Windows desktop / IDE window (Cursor / VS Code / Slack).

- A button: **"Hold Space or Click & Hold to Test Voice Dictation"**.

- When held:

  - An obsidian pill at the top of the mock window expands.

  - An animated multi-bar audio visualizer dances with subtle cyan/emerald pulses.

  - Simulated audio recording timer ticks (`0:02`).

- When released:

  - The pill shows a brief checkmark `✓ Pasted verbatim`.

  - Realistic text types out into the mock editor: `"Refactor the auth middleware to support bearer tokens and add rate limiting."`

  - Shows an option to toggle between: **"Direct Dictation (Verbatim)"** and **"Smart Copilot (Prompt Engineered)"**.

#### 4. CORE CAPABILITIES (TECHNICAL GRID)

A responsive 6-card bento grid with subtle hover borders:

1. **🎙️ Hold-to-Talk (Wispr Flow Native)**: Hold `Right Alt` (or `F8` / `Fn`) $\ge 180$ms. Floating pill appears without stealing focus; release to paste instantly into active apps (Cursor, VS Code, Chrome, Slack, Discord).

2. **⚡ Double-Tap Persistent Mode**: Double-tap `Right Alt` within $380$ms to lock the HUD open with Record, Pause/Resume, Stop & Insert, and Cancel controls.

3. **🎯 Direct Dictation vs. Smart Assistant**:

   - _Direct Mode_: Pure verbatim dictation with perfect capitalization and punctuation. No unwanted AI hallucinations or rewrites.

   - _Smart Copilot Mode_: Contextual prompt generation for Claude, ChatGPT, and Cursor Composer.

4. **🌐 High-Speed Neural Speech Pipeline**: Sub-180ms inference, greedy zero-temperature decoding (no hallucination on whispers or background noise), and real-time contextual cleaning.

5. **🤖 Autonomous Screen Copilot & HITL Safety**: Multimodal visual inspect through desktop capture. Includes a strict **Human-in-the-Loop (HITL) approval card** — press `Enter` to approve, `Esc` to reject.

6. **⌨️ Global Windows Hotkey Architecture**: Native low-level Windows keyboard hooking (`Right Alt`, `F8`, `Ctrl+Shift+Space`) with custom key remapping.

#### 5. DOWNLOAD & STEP-BY-STEP PREREQUISITES GUIDE

A dedicated section designed to eliminate onboarding friction for users:

- **Direct Download Box**:

  - Card with Windows logo, version number (`Official Release v1.0`), file size (`~85 MB`), SHA256 checksum toggle, and a big button: **"Download VESPER Installer (.exe)"** + link to portable zip.

- **Prerequisites & Setup Accordion / Tabbed Guide**:

  - **Step 1: Obtain Your Verified VESPER License Key**:

    - Note: _"Official release includes pre-provisioned developer license keys."_

    - Sign in and verify your developer email to receive your dedicated license key (`VESPER-XXXX-XXXX-XXXX`).

  - **Step 2: Windows Audio Permissions**:

    - Ensure your microphone is enabled in Windows Settings > Privacy & Security > Microphone.

  - **Step 3: Launch VESPER & Configure**:

    - Run the installer, press `Ctrl + Shift + Space` or click the ⚙️ Settings gear icon on the floating capsule.

    - Enter your `VESPER License Key`, select **Direct Dictation**, and click **Save Settings**.

  - **Step 4 (Authorized Developers)**:

    - Instructions for private repository setup: `npm install` -> `npm run dev`.

#### 6. GLOBAL SHORTCUTS REFERENCE TABLE

A clean, styled keyboard cheat-sheet:

- `Hold Right Alt` (180ms) ➔ Push-to-Talk (Transcribe on release)

- `Double-tap Right Alt` (380ms) ➔ Toggle persistent capsule controls

- `Ctrl + Shift + Space` ➔ Open/hide Settings & HUD overlay

- `Esc` ➔ Discard recording / dismiss prompt

- `1 / 2 / 3` ➔ Instant keyboard option disambiguation

#### 7. PRODUCT ROADMAP ("HOW WE ARE MOVING FORWARD")

A modern timeline showcasing the vision:

- **Phase 1 (Today / Live MVP)**: Local-first Windows Hold-to-Talk, High-Speed Neural Speech Pipeline, zero-focus cursor pasting, direct dictation.

- **Phase 2 (Next)**: Fully offline local Whisper running on-device with GPU/NPU acceleration via Transformers.js & ONNX (100% air-gapped).

- **Phase 3**: macOS & Linux companion support, multi-window custom presets.

- **Phase 4**: Team dictionary & enterprise custom vocabulary synchronization.

#### 8. WAITLIST / EARLY ACCESS FORM

- Card with glowing border: **"Join the VESPER Pro & Mac Beta Waitlist"**.

- Fields:

  - Name (`input`)

  - Email (`input type="email"`)

  - Primary Use Case (`select`: Developer / Engineer, Writer / Creator, Founder / Exec, Customer Support, Other)

  - Platform Interest (`checkboxes`: Windows Power User, macOS, Linux)

- Button: **"Get Priority Access"**.

- On submission: Interactive toast notification + visual ticket card showing: _"You're on the list! Current Waitlist Position: #148"_. Store entries in Supabase or local state with mock fallback.

#### 9. FAQ & EXPO LIVE FEEDBACK DRAWER

- FAQ Accordions:

  - _Does VESPER steal focus when recording?_ (No, it uses Win32 native foreground preservation so you never lose cursor position in your editor.)

  - _Is my voice stored or trained on?_ (Never. Audio streams strictly through encrypted memory for instant transcription and is discarded immediately.)

  - _Can I change the hotkey?_ (Yes, supports Right Alt, F8, Fn, Right Ctrl, Left Alt, or custom combo.)

- Floating or embedded **"Give Expo Feedback"** button with a quick 1-5 star rating and feedback input.

#### 10. FOOTER

- Minimalist footer with VESPER branding, security and documentation verification link, MIT/Proprietary license notice, and tagline: _"Built for high-velocity builders."_

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28adf6d7-dacf-4aaa-94c1-23fc53cfec44).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
