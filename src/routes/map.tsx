import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ComplaintMap } from "@/components/complaint-map";
import { CATEGORIES, COMPLAINTS } from "@/lib/mock";
import { useState } from "react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Complaint Map · PRAMAAN" },
      {
        name: "description",
        content:
          "Interactive India map with complaint markers, category filters and priority heatmap.",
      },
      { property: "og:title", content: "Complaint Map · PRAMAAN" },
      { property: "og:description", content: "National complaint map with filters." },
    ],
  }),
  component: MapPage,
});
function MapPage() {
  const [cat, setCat] = useState<string | "all">("all");
  const [status, setStatus] = useState<"all" | "open" | "resolved" | "high">("all");
  return (
    <AppShell title="Interactive India Map" subtitle="Complaint Heatmap">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="glass space-y-5 rounded-2xl p-4">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </div>
            <div className="space-y-1">
              <FilterButton active={cat === "all"} onClick={() => setCat("all")}>
                All ({COMPLAINTS.length})
              </FilterButton>
              {CATEGORIES.slice(0, 10).map((c) => (
                <FilterButton key={c.name} active={cat === c.name} onClick={() => setCat(c.name)}>
                  {c.name}
                </FilterButton>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </div>
            <div className="space-y-1">
              <FilterButton active={status === "all"} onClick={() => setStatus("all")}>
                All
              </FilterButton>
              <FilterButton active={status === "open"} onClick={() => setStatus("open")}>
                Open
              </FilterButton>
              <FilterButton active={status === "resolved"} onClick={() => setStatus("resolved")}>
                Resolved
              </FilterButton>
              <FilterButton active={status === "high"} onClick={() => setStatus("high")}>
                High Priority
              </FilterButton>
            </div>
          </div>
        </div>
        <ComplaintMap
          height={620}
          filter={(c) =>
            (cat === "all" || c.category === cat) &&
            (status === "all" ||
              (status === "open" && c.status !== "closed") ||
              (status === "resolved" && c.status === "closed") ||
              (status === "high" && (c.priority === "high" || c.priority === "critical")))
          }
        />
      </div>
    </AppShell>
  );
}
function FilterButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}
