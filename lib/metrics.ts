export interface WorkflowRun {
  id: string;
  name: string;
  conclusion: "success" | "failure";
  head_branch: string;
  created_at: string;
}

export interface ChartDataPoint {
  date: string;
  status: number;
  risk?: number;
  name: string;
  conclusion: string;
  createdAt: string;
}

export function filterLast7Days(runs: WorkflowRun[]): WorkflowRun[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return runs.filter((run) => new Date(run.created_at) >= sevenDaysAgo);
}

export function calculateSuccessRate(
  totalRuns: number,
  failedRuns: number
): string {
  return totalRuns > 0
    ? (((totalRuns - failedRuns) / totalRuns) * 100).toFixed(1) + "%"
    : "0%";
}

export function calculateRiskScore(
  failureRate: number,
  streak: number
): number {
  return Math.min(100, Math.round(failureRate * 60 + streak * 15));
}

export function getRiskLevel(riskScore: number): string {
  if (riskScore > 70) return "High";
  if (riskScore > 40) return "Medium";
  return "Low";
}

export function getConsecutiveFailureStreak(runs: WorkflowRun[]): number {
  let streak = 0;
  for (const run of runs) {
    if (run.conclusion === "failure") streak++;
    else break;
  }
  return streak;
}

export function prepareChartData(runs: WorkflowRun[]): ChartDataPoint[] {
  return runs.map((run) => ({
    date: new Date(run.created_at).toLocaleDateString(),
    status: run.conclusion === "failure" ? 1 : 0,
    name: run.name,
    conclusion: run.conclusion,
    createdAt: new Date(run.created_at).toLocaleString(),
  }));
}

export function detectSpike(chartData: ChartDataPoint[]): boolean {
  if (chartData.length >= 2) {
    const last = chartData[chartData.length - 1].status;
    const prev = chartData[chartData.length - 2].status;

    // Detect spike: last risk > 2x previous OR significant jump
    if (last > prev * 1.5 && last > 20) {
      return true;
    }
  }
  return false;
}
