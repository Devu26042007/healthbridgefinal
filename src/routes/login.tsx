import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useApp, type UserProfile } from "@/lib/app-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Register or Log In — HealthBridge" },
      {
        name: "description",
        content:
          "Create your HealthBridge profile to unlock your health card, store insurance and medical documents and speed up hospital admission.",
      },
      { property: "og:title", content: "Register or Log In — HealthBridge" },
      {
        property: "og:description",
        content: "One profile that carries your health card into any emergency room.",
      },
    ],
  }),
  component: LoginPage,
});

const empty: UserProfile = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  bloodGroup: "",
  aadhaar: "",
  city: "",
  emergencyContact: "",
  insurer: "",
  policyNumber: "",
  conditions: "",
};

const fields: { key: keyof UserProfile; label: string; type?: string; wide?: boolean }[] = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Mobile number", type: "tel" },
  { key: "age", label: "Age" },
  { key: "bloodGroup", label: "Blood group" },
  { key: "city", label: "City / area" },
  { key: "aadhaar", label: "Aadhaar number" },
  { key: "emergencyContact", label: "Emergency contact" },
  { key: "insurer", label: "Insurance provider" },
  { key: "policyNumber", label: "Policy number" },
  { key: "conditions", label: "Known conditions, allergies, past surgeries", wide: true },
];

function LoginPage() {
  const { user, setUser } = useApp();
  const [form, setForm] = useState<UserProfile>(user ?? empty);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <AppShell
      title={user ? "Update your profile" : "Register for HealthBridge"}
      subtitle="Your details are stored on this device and shared with a hospital only when you book care."
    >
      <form
        className="card-surface max-w-3xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.fullName.trim() || form.phone.trim().length < 10) {
            setError("Please enter your full name and a valid 10-digit mobile number.");
            return;
          }
          setError("");
          setUser(form);
          navigate({ to: "/profile" });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
              <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                {f.label}
              </span>
              {f.wide ? (
                <textarea
                  rows={3}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-1 w-full rounded-xl border-2 bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-1 w-full rounded-xl border-2 bg-background px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              )}
            </label>
          ))}
        </div>

        {error && <p className="mt-3 text-sm font-bold text-crit">{error}</p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-3 font-extrabold text-primary-foreground"
          >
            {user ? "Save profile" : "Create profile & log in"}
          </button>
          {user && (
            <button
              type="button"
              onClick={() => {
                setUser(null);
                setForm(empty);
              }}
              className="rounded-xl border-2 px-6 py-3 font-extrabold"
            >
              Log out
            </button>
          )}
        </div>
      </form>
    </AppShell>
  );
}
