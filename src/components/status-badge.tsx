import { cn } from "@/lib/utils";
import type { ComplaintStatus, Priority } from "@/lib/types";

const statusMap: Record<ComplaintStatus, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "bg-info/10 text-info ring-info/20" },
  verified: { label: "Verified", className: "bg-primary/10 text-primary ring-primary/20" },
  assigned: { label: "Assigned", className: "bg-primary/10 text-primary ring-primary/20" },
  in_progress: { label: "In Progress", className: "bg-warning/15 text-warning ring-warning/25" },
  work_done: { label: "Work Done", className: "bg-primary/10 text-primary ring-primary/20" },
  inspected: { label: "Inspected", className: "bg-gov-green/15 text-gov-green ring-gov-green/25" },
  closed: { label: "Closed", className: "bg-success/15 text-success ring-success/25" },
  escalated: {
    label: "Escalated",
    className: "bg-destructive/10 text-destructive ring-destructive/20",
  },
  rejected: { label: "Rejected", className: "bg-muted text-muted-foreground ring-border" },
};

const priorityMap: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground ring-border" },
  medium: { label: "Medium", className: "bg-info/10 text-info ring-info/20" },
  high: { label: "High", className: "bg-warning/15 text-warning ring-warning/25" },
  critical: {
    label: "Critical",
    className: "bg-destructive/10 text-destructive ring-destructive/20",
  },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const s = statusMap[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        s.className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const p = priorityMap[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        p.className,
      )}
    >
      {p.label}
    </span>
  );
}
