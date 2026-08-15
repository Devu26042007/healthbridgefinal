import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, MicOff, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/brand";
import { useApp } from "@/lib/app-store";
import { bedStatus } from "@/lib/health-data";
import { useVoice } from "@/lib/use-voice";

export const Route = createFileRoute("/beds")({
  head: () => ({
    meta: [
      { title: "Bed Availability & Prices — HealthBridge" },
      {
        name: "description",
        content:
          "Live ICU, super deluxe, general ward and emergency bed availability with daily price ranges at nearby hospitals.",
      },
      { property: "og:title", content: "Bed Availability & Prices — HealthBridge" },
      {
        property: "og:description",
        content:
          "Describe the patient's condition by voice and see matching beds with live counts and price ranges.",
      },
    ],
  }),
  component: Beds,
});

const triage: { keys: string[]; bed: string; advice: string }[] = [
  { keys: ["chest", "heart", "breath", "unconscious", "stroke"], bed: "ICU", advice: "Critical symptoms detected — ICU or emergency bay recommended." },
  { keys: ["accident", "fracture", "bleeding", "injury", "burn"], bed: "Emergency Bay", advice: "Trauma case — emergency bay with theatre backup recommended." },
  { keys: ["fever", "vomit", "weak", "infection", "dehydra"], bed: "General Ward", advice: "Stable case — general ward is sufficient." },
  { keys: ["surgery", "recovery", "private", "attendant"], bed: "Super Deluxe", advice: "Longer stay — super deluxe room gives attendant space." },
];

function Beds() {
  const { hospital } = useApp();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ bed: string; advice: string } | null>(null);
  const voice = useVoice((text) => {
    setQuery(text);
    analyse(text);
  });

  function analyse(text: string) {
    const q = text.toLowerCase();
    const hit = triage.find((t) => t.keys.some((k) => q.includes(k)));
    setResult(hit ? { bed: hit.bed, advice: hit.advice } : { bed: "General Ward", advice: "No critical keywords found — start with a general ward assessment." });
  }

  const highlighted = result?.bed;

  return (
    <AppShell
      title="Bed availability"
      subtitle={`Live counts and price ranges at ${hospital.name}. Describe the patient's condition and we'll suggest the right bed.`}
    >
      <div className="card-surface p-5">
        <h2 className="text-lg font-extrabold">Describe the patient's condition</h2>
        <p className="text-sm text-muted-foreground">
          Type it, or tap the mic and simply speak — Bachao Bot will match the right bed type.
        </p>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            analyse(query);
          }}
        >
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border-2 bg-background px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={voice.listening ? voice.transcript : query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 65-year-old with chest pain and breathlessness…"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
            />
            <button
              type="button"
              onClick={voice.toggle}
              aria-label={voice.listening ? "Stop recording" : "Record condition by voice"}
              className={`flex size-9 items-center justify-center rounded-lg ${voice.listening ? "mic-active bg-coral text-primary-foreground" : "bg-mint text-primary"}`}
            >
              {voice.listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </button>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground"
          >
            Find bed
          </button>
        </form>
        {!voice.supported && (
          <p className="mt-2 text-xs text-muted-foreground">
            Voice recording is unavailable in this browser — please type the condition.
          </p>
        )}
        {result && (
          <div className="mt-4 rounded-xl bg-mint p-4 text-sm">
            <p className="font-extrabold text-primary">Recommended: {result.bed}</p>
            <p className="text-muted-foreground">{result.advice}</p>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {hospital.beds.map((b) => {
          const status = bedStatus(b.available, b.total);
          const pct = Math.round((b.available / b.total) * 100);
          return (
            <div
              key={b.label}
              className={`card-surface p-5 ${highlighted === b.label ? "ring-2 ring-primary" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold">{b.label}</h3>
                <StatusPill status={status}>
                  {b.available} of {b.total} free
                </StatusPill>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-mint">
                <div
                  className={`h-full rounded-full ${status === "ok" ? "bg-ok" : status === "warn" ? "bg-warn" : "bg-crit"}`}
                  style={{ width: `${Math.max(pct, 3)}%` }}
                />
              </div>
              <p className="mt-3 text-sm">
                <span className="text-muted-foreground">Price range · </span>
                <span className="font-extrabold">{b.priceRange}</span>
              </p>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
