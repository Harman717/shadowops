interface WorkflowRun {
  id: string;
  name: string;
  conclusion: "success" | "failure";
  head_branch: string;
  created_at: string;
}

export function generateMockRuns(count: number, failureRate: number = 0): WorkflowRun[] {
  const runs: WorkflowRun[] = [];
  for (let i = 0; i < count; i++) {
    const isFailure = Math.random() < failureRate;
    runs.push({
      id: `run-${i}`,
      name: `workflow-${i}`,
      conclusion: isFailure ? "failure" : "success",
      head_branch: "main",
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  return runs;
}

export function generateConsecutiveFailures(count: number): WorkflowRun[] {
  const runs: WorkflowRun[] = [];
  for (let i = 0; i < count; i++) {
    runs.push({
      id: `run-${i}`,
      name: `workflow-${i}`,
      conclusion: "failure",
      head_branch: "main",
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  return runs;
}
