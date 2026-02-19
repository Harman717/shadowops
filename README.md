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

<img width="667" height="123" alt="image" src="https://github.com/user-attachments/assets/cc099c68-be06-4328-b92a-395bbbf7b70c" />
