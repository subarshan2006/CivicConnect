import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { motion } from "framer-motion";
import {
  Sparkles,
  Copy,
  TrendingUp,
  MapPin,
  Clock,
  AlertTriangle,
  Users,
  Image as ImageIcon,
  Brain,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { ChartArea, ChartBar } from "@/components/charts";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Insights · PRAMAAN" },
      {
        name: "description",
        content:
          "AI-driven image classification, duplicate detection, priority prediction and resolution forecasting for civic complaints.",
      },
      { property: "og:title", content: "AI Insights · PRAMAAN" },
      { property: "og:description", content: "AI-driven civic complaint intelligence." },
    ],
  }),
  component: AIPage,
});

const features = [
  {
    icon: ImageIcon,
    name: "Image Classification",
    desc: "Identify 15+ civic categories with 98% accuracy.",
  },
  { icon: Copy, name: "Duplicate Detection", desc: "Merge similar complaints within 200m radius." },
  {
    icon: AlertTriangle,
    name: "Priority Prediction",
    desc: "AI ranks urgency using sentiment + risk signals.",
  },
  { icon: MapPin, name: "Ward Prediction", desc: "Auto-assign ward from GPS + landmark cues." },
  { icon: Clock, name: "Resolution Estimation", desc: "Forecast SLA based on department load." },
  { icon: Users, name: "Officer Recommendation", desc: "Suggest best-fit officer for the task." },
  {
    icon: TrendingUp,
    name: "Escalation Prediction",
    desc: "Flag complaints likely to breach SLA.",
  },
  { icon: Brain, name: "Sentiment Analysis", desc: "Read tone of citizen feedback and reviews." },
];

function AIPage() {
  return (
    <AppShell title="AI Command Center" subtitle="Civic Intelligence">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="AI Accuracy" value="98%" icon={Brain} tone="primary" index={0} />
        <KpiCard label="Predictions today" value="1,204" icon={Sparkles} tone="success" index={1} />
        <KpiCard label="Duplicates merged" value={87} icon={Copy} tone="warning" index={2} />
        <KpiCard
          label="Escalations flagged"
          value={22}
          icon={AlertTriangle}
          tone="destructive"
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass group rounded-2xl p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gov-gradient text-white">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-sm font-semibold">{f.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${70 + i * 3}%` }}
                transition={{ duration: 0.8 }}
                className="h-full gov-gradient"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Predicted Volume · Next 7 days</h3>
          <ChartArea
            data={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((n, i) => ({
              name: n,
              Actual: 80 + i * 6,
              Predicted: 90 + i * 7,
            }))}
            keys={["Actual", "Predicted"]}
          />
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Category Confidence</h3>
          <ChartBar
            data={["Street Light", "Road", "Garbage", "Water", "Signal", "Drainage"].map(
              (n, i) => ({ name: n, value: 82 + i * 2 }),
            )}
          />
        </div>
      </div>
    </AppShell>
  );
}
