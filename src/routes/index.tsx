import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { Logo } from "@/components/logo";
import {
  User,
  Building2,
  Briefcase,
  HardHat,
  ShieldCheck,
  Crown,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Building,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · CivicConnect AI Smart City Platform" },
      {
        name: "description",
        content:
          "Sign in to the Government of India Smart City complaint management portal — citizens, ward officers, department officers, field staff, inspectors and administrators.",
      },
      { property: "og:title", content: "Sign in · CivicConnect AI" },
      {
        property: "og:description",
        content: "Government of India Smart City complaint management portal.",
      },
    ],
  }),
  component: LoginPage,
});

const roles: { id: Role; label: string; icon: any; email: string }[] = [
  { id: "citizen", label: "Citizen", icon: User, email: "citizen@demo.com" },
  { id: "ward", label: "Ward Officer", icon: Building2, email: "ward@demo.com" },
  { id: "department", label: "Department Officer", icon: Briefcase, email: "department@demo.com" },
  { id: "field", label: "Field Staff", icon: HardHat, email: "field@demo.com" },
  { id: "inspector", label: "Quality Inspector", icon: ShieldCheck, email: "inspector@demo.com" },
  { id: "admin", label: "Super Admin", icon: Crown, email: "admin@demo.com" },
];

function LoginPage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("citizen");
  const [email, setEmail] = useState("citizen@demo.com");
  const [password, setPassword] = useState("123456");
  const [remember, setRemember] = useState(true);
  const [showDemos, setShowDemos] = useState(false);

  useEffect(() => {
    if (user) nav({ to: `/dashboard/${user.role}` });
  }, [user, nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = Object.values(DEMO_ACCOUNTS).find((u) => u.email === email.trim().toLowerCase());
    if (!match || password !== "123456") {
      toast.error("Invalid credentials. Try password: 123456");
      return;
    }
    login(match.role);
    toast.success(`Welcome, ${match.name}`);
    nav({ to: `/dashboard/${match.role}` });
  };

  const pickRole = (r: Role) => {
    setRole(r);
    setEmail(DEMO_ACCOUNTS[r].email);
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left illustration */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 gov-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white/25,transparent_60%)]" />
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="white" strokeWidth="0.15" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo />

          {/* Smart city SVG */}
          <div className="mx-auto w-full max-w-md">
            <SmartCitySVG />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered · 100 wards · 25 departments
            </div>
            <h2
              className="text-4xl font-bold leading-tight tracking-tight"
              style={{ fontFamily: "Sora, Inter, sans-serif" }}
            >
              A cleaner, safer, faster city.
              <br />
              <span className="text-white/80">One complaint at a time.</span>
            </h2>
            <p className="max-w-md text-sm text-white/70">
              CivicConnect AI unifies citizens, ward officers, departments, field staff and quality
              inspectors into one intelligent grievance redressal system for India's Smart Cities.
            </p>
            <div className="flex gap-8 pt-4 text-sm">
              <div>
                <div className="text-3xl font-bold">1,000+</div>
                <div className="text-white/60">Complaints resolved</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100</div>
                <div className="text-white/60">Wards connected</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-white/60">AI accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="relative flex min-h-screen items-center justify-center p-6 lg:p-12">
        <div className="lg:hidden absolute top-6 left-6">
          <Logo />
        </div>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong w-full max-w-md space-y-5 rounded-3xl p-8"
        >
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-primary">
              Secure sign-in
            </div>
            <h1
              className="mt-1 text-2xl font-bold tracking-tight"
              style={{ fontFamily: "Sora, Inter, sans-serif" }}
            >
              Welcome to CivicConnect AI
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose your role and sign in with your government credentials.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const active = role === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => pickRole(r.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition",
                      active
                        ? "border-primary bg-primary/8 text-primary shadow-sm"
                        : "border-border/60 bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/5",
                    )}
                  >
                    <r.icon className="h-4 w-4" />
                    <span className="text-[11px] font-medium leading-tight">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-background/60 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="you@gov.in"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-background/60 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              Remember me
            </label>
            <a className="font-medium text-primary hover:underline" href="#">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl gov-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/30"
          >
            Sign in{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowDemos((v) => !v)}
            className="w-full rounded-xl border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary"
          >
            {showDemos ? "Hide" : "Show"} demo accounts
          </button>

          {showDemos && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1 overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-2 text-xs"
            >
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    pickRole(r.id);
                    toast.success(`${r.label} credentials filled`);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 hover:bg-background"
                >
                  <span className="flex items-center gap-2">
                    <r.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{r.label}</span>
                  </span>
                  <span className="font-mono text-muted-foreground">{r.email}</span>
                </button>
              ))}
              <div className="border-t border-border/60 pt-1 pl-2 pt-2 text-muted-foreground">
                Password for all: <span className="font-mono text-foreground">123456</span>
              </div>
            </motion.div>
          )}

          <p className="pt-1 text-center text-[11px] text-muted-foreground">
            Secured by CivicConnect Trust · An initiative of Ministry of Housing & Urban Affairs
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function SmartCitySVG() {
  return (
    <svg viewBox="0 0 400 260" className="w-full">
      <defs>
        <linearGradient id="skygrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#skygrad)" rx="20" />
      {/* Sun */}
      <circle cx="320" cy="60" r="26" fill="white" fillOpacity="0.25" />
      <circle cx="320" cy="60" r="14" fill="white" fillOpacity="0.6" />
      {/* Buildings */}
      {[
        { x: 30, w: 40, h: 130, c: 0.35 },
        { x: 78, w: 50, h: 170, c: 0.5 },
        { x: 136, w: 34, h: 100, c: 0.4 },
        { x: 178, w: 60, h: 200, c: 0.55 },
        { x: 246, w: 42, h: 140, c: 0.42 },
        { x: 296, w: 46, h: 180, c: 0.5 },
        { x: 350, w: 32, h: 110, c: 0.38 },
      ].map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={230 - b.h}
            width={b.w}
            height={b.h}
            rx="4"
            fill="white"
            fillOpacity={b.c}
          />
          {Array.from({ length: Math.floor(b.h / 20) }).map((_, r) =>
            Array.from({ length: Math.floor(b.w / 12) }).map((_, c) => (
              <rect
                key={r + "-" + c}
                x={b.x + 4 + c * 12}
                y={230 - b.h + 6 + r * 20}
                width="6"
                height="8"
                fill="white"
                fillOpacity={Math.random() > 0.4 ? 0.9 : 0.2}
                rx="1"
              />
            )),
          )}
        </g>
      ))}
      {/* Ground */}
      <rect y="230" width="400" height="30" fill="white" fillOpacity="0.15" />
      {/* Lamp posts */}
      {[60, 170, 280].map((x) => (
        <g key={x}>
          <rect x={x} y="200" width="2" height="30" fill="white" fillOpacity="0.6" />
          <circle cx={x + 1} cy="200" r="5" fill="#ffdb70" opacity="0.9" />
        </g>
      ))}
      {/* Antenna pulse */}
      <g transform="translate(208 30)">
        <circle r="4" fill="white" />
        <circle r="12" fill="none" stroke="white" strokeOpacity="0.6">
          <animate attributeName="r" from="8" to="30" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}
