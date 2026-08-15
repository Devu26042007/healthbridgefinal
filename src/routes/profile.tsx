import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  FileText,
  HeartPulse,
  IdCard,
  MapPin,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BachaoMark } from "@/components/brand";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile Status & Health Card — HealthBridge" },
      {
        name: "description",
        content:
          "Your HealthBridge health card: registration details, medical history, insurance documents, Aadhaar, age and fitness certificates and location allowance.",
      },
      { property: "og:title", content: "Profile Status & Health Card — HealthBridge" },
      {
        property: "og:description",
        content: "One health card carrying every document a hospital asks for in an emergency.",
      },
    ],
  }),
  component: Profile,
});

const documents = [
  { icon: FileText, name: "Medical history & reports", note: "3 reports uploaded · last: blood panel, 12 Jul" },
  { icon: ShieldCheck, name: "Insurance documents", note: "Policy PDF + e-card verified" },
  { icon: HeartPulse, name: "Health card / certificate", note: "Issued by HealthBridge · valid 1 year" },
  { icon: BadgeCheck, name: "Fitness certificate", note: "Uploaded · verified by Dr. N. Sharma" },
  { icon: IdCard, name: "Aadhaar card", note: "Masked & encrypted · KYC complete" },
  { icon: FileText, name: "Age certificate", note: "Birth certificate on file" },
  { icon: MapPin, name: "Location allowance", note: "Live location sharing enabled for emergencies" },
];

function Profile() {
  const { user } = useApp();

  if (!user) {
    return (
      <AppShell title="Profile status" subtitle="Register to unlock your HealthBridge health card.">
        <div className="card-surface p-8 text-center">
          <p className="text-muted-foreground">You are not signed in yet.</p>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 font-extrabold text-primary-foreground"
          >
            Register / log in
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Profile status"
      subtitle="Your registration details, documents and health card — ready to show at any hospital desk."
    >
      <div className="overflow-hidden rounded-2xl bg-brand-gradient p-6 text-primary-foreground shadow-[var(--shadow-lift)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-card/20">
            <BachaoMark size={30} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest uppercase opacity-90">
              HealthBridge Health Card
            </p>
            <p className="font-display text-2xl font-extrabold">{user.fullName}</p>
            <p className="text-sm opacity-90">
              {user.age ? `${user.age} yrs · ` : ""}
              {user.bloodGroup || "Blood group not set"} · {user.city || "City not set"}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="opacity-90">Policy</p>
            <p className="font-extrabold">{user.policyNumber || "—"}</p>
            <p className="opacity-90">{user.insurer || "No insurer linked"}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="text-lg font-extrabold">Registration details</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Full name" value={user.fullName} />
            <Field label="Email" value={user.email} />
            <Field label="Phone" value={user.phone} />
            <Field label="Age" value={user.age} />
            <Field label="Blood group" value={user.bloodGroup} />
            <Field label="City" value={user.city} />
            <Field label="Aadhaar" value={user.aadhaar ? `XXXX XXXX ${user.aadhaar.slice(-4)}` : ""} />
            <Field label="Emergency contact" value={user.emergencyContact} />
          </dl>
          <Link to="/login" className="mt-4 inline-block text-sm font-bold text-primary">
            Edit details →
          </Link>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-lg font-extrabold">Medical history</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {user.conditions || "No known conditions recorded. Add allergies, chronic illness or past surgeries."}
          </p>
          <div className="mt-4 rounded-xl bg-mint p-4 text-sm">
            <p className="font-bold">Shared automatically during an emergency</p>
            <p className="text-muted-foreground">
              When you book an ambulance, your blood group, allergies and insurer are sent ahead to
              the hospital's emergency desk.
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-7 mb-3 text-xl font-extrabold">Documents</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {documents.map(({ icon: Icon, name, note }) => (
          <div key={name} className="card-surface flex items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint text-primary">
              <Icon className="size-5" />
            </span>
            <div className="flex-1">
              <p className="font-bold">{name}</p>
              <p className="text-sm text-muted-foreground">{note}</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border-2 px-3 py-1.5 text-xs font-bold"
            >
              <Upload className="size-3.5" /> Update
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="font-semibold">{value || "—"}</dd>
    </div>
  );
}
