export type Status = "ok" | "warn" | "crit";

export type BedType = {
  label: string;
  available: number;
  total: number;
  priceRange: string;
};

export type Instrument = {
  name: string;
  status: Status;
  text: string;
  treatments: string[];
};

export type Doctor = {
  name: string;
  specialty: string;
  status: Status;
  text: string;
};

export type InsurancePlan = {
  insurer: string;
  cashless: boolean;
  coveragePct: number;
  roomCapPerDay: number;
  claimTimeHrs: number;
  note: string;
};

export type Hospital = {
  id: string;
  name: string;
  distanceKm: number;
  area: string;
  phone: string;
  ambulanceEtaMin: number;
  beds: BedType[];
  instruments: Instrument[];
  doctors: Doctor[];
  insurers: InsurancePlan[];
};

export const hospitals: Hospital[] = [
  {
    id: "cgh",
    name: "City General Hospital",
    distanceKm: 2.1,
    area: "Shivaji Nagar",
    phone: "+91 20 4000 1108",
    ambulanceEtaMin: 6,
    beds: [
      { label: "ICU", available: 2, total: 12, priceRange: "₹9,500 – ₹14,000 / day" },
      { label: "Super Deluxe", available: 4, total: 10, priceRange: "₹7,000 – ₹11,000 / day" },
      { label: "General Ward", available: 18, total: 40, priceRange: "₹1,200 – ₹2,400 / day" },
      { label: "Emergency Bay", available: 5, total: 10, priceRange: "₹2,500 – ₹4,000 / day" },
    ],
    instruments: [
      { name: "Ventilators", status: "ok", text: "6 available", treatments: ["Respiratory failure", "COVID / pneumonia", "Post-op critical care"] },
      { name: "Oxygen Units", status: "ok", text: "Ample supply", treatments: ["Breathlessness", "Cardiac emergency"] },
      { name: "Dialysis Machines", status: "warn", text: "1 available", treatments: ["Kidney failure", "Poisoning"] },
      { name: "Operation Theatres", status: "crit", text: "All in use", treatments: ["Trauma surgery", "Appendicitis", "C-section"] },
      { name: "CT / MRI Scanner", status: "ok", text: "Both free", treatments: ["Head injury", "Stroke", "Fracture assessment"] },
      { name: "Cath Lab", status: "ok", text: "Ready", treatments: ["Heart attack", "Angioplasty"] },
    ],
    doctors: [
      { name: "Dr. A. Rao", specialty: "Cardiology", status: "ok", text: "Available" },
      { name: "Dr. S. Iyer", specialty: "Orthopedics", status: "ok", text: "Available" },
      { name: "Dr. M. Khan", specialty: "Neurology", status: "warn", text: "In surgery" },
      { name: "Dr. P. Nair", specialty: "General Medicine", status: "ok", text: "Available" },
    ],
    insurers: [
      { insurer: "Star Health", cashless: true, coveragePct: 90, roomCapPerDay: 12000, claimTimeHrs: 3, note: "Pre-auth cleared on the spot for emergencies." },
      { insurer: "HDFC Ergo", cashless: true, coveragePct: 85, roomCapPerDay: 10000, claimTimeHrs: 4, note: "ICU covered fully, consumables partly excluded." },
      { insurer: "ICICI Lombard", cashless: true, coveragePct: 80, roomCapPerDay: 9000, claimTimeHrs: 5, note: "Room rent above cap is payable by patient." },
      { insurer: "National Insurance", cashless: false, coveragePct: 70, roomCapPerDay: 7000, claimTimeHrs: 48, note: "Reimbursement only — keep all bills." },
      { insurer: "CGHS", cashless: true, coveragePct: 100, roomCapPerDay: 8000, claimTimeHrs: 6, note: "Government panel rates apply." },
    ],
  },
  {
    id: "sjm",
    name: "St. Jude Medical Centre",
    distanceKm: 3.4,
    area: "Kalyani Nagar",
    phone: "+91 20 4000 2242",
    ambulanceEtaMin: 9,
    beds: [
      { label: "ICU", available: 0, total: 10, priceRange: "₹11,000 – ₹16,500 / day" },
      { label: "Super Deluxe", available: 2, total: 8, priceRange: "₹8,500 – ₹13,000 / day" },
      { label: "General Ward", available: 6, total: 35, priceRange: "₹1,500 – ₹2,800 / day" },
      { label: "Emergency Bay", available: 2, total: 8, priceRange: "₹3,000 – ₹4,800 / day" },
    ],
    instruments: [
      { name: "Ventilators", status: "crit", text: "None available", treatments: ["Respiratory failure"] },
      { name: "Oxygen Units", status: "warn", text: "Low supply", treatments: ["Breathlessness"] },
      { name: "Dialysis Machines", status: "ok", text: "3 available", treatments: ["Kidney failure"] },
      { name: "Operation Theatres", status: "warn", text: "1 available", treatments: ["Trauma surgery", "Orthopedic surgery"] },
      { name: "CT / MRI Scanner", status: "ok", text: "CT free", treatments: ["Head injury", "Stroke"] },
      { name: "Cath Lab", status: "crit", text: "Under maintenance", treatments: ["Heart attack"] },
    ],
    doctors: [
      { name: "Dr. R. Bose", specialty: "Cardiology", status: "warn", text: "On call" },
      { name: "Dr. L. Fernandes", specialty: "Pediatrics", status: "ok", text: "Available" },
      { name: "Dr. T. Gupta", specialty: "General Medicine", status: "ok", text: "Available" },
    ],
    insurers: [
      { insurer: "Star Health", cashless: true, coveragePct: 75, roomCapPerDay: 9000, claimTimeHrs: 6, note: "Cashless desk open 9am – 9pm only." },
      { insurer: "Bajaj Allianz", cashless: true, coveragePct: 88, roomCapPerDay: 11000, claimTimeHrs: 3, note: "Best rate at this hospital." },
      { insurer: "Care Health", cashless: true, coveragePct: 82, roomCapPerDay: 9500, claimTimeHrs: 5, note: "Day-care procedures included." },
      { insurer: "CGHS", cashless: true, coveragePct: 100, roomCapPerDay: 7500, claimTimeHrs: 8, note: "Panel rates, longer approval queue." },
    ],
  },
  {
    id: "lch",
    name: "Lakeview Community Hospital",
    distanceKm: 5,
    area: "Baner",
    phone: "+91 20 4000 3390",
    ambulanceEtaMin: 13,
    beds: [
      { label: "ICU", available: 6, total: 14, priceRange: "₹7,500 – ₹10,500 / day" },
      { label: "Super Deluxe", available: 5, total: 9, priceRange: "₹5,500 – ₹8,500 / day" },
      { label: "General Ward", available: 29, total: 50, priceRange: "₹900 – ₹1,800 / day" },
      { label: "Emergency Bay", available: 7, total: 10, priceRange: "₹2,000 – ₹3,200 / day" },
    ],
    instruments: [
      { name: "Ventilators", status: "ok", text: "9 available", treatments: ["Respiratory failure", "Post-op critical care"] },
      { name: "Oxygen Units", status: "ok", text: "Ample supply", treatments: ["Breathlessness", "Asthma attack"] },
      { name: "Dialysis Machines", status: "ok", text: "4 available", treatments: ["Kidney failure"] },
      { name: "Operation Theatres", status: "ok", text: "3 available", treatments: ["Trauma surgery", "C-section", "Appendicitis"] },
      { name: "CT / MRI Scanner", status: "warn", text: "MRI booked till 6pm", treatments: ["Stroke", "Spine injury"] },
      { name: "Cath Lab", status: "ok", text: "Ready", treatments: ["Heart attack", "Angioplasty"] },
    ],
    doctors: [
      { name: "Dr. N. Sharma", specialty: "General Medicine", status: "ok", text: "Available" },
      { name: "Dr. V. Menon", specialty: "Orthopedics", status: "ok", text: "Available" },
      { name: "Dr. K. Das", specialty: "Cardiology", status: "ok", text: "Available" },
      { name: "Dr. J. Pillai", specialty: "Neurology", status: "ok", text: "Available" },
      { name: "Dr. A. Verma", specialty: "Pediatrics", status: "warn", text: "In surgery" },
    ],
    insurers: [
      { insurer: "HDFC Ergo", cashless: true, coveragePct: 92, roomCapPerDay: 10000, claimTimeHrs: 2, note: "Fastest approvals in the network." },
      { insurer: "ICICI Lombard", cashless: true, coveragePct: 86, roomCapPerDay: 9000, claimTimeHrs: 4, note: "Includes ambulance reimbursement." },
      { insurer: "National Insurance", cashless: true, coveragePct: 78, roomCapPerDay: 7000, claimTimeHrs: 6, note: "Cashless available on weekdays." },
      { insurer: "Bajaj Allianz", cashless: true, coveragePct: 84, roomCapPerDay: 8500, claimTimeHrs: 5, note: "Pre-existing waiting period applies." },
      { insurer: "Star Health", cashless: true, coveragePct: 80, roomCapPerDay: 8000, claimTimeHrs: 5, note: "Standard network rates." },
      { insurer: "CGHS", cashless: true, coveragePct: 100, roomCapPerDay: 7000, claimTimeHrs: 7, note: "Panel rates apply." },
    ],
  },
];

export const treatments = [
  "Heart attack",
  "Stroke",
  "Trauma surgery",
  "Kidney failure",
  "Respiratory failure",
  "C-section",
  "Appendicitis",
  "Head injury",
];

export const ambulanceTypes = [
  { id: "bls", label: "Basic Life Support", detail: "Oxygen, stretcher, paramedic", price: "₹1,200 base" },
  { id: "als", label: "Advanced Life Support", detail: "Ventilator, monitor, EMT team", price: "₹2,600 base" },
  { id: "cardiac", label: "Cardiac Ambulance", detail: "Defibrillator + cardiac nurse", price: "₹3,400 base" },
];

export function bedStatus(available: number, total: number): Status {
  const pct = total === 0 ? 0 : available / total;
  if (available === 0 || pct < 0.1) return "crit";
  if (pct < 0.3) return "warn";
  return "ok";
}

export function hospitalStatus(h: Hospital): Status {
  const icu = h.beds.find((b) => b.label === "ICU");
  return icu ? bedStatus(icu.available, icu.total) : "ok";
}
