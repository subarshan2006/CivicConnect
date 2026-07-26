import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthUser, Role } from "./types";

const DEMO: Record<Role, AuthUser> = {
  citizen: {
    id: "u1",
    name: "Aarav Sharma",
    email: "citizen@demo.com",
    role: "citizen",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aarav",
    ward: 42,
    score: 1240,
  },
  ward: {
    id: "u2",
    name: "Rajesh Verma",
    email: "ward@demo.com",
    role: "ward",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rajesh",
    ward: 42,
  },
  department: {
    id: "u3",
    name: "Priya Iyer",
    email: "department@demo.com",
    role: "department",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya",
    department: "Electrical",
  },
  field: {
    id: "u4",
    name: "Suresh Naidu",
    email: "field@demo.com",
    role: "field",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Suresh",
    ward: 42,
  },
  inspector: {
    id: "u5",
    name: "Meera Nair",
    email: "inspector@demo.com",
    role: "inspector",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Meera",
  },
  admin: {
    id: "u6",
    name: "Dr. Arjun Menon",
    email: "admin@demo.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Arjun",
  },
};

export const DEMO_ACCOUNTS = DEMO;

const KEY = "civic.auth";

interface Ctx {
  user: AuthUser | null;
  login: (role: Role) => AuthUser;
  logout: () => void;
}

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);
  const login = (role: Role) => {
    const u = DEMO[role];
    setUser(u);
    try {
      localStorage.setItem(KEY, JSON.stringify(u));
    } catch {}
    return u;
  };
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
