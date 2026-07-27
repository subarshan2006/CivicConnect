import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  Briefcase,
  HardHat,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow · PRAMAAN" },
      {
        name: "description",
        content:
          "Visual civic complaint workflow — from citizen intake to inspector approval and citizen verification.",
      },
      { property: "og:title", content: "Workflow · PRAMAAN" },
      { property: "og:description", content: "Animated civic complaint workflow." },
    ],
  }),
  component: WorkflowPage,
});

const stages = [
  { icon: User, name: "Citizen", desc: "Reports issue with photo, GPS, description." },
  { icon: Building2, name: "Ward Officer", desc: "Verifies, prioritizes, forwards to department." },
  { icon: Briefcase, name: "Department Officer", desc: "Assigns work order and budget." },
  { icon: HardHat, name: "Field Staff", desc: "Executes work on site with before/after evidence." },
  { icon: ShieldCheck, name: "Quality Inspector", desc: "Verifies completion and quality." },
  { icon: Star, name: "Citizen Verification", desc: "Citizen rates and confirms resolution." },
  { icon: CheckCircle2, name: "Closed", desc: "Complaint archived with full audit trail." },
];

function WorkflowPage() {
  return (
    <AppShell title="Complaint Workflow" subtitle="End-to-end lifecycle">
      <div className="glass mx-auto max-w-2xl space-y-4 rounded-2xl p-6">
        {stages.map((s, i) => (
          <div key={s.name}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl gov-gradient text-white shadow-lg shadow-primary/25">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="absolute -right-1 -top-1 rounded-full bg-white px-1.5 text-[10px] font-bold text-primary ring-2 ring-primary/30">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="font-semibold">{s.name}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{s.desc}</div>
              </div>
            </motion.div>
            {i < stages.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.05 }}
                className="my-2 ml-6 flex justify-center"
              >
                <ArrowDown className="h-5 w-5 animate-pulse text-primary/60" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
