import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CHATS } from "@/lib/mock";
import { motion } from "framer-motion";
import { Paperclip, Send, Smile, Sparkles, User, Building2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat · CivicConnect AI" },
      {
        name: "description",
        content:
          "Modern messaging between citizens, government officers and the CivicConnect AI assistant.",
      },
      { property: "og:title", content: "Chat · CivicConnect AI" },
      { property: "og:description", content: "Real-time civic messaging." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [msgs, setMsgs] = useState(CHATS);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [
      ...m,
      {
        from: "user",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          from: "ai",
          text: "Understood. I've forwarded this to Ward Officer Rajesh. You'll get an update within 2 hours.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  return (
    <AppShell title="Chat" subtitle="Citizen · Officer · AI">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="glass rounded-2xl p-3">
          {[
            { name: "CivicConnect AI", role: "AI Assistant", icon: Sparkles, active: true },
            { name: "Rajesh Verma", role: "Ward Officer", icon: Building2 },
            { name: "Priya Iyer", role: "Dept Officer", icon: Building2 },
            { name: "Support Team", role: "Grievance Cell", icon: User },
          ].map((c, i) => (
            <button
              key={i}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${c.active ? "bg-gradient-to-r from-primary/12 to-transparent" : "hover:bg-muted/60"}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gov-gradient text-white">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{c.name}</div>
                <div className="truncate text-[11px] text-muted-foreground">{c.role}</div>
              </div>
              {c.active && <span className="h-2 w-2 rounded-full bg-success" />}
            </button>
          ))}
        </div>

        <div className="glass flex h-[70vh] flex-col rounded-2xl">
          <div className="border-b border-border/50 px-5 py-3">
            <div className="font-semibold">CivicConnect AI</div>
            <div className="text-[11px] text-success">● Online · Typically replies instantly</div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {msgs.map((m, i) => {
              const me = m.from === "user";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${me ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${me ? "gov-gradient text-white" : m.from === "ai" ? "bg-primary/10 text-foreground" : "glass"}`}
                  >
                    {m.from !== "user" && (
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                        {m.from === "ai"
                          ? "AI Assistant"
                          : m.from === "officer"
                            ? "Officer Rajesh"
                            : "System"}
                      </div>
                    )}
                    <div>{m.text}</div>
                    <div
                      className={`mt-1 text-[10px] ${me ? "text-white/70" : "text-muted-foreground"}`}
                    >
                      {m.time}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1 rounded-2xl bg-muted px-4 py-2 text-sm w-fit"
              >
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: "120ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-primary"
                  style={{ animationDelay: "240ms" }}
                />
              </motion.div>
            )}
          </div>
          <div className="border-t border-border/50 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2">
              <button className="text-muted-foreground hover:text-primary">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="text-muted-foreground hover:text-primary">
                <Smile className="h-4 w-4" />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Message CivicConnect AI…"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button onClick={send} className="rounded-lg gov-gradient p-2 text-white">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
