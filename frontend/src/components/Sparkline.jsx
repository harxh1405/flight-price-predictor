import { AreaChart, Area, ResponsiveContainer } from "recharts";

export default function Sparkline({ data, color }) {
  return (
    <div className="w-full h-10">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="sparkline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="30%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill="url(#sparkline)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
