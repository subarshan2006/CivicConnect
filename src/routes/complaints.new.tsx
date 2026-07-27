import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Upload,
  Camera,
  MapPin,
  Mic,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Clock,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/complaints/new")({
  head: () => ({
    meta: [
      { title: "Report Complaint · PRAMAAN" },
      {
        name: "description",
        content:
          "Report a civic issue with photo evidence, GPS location and voice notes. AI auto-detects category, priority and department.",
      },
      { property: "og:title", content: "Report Complaint · PRAMAAN" },
      {
        property: "og:description",
        content: "Report a civic issue with AI-assisted classification.",
      },
    ],
  }),
  component: NewComplaint,
});

function NewComplaint() {
  const [image, setImage] = useState<string | null>(null);
  const [aiRunning, setAiRunning] = useState(false);
  const [ai, setAi] = useState<any>(null);
  const [desc, setDesc] = useState("");
  const nav = useNavigate();

  const runAI = () => {
    setAiRunning(true);
    setAi(null);
    setTimeout(() => {
      setAi({
        category: "Street Light",
        confidence: 98,
        department: "Electrical",
        ward: 42,
        eta: "48 hours",
        duplicate: false,
        priority: "Medium",
        sentiment: "Neutral",
      });
      setAiRunning(false);
    }, 1400);
  };

  const submit = () => {
    toast.success("Complaint submitted. Ref CIV-100999");
    setTimeout(() => nav({ to: "/complaints/track" }), 500);
  };

  return (
    <AppShell title="Report a Complaint" subtitle="Citizen Portal">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Upload Evidence</h3>
            <label className="group flex aspect-video cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background/40 text-center transition hover:border-primary hover:bg-primary/5">
              {image ? (
                <img src={image} className="h-full w-full rounded-2xl object-cover" alt="" />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Drag & drop, click to upload</div>
                    <div className="text-xs text-muted-foreground">
                      PNG, JPG up to 10 MB · or use camera
                    </div>
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setImage(URL.createObjectURL(f));
                }}
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setImage("https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1200")
                }
                className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
              >
                <Camera className="h-4 w-4" />
                Capture
              </button>
              <button
                onClick={runAI}
                disabled={aiRunning}
                className="inline-flex items-center gap-2 rounded-xl gov-gradient px-3 py-2 text-sm font-semibold text-white shadow disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {aiRunning ? "Analyzing…" : "Detect using AI"}
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Description</h3>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="Describe the issue…"
              className="w-full rounded-xl border border-border/60 bg-background/60 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </label>
                <select className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm">
                  {CATEGORIES.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Priority (optional)
                </label>
                <select className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm">
                  {["Low", "Medium", "High", "Critical"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Location</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">GPS auto-detected</div>
                <div className="mt-1 font-mono text-sm">19.0760°N, 72.8777°E</div>
                <div className="mt-2 text-xs">📍 Ward 42, Mumbai</div>
              </div>
              <input
                placeholder="Address / Landmark"
                className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="mt-3 flex aspect-[16/6] items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-success/10 text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" /> Interactive map preview
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium">
              <Mic className="h-4 w-4" />
              Voice Complaint
            </button>
            <button
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-xl gov-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25"
            >
              <Send className="h-4 w-4" />
              Submit Complaint
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-strong rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gov-gradient text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">AI Analysis</div>
                <div className="text-xs text-muted-foreground">Powered by PRAMAAN Vision</div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {aiRunning ? (
                <motion.div
                  key="l"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 animate-pulse rounded-lg bg-muted"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </motion.div>
              ) : ai ? (
                <motion.div
                  key="d"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <AiRow label="Detected Category" value={ai.category} tone="text-primary" />
                  <AiRow label="Confidence" value={`${ai.confidence}%`} tone="text-success" />
                  <AiRow label="Department" value={ai.department} />
                  <AiRow label="Ward" value={`Ward ${ai.ward}`} />
                  <AiRow label="Estimated Resolution" value={ai.eta} tone="text-warning" />
                  <AiRow
                    label="Duplicate?"
                    value={ai.duplicate ? "Yes" : "No"}
                    tone="text-success"
                  />
                  <AiRow label="AI Priority" value={ai.priority} />
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-primary/8 p-3 text-xs text-primary">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    Recommendation: Auto-assign to Electrical Dept. Expected SLA 48h.
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="e"
                  className="rounded-xl border border-dashed border-border/60 bg-background/40 p-4 text-center text-xs text-muted-foreground"
                >
                  Upload an image and click "Detect using AI" to auto-classify.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-semibold text-foreground">Emergency?</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              For life-threatening issues call the 24×7 Smart City helpline.
            </p>
            <div className="mt-3 rounded-xl gov-gradient p-3 text-center text-white">
              <div className="text-xs uppercase tracking-wider opacity-80">Helpline</div>
              <div className="text-xl font-bold tracking-wider">1800-111-222</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              SLA
            </h3>
            <p className="text-xs text-muted-foreground">
              Most complaints in your ward are resolved within{" "}
              <span className="font-semibold text-foreground">36 hours</span>. Escalations trigger
              automatically after 72h.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
function AiRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${tone ?? ""}`}>{value}</span>
    </div>
  );
}
