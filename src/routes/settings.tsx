import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DEPARTMENTS, CATEGORIES } from "@/lib/mock";
import {
  Building2,
  Tag,
  Users,
  ShieldCheck,
  Bell,
  Palette,
  Languages,
  Moon,
  ScrollText,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · PRAMAAN" },
      {
        name: "description",
        content:
          "Manage departments, categories, users, roles, permissions, notifications, themes, languages and audit logs.",
      },
      { property: "og:title", content: "Settings · PRAMAAN" },
      { property: "og:description", content: "Administrative settings for PRAMAAN." },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  { icon: Building2, name: "Departments", desc: `${DEPARTMENTS.length} departments configured` },
  { icon: Tag, name: "Categories", desc: `${CATEGORIES.length} complaint categories` },
  { icon: Users, name: "Users", desc: "500 citizens · 120 officers · 100 field staff" },
  { icon: ShieldCheck, name: "Roles & Permissions", desc: "6 roles with granular access control" },
  { icon: Bell, name: "Notifications", desc: "Email · SMS · Push · WhatsApp" },
  { icon: Palette, name: "Themes", desc: "Government of India · Smart City · Custom" },
  { icon: Languages, name: "Languages", desc: "Hindi · English · Tamil · Bengali +9" },
  { icon: Moon, name: "Dark Mode", desc: "System · Light · Dark" },
  { icon: ScrollText, name: "Audit Logs", desc: "12,480 events in last 30 days" },
];

function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Administration">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <button
            key={s.name}
            className="glass group text-left rounded-2xl p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:gov-gradient group-hover:text-white">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-semibold">{s.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.desc}</div>
          </button>
        ))}
      </div>

      <div className="glass mt-6 rounded-2xl p-5">
        <h3 className="mb-3 font-semibold">Recent Audit Logs</h3>
        <div className="space-y-2 text-sm">
          {[
            "Rajesh Verma approved CIV-100234 · 2 min ago",
            "Priya Iyer assigned work order to Suresh Naidu · 12 min ago",
            "Meera Nair marked CIV-100112 for rework · 34 min ago",
            "Super Admin exported Q2 report (PDF, 4.2MB) · 1 hr ago",
            "System auto-escalated CIV-100005 to Zonal Officer · 3 hr ago",
          ].map((line, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2 font-mono text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {line}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
