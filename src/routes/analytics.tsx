import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ChartArea, ChartBar, ChartLine, ChartPie } from "@/components/charts";
import { KpiCard } from "@/components/kpi-card";
import { CATEGORIES, DEPARTMENTS, STATS } from "@/lib/mock";
import { Activity, Timer, Wallet, Users } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · CivicConnect AI" },
      {
        name: "description",
        content:
          "Pie, bar, line and area charts covering complaints, departments, budgets and officer productivity.",
      },
      { property: "og:title", content: "Analytics · CivicConnect AI" },
      { property: "og:description", content: "Deep civic analytics dashboards." },
    ],
  }),
  component: AnalyticsPage,
});

const monthly = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map((m, i) => ({
  name: m,
  Complaints: 60 + Math.round(Math.sin(i) * 30 + i * 4),
  Resolved: 40 + Math.round(Math.cos(i) * 20 + i * 3),
  Escalated: 5 + Math.round(Math.sin(i * 2) * 3),
}));

function AnalyticsPage() {
  return (
    <AppShell title="Analytics" subtitle="City intelligence">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label="Total volume"
          value={STATS.total}
          icon={Activity}
          tone="primary"
          index={0}
        />
        <KpiCard label="Avg resolution" value="41h" icon={Timer} tone="info" index={1} />
        <KpiCard label="Budget spent" value="₹6.2Cr" icon={Wallet} tone="success" index={2} />
        <KpiCard label="Officer productivity" value="94%" icon={Users} tone="warning" index={3} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-3 font-semibold">Complaint Trend · Monthly</h3>
          <ChartArea data={monthly} keys={["Complaints", "Resolved", "Escalated"]} />
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Category Split</h3>
          <ChartPie
            data={CATEGORIES.slice(0, 5).map((c, i) => ({ name: c.name, value: 40 + i * 12 }))}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Department Comparison</h3>
          <ChartBar
            data={DEPARTMENTS.slice(0, 8).map((d, i) => ({
              name: d.split(" ")[0],
              value: 30 + i * 9,
            }))}
          />
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Resolution Time (hrs)</h3>
          <ChartLine
            data={monthly.map((m, i) => ({
              name: m.name,
              value: 30 + Math.round(Math.sin(i) * 10 + i * 0.5),
            }))}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Budget Usage by Department</h3>
          <ChartBar
            data={DEPARTMENTS.slice(0, 6).map((d) => ({
              name: d.split(" ")[0],
              value: 30 + Math.round(Math.random() * 60),
            }))}
          />
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Officer Productivity</h3>
          <ChartArea data={monthly.slice(0, 8)} keys={["Complaints", "Resolved"]} />
        </div>
      </div>
    </AppShell>
  );
}
