import { useState } from "react";

export function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="glass relative aspect-video select-none overflow-hidden rounded-2xl">
      <img src={after} className="absolute inset-0 h-full w-full object-cover" alt="after" />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} className="absolute inset-0 h-full w-full object-cover" alt="before" />
      </div>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="h-full w-0.5 bg-white shadow-lg" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-xl ring-1 ring-black/10">
          <div className="text-xs font-bold text-primary">↔</div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(+e.target.value)}
        className="absolute inset-x-0 bottom-4 mx-auto w-2/3 accent-primary"
      />
      <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
        Before
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
        After
      </div>
    </div>
  );
}
