# Role Specification: Lead Product & UI/UX Designer

> **File:** `employees/product-designer.md`  
> **Role:** Lead Product & UI/UX Designer  
> **Department:** Design, User Interface & Brand Aesthetics  
> **Key Partners:** Lead Product Manager, Lead Desktop Software Engineer, Founder & CEO  

---

## 🎯 1. Mission & Design Philosophy

The Lead Product Designer crafts the visual and interactive identity of VESPER. The designer’s mission is to **create an ambient interface so elegant, responsive, and unobtrusive that using it feels like second nature**.

### The Core Design Tenets for VESPER
1. **Obsidian Glass Aesthetic:** A tailored dark mode combining deep obsidian gradients (`#1c1c20` to `#111114`), ultra-fine glass borders (`rgba(255, 255, 255, 0.08)`), subtle backdrop blurs, and ambient backlighting.
2. **Ambient Minimalism (Zero Distraction):** The floating capsule must never scream for attention. It exists quietly in the periphery, speaks through subtle waveforms, and vanishes the moment dictation is finished.
3. **Physical-Digital Tactility:** Transitions must feel organic and springy, not abrupt or robotic. Micro-animations signal system state (Idle $\rightarrow$ Listening $\rightarrow$ Polishing $\rightarrow$ Complete) effortlessly.

---

## 💼 2. Core Responsibilities

### A. Floating Capsule & HUD System
- Maintain the visual design language in `src/renderer/src/styles/hud.css`:
  - 14px rounded rectangle format (`border-radius: 14px`).
  - Subtle drag-handle (`.wf-drag-handle-section`) allowing users to position the capsule anywhere on screen.
  - Options menu (`...`) and persistent controls (`Record`, `Pause`, `Done`, `Cancel`).
- Ensure dynamic headroom eliminates box-shadow cutoffs and high-DPI Windows edge clipping.

### B. React Bits Pro Audio Visualizer Waveform
- Design and tune the audio visualizer in `src/renderer/src/components/AudioVisualizer.tsx`:
  - 20 symmetrical, center-weighted rounded pills (`4px` wide with `3px` gaps).
  - Smooth expansion from idle dots (`5px`) to responsive vertical bars (up to `24px`) matching live voice decibels.
  - Calibrated spring physics preventing twitchy or jittery bar animations during speech pauses.

### C. Flow Hub & Desktop Productivity Surface
- Design the Flow Hub dashboard (`src/renderer/src/components/VesperDashboard.tsx`):
  - **History Timeline:** Clean card-based feed of past dictations with word counts, elapsed time, and one-click copy.
  - **Personal Dictionary:** Minimalist tags and add-word modals for company jargon, acronyms, and names.
  - **Snippets:** Instant text expander templates triggered by voice shortcuts.
  - **Style Presets:** Visual selectors for tone (Default, Casual, Professional, Concise, Bullet Points).

### D. Smart Q&A & HITL Approval Overlays
- Design the lightweight Smart Q&A card (`SmartQAOverlay.tsx`):
  - Keyboard number chips (`1`, `2`, `3`) for sub-second disambiguation.
  - Destructive action warning cards (`AgentApprovalCard.tsx`) with bold safety cues (Amber/Red glow, Enter to confirm, Esc to abort).

---

## 🔍 3. Product Validation Playbook

The Product Designer validates the interface using rigorous visual and perceptual tests:

### 1. The Perceptual Distraction Benchmark
- **Test:** A user is deep in code editing or essay drafting. They trigger Hold-to-Talk for 4 seconds.
- **Evaluation:** Does the capsule draw their eyes away from the active cursor line? 
- **Pass Criteria:** The capsule must be visible in peripheral vision to convey active microphone status, but subtle enough that the user never loses their train of thought.

### 2. The 60 FPS Micro-Animation Audit
- Profile CSS animations and Web Audio canvas/DOM renders using DevTools Performance panel:
  - Frame rate during active waveform oscillation must remain solid at **60 FPS** (or 120/144 FPS on high-refresh monitors).
  - Zero dropped frames during capsule width expansion (from Idle 140px to Listening 240px).

### 3. Contrast, Accessibility & Visual Polish Matrix
- **Dark & Light Background Contrast:** The capsule must remain legible whether floating over a pure white Google Doc or an all-black VS Code terminal.
- **Shadow Clipping Test:** Ensure the outer blur (`box-shadow: 0 12px 32px rgba(0,0,0,0.45)`) does not show any razor-sharp window frame boundaries.

---

## 🗓️ 4. Daily & Weekly Operating Cadence

| Timeframe | Activity | Focus / Output |
|---|---|---|
| **Daily 09:30** | Visual Quality Pass | Test nightly build on multiple monitors and resolutions |
| **Daily 11:00** | Component Design | Polish Figma specs and refine CSS for interactive states |
| **Daily 14:00** | Pairing with Frontend Dev | Pair with Desktop Engineer to ensure 1:1 match between Figma and CSS |
| **Weekly Wed** | User Micro-Interaction Review | Analyze video recordings of user sessions for visual hesitations |
| **Weekly Fri** | Design System Refinement | Update color tokens, typography scales, and animation timing curves |

---

## 🤝 5. Cross-Functional Collaboration Matrix

- **With Lead Product Manager:** Aligning feature requirements with minimal UI footprint.
- **With Lead Desktop Engineer:** Specifying exact CSS window coordinates, drag-regions (`-webkit-app-region: drag`), and resize hooks.
- **With Founder:** Ensuring the brand identity exudes high-end, premium craftsmanship comparable to Apple, Linear, or Raycast.
