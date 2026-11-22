export type Flow = "spotting" | "light" | "medium" | "heavy";

export type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface DayLog {
  /** YYYY-MM-DD */
  date: string;
  flow?: Flow;
  symptoms: string[];
  moods: string[];
  notes?: string;
}

export interface Profile {
  name: string;
  cycleLength: number;
  periodLength: number;
  reminders: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserData {
  profile: Profile;
  logs: Record<string, DayLog>;
}

export const FLOWS: { value: Flow; label: string; dots: number }[] = [
  { value: "spotting", label: "Spotting", dots: 1 },
  { value: "light", label: "Light", dots: 2 },
  { value: "medium", label: "Medium", dots: 3 },
  { value: "heavy", label: "Heavy", dots: 4 },
];

export const SYMPTOMS: string[] = [
  "Cramps",
  "Headache",
  "Bloating",
  "Back pain",
  "Fatigue",
  "Tender breasts",
  "Acne",
  "Nausea",
  "Cravings",
  "Dizziness",
];

export const MOODS: string[] = [
  "Happy",
  "Calm",
  "Energetic",
  "Focused",
  "Anxious",
  "Irritable",
  "Sad",
  "Foggy",
];
