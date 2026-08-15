import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Mic, MicOff, X } from "lucide-react";
import { BachaoMark } from "@/components/brand";
import { useVoice, speak } from "@/lib/use-voice";
import { useApp } from "@/lib/app-store";
import { ambulanceTypes, hospitals } from "@/lib/health-data";

type Line = { from: "bot" | "you"; text: string };

const HELP = [
  '"Open beds" / "Show instruments" / "Insurance"',
  '"Book ambulance" · "Cancel ambulance"',
  '"Set radius 5 km" · "Switch to Lakeview"',
  '"Emergency" to dial 108',
];

export function BachaoBot() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<Line[]>([
    { from: "bot", text: "Namaste, I am Bachao Bot. Tap the mic and tell me what you need." },
  ]);
  const navigate = useNavigate();
  const app = useApp();

  const respond = (text: string) => {
    setLog((l) => [...l, { from: "bot", text }]);
    speak(text);
  };

  const handle = (raw: string) => {
    const q = raw.toLowerCase();
    setLog((l) => [...l, { from: "you", text: raw }]);

    const radius = q.match(/radius\s*(?:to\s*)?(\d+)/);
    if (radius?.[1]) {
      app.setRadiusKm(Number(radius[1]));
      return respond(`Radius set to ${radius[1]} kilometres.`);
    }
    const hosp = hospitals.find((h) => q.includes(h.name.split(" ")[0]!.toLowerCase()));
    if (hosp && (q.includes("switch") || q.includes("select") || q.includes("show"))) {
      app.setSelectedHospitalId(hosp.id);
      return respond(`Switched to ${hosp.name}.`);
    }
    if (q.includes("cancel")) {
      app.cancelBooking();
      return respond("Ambulance dispatch cancelled.");
    }
    if (q.includes("ambulance") || q.includes("book")) {
      navigate({ to: "/ambulance" });
      app.bookAmbulance({
        hospitalId: app.hospital.id,
        ambulanceType: ambulanceTypes[1]!.label,
        etaMin: app.hospital.ambulanceEtaMin,
        pickup: app.user?.city ? `${app.user.city} — current location` : "Current location",
      });
      return respond(
        `Advanced Life Support ambulance booked to ${app.hospital.name}. Arriving in about ${app.hospital.ambulanceEtaMin} minutes.`,
      );
    }
    if (q.includes("emergency") || q.includes("108") || q.includes("bachao")) {
      return respond("Dialling emergency helpline 108 now. Stay calm, help is coming.");
    }
    if (q.includes("bed") || q.includes("icu") || q.includes("ward")) {
      navigate({ to: "/beds" });
      const icu = app.hospital.beds.find((b) => b.label === "ICU");
      return respond(`Opening beds. ${icu?.available ?? 0} ICU beds free at ${app.hospital.name}.`);
    }
    if (q.includes("instrument") || q.includes("equipment") || q.includes("machine")) {
      navigate({ to: "/instruments" });
      return respond("Showing instrument availability.");
    }
    if (q.includes("insurance") || q.includes("claim")) {
      navigate({ to: "/insurance" });
      return respond("Opening insurance checker.");
    }
    if (q.includes("profile") || q.includes("document") || q.includes("health card")) {
      navigate({ to: "/profile" });
      return respond("Here is your profile status.");
    }
    if (q.includes("responder") || q.includes("alert") || q.includes("notification")) {
      navigate({ to: "/responder" });
      return respond("Showing responder alerts.");
    }
    if (q.includes("help") || q.includes("support") || q.includes("guide")) {
      navigate({ to: "/help" });
      return respond("Opening the help centre.");
    }
    if (q.includes("home") || q.includes("overview") || q.includes("dashboard")) {
      navigate({ to: "/" });
      return respond("Back to the overview.");
    }
    respond("Sorry, I did not catch that. Try saying: open beds, book ambulance, or insurance.");
  };

  const voice = useVoice(handle);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Bachao Bot voice assistant"
        className={`fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110 ${voice.listening ? "mic-active" : ""}`}
      >
        <BachaoMark size={28} />
      </button>

      {open && (
        <div className="fixed right-5 bottom-24 z-40 flex max-h-[70vh] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-3 border-b bg-brand-gradient px-4 py-3 text-primary-foreground">
            <BachaoMark size={22} />
            <div className="flex-1">
              <p className="font-display text-sm font-bold">Bachao Bot</p>
              <p className="text-[11px] opacity-90">Voice control for the whole app</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-4 text-sm">
            {log.map((l, i) => (
              <p
                key={i}
                className={
                  l.from === "bot"
                    ? "rounded-xl rounded-tl-sm bg-mint px-3 py-2"
                    : "ml-8 rounded-xl rounded-tr-sm bg-primary px-3 py-2 text-primary-foreground"
                }
              >
                {l.text}
              </p>
            ))}
            {voice.transcript && (
              <p className="ml-8 rounded-xl bg-secondary px-3 py-2 text-muted-foreground italic">
                {voice.transcript}
              </p>
            )}
          </div>

          <div className="border-t p-3">
            {!voice.supported && (
              <p className="mb-2 text-xs text-muted-foreground">
                Voice input is not supported in this browser — type a command instead.
              </p>
            )}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem("cmd") as HTMLInputElement;
                if (input.value.trim()) handle(input.value.trim());
                input.value = "";
              }}
            >
              <button
                type="button"
                onClick={voice.toggle}
                aria-label={voice.listening ? "Stop listening" : "Start voice command"}
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${voice.listening ? "mic-active bg-coral text-primary-foreground" : "bg-mint text-primary"}`}
              >
                {voice.listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </button>
              <input
                name="cmd"
                placeholder="Say or type a command…"
                className="min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </form>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              {HELP.join(" · ")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
