import { motion } from "framer-motion";
import { COMPLAINTS } from "@/lib/mock";
import { cn } from "@/lib/utils";
import type { Complaint } from "@/lib/types";

const LNG_MIN = 68,
  LNG_MAX = 97;
const LAT_MIN = 8,
  LAT_MAX = 36;

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * w;
  const y = h - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * h;
  return { x, y };
}

export function ComplaintMap({
  height = 420,
  filter,
  className,
}: {
  height?: number;
  filter?: (c: Complaint) => boolean;
  className?: string;
}) {
  const w = 600,
    h = height;
  const data = COMPLAINTS.filter(filter ?? (() => true)).slice(0, 220);
  return (
    <div className={cn("glass relative overflow-hidden rounded-2xl", className)} style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mapbg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="oklch(0.94 0.03 220)" />
            <stop offset="100%" stopColor="oklch(0.98 0.01 240)" />
          </radialGradient>
          <linearGradient id="landfill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.08 220 / 0.6)" />
            <stop offset="100%" stopColor="oklch(0.85 0.09 155 / 0.5)" />
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill="url(#mapbg)" />
        <path
          d="M170,60 C230,50 310,45 370,70 C430,90 470,140 480,200 C490,260 470,320 430,360 C400,390 360,410 320,410 C300,430 280,440 260,430 C240,420 230,395 220,375 C200,360 170,340 155,310 C130,280 115,240 115,200 C115,150 130,90 170,60 Z"
          fill="url(#landfill)"
          stroke="oklch(0.55 0.15 255 / 0.5)"
          strokeWidth="1.5"
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={"gh" + i}
            x1={0}
            x2={w}
            y1={(i * h) / 8}
            y2={(i * h) / 8}
            stroke="oklch(0.5 0.05 240 / 0.06)"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={"gv" + i}
            x1={(i * w) / 10}
            x2={(i * w) / 10}
            y1={0}
            y2={h}
            stroke="oklch(0.5 0.05 240 / 0.06)"
          />
        ))}
        {data.map((c, i) => {
          const { x, y } = project(c.lat, c.lng, w, h);
          const color =
            c.priority === "critical"
              ? "oklch(0.6 0.22 25)"
              : c.priority === "high"
                ? "oklch(0.75 0.16 55)"
                : c.status === "closed"
                  ? "oklch(0.62 0.15 155)"
                  : "oklch(0.55 0.18 255)";
          return (
            <g key={c.id}>
              <motion.circle
                cx={x}
                cy={y}
                r={5}
                fill={color}
                fillOpacity={0.3}
                animate={{ scale: [0.8, 1.4, 0.8] }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + (i % 5) * 0.3,
                  delay: (i % 20) * 0.05,
                }}
              />
              <circle cx={x} cy={y} r={2.5} fill={color} />
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-xs">
        {[
          { label: "Critical", color: "oklch(0.6 0.22 25)" },
          { label: "High", color: "oklch(0.75 0.16 55)" },
          { label: "Open", color: "oklch(0.55 0.18 255)" },
          { label: "Resolved", color: "oklch(0.62 0.15 155)" },
        ].map((l) => (
          <div
            key={l.label}
            className="glass-strong flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
