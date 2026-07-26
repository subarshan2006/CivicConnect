import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { ChartPie, ChartBar, ChartArea, ChartLine } from "@/components/charts";
import { ComplaintMap } from "@/components/complaint-map";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { ComplaintTimeline } from "@/components/complaint-timeline";
import { COMPLAINTS, NOTIFICATIONS, STATS, DEPARTMENTS } from "@/lib/mock";
import type { Role } from "@/lib/types";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Clock,
  Activity,
  Timer,
  AlertTriangle,
  Users,
  Building2,
  Zap,
  TrendingUp,
  MapPin,
  HardHat,
  ShieldCheck,
  Wallet,
  ClipboardList,
  Camera,
  PlusCircle,
  BellRing,
  MessageSquare,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/$role")({
  head: () => ({
    meta: [
      { title: "Dashboard · CivicConnect AI" },
      {
        name: "description",
        content:
          "Personalized government dashboard for citizens, ward officers, departments, field staff, inspectors and administrators.",
      },
      { property: "og:title", content: "Dashboard · CivicConnect AI" },
      { property: "og:description", content: "Personalized government Smart City dashboard." },
    ],
  }),
  component: DashboardPage,
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
}));

function pieByStatus() {
  const map: Record<string, number> = {};
  for (const c of COMPLAINTS) map[c.status] = (map[c.status] || 0) + 1;
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}
function catBar() {
  const map: Record<string, number> = {};
  for (const c of COMPLAINTS) map[c.category] = (map[c.category] || 0) + 1;
  return Object.entries(map)
    .slice(0, 8)
    .map(([name, value]) => ({ name: name.split(" ")[0], value }));
}

function DashboardPage() {
  const { user } = useAuth();
  const { role } = useParams({ from: "/dashboard/$role" }) as { role: Role };
  const r = (user?.role ?? role) as Role;
  const titleMap: Record<Role, [string, string]> = {
    citizen: ["Namaste, welcome back", "Track your civic contributions and city progress"],
    ward: ["Ward 42 Command Center", "Manage queue, verify complaints and monitor SLAs"],
    department: ["Electrical Department", "Assign engineers, track budget and completion reports"],
    field: ["Today's field tasks", "Navigate to sites, capture evidence and mark completion"],
    inspector: ["Quality Inspection Desk", "Verify completed work and approve reopens"],
    admin: ["Government Analytics", "Nation-wide performance across all wards and departments"],
  };
  const [t, s] = titleMap[r];
  return (
    <AppShell
      title={t}
      subtitle={
        r === "admin"
          ? "Super Admin Console"
          : `${r.charAt(0).toUpperCase() + r.slice(1)} Dashboard`
      }
    >
      <p className="mb-6 -mt-3 text-sm text-muted-foreground">{s}</p>
      {r === "citizen" && <CitizenDash />}
      {r === "ward" && <WardDash />}
      {r === "department" && <DepartmentDash />}
      {r === "field" && <FieldDash />}
      {r === "inspector" && <InspectorDash />}
      {r === "admin" && <AdminDash />}
    </AppShell>
  );
}

function CitizenDash() {
  const mine = COMPLAINTS.slice(0, 12);
  const stats = {
    my: 12,
    resolved: 7,
    pending: 2,
    progress: 3,
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard
          label="My Complaints"
          value={stats.my}
          icon={FileText}
          tone="primary"
          delta="+2 this month"
          trend="up"
          index={0}
        />
        <KpiCard
          label="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          tone="success"
          delta="58% rate"
          trend="up"
          index={1}
        />
        <KpiCard label="Pending" value={stats.pending} icon={Clock} tone="info" index={2} />
        <KpiCard
          label="In Progress"
          value={stats.progress}
          icon={Activity}
          tone="warning"
          index={3}
        />
        <KpiCard
          label="Avg Resolution"
          value="36h"
          icon={Timer}
          tone="primary"
          delta="-8h vs city"
          trend="up"
          index={4}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <QuickActions />
        <NearbyIssues />
        <LatestNotifications />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="Complaints per Month" hint="Last 12 months" />
          <ChartArea data={monthly} keys={["Complaints", "Resolved"]} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Status Distribution" />
          <ChartPie data={pieByStatus().slice(0, 5)} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="Complaint Heatmap" hint="Your city" />
          <ComplaintMap height={340} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Complaint Timeline" hint="Latest activity" />
          <ComplaintTimeline steps={mine[0].timeline.slice(0, 6)} />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <SectionHeader
          title="Recent Complaints"
          cta={
            <Link to="/complaints" className="text-sm font-medium text-primary hover:underline">
              View all →
            </Link>
          }
        />
        <ComplaintList items={mine.slice(0, 6)} />
      </div>
    </div>
  );
}

