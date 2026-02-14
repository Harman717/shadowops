"use client";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

interface ChartDataPoint {
  date: string;
  status: number;
  risk?: number;
  name: string;
  conclusion: string;
  createdAt: string;
}

type Props = {
  data: ChartDataPoint[];
};

export default function RiskChart({ data }: Props) {
  // Use risk field if available, otherwise calculate from status
  const chartData = data.map((point) => ({
    date: point.date,
    risk: point.risk ?? Math.round(point.status * 100),
    failures: point.status,
    name: point.name,
  }));

  const handleTooltip = (value: number | undefined, name: string | undefined) => {
    if (!value) return ["0", name || ""];
    if (name === "risk") return [`${value}%`, "Risk Score"];
    if (name === "failures") return [value, "Failed Runs"];
    return [value, name || ""];
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" label={{ value: "Risk Score (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
            formatter={handleTooltip}
          />
          <Legend />
          <Bar dataKey="failures" fill="#ef4444" name="Failed Runs" opacity={0.7} />
          <Line
            type="linear"
            dataKey="risk"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: "#ef4444", r: 4 }}
            activeDot={{ r: 6 }}
            name="Risk Score (%)"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
