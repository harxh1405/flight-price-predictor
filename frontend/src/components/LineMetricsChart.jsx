import { useState } from "react";
import {
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function LineMetricChart({
  data,
  metric,
  title,
  xKey = "test_size",
  dark = false, // optional theme toggle
}) {
  // -------------------------------------
  // MODEL COLORS (light & dark mode)
  // -------------------------------------
  const modelColors = {
    LinearRegression: dark ? "#60a5fa" : "#2563eb",
    RandomForest: dark ? "#4ade80" : "#16a34a",
    GradientBoosting: dark ? "#f87171" : "#dc2626",
    XGBoost: dark ? "#c084fc" : "#9333ea",
    LightGBM: dark ? "#facc15" : "#ca8a04",
    CatBoost: dark ? "#fb923c" : "#ea580c",
  };

  // -------------------------------------
  // Group data by x-axis key
  // -------------------------------------
  const grouped = {};
  data.forEach((d) => {
    const key = d[xKey];
    if (!grouped[key]) grouped[key] = { [xKey]: key };
    grouped[key][d.model] = d[metric];
  });

  const finalData = Object.values(grouped);

  // -------------------------------------
  // Duplicate values for area (area-only dataKey)
  // -------------------------------------
  finalData.forEach((row) => {
    Object.keys(modelColors).forEach((model) => {
      if (row[model] !== undefined) {
        row[`${model}_area`] = row[model];
      }
    });
  });

  // -------------------------------------
  // MODEL VISIBILITY (toggle-on/off)
  // -------------------------------------
  const [visibleModels, setVisibleModels] = useState({
    LinearRegression: true,
    RandomForest: true,
    GradientBoosting: true,
    XGBoost: true,
    LightGBM: true,
    CatBoost: true,
  });

  const toggleModel = (model) => {
    setVisibleModels({
      ...visibleModels,
      [model]: !visibleModels[model],
    });
  };

  // -------------------------------------
  // Custom Tooltip with sorting
  // -------------------------------------
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    // Remove area duplicates
    const filtered = payload.filter(
      (p) => !p.name.includes("_area") && visibleModels[p.name]
    );

    // Sort by value
    filtered.sort((a, b) => b.value - a.value);

    return (
      <div
        className={`rounded-lg p-4 border shadow-lg ${
          dark
            ? "bg-gray-800 border-gray-600 text-gray-100"
            : "bg-white border-gray-200"
        }`}
      >
        <p className="font-medium mb-2">
          {xKey.toUpperCase()}: {label}
        </p>

        {filtered.map((entry, idx) => {
          const model = entry.name;
          return (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: modelColors[model] }}
              ></span>
              <span className="font-medium">{model}</span>
              <span className="ml-auto">{entry.value.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // -------------------------------------
  // Custom Legend (clickable, animated)
  // -------------------------------------
  const CustomLegend = () => {
    return (
      <div className="flex gap-4 flex-wrap mb-3">
        {Object.keys(modelColors).map((model) => (
          <div
            key={model}
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => toggleModel(model)}
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{
                backgroundColor: visibleModels[model]
                  ? modelColors[model]
                  : "#9ca3af",
              }}
            ></span>
            <span
              className={`text-sm ${
                visibleModels[model] ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {model}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`p-6 rounded shadow ${
        dark ? "bg-gray-900 text-gray-100" : "bg-white"
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>

      <CustomLegend />

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={finalData}>
          <defs>
            {/* Gradient per model */}
            {Object.keys(modelColors).map((model) => (
              <linearGradient
                key={model}
                id={`grad-${model}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="20%"
                  stopColor={modelColors[model]}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={modelColors[model]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />

          {/* Animated Lines + Areas */}
          {Object.keys(modelColors).map((model) => (
            <AnimatePresence key={model}>
              {visibleModels[model] && (
                <>
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Line
                      type="monotone"
                      dataKey={model}
                      stroke={modelColors[model]}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey={`${model}_area`}
                      stroke="none"
                      fill={`url(#grad-${model})`}
                      legendType="none"
                    />
                  </motion.g>
                </>
              )}
            </AnimatePresence>
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
