import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, TrendingUp, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/app-store";
import { hospitals } from "@/lib/health-data";

export const Route = createFileRoute("/insurance")({
  head: () => ({
    meta: [
      { title: "Instant Insurance Claim Check — HealthBridge" },
      {
        name: "description",
        content:
          "Instantly see whether your health insurance is claimable at a hospital, how much is covered, and where you get the best benefit.",
      },
      { property: "og:title", content: "Instant Insurance Claim Check — HealthBridge" },
      {
        property: "og:description",
        content: "Cashless status, coverage percentage, room caps and best-value hospital in one view.",
      },
    ],
  }),
  component: Insurance,
});

function Insurance() {
  const { hospital, user } = useApp();
  const [insurer, setInsurer] = useState(user?.insurer ?? "");
  const [checked, setChecked] = useState(false);

  const match = useMemo(() => {
    if (!insurer.trim()) return null;
    const q = insurer.trim().toLowerCase();
    return hospital.insurers.find((p) => p.insurer.toLowerCase().includes(q)) ?? null;
  }, [insurer, hospital]);

  const bestElsewhere = useMemo(() => {
    if (!insurer.trim()) return null;
    const q = insurer.trim().toLowerCase();
    const options = hospitals
      .map((h) => ({ h, plan: h.insurers.find((p) => p.insurer.toLowerCase().includes(q)) }))
      .filter((o) => o.plan)
      .sort((a, b) => (b.plan!.coveragePct ?? 0) - (a.plan!.coveragePct ?? 0));
    return options[0] ?? null;
  }, [insurer]);

  return (
    <AppShell
      title="Insurance coverage"
      subtitle={`Check instantly whether your plan is claimable at ${hospital.name} — and whether you're getting the best benefit.`}
    >
      <div className="card-surface p-5">
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setChecked(true);
          }}
        >
          <input
            value={insurer}
            onChange={(e) => {
              setInsurer(e.target.value);
              setChecked(false);
            }}
            placeholder="Type your insurance provider… e.g. Star Health"
            className="min-w-[240px] flex-1 rounded-xl border-2 bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground"
          >
            Check claim
          </button>
        </form>

        {checked && (
          <div className="mt-4 space-y-4">
            {match ? (
              <div className="rounded-xl bg-ok-bg p-4">
                <p className="flex items-center gap-2 font-extrabold text-ok">
                  <CheckCircle2 className="size-5" />
                  {match.insurer} is {match.cashless ? "cashless-accepted" : "accepted (reimbursement)"}{" "}
                  at {hospital.name}
                </p>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <Stat label="Covered" value={`${match.coveragePct}%`} />
                  <Stat label="Room cap / day" value={`₹${match.roomCapPerDay.toLocaleString("en-IN")}`} />
                  <Stat label="Approval time" value={`~${match.claimTimeHrs} hrs`} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{match.note}</p>
              </div>
            ) : (
              <div className="rounded-xl bg-crit-bg p-4">
                <p className="flex items-center gap-2 font-extrabold text-crit">
                  <XCircle className="size-5" /> Not on panel at {hospital.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  You'd need to pay upfront and claim reimbursement later. Check the hospitals below.
                </p>
              </div>
            )}

            {bestElsewhere?.plan && (
              <div className="rounded-xl border-2 border-primary/40 bg-mint p-4">
                <p className="flex items-center gap-2 font-extrabold text-primary">
                  <TrendingUp className="size-5" /> Best benefit: {bestElsewhere.h.name}
                </p>
                <p className="mt-1 text-sm">
                  {bestElsewhere.plan.coveragePct}% covered, room cap ₹
                  {bestElsewhere.plan.roomCapPerDay.toLocaleString("en-IN")}/day, approval in ~
                  {bestElsewhere.plan.claimTimeHrs} hrs · {bestElsewhere.h.distanceKm} km away.
                  {bestElsewhere.h.id !== hospital.id &&
                    " Travelling here could reduce your out-of-pocket cost."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <h2 className="mt-7 mb-3 text-xl font-extrabold">Panel at {hospital.name}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {hospital.insurers.map((p) => (
          <div key={p.insurer} className="card-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold">{p.insurer}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-extrabold ${p.cashless ? "bg-ok-bg text-ok" : "bg-warn-bg text-warn"}`}
              >
                {p.cashless ? "Cashless" : "Reimbursement"}
              </span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-mint">
              <div className="h-full rounded-full bg-primary" style={{ width: `${p.coveragePct}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {p.coveragePct}% covered · room cap ₹{p.roomCapPerDay.toLocaleString("en-IN")}/day ·{" "}
              {p.note}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card p-3">
      <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="font-display text-lg font-extrabold">{value}</p>
    </div>
  );
}