function WardDash() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard label="Pending" value={124} icon={Clock} tone="info" index={0} />
        <KpiCard
          label="High Priority"
          value={38}
          icon={AlertTriangle}
          tone="destructive"
          index={1}
        />
        <KpiCard label="Assigned" value={186} icon={ClipboardList} tone="primary" index={2} />
        <KpiCard label="Escalated" value={12} icon={TrendingUp} tone="warning" index={3} />
        <KpiCard label="Officers on-duty" value={22} icon={Users} tone="success" index={4} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="Ward Complaint Heatmap" hint="Ward 42" />
          <ComplaintMap height={360} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Officer Performance" />
          <OfficerLeaderboard />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <SectionHeader
          title="Complaint Queue"
          cta={
            <div className="flex gap-2 text-xs">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">All</span>
              <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">High</span>
              <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                Escalated
              </span>
            </div>
          }
        />
        <ComplaintTable items={COMPLAINTS.slice(0, 10)} showActions />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Category Distribution" />
          <ChartBar data={catBar()} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Weekly Trend" />
          <ChartArea data={monthly.slice(0, 8)} keys={["Complaints", "Resolved"]} />
        </div>
      </div>
    </div>
  );
}

function DepartmentDash() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard label="Active Complaints" value={214} icon={Activity} tone="warning" index={0} />
        <KpiCard label="Assigned Engineers" value={38} icon={HardHat} tone="primary" index={1} />
        <KpiCard label="Avg Resolution" value="41h" icon={Timer} tone="info" index={2} />
        <KpiCard
          label="Budget Used"
          value="₹42.6L"
          icon={Wallet}
          tone="success"
          delta="72% of quarter"
          index={3}
        />
        <KpiCard label="Pending" value={57} icon={Clock} tone="destructive" index={4} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="Departmental Performance" />
          <ChartArea data={monthly} keys={["Complaints", "Resolved"]} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Category Split" />
          <ChartPie data={catBar().slice(0, 5)} />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <SectionHeader
          title="Active Work Orders"
          cta={
            <button className="rounded-lg gov-gradient px-3 py-1.5 text-xs font-medium text-white">
              + Assign Field Staff
            </button>
          }
        />
        <ComplaintTable items={COMPLAINTS.slice(20, 30)} showActions />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Estimated Cost" />
          <ChartBar data={catBar()} />
        </div>
        <BudgetPanel />
      </div>
    </div>
  );
}

