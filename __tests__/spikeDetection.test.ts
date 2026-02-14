import { describe, it, expect } from "@jest/globals";

interface ChartDataPoint {
  date: string;
  status: number;
  name: string;
  conclusion: string;
  createdAt: string;
}

function detectSpike(chartData: ChartDataPoint[]): boolean {
  if (chartData.length >= 2) {
    const last = chartData[chartData.length - 1].status;
    const prev = chartData[chartData.length - 2].status;
    if (last > prev * 2 && last > 0) {
      return true;
    }
  }
  return false;
}

describe("Spike Detection", () => {
  it("should detect spike when last status > 2x previous and > 0", () => {
    const data = [
      { date: "1/1", status: 0, name: "run1", conclusion: "success", createdAt: "" },
      { date: "1/2", status: 2, name: "run2", conclusion: "failure", createdAt: "" },
    ];
    expect(detectSpike(data)).toBe(true);
  });

  it("should not detect spike when last < 2x previous", () => {
    const data = [
      { date: "1/1", status: 2, name: "run1", conclusion: "failure", createdAt: "" },
      { date: "1/2", status: 3, name: "run2", conclusion: "failure", createdAt: "" },
    ];
    expect(detectSpike(data)).toBe(false);
  });

  it("should not detect spike when last = 0", () => {
    const data = [
      { date: "1/1", status: 5, name: "run1", conclusion: "failure", createdAt: "" },
      { date: "1/2", status: 0, name: "run2", conclusion: "success", createdAt: "" },
    ];
    expect(detectSpike(data)).toBe(false);
  });

  it("should not detect spike with less than 2 data points", () => {
    const data = [
      { date: "1/1", status: 5, name: "run1", conclusion: "failure", createdAt: "" },
    ];
    expect(detectSpike(data)).toBe(false);
  });

  it("should detect spike with multiple data points", () => {
    const data = [
      { date: "1/1", status: 1, name: "run1", conclusion: "failure", createdAt: "" },
      { date: "1/2", status: 0, name: "run2", conclusion: "success", createdAt: "" },
      { date: "1/3", status: 1, name: "run3", conclusion: "failure", createdAt: "" },
      { date: "1/4", status: 3, name: "run4", conclusion: "failure", createdAt: "" },
    ];
    expect(detectSpike(data)).toBe(true);
  });
});
