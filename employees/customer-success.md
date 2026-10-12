# Role Specification: Customer Success & Community Lead

> **File:** `employees/customer-success.md`  
> **Role:** Customer Success & Community Lead  
> **Department:** Customer Experience & Community  
> **Key Partners:** Lead Product Manager, Founder & CEO, Head of Growth, QA Engineer  

---

## 🎯 1. Mission & Customer Advocacy

The Customer Success & Community Lead is the **human heartbeat connecting VESPER's users with the engineering team**. 

Because VESPER is a high-frequency daily driver that integrates directly into people's working hours, user frustration from unexpected behavior or hotkey confusion must be resolved immediately. The Customer Success Lead ensures that every user becomes a lifelong evangelist.

---

## 💼 2. Core Responsibilities

### A. Community Management & Discord Triage
- Nurture the official VESPER Discord community and GitHub Discussions:
  - Welcome new alpha/beta testers within 15 minutes of joining.
  - Maintain an active `#feedback-and-ideas` channel where users suggest custom vocabulary and workflows.
  - Triage reported bugs: Reproduce user issues with exact Windows version and microphone specs before escalating to engineering.

### B. Onboarding & Time-to-First-Value (TTFV)
- Track user progression through the onboarding funnel:
  - Verify that new users understand the default key (`Right Alt`) vs alternative hotkeys (`Left Alt`, `F8`, `Fn`).
  - Help users configure microphone permissions and optional Groq API keys if they desire cloud acceleration.
  - Goal: **TTFV $< 60$ seconds** from installer launch to first voice-pasted sentence.

### C. Personal Dictionary & Custom Vocabulary Enrichment
- Collect frequently misheard industry terms, acronyms, and names from users (e.g. medical terminology, proprietary codebase names, foreign surnames).
- Synthesize weekly custom dictionary recommendations for the AI Engineer to incorporate into pre-loaded models and regex polishers.

### D. User Health & Churn Prevention
- Monitor early retention indicators:
  - If a user dictates 20 times on Day 1 but drops to 0 on Day 3, trigger proactive outreach: *"Hey! Noticed you stopped using VESPER. Did you hit a hotkey conflict or audio glitch?"*
  - Run quarterly Net Promoter Score (NPS) surveys (Target: **NPS $\ge 65$**).

---

## 🔍 3. Product Validation Playbook

Customer Success validates the product through qualitative user satisfaction and onboarding friction tracking:

### 1. The "First Hour Onboarding" Audit
- Track 50 randomly sampled new signups:
  - Did they encounter a Windows audio driver permission error?
  - Did they know which key to press without reading documentation?
  - Did they test both Hold-to-Talk and Double-Tap Persistent mode?
  - **Success Benchmark:** $> 80\%$ complete at least 5 successful dictations within 60 minutes of download.

### 2. The Net Promoter Score (NPS) & CSAT Gate
- Deliver a 1-question in-app survey after 100 successful dictations:
  - *"How likely are you to recommend VESPER to a friend or coworker?" (0–10)*
  - **Pass Criteria:** $> 70\%$ Promoters (score 9–10), $< 10\%$ Detractors (score 0–6).

### 3. Voice Fatigue & Keyboard Ergonomics Feedback
- Survey power users (those dictating $> 50\text{ times/day}$):
  - Is `Right Alt` causing thumb strain? (If so, assist in remapping to `F8` or mouse button).
  - Do they prefer the floating capsule at the top center, bottom center, or following the mouse cursor?

---

## 🗓️ 4. Daily & Weekly Operating Cadence

| Timeframe | Activity | Focus / Output |
|---|---|---|
| **Daily 08:30** | Discord & Support Queue | Clear all support tickets, respond to new community posts |
| **Daily 11:00** | VIP User Onboarding Call | 15-minute screen share with a newly onboarded enterprise user |
| **Daily 14:00** | Bug Reproduction & Escalation | Create clear, reproducible bug tickets in Linear with audio samples |
| **Weekly Wed** | Voice of Customer (VoC) Report | Present top 5 user pain points to PM and Engineering |
| **Weekly Fri** | Community Townhall / Office Hours | Host a live Discord voice stage demoing upcoming features |

---

## 🤝 5. Cross-Functional Collaboration Matrix

- **With Lead Product Manager:** Sharing raw customer feedback, unvarnished complaints, and feature wishlists.
- **With QA Engineer:** Providing exact hardware specs and log files from users experiencing crashes.
- **With Head of Growth:** Identifying passionate power users who are willing to record video testimonials or write case studies.
- **With AI Engineer:** Supplying lists of domain-specific terminology that require custom pronunciation rules.
