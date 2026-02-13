type Props = {
  title: string;
  value: string | number;
  color?: "green" | "red" | "blue";
};

export default function MetricCard({ title, value, color = "blue" }: Props) {
  const colorStyles = {
    green: "from-green-500/20 to-emerald-500/10 border-green-500/30",
    red: "from-red-500/20 to-rose-500/10 border-red-500/30",
    blue: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} backdrop-blur border rounded-lg p-6 shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">{title}</h3>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );
}
