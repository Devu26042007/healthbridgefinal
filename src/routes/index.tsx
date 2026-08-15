import { createFileRoute, Link } from "@tanstack/react-router";
import { Ambulance, BedDouble, ShieldCheck, Stethoscope } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EcgLine, StatusPill } from "@/components/brand";
import { MapPanel } from "@/components/map-panel";
import { useApp } from "@/lib/app-store";
import { bedStatus, hospitalStatus } from "@/lib/health-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HealthBridge — Live Emergency Care & Bed Finder" },
      {
        name: "description",
        content:
          "See live ICU, ward and equipment availability, book an ambulance and check insurance cover across nearby hospitals in real time.",
      },
      { property: "og:title", content: "HealthBridge — Live Emergency Care & Bed Finder" },
      {
        property: "og:description",
        content:
          "Real-time hospital beds, instruments, ambulances and insurance clarity — controlled by Bachao Bot voice commands.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { hospital, inRadius, radiusKm, setRadiusKm, booking, setSelectedHospitalId, alerts } =
    useApp();

  return (
    <AppShell
      title="Real-time care, right when you need it"
      subtitle="Live bed, equipment, doctor, ambulance and insurance status across nearby hospitals — before you travel."
    >
      <div className="card-surface mb-6 p-5">
        <EcgLine />
        <p className="mt-3 text-sm text-muted-foreground">
          Vitals feed connected · data updated directly by hospital staff · last sync just now.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">Hospitals in radius</h2>
              <p className="text-sm text-muted-foreground">
                {inRadius.length} hospitals within {radiusKm} km
              </p>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold">
              Radius
              <input
                type="range"
                min={1}
                max={10}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="accent-primary"
              />
              <span className="w-12 font-extrabold text-primary">{radiusKm} km</span>
            </label>
          </div>

          <ul className="mt-4 space-y-3">
            {inRadius.map((h) => {
              const icu = h.beds.find((b) => b.label === "ICU");
              return (
                <li
                  key={h.id}
                  className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 ${h.id === hospital.id ? "bg-mint" : "bg-card"}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{h.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {h.area} · {h.distanceKm} km · ambulance ETA {h.ambulanceEtaMin} min
                    </p>
                  </div>
                  <StatusPill status={hospitalStatus(h)}>
                    ICU {icu?.available ?? 0}/{icu?.total ?? 0}
                  </StatusPill>
                  <button
                    type="button"
                    onClick={() => setSelectedHospitalId(h.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                  >
                    Select
                  </button>
                </li>
              );
            })}
            {inRadius.length === 0 && (
              <li className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                No hospitals within {radiusKm} km. Widen the radius.
              </li>
            )}
          </ul>
        </div>

        <div className="card-surface p-5">
          <h2 className="mb-3 text-xl font-extrabold">Ambulance map</h2>
          <MapPanel
            hospitals={inRadius}
            activeId={hospital.id}
            ambulanceActive={Boolean(booking)}
            etaMin={booking?.etaMin}
          />
          <Link
            to="/ambulance"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-coral px-4 py-3 font-extrabold text-primary-foreground"
          >
            <Ambulance className="size-5" />
            {booking ? "Track ambulance" : "Book an ambulance"}
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Link to="/beds" className="card-surface p-5 transition hover:shadow-[var(--shadow-lift)]">
          <BedDouble className="mb-2 size-6 text-primary" />
          <h3 className="text-lg font-extrabold">Beds at {hospital.name}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {hospital.beds.slice(0, 3).map((b) => (
              <li key={b.label} className="flex items-center justify-between gap-2">
                <span>{b.label}</span>
                <StatusPill status={bedStatus(b.available, b.total)}>
                  {b.available}/{b.total}
                </StatusPill>
              </li>
            ))}
          </ul>
        </Link>

        <Link
          to="/instruments"
          className="card-surface p-5 transition hover:shadow-[var(--shadow-lift)]"
        >
          <Stethoscope className="mb-2 size-6 text-primary" />
          <h3 className="text-lg font-extrabold">Instruments</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {hospital.instruments.slice(0, 3).map((i) => (
              <li key={i.name} className="flex items-center justify-between gap-2">
                <span>{i.name}</span>
                <StatusPill status={i.status}>{i.text}</StatusPill>
              </li>
            ))}
          </ul>
        </Link>

        <Link
          to="/insurance"
          className="card-surface p-5 transition hover:shadow-[var(--shadow-lift)]"
        >
          <ShieldCheck className="mb-2 size-6 text-primary" />
          <h3 className="text-lg font-extrabold">Insurance</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Instantly see if your policy is claimable here and whether you get the best benefit.
          </p>
          <p className="mt-3 text-sm font-bold text-primary">
            {hospital.insurers.length} insurers on panel →
          </p>
        </Link>
      </div>

      <div className="card-surface mt-5 p-5">
        <h2 className="text-xl font-extrabold">Latest responder activity</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {alerts.slice(0, 3).map((a) => (
            <li key={a.id} className="flex gap-3 rounded-xl bg-mint p-3">
              <span className="live-dot mt-1.5 size-2 shrink-0" />
              <span>
                <strong>{a.title}</strong> · {a.body}{" "}
                <span className="text-muted-foreground">({a.time})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
