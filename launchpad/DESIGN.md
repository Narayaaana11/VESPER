# VESPER Design System & Aesthetic Direction (`DESIGN.md`)

> **Guiding Principle:** Engineering precision over AI spectacle. Tactile, honest, instant (<250ms), and distraction-free.

---

## 1. Product & Brand Identity

- **Product:** VESPER — Local-First Context-Aware AI Voice-to-Action & Ambient Desktop Platform.
- **Audience:** Power engineers, builders, writers, and operators who live in VS Code, Cursor, terminal, browser, and document workflows.
- **Personality:** Restrained, swift, physical, dependable. A precision instrument, not an AI chatbot or novelty gimmick.

---

## 2. Anti-Slop Policy & Guardrails

- **No Generic Purple-to-Cyan Gradients:** No unmotivated rainbow glows, blurred radial orb backgrounds, or stock tech-speculation aesthetics.
- **No Fake Metrics or Word Salad:** No fabricated "10,000% productivity synergy", "Trusted by 500k founders", or invented quotes. All latency benchmarks (<180ms Neural Speech Pipeline, <250ms native injection, 241 unit tests) reflect real code benchmarks.
- **No Fake Terminals:** Interactive simulators show genuine recorded desktop context packets and real action dispatch, not fake ASCII loops.
- **No Blanket Glassmorphism:** Glass is strictly an elevation accent reserved for the ambient HUD and floating pill. Cards, forms, and backgrounds remain solid, legible, and high-contrast.
- **No Uniform Pill Shapes:** Distinct semantic geometries: cards have sharp-cornered subtle radiuses (`rounded-xl` 12px), interactive buttons have deliberate radiuses (`rounded-lg` 8px), badges use restrained chips (`rounded-md` 6px).

---

## 3. Curated Color Palette

| Token                                | Hex / HSL | Usage                                                                |
| ------------------------------------ | --------- | -------------------------------------------------------------------- |
| **Obsidian Dark (Base)**             | `#0a0a0c` | Primary canvas & root background                                     |
| **Titanium Surface**                 | `#121217` | Card, container, and dialog background                               |
| **Titanium Elevated**                | `#181820` | Hover states, active dropdowns, elevated panels                      |
| **Titanium Border**                  | `#262632` | Structural 1px separation lines                                      |
| **Primary Text (Stark White)**       | `#f4f4f7` | Headlines, primary button text, active values                        |
| **Secondary Text (Titanium Silver)** | `#8e8e9f` | Paragraphs, documentation prose, inactive tabs                       |
| **Tertiary Text (Muted Slate)**      | `#555568` | Metadata, keybindings, timestamps, helper labels                     |
| **Accent Emerald (Live / Audio)**    | `#10b981` | Real microphone capture waveform, push-to-talk live state, test pass |
| **Accent Amber (Inference / VAD)**   | `#f59e0b` | Local ONNX speech detection, revalidation warnings, status pills     |
| **Accent Cobalt (System / Action)**  | `#3b82f6` | MCP server connection status, deep link highlights                   |

---

## 4. Typography Hierarchy

- **Primary Interface Font:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif.
- **Monospace Numerical & Code Font:** `JetBrains Mono`, `SF Mono`, `Consolas`, monospace.
- **Type Scale:**
  - Display: `text-4xl md:text-6xl font-extrabold tracking-tight leading-none`
  - H2 Section Header: `text-2xl md:text-3xl font-bold tracking-tight text-white`
  - H3 Card Header: `text-lg font-semibold text-white`
  - Body: `text-sm md:text-base text-[#8e8e9f] leading-relaxed`
  - Micro / Labels: `text-xs font-mono tracking-wider uppercase text-[#555568]`

---

## 5. Motion & Interaction (Dials: Energy 2 / Rhythm 2 / Motion 2)

- **HUD Spring Physics:** Spring duration `0.2s`, damping `25`, mass `0.8` (snappy physical feel, not slow floating inertia).
- **Audio Waveforms:** Live WebAudio analyser frequency rendering via ReactBits canvas components; scales dynamically to actual voice decibels.
- **Keypress Feedback:** Immediate tactile state change on push-to-talk press & release. Zero delay.
