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
- **No Fake Metrics or Word Salad:** No fabricated "10,000% productivity synergy", "Trusted by 500k founders", or invented quotes. All latency benchmarks (<180ms Groq Whisper-Turbo, <250ms native injection, 241 unit tests) reflect real code benchmarks.
- **No Fake Terminals:** Interactive simulators show genuine recorded desktop context packets and real action dispatch, not fake ASCII loops.
- **No Blanket Glassmorphism:** Glass is strictly an elevation accent reserved for the ambient HUD and floating pill. Cards, forms, and backgrounds remain solid, legible, and high-contrast.
- **No Uniform Pill Shapes:** Distinct semantic geometries: cards have sharp-cornered subtle radiuses (`rounded-xl` 12px), interactive buttons have deliberate radiuses (`rounded-lg` 8px), badges use restrained chips (`rounded-md` 6px).

---

## 3. Curated Light Mode Color Palette (Orange & White Precision)

| Token | Hex / HSL | Usage |
|---|---|---|
| **Canvas White (Base)** | `#ffffff` | Primary canvas & root window background |
| **Warm Surface** | `#f8fafc` | Card, container, and elevated panel background |
| **Surface Elevated** | `#ffffff` | Interactive elements, modal cards, hover panels |
| **Structural Border** | `rgba(0, 0, 0, 0.08)` | Structural 1px separation lines |
| **Primary Text (Deep Ink)** | `#0f172a` | Headlines, primary values, active titles |
| **Secondary Text (Slate)** | `#475569` | Body copy, descriptions, secondary metadata |
| **Tertiary Text (Muted Slate)** | `#94a3b8` | Timestamps, helper labels, inactive tabs |
| **Brand Orange (Primary)** | `#ff6b00` | Primary buttons, active tabs, brand logo marks |
| **Brand Orange Hover** | `#ea580c` | Hover states, active focus rings, key accents |
| **Brand Orange Fragment** | `rgba(255, 107, 0, 0.08)` | Badges, spotlight cards, glow accents |
| **Accent Emerald** | `#16a34a` | Verification badges, success states |
| **Accent Amber** | `#f59e0b` | Usage warnings, quota meters |

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
