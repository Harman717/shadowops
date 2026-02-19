"use client";
import MetricCard from "@/components/MetricCard";
import RiskChart from "@/components/RiskChart";
import { useState } from "react";
import {
  filterLast7Days,
  calculateSuccessRate,
  calculateRiskScore,
  getRiskLevel,
  getConsecutiveFailureStreak,
  prepareChartData,
  detectSpike,
  type WorkflowRun,
  type ChartDataPoint,
} from "@/lib/metrics";

interface DashboardData {
  workflows: {
    workflow_runs: WorkflowRun[];
  };
  commits: Array<{ id?: string; message?: string }>;
}

interface ActionSnapshot {
  summary: string;
  driver: string;
  action: string;
}

export default function Dashboard() {
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [actionSnapshot, setActionSnapshot] = useState<ActionSnapshot>({
    summary: "",
    driver: "",
    action: "",
  });

  async function fetchData() {
    const res = await fetch("/api/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, owner, repo }),
    });

    const result = await res.json();
    setData(result);
  }

  // ✅ METRICS CALCULATIONS
  let totalRuns = 0;
  let failedRuns = 0;
  let successRate = "0%";
  let riskScore = 0;
  let riskLevel = "Low";
  let spikeDetected = false;
  let chartData: ChartDataPoint[] = [];
  let topFailingWorkflow = "None";
  let topFailureCount = 0;
  let riskTrend = "Stable";

  if (demoMode) {
    // 🎬 CONTROLLED 7-DAY DEGRADATION SIMULATION
    const demoRuns = [
      { dayOffset: 6, failures: 0, total: 3 },
      { dayOffset: 5, failures: 0, total: 4 },
      { dayOffset: 4, failures: 1, total: 4 },
      { dayOffset: 3, failures: 2, total: 5 },
      { dayOffset: 2, failures: 3, total: 5 },
      { dayOffset: 1, failures: 4, total: 6 },
      { dayOffset: 0, failures: 5, total: 6 },
    ];

    totalRuns = demoRuns.reduce((acc, d) => acc + d.total, 0);
    failedRuns = demoRuns.reduce((acc, d) => acc + d.failures, 0);

    const failureRate = failedRuns / totalRuns;
    const streak = 3; // Last 3 days failing heavily

    riskScore = calculateRiskScore(failureRate, streak);
    riskLevel = getRiskLevel(riskScore);
    successRate = calculateSuccessRate(totalRuns, failedRuns);

    // Build demo chart data with realistic risk progression
    chartData = demoRuns.map((d) => {
      const date = new Date();
      date.setDate(date.getDate() - d.dayOffset);

      const risk = Math.round((d.failures / d.total) * 100);

      return {
        date: date.toISOString().split("T")[0],
        status: d.failures > 0 ? 1 : 0,
        risk,
        name: `workflow-${d.dayOffset}`,
        conclusion: d.failures > 0 ? "failure" : "success",
        createdAt: date.toISOString(),
      };
    });

    spikeDetected = detectSpike(chartData);

    // 🔥 FAILURE CLUSTERING (DEMO)
    topFailingWorkflow = "Integration Tests";
    topFailureCount = 5;
  } else if (data?.workflows?.workflow_runs) {
    const recentRuns = filterLast7Days(data.workflows.workflow_runs);

    totalRuns = recentRuns.length;
    failedRuns = recentRuns.filter(
      (run: WorkflowRun) => run.conclusion === "failure"
    ).length;

    successRate = calculateSuccessRate(totalRuns, failedRuns);

    const failureRate = totalRuns > 0 ? failedRuns / totalRuns : 0;
    const streak = getConsecutiveFailureStreak(recentRuns);

    riskScore = calculateRiskScore(failureRate, streak);
    riskLevel = getRiskLevel(riskScore);

    chartData = prepareChartData(recentRuns);
    spikeDetected = detectSpike(chartData);

    // 🔥 FAILURE CLUSTERING (REAL DATA)
    const workflowFailureMap: { [key: string]: number } = {};

    recentRuns.forEach((run: WorkflowRun) => {
      if (run.conclusion === "failure") {
        const name = run.name || "Unknown Workflow";
        workflowFailureMap[name] = (workflowFailureMap[name] || 0) + 1;
      }
    });

    Object.entries(workflowFailureMap).forEach(([name, count]) => {
      if (count > topFailureCount) {
        topFailureCount = count;
        topFailingWorkflow = name;
      }
    });
  }

  // 🔥 RISK TREND DETECTION
  if (chartData.length >= 2) {
    const last = chartData[chartData.length - 1].risk || 0;
    const prev = chartData[chartData.length - 2].risk || 0;

    if (last > prev) riskTrend = "Increasing";
    else if (last < prev) riskTrend = "Decreasing";
  }

  async function explainRisk() {
    setLoadingAI(true);
    setExplanation("");
    setActionSnapshot({ summary: "", driver: "", action: "" });

    // Calculate consecutive failures for AI context
    let consecutiveFailures = 0;
    if (demoMode || (data?.workflows?.workflow_runs)) {
      const runs = demoMode 
        ? chartData 
        : data?.workflows?.workflow_runs || [];
      
      for (const run of runs) {
        if (run.conclusion === "failure") {
          consecutiveFailures++;
        } else {
          break;
        }
      }
    }

    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metrics: {
          totalRuns,
          failedRuns,
          successRate,
          riskScore,
          riskLevel,
          streak: consecutiveFailures,
        },
      }),
    });

    const result = await res.json();
    const text = result.explanation || "";
    
    setExplanation(text);

    // 🔥 PARSE STRUCTURED OUTPUT
    const summaryMatch = text.match(/EXECUTIVE_SUMMARY:\s*([^\n]+)/);
    const driverMatch = text.match(/PRIMARY_RISK_DRIVER:\s*([^\n]+)/);
    const actionMatch = text.match(/IMMEDIATE_ACTION:\s*([^\n]+)/);

    setActionSnapshot({
      summary: summaryMatch ? summaryMatch[1].trim() : "",
      driver: driverMatch ? driverMatch[1].trim() : "",
      action: actionMatch ? actionMatch[1].trim() : "",
    });

    setLoadingAI(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-900/40 to-purple-900/40 border-b border-indigo-500/20 p-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          ShadowOps Dashboard
        </h1>
        <p className="text-gray-400 mt-2">GitHub Workflow & Security Analytics</p>
      </div>

      <div className="p-8">
        {/* Input Section */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-400 mb-4 font-semibold">Connect your GitHub repository</p>
          <div className="flex gap-3 flex-wrap">
            <input
              placeholder="GitHub Token"
              type="password"
              className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg w-64 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <input
              placeholder="Owner"
              className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex-1 min-w-32 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
            <input
              placeholder="Repository"
              className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex-1 min-w-32 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
            <button
              onClick={fetchData}
              className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/50 transition transform hover:scale-105"
            >
              Connect
            </button>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                demoMode
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              {demoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
            </button>
          </div>
        </div>

        {/* Demo Mode Badge */}
        {demoMode && (
          <div className="bg-blue-600/20 border border-blue-500/40 text-blue-300 p-3 rounded-lg mb-6 text-sm font-semibold">
            🎬 Demo Mode Active - Showing simulated workflow data
          </div>
        )}

        {/* Metrics Grid */}
        {(demoMode || (data && data.workflows?.workflow_runs)) && (
          <>
            {/* 🚨 EXECUTIVE ALERT BANNERS */}
            {riskScore > 70 && (
              <div className="bg-red-600/20 border border-red-500/40 text-red-300 p-4 rounded-lg mb-6 flex items-center gap-3">
                <span className="text-xl">🚨</span>
                <span className="font-semibold">High Engineering Risk Detected — Immediate attention recommended.</span>
              </div>
            )}

            {riskScore <= 70 && riskScore > 40 && (
              <div className="bg-blue-600/20 border border-blue-500/40 text-blue-300 p-4 rounded-lg mb-6 flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold">Moderate instability observed in CI pipelines.</span>
              </div>
            )}

            {/* ✅ SPIKE DETECTION ALERT BANNER */}
            {spikeDetected && (
              <div className="bg-red-600/20 border border-red-500/40 text-red-300 p-4 rounded-lg mb-6 flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold">Risk spike detected in latest workflow runs.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <MetricCard title="Total Runs (7d)" value={totalRuns} />
              <MetricCard title="Failed Runs" value={failedRuns} color={failedRuns > 0 ? "red" : "green"} />
              <MetricCard title="Success Rate" value={successRate} color={successRate === "100%" ? "green" : "blue"} />
              <MetricCard title="Commits (Last 20)" value={demoMode ? 5 : data?.commits.length || 0} />
              <MetricCard title="Risk Score" value={riskScore} color={riskScore > 50 ? "red" : "green"} />
              <MetricCard title="Risk Trend" value={riskTrend} color={riskTrend === "Increasing" ? "red" : riskTrend === "Decreasing" ? "green" : "blue"} />
            </div>

            {/* 🔥 FAILURE PATTERN ANALYSIS PANEL */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">Failure Pattern Analysis</h3>
              {topFailureCount > 0 ? (
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold">
                    🔴 Most unstable workflow
                  </div>
                  <div className="text-gray-200">
                    <strong>{topFailingWorkflow}</strong>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Failures detected (7d): <span className="text-red-300 font-semibold">{topFailureCount}</span>
                  </div>
                </div>
              ) : (
                <div className="text-green-400 font-semibold">
                  🟢 No recurring workflow failures detected.
                </div>
              )}
            </div>

            {/* Risk Over Time Chart */}
            {chartData.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Risk Over Time (Last 7 Days)</h2>
                <RiskChart data={chartData} />
              </div>
            )}

            {/* AI Risk Explanation Button */}
            <div className="mb-8">
              <button
                onClick={explainRisk}
                disabled={loadingAI}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/50 transition"
              >
                {loadingAI ? "🤖 Analyzing..." : "🧠 Explain Current Risk"}
              </button>
            </div>

            {/* ⚡ ACTION SNAPSHOT PANEL */}
            {actionSnapshot.summary && (
              <div className="bg-gradient-to-r from-red-900/30 to-indigo-900/30 border border-red-500/40 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                  ⚡ Action Snapshot
                </h3>

                <div className="space-y-3 text-gray-100">
                  <div>
                    <p className="text-gray-400 text-sm font-semibold mb-1">System Status</p>
                    <p className="text-white">{actionSnapshot.summary}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm font-semibold mb-1">Primary Risk Driver</p>
                    <p className="text-white">{actionSnapshot.driver}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm font-semibold mb-1">Immediate Action</p>
                    <p className="text-red-300 font-semibold">{actionSnapshot.action}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full AI Analysis */}
            {explanation && (
              <div className="bg-slate-900/60 backdrop-blur border border-indigo-500/30 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-indigo-400">Full Risk Analysis</h2>
                <div className="text-gray-200 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                  {explanation}
                </div>
              </div>
            )}

            {/* Recent Workflow Runs */}
            {(demoMode || data?.workflows?.workflow_runs) && (
              <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Recent Workflow Runs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="p-4 text-sm font-semibold text-gray-300">Name</th>
                        <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                        <th className="p-4 text-sm font-semibold text-gray-300">Branch</th>
                        <th className="p-4 text-sm font-semibold text-gray-300">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(demoMode 
                        ? [
                            { id: "1", name: "Integration Tests", conclusion: "failure" as const, head_branch: "main", created_at: new Date(Date.now() - 3600000).toISOString() },
                            { id: "2", name: "Unit Tests", conclusion: "failure" as const, head_branch: "main", created_at: new Date(Date.now() - 7200000).toISOString() },
                            { id: "3", name: "E2E Tests", conclusion: "failure" as const, head_branch: "main", created_at: new Date(Date.now() - 10800000).toISOString() },
                            { id: "4", name: "Build", conclusion: "success" as const, head_branch: "develop", created_at: new Date(Date.now() - 14400000).toISOString() },
                            { id: "5", name: "Integration Tests", conclusion: "failure" as const, head_branch: "main", created_at: new Date(Date.now() - 18000000).toISOString() },
                          ]
                        : data?.workflows?.workflow_runs || []
                      ).map((run: any) => (
                        <tr key={run.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                          <td className="p-4 font-medium">{run.name}</td>
                          <td className="p-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              run.conclusion === "failure"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-green-500/20 text-green-300"
                            }`}>
                              {run.conclusion}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400"><code className="bg-slate-800 px-2 py-1 rounded">{run.head_branch}</code></td>
                          <td className="p-4 text-gray-400 text-sm">
                            {new Date(run.created_at).toISOString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}