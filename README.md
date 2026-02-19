# ShadowOps 🚨  
### Engineering Risk Intelligence for GitHub CI

ShadowOps transforms raw GitHub CI workflow telemetry into actionable engineering risk signals.  

Instead of manually scanning failed runs and logs, ShadowOps computes risk scores, detects instability patterns, visualizes degradation trends, and generates AI-powered incident analysis in real time.

Built for **DevDash 2026 – The Sprint to Solution**.

---

## 🔍 Problem

Modern CI pipelines generate massive telemetry across workflow runs, test executions, and deployments.  

However:

- Failures are often isolated events with no contextual risk signal  
- Engineering teams lack a unified short-term stability metric  
- Degradation trends go unnoticed until delivery velocity is impacted  
- There is no automated insight layer explaining why instability is occurring  

ShadowOps addresses this gap.

---

## 🚀 Solution

ShadowOps integrates directly with GitHub repositories to:

- Aggregate workflow runs (last 7 days)
- Compute a short-term Engineering Risk Score
- Detect consecutive failure streaks
- Identify top failing workflows
- Visualize risk trends over time
- Generate AI-powered structured incident reports
- Provide immediate remediation snapshots

It moves CI monitoring from reactive debugging to proactive risk intelligence.

---

## 🧠 Key Features

### 📊 Risk Scoring Engine
- Failure rate modeling
- Consecutive failure streak detection
- Weighted short-term risk formula
- Risk classification (Low / Medium / High)

### 🔎 Pattern Detection
- Failure clustering by workflow
- Most unstable workflow identification
- Risk trend detection (Increasing / Decreasing / Stable)

### 📈 Risk Over Time Visualization
- 7-day aggregation
- Failure distribution bars
- Risk line trend

### ⚡ AI Incident Analysis
- Structured executive summary
- Primary risk driver identification
- Immediate action recommendation
- Detailed analysis report

### 🎛 Demo Mode
- Controlled instability simulation
- Realistic degradation modeling
- Enables consistent demonstration

---

## 🏗 Architecture Overview

<img width="955" height="195" alt="image" src="https://github.com/user-attachments/assets/fa93a901-1e88-4e45-b1e6-bc67fa0dede8" />


---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **GitHub REST API**
- **OpenAI API (GPT-4o-mini)**
- **Recharts (Data Visualization)**
- **TailwindCSS**
- **Vercel Deployment**

---

## 🌐 Live Demo

👉 https://shadowops-henna.vercel.app/

---

### 1️⃣ Clone Repository
- git clone https://github.com/Harman717/shadowops.git
- cd shadowops
### 2️⃣ Install Dependencies
- npm install
### 3️⃣ Create Environment File
- Create .env.local in root:
- OPENAI_API_KEY=your_openai_api_key_here
### 4️⃣ Run Development Server
- npm run dev
- Open:
-- http://localhost:3000

