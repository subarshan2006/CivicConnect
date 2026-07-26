import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ComplaintTimeline } from "@/components/complaint-timeline";
import { COMPLAINTS } from "@/lib/mock";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { Search } from "lucide-react";
import { useState } from "react";
import { ComplaintMap } from "@/components/complaint-map";

export const Route = createFileRoute("/complaints/track")({
  head: () => ({
    meta: [
      { title: "Track Complaint · CivicConnect AI" },
      {
        name: "description",
        content:
          "Real-time animated timeline of your complaint from submission to citizen verification.",
      },
      { property: "og:title", content: "Track Complaint · CivicConnect AI" },
      { property: "og:description", content: "Real-time complaint timeline." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [code, setCode] = useState(COMPLAINTS[0].code);
  const c = COMPLAINTS.find((x) => x.code === code) ?? COMPLAINTS[0];
  return (
    <AppShell title="Track Complaint" subtitle="Citizen Portal">
      <div className="mb-5 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background/60 py-2 pl-9 pr-3 text-sm font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Enter complaint code"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-mono text-xs text-muted-foreground">{c.code}</div>
              <h2 className="mt-1 text-xl font-bold">{c.category}</h2>
              <div className="text-sm text-muted-foreground">{c.address}</div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={c.status} />
              <PriorityBadge priority={c.priority} />
            </div>
          </div>
          <ComplaintTimeline steps={c.timeline} />
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Live Location</h3>
            <ComplaintMap height={220} filter={(x) => x.id === c.id} />
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Photo Evidence</h3>
            <div className="grid grid-cols-2 gap-2">
              <img src={c.beforeImage} className="aspect-square rounded-xl object-cover" alt="" />
              <img src={c.afterImage} className="aspect-square rounded-xl object-cover" alt="" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
