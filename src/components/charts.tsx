import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";

const COLORS = [
  "oklch(0.55 0.18 255)",
  "oklch(0.62 0.15 155)",
  "oklch(0.75 0.16 55)",
  "oklch(0.6 0.2 25)",
  "oklch(0.55 0.14 300)",
  "oklch(0.65 0.13 220)",
];

const tooltipStyle = {
  contentStyle: {
    background: "oklch(1 0 0 / 0.95)",
    border: "1px solid oklch(0.9 0.015 245)",
    borderRadius: 12,
    boxShadow: "0 10px 30px -12px oklch(0.4 0.1 258 / 0.25)",
    fontSize: 12,
  },
};

export function ChartPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ChartBar({
  data,
  dataKey = "value",
  xKey = "name",
}: {
  data: Array<Record<string, any>>;
  dataKey?: string;
  xKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 245)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "oklch(0.55 0.18 255 / 0.08)" }} />
        <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChartLine({
  data,
  dataKey = "value",
  xKey = "name",
}: {
  data: Array<Record<string, any>>;
  dataKey?: string;
  xKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 245)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={COLORS[0]}
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ChartArea({
  data,
  keys,
  xKey = "name",
}: {
  data: Array<Record<string, any>>;
  keys: string[];
  xKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          {keys.map((k, i) => (
            <linearGradient key={k} id={`grad-${k}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 245)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Area
            key={k}
            type="monotone"
            dataKey={k}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            fill={`url(#grad-${k})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
