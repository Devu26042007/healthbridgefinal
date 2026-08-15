import { useEffect, useState } from "react";
import type { Hospital } from "@/lib/health-data";

/** Stylised live map: shows the pickup point, nearby hospitals and a moving ambulance. */
export function MapPanel({
  hospitals,
  activeId,
  ambulanceActive,
  etaMin,
}: {
  hospitals: Hospital[];
  activeId: string;
  ambulanceActive: boolean;
  etaMin?: number;
}) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!ambulanceActive) {
      setT(0);
      return;
    }
    const id = window.setInterval(() => setT((v) => (v >= 1 ? 0 : v + 0.01)), 120);
    return () => window.clearInterval(id);
  }, [ambulanceActive]);

  const pins = hospitals.map((h, i) => ({
    h,
    x: 70 + ((i * 97) % 210),
    y: 60 + ((i * 71) % 120),
  }));
  const target = pins.find((p) => p.h.id === activeId) ?? pins[0];
  const ax = target ? 40 + (target.x - 40) * t : 40;
  const ay = target ? 190 + (target.y - 190) * t : 190;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-mint">
      <svg viewBox="0 0 320 220" className="h-64 w-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--border)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="220" fill="url(#grid)" />
        <path
          d="M0 150 Q90 130 150 165 T320 140"
          stroke="var(--sky)"
          strokeOpacity="0.25"
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M60 0 L80 220"
          stroke="var(--emerald)"
          strokeOpacity="0.15"
          strokeWidth="12"
          fill="none"
        />
        {target && (
          <path
            d={`M40 190 Q ${(40 + target.x) / 2} ${target.y + 30} ${target.x} ${target.y}`}
            stroke="var(--coral)"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            fill="none"
            opacity={ambulanceActive ? 1 : 0.35}
          />
        )}
        {pins.map(({ h, x, y }) => (
          <g key={h.id}>
            <circle
              cx={x}
              cy={y}
              r={h.id === activeId ? 11 : 8}
              fill={h.id === activeId ? "var(--emerald)" : "var(--card)"}
              stroke="var(--emerald)"
              strokeWidth="2"
            />
            <path
              d={`M${x - 3.5} ${y} h7 M${x} ${y - 3.5} v7`}
              stroke={h.id === activeId ? "var(--primary-foreground)" : "var(--emerald)"}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text x={x + 14} y={y + 4} fontSize="8" fill="var(--foreground)" fontWeight="700">
              {h.name.split(" ")[0]}
            </text>
          </g>
        ))}
        <circle cx="40" cy="190" r="7" fill="var(--sky)" />
        <circle cx="40" cy="190" r="12" fill="var(--sky)" opacity="0.25" />
        <text x="52" y="194" fontSize="8" fill="var(--foreground)" fontWeight="700">
          You
        </text>
        {ambulanceActive && (
          <g transform={`translate(${ax - 8} ${ay - 6})`}>
            <rect width="16" height="11" rx="3" fill="var(--coral)" />
            <path d="M8 3v5M5.5 5.5h5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        )}
      </svg>
      <div className="flex items-center justify-between gap-2 border-t bg-card px-4 py-2 text-xs font-semibold">
        <span className="flex items-center gap-2">
          <span className="live-dot size-2" /> Live traffic-aware routing
        </span>
        <span className="text-muted-foreground">
          {ambulanceActive ? `Ambulance arriving in ~${etaMin} min` : "No active dispatch"}
        </span>
      </div>
    </div>
  );
}
