import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth";
import { Award, MapPin, Mail, Phone, Trophy, Sparkles } from "lucide-react";
import { COMPLAINTS } from "@/lib/mock";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · PRAMAAN" },
      {
        name: "description",
        content: "Your civic contribution score, complaints history, achievements and rewards.",
      },
      { property: "og:title", content: "Profile · PRAMAAN" },
      { property: "og:description", content: "Your civic profile and contributions." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <AppShell title="My Profile" subtitle="Citizen Profile">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-strong lg:col-span-1 rounded-3xl p-6 text-center">
          <img src={user.avatar} alt="" className="mx-auto h-24 w-24 rounded-2xl bg-muted" />
          <h2 className="mt-3 text-xl font-bold">{user.name}</h2>
          <div className="mt-1 text-xs text-muted-foreground">Verified Citizen · ID C-1042</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Score", value: user.score ?? 1240 },
              { label: "Reports", value: 12 },
              { label: "Resolved", value: 7 },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-background/50 p-2">
                <div className="text-lg font-bold text-primary">{s.value}</div>
                <div className="text-[10px] uppercase text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 text-left text-sm">
            <Row icon={Mail} value={user.email} />
            <Row icon={Phone} value="+91 98765 43210" />
            <Row icon={MapPin} value="Ward 42, Mumbai" />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { name: "First Reporter", icon: Sparkles, tone: "from-primary to-primary/70" },
                { name: "10 Complaints", icon: Award, tone: "from-warning to-warning/70" },
                { name: "Ward Champion", icon: Trophy, tone: "from-success to-success/70" },
                { name: "Green Hero", icon: MapPin, tone: "from-gov-green to-gov-green/70" },
              ].map((a) => (
                <div
                  key={a.name}
                  className={`flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br ${a.tone} p-4 text-white`}
                >
                  <a.icon className="h-6 w-6" />
                  <div className="text-xs font-semibold text-center">{a.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">Contribution Score</h3>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-4/5 gov-gradient" />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Level 4 · Civic Hero</span>
              <span>1240 / 1500 to next level</span>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold">My Complaints</h3>
            <div className="space-y-2">
              {COMPLAINTS.slice(0, 6).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 text-sm"
                >
                  <div>
                    <div className="font-medium">{c.category}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.code} · {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
function Row({ icon: Icon, value }: { icon: any; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 p-2">
      <Icon className="h-4 w-4 text-primary" /> <span>{value}</span>
    </div>
  );
}
