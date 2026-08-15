import { Link, useNavigate } from "@tanstack/react-router";
import {
  Ambulance,
  BedDouble,
  CircleUser,
  HeartPulse,
  LifeBuoy,
  LayoutDashboard,
  PhoneCall,
  ShieldCheck,
  Siren,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";
import { Ambient, BachaoMark } from "@/components/brand";
import { BachaoBot } from "@/components/bachao-bot";
import { useApp } from "@/lib/app-store";
import { hospitals } from "@/lib/health-data";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/beds", label: "Beds", icon: BedDouble },
  { to: "/instruments", label: "Instruments", icon: Stethoscope },
  { to: "/insurance", label: "Insurance", icon: ShieldCheck },
  { to: "/ambulance", label: "Ambulance", icon: Ambulance },
  { to: "/profile", label: "Profile status", icon: CircleUser },
  { to: "/responder", label: "Responder", icon: Siren },
  { to: "/help", label: "Help", icon: LifeBuoy },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, selectedHospitalId, setSelectedHospitalId, alerts } = useApp();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <Ambient />
      <div className="relative z-10 flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-5 lg:flex">
          <Link to="/" className="mb-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-[var(--shadow-glow)]">
              <BachaoMark />
            </span>
            <span>
              <span className="font-display block text-lg leading-tight font-extrabold text-sidebar-foreground">
                HealthBridge
              </span>
              <span className="block text-[11px] font-bold tracking-wider text-primary uppercase">
                Live emergency access
              </span>
            </span>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                inactiveProps={{ className: "text-sidebar-foreground hover:bg-sidebar-accent" }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
              >
                <Icon className="size-[18px]" />
                {label}
                {to === "/responder" && alerts.length > 0 && (
                  <span className="ml-auto rounded-full bg-coral px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                    {alerts.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-4 rounded-xl border bg-card p-3 text-xs">
            {user ? (
              <>
                <p className="font-bold">{user.fullName}</p>
                <p className="text-muted-foreground">{user.phone}</p>
                <Link to="/profile" className="mt-2 inline-block font-bold text-primary">
                  View health card →
                </Link>
              </>
            ) : (
              <>
                <p className="font-bold">Not signed in</p>
                <Link to="/login" className="mt-1 inline-block font-bold text-primary">
                  Register / log in →
                </Link>
              </>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-card/85 px-5 py-3 backdrop-blur">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground">
                <BachaoMark size={20} />
              </span>
              <span className="font-display font-extrabold">HealthBridge</span>
            </Link>

            <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
              <HeartPulse className="size-4 text-primary" />
              <span className="sr-only sm:not-sr-only">Hospital</span>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="rounded-xl border-2 bg-background px-3 py-2 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.distanceKm} km
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => navigate({ to: "/ambulance" })}
              className="flex items-center gap-2 rounded-xl bg-coral px-4 py-2.5 text-sm font-extrabold text-primary-foreground shadow-[0_6px_16px_-4px_var(--coral)] transition hover:brightness-105"
            >
              <PhoneCall className="size-4" />
              Emergency 108
            </button>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-7">
            <h1 className="font-display text-3xl font-extrabold">{title}</h1>
            {subtitle && <p className="mt-1 max-w-2xl text-muted-foreground">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </main>

          <footer className="border-t px-5 py-5 text-center text-sm text-muted-foreground">
            <strong className="text-foreground">HealthBridge</strong> — beds, equipment, doctors,
            ambulances and insurance in one live view.
          </footer>
        </div>
      </div>

      <nav className="sticky bottom-0 z-30 flex overflow-x-auto border-t bg-card lg:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="flex min-w-[72px] flex-1 flex-col items-center gap-1 py-2 text-[10px] font-bold"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <BachaoBot />
    </div>
  );
}
