import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Ambulance as AmbIcon, PhoneCall } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MapPanel } from "@/components/map-panel";
import { useApp } from "@/lib/app-store";
import { ambulanceTypes } from "@/lib/health-data";

export const Route = createFileRoute("/ambulance")({
  head: () => ({
    meta: [
      { title: "Book an Ambulance with Live Map — HealthBridge" },
      {
        name: "description",
        content:
          "Book a BLS, ALS or cardiac ambulance to the nearest suitable hospital and track it live on the map with real-time ETA.",
      },
      { property: "og:title", content: "Book an Ambulance with Live Map — HealthBridge" },
      {
        property: "og:description",
        content: "Dispatch an ambulance in seconds and watch it approach on a live map.",
      },
    ],
  }),
  component: AmbulancePage,
});

function AmbulancePage() {
  const { hospital, inRadius, booking, bookAmbulance, cancelBooking, user } = useApp();
  const [type, setType] = useState(ambulanceTypes[1]!.id);
  const [pickup, setPickup] = useState(user?.city ?? "");

  const selected = ambulanceTypes.find((a) => a.id === type)!;

  return (
    <AppShell
      title="Ambulance dispatch"
      subtitle="Pick an ambulance type, confirm the destination hospital and track it live."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="text-lg font-extrabold">Booking details</h2>

          <label className="mt-4 block text-sm font-bold">Pickup location</label>
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="House / landmark / area"
            className="mt-1 w-full rounded-xl border-2 bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <p className="mt-4 text-sm font-bold">Ambulance type</p>
          <div className="mt-2 space-y-2">
            {ambulanceTypes.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setType(a.id)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left ${type === a.id ? "border-primary bg-mint" : "bg-card"}`}
              >
                <AmbIcon className="size-5 text-primary" />
                <span className="flex-1">
                  <span className="block font-bold">{a.label}</span>
                  <span className="block text-xs text-muted-foreground">{a.detail}</span>
                </span>
                <span className="text-sm font-extrabold">{a.price}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Destination: <strong className="text-foreground">{hospital.name}</strong> ·{" "}
            {hospital.distanceKm} km · ETA ~{hospital.ambulanceEtaMin} min
          </p>

          {booking ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-ok-bg p-4 text-sm">
                <p className="font-extrabold text-ok">Ambulance dispatched</p>
                <p className="text-muted-foreground">
                  {booking.ambulanceType} · pickup {booking.pickup || "current location"} · arriving
                  in ~{booking.etaMin} min.
                </p>
              </div>
              <button
                type="button"
                onClick={cancelBooking}
                className="w-full rounded-xl border-2 py-3 text-sm font-extrabold"
              >
                Cancel dispatch
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                bookAmbulance({
                  hospitalId: hospital.id,
                  ambulanceType: selected.label,
                  etaMin: hospital.ambulanceEtaMin,
                  pickup: pickup || "Current location",
                })
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-coral py-3.5 font-extrabold text-primary-foreground"
            >
              <PhoneCall className="size-5" /> Confirm ambulance
            </button>
          )}
        </div>

        <div className="card-surface p-5">
          <h2 className="mb-3 text-lg font-extrabold">Live map</h2>
          <MapPanel
            hospitals={inRadius.length ? inRadius : [hospital]}
            activeId={hospital.id}
            ambulanceActive={Boolean(booking)}
            etaMin={booking?.etaMin ?? hospital.ambulanceEtaMin}
          />
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Driver and paramedic details are shared once the crew accepts.</li>
            <li>• The hospital emergency desk is alerted the moment you confirm.</li>
            <li>• Say "Bachao, book ambulance" any time to dispatch hands-free.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