function FieldDash() {
  const tasks = COMPLAINTS.slice(40, 48);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Today's Tasks" value={8} icon={ClipboardList} tone="primary" index={0} />
        <KpiCard label="Completed" value={3} icon={CheckCircle2} tone="success" index={1} />
        <KpiCard label="In Progress" value={2} icon={Activity} tone="warning" index={2} />
        <KpiCard label="Distance covered" value="14 km" icon={MapPin} tone="info" index={3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="Route Navigation" hint="Optimized route for today" />
          <ComplaintMap height={360} />
        </div>
        <div className="glass space-y-3 rounded-2xl p-5">
          <SectionHeader title="Field Capture" />
          {[
            { icon: Camera, label: "Upload Before Photo", tone: "text-primary bg-primary/10" },
            { icon: Camera, label: "Upload After Photo", tone: "text-success bg-success/10" },
            { icon: MapPin, label: "Capture GPS", tone: "text-info bg-info/10" },
            { icon: Clock, label: "Log Time", tone: "text-warning bg-warning/10" },
            { icon: MessageSquare, label: "Voice Note", tone: "text-primary bg-primary/10" },
            { icon: CheckCircle2, label: "Mark Complete", tone: "text-success bg-success/10" },
          ].map((a) => (
            <button
              key={a.label}
              className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 text-left text-sm font-medium hover:bg-background"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.tone}`}>
                <a.icon className="h-4 w-4" />
              </span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <SectionHeader title="Assigned Complaints" />
        <div className="grid gap-3 md:grid-cols-2">
          {tasks.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border/60 bg-background/40 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-mono text-muted-foreground">{c.code}</div>
                  <div className="mt-1 font-semibold">{c.category}</div>
                  <div className="text-xs text-muted-foreground">{c.address}</div>
                </div>
                <PriorityBadge priority={c.priority} />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <StatusBadge status={c.status} />
                <span className="text-muted-foreground">ETA {c.estimatedResolution}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InspectorDash() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label="Pending Verification"
          value={42}
          icon={ShieldCheck}
          tone="warning"
          index={0}
        />
        <KpiCard
          label="Approved this week"
          value={87}
          icon={CheckCircle2}
          tone="success"
          index={1}
        />
        <KpiCard
          label="Rework Ordered"
          value={9}
          icon={AlertTriangle}
          tone="destructive"
          index={2}
        />
        <KpiCard label="Sites Visited" value={31} icon={MapPin} tone="info" index={3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="Inspection Schedule" hint="Next 7 days" />
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <div key={d} className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="text-[10px] uppercase text-muted-foreground">{d}</div>
                <div className="mt-1 text-lg font-bold">{[6, 4, 8, 5, 9, 3, 2][i]}</div>
                <div className="text-[10px] text-muted-foreground">inspections</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {COMPLAINTS.slice(60, 66).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-medium">
                    {c.category} · {c.address}
                  </div>
                  <div className="text-xs text-muted-foreground">Field Staff: {c.fieldStaff}</div>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success hover:bg-success/20">
                    Approve
                  </button>
                  <button className="rounded-lg bg-warning/10 px-2 py-1 text-xs font-medium text-warning hover:bg-warning/20">
                    Rework
                  </button>
                  <button className="rounded-lg bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/20">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Before / After" />
          <div className="space-y-2">
            <img
              src={COMPLAINTS[60].beforeImage}
              alt="before"
              className="aspect-video w-full rounded-xl object-cover"
            />
            <img
              src={COMPLAINTS[60].afterImage}
              alt="after"
              className="aspect-video w-full rounded-xl object-cover"
            />
            <Link
              to="/complaints/$id"
              params={{ id: COMPLAINTS[60].id }}
              className="block rounded-xl gov-gradient px-3 py-2 text-center text-sm font-medium text-white"
            >
              Open comparison
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDash() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Total Complaints"
          value={STATS.total.toLocaleString()}
          icon={FileText}
          tone="primary"
          delta="+18% MoM"
          trend="up"
          index={0}
        />
        <KpiCard
          label="Resolved"
          value={STATS.closed}
          icon={CheckCircle2}
          tone="success"
          delta={`${Math.round((STATS.closed / STATS.total) * 100)}%`}
          index={1}
        />
        <KpiCard label="Pending" value={STATS.pending} icon={Clock} tone="info" index={2} />
        <KpiCard
          label="Departments"
          value={STATS.departments}
          icon={Building2}
          tone="warning"
          index={3}
        />
        <KpiCard label="Officers" value={STATS.officers} icon={Users} tone="primary" index={4} />
        <KpiCard label="Citizens" value={STATS.citizens} icon={Users} tone="success" index={5} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="National Heatmap" hint="All wards · all departments" />
          <ComplaintMap height={380} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Status Distribution" />
          <ChartPie data={pieByStatus().slice(0, 5)} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Complaint Trends" hint="Monthly" />
          <ChartArea data={monthly} keys={["Complaints", "Resolved"]} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="Department Performance" />
          <ChartBar
            data={DEPARTMENTS.slice(0, 8).map((d, i) => ({
              name: d.split(" ")[0],
              value: 40 + Math.round(Math.sin(i) * 30 + i * 6),
            }))}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <SectionHeader title="Officer Rankings" />
          <OfficerLeaderboard rows={8} />
        </div>
        <div className="glass rounded-2xl p-5">
          <SectionHeader title="AI Predictions" hint="Next 24 hours" />
          <div className="space-y-3">
            {[
              { label: "Expected complaints", value: "142", tone: "text-primary" },
              { label: "SLA breach risk", value: "18%", tone: "text-destructive" },
              { label: "Escalation likelihood", value: "6%", tone: "text-warning" },
              { label: "Predicted resolution", value: "38h avg", tone: "text-success" },
            ].map((p) => (
              <div
                key={p.label}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2"
              >
                <span className="text-sm text-muted-foreground">{p.label}</span>
                <span className={`text-lg font-bold ${p.tone}`}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Shared blocks */
function SectionHeader({
  title,
  hint,
  cta,
}: {
  title: string;
  hint?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-2">
      <div>
        <h3 className="font-semibold tracking-tight">{title}</h3>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {cta}
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      to: "/complaints/new",
      label: "Report Complaint",
      icon: PlusCircle,
      tone: "from-primary to-primary/70",
    },
    {
      to: "/complaints/track",
      label: "Track Complaint",
      icon: MapPin,
      tone: "from-info to-info/70",
    },
    {
      to: "/complaints/new",
      label: "Emergency",
      icon: AlertTriangle,
      tone: "from-destructive to-destructive/70",
    },
    { to: "/chat", label: "Chat Support", icon: MessageSquare, tone: "from-success to-success/70" },
  ];
  return (
    <div className="glass rounded-2xl p-5">
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className={`group relative flex flex-col items-start gap-2 overflow-hidden rounded-xl bg-gradient-to-br ${a.tone} p-4 text-white shadow-sm transition hover:shadow-md`}
          >
            <a.icon className="h-5 w-5" />
            <div className="text-sm font-semibold">{a.label}</div>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl transition-opacity group-hover:opacity-70" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function NearbyIssues() {
  return (
    <div className="glass rounded-2xl p-5">
      <SectionHeader title="Nearby Issues" hint="Within 2 km" />
      <div className="space-y-3">
        {COMPLAINTS.slice(0, 4).map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{c.category}</div>
              <div className="truncate text-xs text-muted-foreground">{c.address}</div>
            </div>
            <StatusBadge status={c.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestNotifications() {
  return (
    <div className="glass rounded-2xl p-5">
      <SectionHeader
        title="Latest Notifications"
        cta={
          <Link to="/notifications" className="text-xs font-medium text-primary hover:underline">
            All →
          </Link>
        }
      />
      <div className="space-y-3">
        {NOTIFICATIONS.slice(0, 4).map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
              <BellRing className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium leading-tight">{n.title}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{n.time}</div>
            </div>
            {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function OfficerLeaderboard({ rows = 5 }: { rows?: number }) {
  const officers = Array.from({ length: rows }).map((_, i) => ({
    name: [
      "Rajesh Verma",
      "Priya Iyer",
      "Suresh Naidu",
      "Meera Nair",
      "Amit Sharma",
      "Rahul Menon",
      "Divya Rao",
      "Karan Singh",
    ][i],
    resolved: 120 - i * 8,
    rating: (4.9 - i * 0.1).toFixed(1),
    dept: DEPARTMENTS[i],
  }));
  return (
    <div className="space-y-2">
      {officers.map((o, i) => (
        <div
          key={o.name}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-2"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? "gov-gradient text-white" : "bg-muted"}`}
          >
            #{i + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{o.name}</div>
            <div className="truncate text-[11px] text-muted-foreground">{o.dept}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">{o.resolved}</div>
            <div className="flex items-center gap-1 text-[11px] text-warning">
              <Award className="h-3 w-3" />
              {o.rating}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetPanel() {
  const items = DEPARTMENTS.slice(0, 6).map((d, i) => ({ dept: d, used: 30 + i * 8, total: 100 }));
  return (
    <div className="glass rounded-2xl p-5">
      <SectionHeader title="Budget Usage" hint="Q2 FY26" />
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.dept}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{it.dept}</span>
              <span className="text-muted-foreground">{it.used}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${it.used}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full gov-gradient"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplaintList({ items }: { items: typeof COMPLAINTS }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((c, i) => (
        <Link key={c.id} to="/complaints/$id" params={{ id: c.id }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group h-full rounded-xl border border-border/60 bg-background/40 p-4 transition hover:border-primary/40 hover:bg-background hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-muted-foreground">{c.code}</div>
                <div className="mt-0.5 font-semibold group-hover:text-primary">{c.category}</div>
              </div>
              <PriorityBadge priority={c.priority} />
            </div>
            <div className="mt-2 line-clamp-1 text-xs text-muted-foreground">{c.address}</div>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge status={c.status} />
              <span className="text-[11px] text-muted-foreground">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

export function ComplaintTable({
  items,
  showActions,
}: {
  items: typeof COMPLAINTS;
  showActions?: boolean;
}) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-2 py-2 font-semibold">ID</th>
            <th className="px-2 py-2 font-semibold">Category</th>
            <th className="px-2 py-2 font-semibold">Ward</th>
            <th className="px-2 py-2 font-semibold">Officer</th>
            <th className="px-2 py-2 font-semibold">Priority</th>
            <th className="px-2 py-2 font-semibold">Status</th>
            {showActions && <th className="px-2 py-2 font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-t border-border/50 hover:bg-muted/40">
              <td className="px-2 py-2 font-mono text-xs">{c.code}</td>
              <td className="px-2 py-2 font-medium">
                <Link to="/complaints/$id" params={{ id: c.id }} className="hover:text-primary">
                  {c.category}
                </Link>
              </td>
              <td className="px-2 py-2 text-muted-foreground">W{c.ward}</td>
              <td className="px-2 py-2 text-muted-foreground">{c.officer}</td>
              <td className="px-2 py-2">
                <PriorityBadge priority={c.priority} />
              </td>
              <td className="px-2 py-2">
                <StatusBadge status={c.status} />
              </td>
              {showActions && (
                <td className="px-2 py-2 text-right">
                  <div className="inline-flex gap-1">
                    <button className="rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">
                      Approve
                    </button>
                    <button className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Forward
                    </button>
                    <button className="rounded-lg bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                      Reject
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
