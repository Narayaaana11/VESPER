# Guide Specification: The Startup Employee & High-Agency Contributor

> **File:** `employees/employee.md`  
> **Purpose:** General Startup Employee Handbook, Cultural Tenets, Ownership Standards & Dogfooding Mandate  
> **Applies to:** Every team member, intern, contractor, and future hire at VESPER  

---

## 🚀 1. The Startup Mindset: Extreme Ownership & High Agency

In an early-stage startup building cutting-edge ambient voice AI, there are no passive observers, no bureaucratic silos, and no "that's not my job" excuses. 

Every employee at VESPER is expected to operate as a **High-Agency Owner**:
1. **Find a Way or Make One:** When faced with an undocumented Windows API quirk, a microphone driver latency spike, or an obscure build failure, you dig into the root cause and solve it.
2. **Speed as a Habit:** A fast decision made today that can be iterated upon tomorrow is 10x better than a "perfect" decision made in two weeks.
3. **Ruthless Simplicity:** The easiest code to maintain is the code you never wrote. The easiest UI to use is the UI that gets out of the way.

---

## 🐕 2. The Universal Dogfooding Mandate

**Every single employee at VESPER must use VESPER as their primary text input method throughout their workday.**

### What This Means in Practice:
- **Zero Slack Typing:** Write your internal Slack messages, status updates, and code reviews by holding `Right Alt` and speaking.
- **Voice-First Coding:** If you are an engineer, write your Git commit messages, PR descriptions, and Cursor prompts using VESPER.
- **Bug Discovery Responsibility:** If VESPER misbehaves, drops a word, steals focus, or feels laggy during your workday, **you do not ignore it**. You immediately file a ticket in Linear with your active window context and audio sample.

---

## 🛠️ 3. How Every Employee Builds & Validates the Product

Regardless of whether your title is Engineer, Designer, Marketer, or Operations:

```
┌────────────────────────────────────────────────────────┐
│ 1. OBSERVE: Use VESPER 50+ times/day in daily work      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 2. DETECT FRICTION: Spot any lag, hesitation, or bug   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 3. PROPOSE SOLUTION: Create reproducible issue + fix   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 4. VALIDATE: Test the fix against real user workflows  │
└────────────────────────────────────────────────────────┘
```

### The 4 Validation Questions Every Employee Must Answer Before Merging Code or Shipping Changes:
1. **Did it introduce latency?** Does the capsule still appear and paste in $<250\text{ms}$?
2. **Did it steal focus?** Is the cursor still blinking in the target app?
3. **Does it work offline?** Does the feature function seamlessly if Wi-Fi is toggled off?
4. **Is it intuitive without reading a manual?** Can a first-time user figure it out in 5 seconds?

---

## 📋 4. Daily Rituals & Operating Cadence

| Cadence | Event | What You Do |
|---|---|---|
| **08:30 AM** | Daily Standup (15m) | 1. What did you ship yesterday?<br>2. What are you shipping today?<br>3. What is blocking you? |
| **04:30 PM** | Daily Dogfood Retro (15m) | Share 1 friction point or delight moment from using VESPER today |
| **Friday 04:00 PM** | Company Demo & Release Gate | Live demo of all sprint deliverables on clean, freshly installed machines |

---

## 🌟 5. The Golden Rules of VESPER

1. **The User's Cursor is Sacred:** Never steal focus, never desynchronize the active caret, and never destroy the clipboard.
2. **Privacy is Not Negotiable:** Audio data belongs to the user. Local-first is our promise, not just a marketing bullet.
3. **Ship, Learn, Refine:** Ship small, test rigorously, listen to feedback, and iterate relentlessly.
