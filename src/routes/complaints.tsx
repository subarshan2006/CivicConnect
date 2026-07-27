import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { COMPLAINTS } from "@/lib/mock";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { motion } from "framer-motion";
import { LayoutGrid, List, Search, Filter, PlusCircle } from "lucide-react";
import { useState } from "react";
import type { ComplaintStatus } from "@/lib/types";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints · PRAMAAN" },
      {
        name: "description",
        content: "Browse, filter and manage the full complaint queue across wards and departments.",
      },
      { property: "og:title", content: "Complaints · PRAMAAN" },
      {
        property: "og:description",
        content: "The full civic complaint queue for Indian Smart Cities.",
      },
    ],
  }),
  component: ComplaintsPage,
});

const STATUS_COLS: { key: ComplaintStatus; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "verified", label: "Verified" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "work_done", label: "Work Done" },
  { key: "closed", label: "Closed" },
];

function ComplaintsPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [q, setQ] = useState("");
  const data = COMPLAINTS.filter(
    (c) =>
      !q ||
      c.category.toLowerCase().includes(q.toLowerCase()) ||
      c.code.toLowerCase().includes(q.toLowerCase()) ||
      c.city.toLowerCase().includes(q.toLowerCase()),
  ).slice(0, 200);
  return (
    <AppShell title="Complaint Management" subtitle="All Complaints">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by code, category, city..."
            className="w-full rounded-xl border border-border/60 bg-background/60 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <button className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium">
          <Filter className="h-4 w-4" />
          Filters
        </button>
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-border/60 bg-background/60 p-1">
          <button
            onClick={() => setView("kanban")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${view === "kanban" ? "bg-primary text-white" : "text-muted-foreground"}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setView("table")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${view === "table" ? "bg-primary text-white" : "text-muted-foreground"}`}
          >
            <List className="h-3.5 w-3.5" />
            Table
          </button>
        </div>
        <Link
          to="/complaints/new"
          className="inline-flex items-center gap-2 rounded-xl gov-gradient px-3 py-2 text-sm font-semibold text-white shadow"
        >
          <PlusCircle className="h-4 w-4" />
          New Complaint
        </Link>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4 overflow-x-auto pb-4">
          {STATUS_COLS.map((col) => {
            const items = data.filter((c) => c.status === col.key).slice(0, 8);
            return (
              <div key={col.key} className="glass flex flex-col rounded-2xl p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={col.key} />
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {items.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        to="/complaints/$id"
                        params={{ id: c.id }}
                        className="block rounded-xl border border-border/60 bg-background/60 p-3 hover:border-primary/40 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-[10px] text-muted-foreground">
                            {c.code}
                          </div>
                          <PriorityBadge priority={c.priority} />
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm font-semibold">{c.category}</div>
                        <div className="mt-2 line-clamp-1 text-[11px] text-muted-foreground">
                          {c.address}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>W{c.ward}</span>
                          <span>{c.officer.split(" ")[0]}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-2 py-2 font-semibold">Code</th>
                  <th className="px-2 py-2 font-semibold">Category</th>
                  <th className="px-2 py-2 font-semibold">Citizen</th>
                  <th className="px-2 py-2 font-semibold">Ward</th>
                  <th className="px-2 py-2 font-semibold">Department</th>
                  <th className="px-2 py-2 font-semibold">Priority</th>
                  <th className="px-2 py-2 font-semibold">Status</th>
                  <th className="px-2 py-2 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 60).map((c) => (
                  <tr key={c.id} className="border-t border-border/50 hover:bg-muted/40">
                    <td className="px-2 py-2">
                      <Link
                        to="/complaints/$id"
                        params={{ id: c.id }}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {c.code}
                      </Link>
                    </td>
                    <td className="px-2 py-2 font-medium">{c.category}</td>
                    <td className="px-2 py-2 text-muted-foreground">{c.citizen}</td>
                    <td className="px-2 py-2 text-muted-foreground">W{c.ward}</td>
                    <td className="px-2 py-2 text-muted-foreground">{c.department}</td>
                    <td className="px-2 py-2">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-2 py-2">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-2 py-2 text-xs text-muted-foreground">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
