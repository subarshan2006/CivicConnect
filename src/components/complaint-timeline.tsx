import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import type { TimelineStep } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ComplaintTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative space-y-6">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
      {steps.map((s, i) => (
        <motion.li
          key={s.key + i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className="relative flex gap-4"
        >
          <div
            className={cn(
              "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
              s.done
                ? "bg-gradient-to-br from-primary to-gov-green text-white shadow-md shadow-primary/30"
                : "bg-muted text-muted-foreground",
            )}
          >
            {s.done ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
              <Clock className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold text-foreground">{s.label}</div>
              <time className="text-xs text-muted-foreground">
                {new Date(s.timestamp).toLocaleString()}
              </time>
            </div>
            {s.officer && <div className="text-xs text-muted-foreground">Officer: {s.officer}</div>}
            {s.note && <div className="mt-1 text-sm text-muted-foreground">{s.note}</div>}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
