export type Role = "citizen" | "ward" | "department" | "field" | "inspector" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  ward?: number;
  department?: string;
  score?: number;
}

export type ComplaintStatus =
  | "submitted"
  | "verified"
  | "assigned"
  | "in_progress"
  | "work_done"
  | "inspected"
  | "closed"
  | "escalated"
  | "rejected";

export type Priority = "low" | "medium" | "high" | "critical";

export interface TimelineStep {
  key: string;
  label: string;
  timestamp: string;
  officer?: string;
  note?: string;
  done: boolean;
}

export interface Complaint {
  id: string;
  code: string;
  category: string;
  title: string;
  description: string;
  citizen: string;
  citizenId: string;
  ward: number;
  city: string;
  address: string;
  lat: number;
  lng: number;
  department: string;
  officer: string;
  fieldStaff: string;
  priority: Priority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  estimatedResolution: string;
  cost: number;
  rating: number;
  image: string;
  beforeImage: string;
  afterImage: string;
  timeline: TimelineStep[];
  aiConfidence: number;
  duplicate: boolean;
}
