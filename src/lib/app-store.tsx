import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hospitals, type Hospital } from "./health-data";

export type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  bloodGroup: string;
  aadhaar: string;
  city: string;
  emergencyContact: string;
  insurer: string;
  policyNumber: string;
  conditions: string;
};

export type Booking = {
  id: string;
  hospitalId: string;
  ambulanceType: string;
  etaMin: number;
  bookedAt: number;
  pickup: string;
};

export type Alert = {
  id: string;
  kind: "alert" | "notification" | "update";
  title: string;
  body: string;
  time: string;
};

type State = {
  user: UserProfile | null;
  selectedHospitalId: string;
  radiusKm: number;
  booking: Booking | null;
  alerts: Alert[];
  setUser: (u: UserProfile | null) => void;
  setSelectedHospitalId: (id: string) => void;
  setRadiusKm: (km: number) => void;
  bookAmbulance: (b: Omit<Booking, "id" | "bookedAt">) => void;
  cancelBooking: () => void;
  pushAlert: (a: Omit<Alert, "id" | "time">) => void;
  hospital: Hospital;
  inRadius: Hospital[];
};

const Ctx = createContext<State | null>(null);

const seedAlerts: Alert[] = [
  {
    id: "a1",
    kind: "alert",
    title: "ICU nearly full at City General",
    body: "Only 2 ICU beds left. Lakeview Community has 6 free, 5 km away.",
    time: "2 min ago",
  },
  {
    id: "a2",
    kind: "update",
    title: "Operation theatre freed up",
    body: "St. Jude Medical Centre has released 1 theatre for emergency cases.",
    time: "18 min ago",
  },
  {
    id: "a3",
    kind: "notification",
    title: "Insurance pre-auth approved",
    body: "Your Star Health pre-authorisation is valid at City General Hospital.",
    time: "1 hr ago",
  },
];

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState("cgh");
  const [radiusKm, setRadiusKm] = useState(6);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hb.user");
      if (raw) setUserState(JSON.parse(raw) as UserProfile);
    } catch {
      /* ignore */
    }
  }, []);

  const setUser = useCallback((u: UserProfile | null) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem("hb.user", JSON.stringify(u));
      else localStorage.removeItem("hb.user");
    } catch {
      /* ignore */
    }
  }, []);

  const pushAlert = useCallback((a: Omit<Alert, "id" | "time">) => {
    setAlerts((prev) => [
      { ...a, id: Math.random().toString(36).slice(2), time: "just now" },
      ...prev,
    ]);
  }, []);

  const bookAmbulance = useCallback(
    (b: Omit<Booking, "id" | "bookedAt">) => {
      setBooking({ ...b, id: Math.random().toString(36).slice(2), bookedAt: Date.now() });
      const h = hospitals.find((x) => x.id === b.hospitalId);
      pushAlert({
        kind: "alert",
        title: "Ambulance dispatched",
        body: `${b.ambulanceType} on the way to ${b.pickup}. ETA ${b.etaMin} min · ${h?.name ?? ""}.`,
      });
    },
    [pushAlert],
  );

  const cancelBooking = useCallback(() => setBooking(null), []);

  const hospital = useMemo(
    () => hospitals.find((h) => h.id === selectedHospitalId) ?? (hospitals[0] as Hospital),
    [selectedHospitalId],
  );

  const inRadius = useMemo(
    () => hospitals.filter((h) => h.distanceKm <= radiusKm),
    [radiusKm],
  );

  const value: State = {
    user,
    selectedHospitalId,
    radiusKm,
    booking,
    alerts,
    setUser,
    setSelectedHospitalId,
    setRadiusKm,
    bookAmbulance,
    cancelBooking,
    pushAlert,
    hospital,
    inRadius,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}
