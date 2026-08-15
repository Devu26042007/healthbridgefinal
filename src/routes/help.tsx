import { createFileRoute } from "@tanstack/react-router";
import { PhoneCall } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help, Guidelines & Support — HealthBridge" },
      {
        name: "description",
        content:
          "How HealthBridge works, step-by-step usage, operator contact numbers, privacy policy, support and app guidelines.",
      },
      { property: "og:title", content: "Help, Guidelines & Support — HealthBridge" },
      {
        property: "og:description",
        content: "Everything you need to use HealthBridge confidently in an emergency.",
      },
    ],
  }),
  component: Help,
});

const steps = [
  "Pick your radius on the Overview page and see which hospitals are actually able to take a patient right now.",
  "Open Beds, describe the patient's condition by voice or text, and we suggest ICU, super deluxe, general ward or emergency bay with live prices.",
  "Check Instruments to confirm the machine your treatment needs is free at that hospital.",
  "Run an Insurance check to see if your policy is claimable there and where you get the best benefit.",
  "Book an ambulance and track it on the live map. The hospital desk is alerted automatically.",
  "Tap the Bachao Bot button any time and speak — it can run every section of the app for you.",
];

const guidelines = [
  "Data is updated by hospital staff; always confirm critical details on arrival.",
  "In a life-threatening emergency, call 108 first — then book through the app.",
  "Keep your Aadhaar, insurance and medical reports uploaded so admission is faster.",
  "Do not use HealthBridge for medical diagnosis — it routes you to care, it does not replace a doctor.",
];

function Help() {
  return (
    <AppShell
      title="Help & support"
      subtitle="What HealthBridge does, how to use it, and how to reach a human when you need one."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <h2 className="text-lg font-extrabold">About the app</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            HealthBridge is a real-time emergency care finder. It brings bed availability, equipment
            status, doctors on duty, ambulance dispatch and insurance clarity into one live view, so
            a family never has to make ten phone calls while someone is critical. All of it can be
            driven hands-free through Bachao Bot, our voice assistant.
          </p>

          <h2 className="mt-6 text-lg font-extrabold">How to use it</h2>
          <ol className="mt-2 space-y-2 text-sm">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-mint p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-6 text-lg font-extrabold">Guidelines</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {guidelines.map((g) => (
              <li key={g}>• {g}</li>
            ))}
          </ul>

          <h2 className="mt-6 text-lg font-extrabold">Privacy policy</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your documents, Aadhaar number and medical history are encrypted and shared only with
            the hospital you are being admitted to, and only when you book care. Location is used
            solely to compute distance and ambulance ETA, and can be switched off in Profile status.
            We never sell your data to insurers or advertisers.
          </p>
        </div>

        <div className="space-y-4">
          <div className="card-surface p-5">
            <h2 className="text-lg font-extrabold">Talk to an operator</h2>
            <p className="mt-1 text-sm text-muted-foreground">24×7 helpline, all India.</p>
            <a
              href="tel:108"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-coral py-3 font-extrabold text-primary-foreground"
            >
              <PhoneCall className="size-5" /> Emergency 108
            </a>
            <a
              href="tel:+911800226677"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border-2 py-3 font-extrabold"
            >
              Operator: 1800 22 6677
            </a>
            <p className="mt-3 text-sm text-muted-foreground">
              Support email: support@healthbridge.care
            </p>
          </div>

          <div className="card-surface p-5">
            <h2 className="text-lg font-extrabold">Support</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Wrong bed count? Insurance mismatch? Report it and our team verifies with the hospital
              within 15 minutes.
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-xl bg-primary py-3 font-extrabold text-primary-foreground"
            >
              Report an issue
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
