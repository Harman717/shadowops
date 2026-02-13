"use client";
import MetricCard from "@/components/MetricCard";
import { useState } from "react";

export default function Dashboard() {
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [data, setData] = useState<any>(null);

  async function fetchData() {
    const res = await fetch("/api/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, owner, repo }),
    });

    const result = await res.json();
    setData(result);
  }

  // ✅ SAFE METRIC CALCULATIONS
  let totalRuns = 0;
  let failedRuns = 0;
  let successRate = "0%";
  let riskScore = 0;

  if (data?.workflows?.workflow_runs) {
    totalRuns = data.workflows.workflow_runs.length;

    failedRuns = data.workflows.workflow_runs.filter(
      (run: any) => run.conclusion === "failure"
    ).length;

    successRate =
      totalRuns > 0
        ? (((totalRuns - failedRuns) / totalRuns) * 100).toFixed(1) + "%"
        : "0%";

    // Simple risk formula for now
    riskScore = Math.min(100, failedRuns * 10);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-b border-indigo-500/20 p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/50 transition transform hover:scale-105"
            >
              Connect
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        {data && data.workflows?.workflow_runs && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <MetricCard title="Total Runs" value={totalRuns} />
              <MetricCard title="Failed Runs" value={failedRuns} />
              <MetricCard title="Success Rate" value={successRate} />
              <MetricCard title="Commits (Last 20)" value={data.commits.length} />
              <MetricCard title="Risk Score" value={riskScore} color={riskScore > 50 ? "red" : "green"} />
            </div>

            {/* Recent Workflow Runs */}
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
                    {data.workflows.workflow_runs.map((run: any) => (
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
                          {new Date(run.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
