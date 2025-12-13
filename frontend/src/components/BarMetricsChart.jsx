import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarMetricsChart({ data, model }) {
  const latest = data[data.length - 1];

  const barData = [
    { metric: "RMSE", value: latest.rmse },
    { metric: "MAE", value: latest.mae },
    { metric: "R²", value: latest.r2 },
    { metric: "Train Time", value: latest.train_time },
  ];

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl mb-4 font-bold">Metrics for {model}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
