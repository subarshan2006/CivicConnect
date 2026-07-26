import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Download, FileText, FileSpreadsheet, FileType2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · CivicConnect AI" },
      {
        name: "description",
        content:
          "Generate and download PDF, Excel and CSV reports for departments, wards, officers and citizens.",
      },
      { property: "og:title", content: "Reports · CivicConnect AI" },
      { property: "og:description", content: "Custom civic reporting suite." },
    ],
  }),
  component: ReportsPage,
});

const kinds = [
  { name: "Department Reports", desc: "Performance, budget and SLA metrics per department." },
  { name: "Ward Reports", desc: "Ward-level complaint heatmap and resolution scorecard." },
  { name: "Officer Reports", desc: "Individual officer productivity and rankings." },
  { name: "Citizen Reports", desc: "Community contribution and satisfaction scores." },
];

function ReportsPage() {
  const download = (fmt: string, name: string) => {
    toast.success(`${name} exported as ${fmt}`);
  };
  return (
    <AppShell title="Reports" subtitle="Generate & Download">
      <div className="grid gap-4 md:grid-cols-2">
        {kinds.map((k) => (
          <div key={k.name} className="glass rounded-2xl p-5">
            <h3 className="text-lg font-semibold">{k.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{k.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn
                icon={FileType2}
                label="PDF"
                tone="from-destructive to-destructive/70"
                onClick={() => download("PDF", k.name)}
              />
              <Btn
                icon={FileSpreadsheet}
                label="Excel"
                tone="from-success to-success/70"
                onClick={() => download("XLSX", k.name)}
              />
              <Btn
                icon={FileText}
                label="CSV"
                tone="from-primary to-primary/70"
                onClick={() => download("CSV", k.name)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="glass mt-6 rounded-2xl p-5">
        <h3 className="mb-3 font-semibold">Recently Generated</h3>
        <div className="space-y-2">
          {[
            { name: "Q2 FY26 Department Report", fmt: "PDF", size: "4.2 MB" },
            { name: "Ward 42 Monthly Scorecard", fmt: "XLSX", size: "1.8 MB" },
            { name: "Officer Rankings — August", fmt: "CSV", size: "220 KB" },
          ].map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div>
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {r.fmt} · {r.size}
                </div>
              </div>
              <button
                onClick={() => download(r.fmt, r.name)}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
function Btn({ icon: Icon, label, tone, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-br ${tone} px-3 py-2 text-sm font-semibold text-white shadow-sm`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
