import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { COMPLAINTS } from "@/lib/mock";
import { StatusBadge, PriorityBadge } from "@/components/status-badge";
import { ComplaintTimeline } from "@/components/complaint-timeline";
import { BeforeAfterSlider } from "@/components/before-after";
import {
  MapPin,
  User,
  Building2,
  Wallet,
  Star,
  FileText,
  MessageCircle,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/complaints/$id")({
  head: () => ({
    meta: [
      { title: "Complaint Details · CivicConnect AI" },
      {
        name: "description",
        content:
          "Complete complaint lifecycle: timeline, photos, officer notes, verification and citizen rating.",
      },
      { property: "og:title", content: "Complaint Details · CivicConnect AI" },
      { property: "og:description", content: "Complete civic complaint lifecycle." },
    ],
  }),
  component: DetailsPage,
});

function DetailsPage() {
  const { id } = useParams({ from: "/complaints/$id" });
  const c = COMPLAINTS.find((x) => x.id === id) ?? COMPLAINTS[0];
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-6 md:p-8"
        >
          <div className="absolute inset-0 gov-gradient opacity-[0.06]" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <Link to="/complaints" className="text-muted-foreground hover:text-primary">
                  Complaints
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="font-mono text-primary">{c.code}</span>
              </div>
              <h1
                className="mt-2 text-2xl font-bold tracking-tight md:text-3xl"
                style={{ fontFamily: "Sora, Inter, sans-serif" }}
              >
                {c.category}
              </h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {c.address} · Ward {c.ward}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={c.status} />
                <PriorityBadge priority={c.priority} />
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <Building2 className="h-3 w-3" />
                  {c.department}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  ETA {c.estimatedResolution}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-right md:grid-cols-3">
              <Stat label="Est. Cost" value={`₹${c.cost.toLocaleString()}`} />
              <Stat label="AI Confidence" value={`${c.aiConfidence}%`} />
              <Stat label="Rating" value={c.rating ? `${c.rating}★` : "—"} />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-semibold">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {[c.image, c.beforeImage, c.afterImage].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-semibold">Before / After Comparison</h3>
              <BeforeAfterSlider before={c.beforeImage} after={c.afterImage} />
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="mb-4 font-semibold">Timeline</h3>
              <ComplaintTimeline steps={c.timeline} />
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-semibold">Officer Notes & Activity</h3>
              <div className="space-y-3">
                {c.timeline
                  .filter((s) => s.done)
                  .slice(-4)
                  .map((s, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{s.officer ?? "System"}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {new Date(s.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-0.5 text-sm text-muted-foreground">
                          {s.label} — {s.note ?? "Step completed."}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-semibold">Citizen</h3>
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${c.citizen}`}
                  className="h-12 w-12 rounded-xl bg-muted"
                  alt=""
                />
                <div>
                  <div className="font-semibold">{c.citizen}</div>
                  <div className="text-xs text-muted-foreground">ID {c.citizenId}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
            </div>

            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold">Assignments</h3>
              <Row icon={User} label="Ward Officer" value={c.officer} />
              <Row icon={User} label="Field Staff" value={c.fieldStaff} />
              <Row icon={Building2} label="Department" value={c.department} />
              <Row icon={Wallet} label="Estimated Cost" value={`₹${c.cost.toLocaleString()}`} />
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-semibold">Documents</h3>
              <div className="space-y-2">
                {["Work Order.pdf", "Completion Report.pdf", "Materials Invoice.pdf"].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{f}</div>
                      <div className="text-[11px] text-muted-foreground">PDF · 240 KB</div>
                    </div>
                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-semibold">Citizen Verification</h3>
              <div className="mb-3 flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < c.rating ? "fill-current" : "text-muted"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {c.rating ? `${c.rating}/5 by citizen` : "Awaiting verification"}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-xl bg-success/10 py-2 text-sm font-medium text-success hover:bg-success/20">
                  Approve
                </button>
                <button className="flex-1 rounded-xl bg-destructive/10 py-2 text-sm font-medium text-destructive hover:bg-destructive/20">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/50 p-3 text-left">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-bold tracking-tight">{value}</div>
    </div>
  );
}
function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
