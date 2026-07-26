import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Logo } from "./logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Command,
  LayoutDashboard,
  FileText,
  PlusCircle,
  MapPin,
  MessageSquare,
  BarChart3,
  FileBarChart,
  Sparkles,
  Workflow,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NOTIFICATIONS } from "@/lib/mock";
import type { Role } from "@/lib/types";

const roleLabel: Record<Role, string> = {
  citizen: "Citizen",
  ward: "Ward Officer",
  department: "Department Officer",
  field: "Field Staff",
  inspector: "Quality Inspector",
  admin: "Super Admin",
};

function navFor(role: Role) {
  const base: { to: string; label: string; icon: any }[] = [
    { to: `/dashboard/${role}`, label: "Dashboard", icon: LayoutDashboard },
    { to: "/complaints", label: "Complaints", icon: FileText },
  ];
  if (role === "citizen") base.push({ to: "/complaints/new", label: "Report", icon: PlusCircle });
  base.push(
    { to: "/map", label: "Map", icon: MapPin },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/ai", label: "AI Insights", icon: Sparkles },
    { to: "/workflow", label: "Workflow", icon: Workflow },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/chat", label: "Chat", icon: MessageSquare },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  );
  return base;
}

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [cmd, setCmd] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, [user, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmd((v) => !v);
      }
      if (e.key === "Escape") setCmd(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!user) return null;
  const items = navFor(user.role);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border/60 glass transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-border/50">
          <Logo />
          <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {items.map((it) => {
            const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-primary/12 to-transparent text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <it.icon className={cn("h-4 w-4", active && "text-primary")} />
                {it.label}
                {active && (
                  <motion.span
                    layoutId="navdot"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-3 bottom-3">
          <div className="glass-strong flex items-center gap-3 rounded-xl p-3">
            <img src={user.avatar} className="h-9 w-9 rounded-lg bg-muted" alt={user.name} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{user.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {roleLabel[user.role]}
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 glass border-b border-border/50">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCmd(true)}
              className="flex flex-1 items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-background max-w-md"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 truncate">Search complaints, wards, officers...</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                <Command className="h-3 w-3" />K
              </span>
            </button>
            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/notifications"
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </Link>
              <Link to="/profile" className="rounded-lg p-1 hover:bg-muted">
                <img src={user.avatar} className="h-8 w-8 rounded-lg bg-muted" alt="" />
              </Link>
            </div>
          </div>
          {(title || subtitle) && (
            <div className="px-4 pb-5 pt-1 lg:px-8">
              {subtitle && (
                <div className="text-xs font-medium uppercase tracking-wider text-primary">
                  {subtitle}
                </div>
              )}
              {title && (
                <h1
                  className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl"
                  style={{ fontFamily: "Sora, Inter, sans-serif" }}
                >
                  {title}
                </h1>
              )}
            </div>
          )}
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {cmd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24 backdrop-blur-sm"
            onClick={() => setCmd(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -10 }}
              className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="text-[10px] text-muted-foreground">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-auto p-2">
                {items.map((it) => (
                  <Link
                    key={it.to}
                    to={it.to}
                    onClick={() => setCmd(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <it.icon className="h-4 w-4 text-muted-foreground" />
                    <span>Go to {it.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setCmd(false);
                    logout();
                    navigate({ to: "/" });
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
