import { describe, it, expect } from "@jest/globals";

interface WorkflowRun {
  id: string;
  name: string;
  conclusion: "success" | "failure";
  head_branch: string;
  created_at: string;
}

function calculateRiskScore(runs: WorkflowRun[]): { score: number; level: string } {
  const failedRuns = runs.filter(r => r.conclusion === "failure").length;
  const failureRate = runs.length > 0 ? failedRuns / runs.length : 0;

  let streak = 0;
  for (const run of runs) {
    if (run.conclusion === "failure") streak++;
    else break;
  }

  const riskScore = Math.min(100, Math.round(failureRate * 60 + streak * 15));
  let riskLevel = "Low";
  if (riskScore > 70) riskLevel = "High";
  else if (riskScore > 40) riskLevel = "Medium";

  return { score: riskScore, level: riskLevel };
}

describe("Risk Score Calculation", () => {
  it("should return Low risk with all successful runs", () => {
    const runs: WorkflowRun[] = [
      { id: "1", name: "test", conclusion: "success", head_branch: "main", created_at: "2024-01-01" },
      { id: "2", name: "test", conclusion: "success", head_branch: "main", created_at: "2024-01-02" },
    ];
    const { score, level } = calculateRiskScore(runs);
    expect(score).toBe(0);
    expect(level).toBe("Low");
  });

  it("should return High risk with 100% failure rate", () => {
    const runs: WorkflowRun[] = [
      { id: "1", name: "test", conclusion: "failure", head_branch: "main", created_at: "2024-01-01" },
      { id: "2", name: "test", conclusion: "failure", head_branch: "main", created_at: "2024-01-02" },
    ];
    const { score, level } = calculateRiskScore(runs);
    expect(score).toBeGreaterThan(70);
    expect(level).toBe("High");
  });

  it("should return Medium risk with 50% failure rate", () => {
    const runs: WorkflowRun[] = [
      { id: "1", name: "test", conclusion: "failure", head_branch: "main", created_at: "2024-01-01" },
      { id: "2", name: "test", conclusion: "success", head_branch: "main", created_at: "2024-01-02" },
    ];
    const { score, level } = calculateRiskScore(runs);
    expect(score).toBeGreaterThan(20);
    expect(score).toBeLessThanOrEqual(70);
    expect(level).toBe("Medium");
  });

  it("should boost risk score with consecutive failures", () => {
    const runsWith3Streak: WorkflowRun[] = [
      { id: "1", name: "test", conclusion: "failure", head_branch: "main", created_at: "2024-01-01" },
      { id: "2", name: "test", conclusion: "failure", head_branch: "main", created_at: "2024-01-02" },
      { id: "3", name: "test", conclusion: "failure", head_branch: "main", created_at: "2024-01-03" },
    ];
    const { score: scoreWith3 } = calculateRiskScore(runsWith3Streak);
    expect(scoreWith3).toBe(100);
  });

  it("should cap risk score at 100", () => {
    const runs: WorkflowRun[] = Array(10).fill(null).map((_, i) => ({
      id: `${i}`,
      name: "test",
      conclusion: "failure" as const,
      head_branch: "main",
      created_at: "2024-01-01",
    }));
    const { score } = calculateRiskScore(runs);
    expect(score).toBeLessThanOrEqual(100);
  });
});
