export type Frequency =
  | { type: "daily" }
  | { type: "weekly"; days: number[] }; // 0 = Sunday ... 6 = Saturday

export interface Habit {
  id: string;
  title: string;
  notes?: string;
  category: string;
  frequency: Frequency;
  createdAt: string;
  /** ISO dates (yyyy-mm-dd) on which the habit was completed */
  completions: string[];
}

export const DEFAULT_CATEGORIES = ["Mindfulness", "Health", "Work", "Personal"];

export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export const STORAGE_KEY = "habitat.habits.v1";
export const CATEGORY_KEY = "habitat.categories.v1";
export const THEME_KEY = "habitat.theme.v1";

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function isScheduled(habit: Habit, date: Date): boolean {
  if (habit.frequency.type === "daily") return true;
  return habit.frequency.days.includes(date.getDay());
}

export function isCompleted(habit: Habit, date: Date): boolean {
  return habit.completions.includes(toISODate(date));
}

export function frequencyLabel(frequency: Frequency): string {
  if (frequency.type === "daily") return "Every day";
  if (frequency.days.length === 0) return "No days selected";
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return frequency.days
    .slice()
    .sort((a, b) => a - b)
    .map((d) => names[d])
    .join(" · ");
}

/** Consecutive scheduled days completed, counting back from today. */
export function currentStreak(habit: Habit, today = new Date()): number {
  let streak = 0;
  let cursor = new Date(today);
  // Today not being done yet shouldn't break an existing streak.
  if (isScheduled(habit, cursor) && !isCompleted(habit, cursor)) {
    cursor = addDays(cursor, -1);
  }
  for (let i = 0; i < 730; i++) {
    if (!isScheduled(habit, cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    if (!isCompleted(habit, cursor)) break;
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Completion ratio over the last 7 scheduled days (0-1). */
export function weeklyProgress(habit: Habit, today = new Date()): number {
  let scheduled = 0;
  let done = 0;
  for (let i = 0; i < 7; i++) {
    const day = addDays(today, -i);
    if (!isScheduled(habit, day)) continue;
    scheduled++;
    if (isCompleted(habit, day)) done++;
  }
  return scheduled === 0 ? 0 : done / scheduled;
}

export function loadHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Habit[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function loadCategories(): string[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = window.localStorage.getItem(CATEGORY_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

export function createId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
