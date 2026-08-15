export function BachaoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 4.5 5.6 4c2-.3 3.7.7 4.9 2.3C11.6 4.7 13.4 3.7 15.3 4 19 4.5 20.6 8.4 19 11.7 16.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
      <path
        d="M4 12h3l1.6-3 2 5 1.6-3H20"
        stroke="var(--teal-deep)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EcgLine({ label = "ECG active" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-mint px-3 py-1 text-xs font-bold tracking-wide text-primary uppercase">
        <span className="live-dot size-2" />
        {label}
      </span>
      <div className="h-10 min-w-0 flex-1 opacity-90">
        <svg viewBox="0 0 480 40" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="ecgGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--emerald)" />
              <stop offset="55%" stopColor="var(--sky)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          <path
            className="ecg-line"
            d="M0,20 L60,20 L78,7 L92,33 L108,3 L124,36 L140,20 L240,20 L258,7 L272,33 L288,3 L304,36 L320,20 L480,20"
            fill="none"
            stroke="url(#ecgGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function StatusPill({
  status,
  children,
}: {
  status: "ok" | "warn" | "crit";
  children: React.ReactNode;
}) {
  const tone =
    status === "ok"
      ? "bg-ok-bg text-ok"
      : status === "warn"
        ? "bg-warn-bg text-warn"
        : "bg-crit-bg text-crit";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold whitespace-nowrap ${tone}`}
    >
      <span className="size-2 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function Ambient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="blob size-[420px] -top-32 -left-28"
        style={{ background: "radial-gradient(circle, var(--emerald-light), transparent 70%)" }}
      />
      <div
        className="blob size-[380px] top-28 -right-40"
        style={{
          background: "radial-gradient(circle, var(--sky), transparent 70%)",
          animationDuration: "24s",
        }}
      />
      <div
        className="blob size-[300px] -bottom-28 left-1/3"
        style={{
          background: "radial-gradient(circle, var(--violet), transparent 70%)",
          animationDirection: "reverse",
        }}
      />
    </div>
  );
}
