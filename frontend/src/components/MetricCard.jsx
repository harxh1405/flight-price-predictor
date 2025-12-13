import { motion } from "framer-motion";
import Sparkline from "./Sparkline";

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  sparkData = [],
  trend = 0,
}) {
  const colorMap = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    purple: "bg-purple-600",
    amber: "bg-amber-600",
  };

  const textColor = colorMap[color];

  const trendColor =
    trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-500";
  const trendArrow = trend > 0 ? "↑" : trend < 0 ? "↓" : "-";

  return (
    <motion.div
      className="p-6 rounded-xl shadow-md bg-white border border-gray-100"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      {/* TOP ROW */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${textColor}`}
          >
            <Icon size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>

        {/* Trend Arrow */}
        <p className={`text-xl font-bold ${trendColor}`}>{trendArrow}</p>
      </div>

      {/* Sparkline Chart */}
      <div className="mt-3">
        <Sparkline data={sparkData} color={textColor.replace("bg-", "#")} />
      </div>

      {/* Subtitle */}
      {subtitle && <p className="text-gray-500 text-sm mt-2">{subtitle}</p>}
    </motion.div>
  );
}
