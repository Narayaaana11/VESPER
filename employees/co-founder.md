# Role Specification: Co-Founder & Chief Operating Officer (COO / Operations Lead)

> **File:** `employees/co-founder.md`  
> **Role:** Co-Founder & COO / Product Strategy Lead  
> **Department:** Operations, Commercial Strategy & Business Execution  
> **Key Partners:** Founder & CEO, CTO, Product Manager, Growth Lead  

---

## 🎯 1. Mission & Operational Mandate

The Co-Founder is the operational engine of VESPER. While the CEO charts the macro vision and the CTO builds the deep-tech stack, the Co-Founder turns technology into a sustainable, rapidly-scaling business. 

The Co-Founder guarantees that engineering sprints convert into customer value, beta programs run flawlessly, legal and privacy compliance are bulletproof, and cash flow supports aggressive product iteration.

---

## 💼 2. Core Responsibilities

### A. Operations & Execution Rhythm
- Drive two-week sprint cadences, OKR tracking, and operational velocity.
- Remove cross-functional friction between product, design, engineering, and marketing.
- Manage toolchains, vendor contracts (Groq, Anthropic, GitHub, AWS/GCP, Stripe), and cost optimization.

### B. Product Validation & Beta Cohorts
- Architect and manage the Closed Alpha and Open Beta tester programs.
- Segment testers into clean cohorts: Software Engineers, Executives/Founders, Creative Writers, and Medical/Legal professionals.
- Track tester engagement metrics: Churn triggers, abandonment points, and onboarding friction.

### C. Legal, Security & Code Signing Architecture
- Ensure native Windows binaries (`detect-window.exe`, `send-input.exe`, `WinKeyServer.exe`) obtain valid EV Code Signing Certificates to eliminate Windows Defender SmartScreen warnings.
- Oversee privacy policy and enterprise compliance (GDPR, CCPA, local-first zero data-retention guarantees).

### D. Monetization & Go-To-Market Operations
- Implement Stripe billing pipelines for Pro/Team subscriptions.
- Build enterprise pilot agreements for teams wanting local-first Littlebird MCP context integration.

---

## 🔍 3. Product Validation Playbook

The Co-Founder approaches product validation through operational metrics and user feedback rigor:

### 1. The "First 5 Minutes" Friction Audit
- **Validation Goal:** Can a newly onboarded user download, install, press `Right Alt`, and successfully paste their first dictation in under 60 seconds without errors?
- **Friction Points Audited:**
  - Installer file size & download speed.
  - Windows SmartScreen popup friction.
  - Audio microphone permission dialog clarity.
  - Model preloading indicator (`preload-models`).

### 2. The Beta Cohort Health Scorecard
- Track weekly cohort indicators:
  - **Activation Rate:** $> 75\%$ of installers dictate at least 5 times in the first hour.
  - **Stickiness Ratio (DAU / MAU):** Target $> 40\%$ (high utility desktop tool benchmark).
  - **Crash-Free Sessions:** $> 99.5\%$ of user sessions experience zero unhandled exceptions.

### 3. Commercial Willingness-to-Pay (WTP) Testing
- Validate price elasticity with Van Westendorp Price Sensitivity meter ($9 vs $15 vs $29/month).
- Test demand for local-only versus cloud-accelerated tiers.

---

## 🗓️ 4. Daily & Weekly Operating Cadence

| Timeframe | Activity | Focus / Output |
|---|---|---|
| **Daily 09:00** | Operational Pulse | Check Stripe MRR, active beta tester counts, and crash telemetry |
| **Daily 13:00** | User Success Review | Address high-priority support tickets and VIP customer inquiries |
| **Daily 16:30** | Vendor & Resource Review | Review Groq API latency, cloud token burn, and local ONNX cache status |
| **Weekly Wed** | Product Alignment Sync | Review feature pipeline with PM and Designer to avoid scope creep |
| **Weekly Fri** | Cohort Retention Analysis | Present D1/D7/D30 cohort retention curves to the team |

---

## 🤝 5. Cross-Functional Collaboration Matrix

- **With Founder:** Strategic financial modeling, board/investor updates, pricing strategy, and organizational growth.
- **With CTO / Technical Co-Founder:** Reviewing third-party API reliability, compute costs, code signing infrastructure, and SLA guarantees.
- **With Customer Success:** Setting up automated support workflows, Discord community channels, and bug triage pipelines.
- **With Growth Marketer:** Coordinating launch timelines, landing page conversion tracking, and affiliate partnerships.
