import { ShieldCheck } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gov-gradient text-white shadow-lg shadow-primary/25">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-saffron ring-2 ring-background" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight text-gradient">PRAMAAN</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Government of India · Smart City
          </div>
        </div>
      )}
    </div>
  );
}
