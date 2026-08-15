import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/brand";
import { useApp } from "@/lib/app-store";
import { treatments } from "@/lib/health-data";

export const Route = createFileRoute("/instruments")({
  head: () => ({
    meta: [
      { title: "Instrument & Equipment Availability — HealthBridge" },
      {
        name: "description",
        content:
          "Check live availability of ventilators, dialysis machines, theatres, cath labs and scanners for a specific treatment at each hospital.",
      },
      { property: "og:title", content: "Instrument & Equipment Availability — HealthBridge" },
      {
        property: "og:description",
        content: "Filter hospital equipment by the treatment your patient needs, live.",
      },
    ],
  }),
  component: Instruments,
});

function Instruments() {
  const { hospital } = useApp();
  const [treatment, setTreatment] = useState("All treatments");

  const list =
    treatment === "All treatments"
      ? hospital.instruments
      : hospital.instruments.filter((i) => i.treatments.includes(treatment));

  return (
    <AppShell
      title="Instrument availability"
      subtitle={`What ${hospital.name} can actually treat right now, machine by machine.`}
    >
      <div className="card-surface flex flex-wrap items-center gap-3 p-5">
        <label className="text-sm font-bold">Treatment needed</label>
        <select
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          className="rounded-xl border-2 bg-background px-3 py-2.5 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {["All treatments", ...treatments].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <span className="ml-auto text-sm text-muted-foreground">
          {list.length} matching instruments
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map((i) => (
          <div key={i.name} className="card-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-extrabold">{i.name}</h3>
              <StatusPill status={i.status}>{i.text}</StatusPill>
            </div>
            <p className="mt-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              Used for
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              {i.treatments.map((t) => (
                <span key={t} className="rounded-full bg-mint px-3 py-1 text-xs font-bold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="card-surface p-6 text-sm text-muted-foreground">
            No equipment at this hospital is mapped to {treatment}. Try another hospital in your
            radius.
          </p>
        )}
      </div>
    </AppShell>
  );
}
