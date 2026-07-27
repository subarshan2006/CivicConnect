import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { NOTIFICATIONS } from "@/lib/mock";
import { motion } from "framer-motion";
import { Bell, ShieldCheck, TrendingUp, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · PRAMAAN" },
      {
        name: "description",
        content:
          "Government advisories, complaint updates, escalations and citizen verification requests.",
      },
      { property: "og:title", content: "Notifications · PRAMAAN" },
      { property: "og:description", content: "All civic notifications in one place." },
    ],
  }),
  component: NotifPage,
});

const iconFor = (k: string) =>
  k === "government"
    ? ShieldCheck
    : k === "escalation"
      ? TrendingUp
      : k === "verification"
        ? MessageCircle
        : Bell;
const toneFor = (k: string) =>
  k === "government"
    ? "bg-primary/10 text-primary"
    : k === "escalation"
      ? "bg-destructive/10 text-destructive"
      : k === "verification"
        ? "bg-success/10 text-success"
        : "bg-warning/15 text-warning";

function NotifPage() {
  const groups: Record<string, typeof NOTIFICATIONS> = {
    "Government Updates": NOTIFICATIONS.filter((n) => n.kind === "government"),
    "Complaint Updates": NOTIFICATIONS.filter((n) => n.kind === "update"),
    "Escalation Alerts": NOTIFICATIONS.filter((n) => n.kind === "escalation"),
    "Verification Requests": NOTIFICATIONS.filter((n) => n.kind === "verification"),
  };
  return (
    <AppShell title="Notification Center" subtitle="Push · Government · Complaints">
      <div className="space-y-6">
        {Object.entries(groups).map(([title, list]) => (
          <div key={title} className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">{title}</h3>
            <div className="space-y-2">
              {list.map((n, i) => {
                const Icon = iconFor(n.kind);
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneFor(n.kind)}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-[11px] text-muted-foreground">{n.time}</div>
                    </div>
                    {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-primary" />}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
