import type { Complaint, ComplaintStatus, Priority, TimelineStep } from "./types";

// Deterministic PRNG
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260726);
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const int = (a: number, b: number) => Math.floor(rand() * (b - a + 1)) + a;

export const DEPARTMENTS = [
  "Electrical",
  "Roads",
  "Drainage",
  "Water Supply",
  "Health",
  "Garbage",
  "Environment",
  "Traffic",
  "Street Lights",
  "Public Parks",
  "Education",
  "Public Toilets",
  "Animal Control",
  "Disaster Management",
  "Building & Zoning",
  "Sanitation",
  "Fire Services",
  "Housing",
  "IT & Smart City",
  "Public Transport",
  "Revenue",
  "Culture",
  "Sports",
  "Legal Aid",
  "Grievance Redressal",
];

export const CATEGORIES = [
  { name: "Street Light", dept: "Street Lights", icon: "Lightbulb" },
  { name: "Road Damage", dept: "Roads", icon: "Construction" },
  { name: "Garbage", dept: "Garbage", icon: "Trash2" },
  { name: "Drainage", dept: "Drainage", icon: "Waves" },
  { name: "Water Leakage", dept: "Water Supply", icon: "Droplets" },
  { name: "Broken Signal", dept: "Traffic", icon: "TrafficCone" },
  { name: "Illegal Dumping", dept: "Environment", icon: "AlertOctagon" },
  { name: "Tree Fallen", dept: "Public Parks", icon: "TreePine" },
  { name: "Public Toilet", dept: "Public Toilets", icon: "Toilet" },
  { name: "Street Cleaning", dept: "Sanitation", icon: "Broom" },
  { name: "Electric Pole", dept: "Electrical", icon: "Zap" },
  { name: "Flooding", dept: "Disaster Management", icon: "CloudRain" },
  { name: "Dead Animal", dept: "Animal Control", icon: "PawPrint" },
  { name: "Noise Pollution", dept: "Environment", icon: "Volume2" },
  { name: "Illegal Parking", dept: "Traffic", icon: "ParkingCircle" },
];

const FIRST = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vihaan",
  "Arjun",
  "Sai",
  "Reyansh",
  "Ayaan",
  "Krishna",
  "Ishaan",
  "Rohan",
  "Rahul",
  "Ananya",
  "Diya",
  "Isha",
  "Kavya",
  "Meera",
  "Priya",
  "Riya",
  "Sara",
  "Neha",
  "Aisha",
  "Kabir",
  "Aryan",
  "Dev",
  "Karan",
  "Manav",
  "Nikhil",
  "Rajesh",
  "Suresh",
  "Anil",
  "Vikram",
  "Amit",
  "Sanjay",
  "Deepak",
  "Ravi",
  "Kiran",
];
const LAST = [
  "Sharma",
  "Verma",
  "Patel",
  "Kumar",
  "Singh",
  "Iyer",
  "Reddy",
  "Naidu",
  "Rao",
  "Nair",
  "Menon",
  "Gupta",
  "Agarwal",
  "Joshi",
  "Malhotra",
  "Khanna",
  "Chopra",
  "Mehta",
  "Bhatt",
  "Desai",
  "Shah",
  "Pillai",
  "Bose",
  "Das",
  "Roy",
  "Sen",
  "Mukherjee",
  "Chakraborty",
  "Ghosh",
  "Banerjee",
  "Trivedi",
  "Pandey",
];
const CITIES = [
  { name: "Mumbai", lat: 19.076, lng: 72.877 },
  { name: "Delhi", lat: 28.7, lng: 77.1 },
  { name: "Bengaluru", lat: 12.97, lng: 77.59 },
  { name: "Hyderabad", lat: 17.385, lng: 78.486 },
  { name: "Chennai", lat: 13.08, lng: 80.27 },
  { name: "Kolkata", lat: 22.57, lng: 88.36 },
  { name: "Pune", lat: 18.52, lng: 73.85 },
  { name: "Ahmedabad", lat: 23.03, lng: 72.58 },
  { name: "Jaipur", lat: 26.91, lng: 75.79 },
  { name: "Lucknow", lat: 26.85, lng: 80.95 },
  { name: "Surat", lat: 21.17, lng: 72.83 },
  { name: "Indore", lat: 22.72, lng: 75.86 },
];

function name() {
  return `${pick(FIRST)} ${pick(LAST)}`;
}

function avatarFor(seed: string) {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf`;
}

function imageFor(cat: string, i: number) {
  const q = encodeURIComponent(cat.toLowerCase().replace(/ /g, ","));
  return `https://source.unsplash.com/800x600/?${q},street,city&sig=${i}`;
}

const STATUSES: ComplaintStatus[] = [
  "submitted",
  "verified",
  "assigned",
  "in_progress",
  "work_done",
  "inspected",
  "closed",
  "escalated",
  "rejected",
];
const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];

const STEP_ORDER: {
  key: ComplaintStatus | "before" | "after" | "citizen_verify";
  label: string;
}[] = [
  { key: "submitted", label: "Complaint Submitted" },
  { key: "verified", label: "Verified by Ward Officer" },
  { key: "assigned", label: "Assigned to Department" },
  { key: "in_progress", label: "Work Started" },
  { key: "before", label: "Before Photo Uploaded" },
  { key: "work_done", label: "Repair Completed" },
  { key: "after", label: "After Photo Uploaded" },
  { key: "inspected", label: "Engineer / Inspector Approved" },
  { key: "citizen_verify", label: "Citizen Verification" },
  { key: "closed", label: "Complaint Closed" },
];

