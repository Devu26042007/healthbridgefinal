import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Megaphone, Siren } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/responder")({
  head: () => ({
    meta: [
      { title: "Responder — Alerts, Notifications & Hospital Updates | HealthBridge" },
      {
        name: "description",
        content:
          "Live emergency alerts, app notifications and updates pushed directly by hospital staff — bed releases, theatre availability and insurance approvals.",
      },
      { property: "og:title", content: "Responder Alerts & Hospital Updates — HealthBridge" },
      {
        property: "og:description",
        content: "Everything the hospital wants you to know, the moment it changes.",
      },
    ],
  }),
  component: Responder,
});

const tabs = [
  { id: "all", label: "All" },
  { id: "alert", label: "Alerts", icon: Siren },
  { id: "notification", label: "Notifications", icon: Bell },
  { id: "update", label: "Hospital updates", icon: Megaphone },
] as const;

function Responder() {
  const { alerts } = useApp();
  const [tab, setTab] = useState<string>("all");
  const list = tab === "all" ? alerts : alerts.filter((a) => a.kind === tab);

  return (
    <AppShell
      title="Responder"
      subtitle="Alerts, notifications and live updates coming in from hospitals around you."
    >
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-mint text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {list.map((a) => {
          const tone =
            a.kind === "alert"
              ? "bg-crit-bg text-crit"
              : a.kind === "update"
                ? "bg-warn-bg text-warn"
                : "bg-ok-bg text-ok";
          const Icon = a.kind === "alert" ? Siren : a.kind === "update" ? Megaphone : Bell;
          return (
            <li key={a.id} className="card-surface flex items-start gap-3 p-4">
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <p className="font-extrabold">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.body}</p>
              </div>
              <span className="text-xs font-bold text-muted-foreground">{a.time}</span>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="card-surface p-6 text-sm text-muted-foreground">Nothing here right now.</li>
        )}
      </ul>
    </AppShell>
  );
}