function timelineFor(status: ComplaintStatus, createdAt: Date): TimelineStep[] {
  const stepIndex: Record<string, number> = {
    submitted: 0,
    verified: 1,
    assigned: 2,
    in_progress: 3,
    work_done: 5,
    inspected: 7,
    closed: 9,
    escalated: 3,
    rejected: 1,
  };
  const cutoff = stepIndex[status] ?? 0;
  return STEP_ORDER.map((s, i) => {
    const ts = new Date(createdAt.getTime() + i * 6 * 3600 * 1000);
    return {
      key: s.key,
      label: s.label,
      timestamp: ts.toISOString(),
      officer: i > 0 ? name() : undefined,
      done: i <= cutoff,
      note: i <= cutoff ? "Step completed as per SLA." : undefined,
    } as TimelineStep;
  });
}

function makeComplaints(n: number): Complaint[] {
  const list: Complaint[] = [];
  for (let i = 0; i < n; i++) {
    const cat = CATEGORIES[i % CATEGORIES.length];
    const city = CITIES[i % CITIES.length];
    let status: ComplaintStatus;
    if (i < 250) status = "closed";
    else if (i < 750)
      status = pick([
        "in_progress",
        "assigned",
        "verified",
        "work_done",
        "inspected",
      ] as ComplaintStatus[]);
    else if (i < 900) status = "submitted";
    else status = "escalated";
    const priority: Priority = pick(PRIORITIES);
    const created = new Date(Date.now() - int(1, 60) * 86400000);
    const citizen = name();
    list.push({
      id: String(i + 1),
      code: `CIV-${String(100000 + i)}`,
      category: cat.name,
      title: `${cat.name} near ${city.name} ward ${int(1, 100)}`,
      description: `Reported ${cat.name.toLowerCase()} issue. Requires immediate attention from ${cat.dept} department. Citizens in the vicinity have raised concerns about safety and hygiene.`,
      citizen,
      citizenId: `C-${int(1000, 9999)}`,
      ward: int(1, 100),
      city: city.name,
      address: `${int(1, 999)} Marg, ${city.name}`,
      lat: city.lat + (rand() - 0.5) * 0.3,
      lng: city.lng + (rand() - 0.5) * 0.3,
      department: cat.dept,
      officer: name(),
      fieldStaff: name(),
      priority,
      status,
      createdAt: created.toISOString(),
      updatedAt: new Date(created.getTime() + int(1, 20) * 3600000).toISOString(),
      estimatedResolution: `${int(12, 96)} hours`,
      cost: int(500, 50000),
      rating: status === "closed" ? int(3, 5) : 0,
      image: imageFor(cat.name, i),
      beforeImage: imageFor(cat.name + " damage", i * 2),
      afterImage: imageFor(cat.name + " repair", i * 3),
      timeline: timelineFor(status, created),
      aiConfidence: 80 + Math.floor(rand() * 20),
      duplicate: rand() < 0.05,
    });
  }
  return list;
}

export const COMPLAINTS = makeComplaints(1000);

export const STATS = {
  citizens: 500,
  officers: 120,
  fieldStaff: 100,
  inspectors: 25,
  departments: 25,
  admin: 1,
  total: COMPLAINTS.length,
  closed: COMPLAINTS.filter((c) => c.status === "closed").length,
  inProgress: COMPLAINTS.filter((c) =>
    ["in_progress", "assigned", "verified", "work_done", "inspected"].includes(c.status),
  ).length,
  pending: COMPLAINTS.filter((c) => c.status === "submitted").length,
  escalated: COMPLAINTS.filter((c) => c.status === "escalated").length,
};

export const NOTIFICATIONS = Array.from({ length: 18 }).map((_, i) => ({
  id: `n-${i}`,
  kind: pick(["government", "update", "escalation", "verification"] as const),
  title: pick([
    "Government Update: Smart City Mission 2026 review",
    "Complaint status changed to In Progress",
    "Your complaint has been escalated to Zonal Officer",
    "Verification requested — please rate the resolution",
    "New advisory issued by Ministry of Housing",
    "Ward Officer approved your complaint",
  ]),
  time: `${int(1, 59)} min ago`,
  read: rand() < 0.3,
}));

export const CHATS = [
  { from: "system", text: "You are chatting with the CivicConnect AI Assistant.", time: "09:12" },
  {
    from: "user",
    text: "The street light in front of my house has been broken for 3 days.",
    time: "09:12",
  },
  {
    from: "ai",
    text: "I have logged that. Nearest ward officer is Rajesh Sharma. Estimated resolution: 48 hours.",
    time: "09:12",
  },
  {
    from: "officer",
    text: "Hello, this is Officer Rajesh. A crew has been dispatched to your location.",
    time: "09:20",
  },
  { from: "user", text: "Thank you, appreciate the quick response.", time: "09:22" },
  {
    from: "officer",
    text: "You are welcome. We will share the completion report shortly.",
    time: "09:25",
  },
];
