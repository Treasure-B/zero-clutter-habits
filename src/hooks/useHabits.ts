import { useCallback, useEffect, useState } from "react";
import {
  createId,
  loadCategories,
  loadHabits,
  saveCategories,
  saveHabits,
  toISODate,
  type Habit,
  DEFAULT_CATEGORIES,
} from "@/lib/habits";

export type HabitDraft = Omit<Habit, "id" | "createdAt" | "completions">;

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHabits(loadHabits());
    setCategories(loadCategories());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveHabits(habits);
  }, [habits, hydrated]);

  useEffect(() => {
    if (hydrated) saveCategories(categories);
  }, [categories, hydrated]);

  const addHabit = useCallback((draft: HabitDraft) => {
    setHabits((prev) => [
      ...prev,
      { ...draft, id: createId(), createdAt: new Date().toISOString(), completions: [] },
    ]);
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleCompletion = useCallback((id: string, date: Date = new Date()) => {
    const key = toISODate(date);
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completions: h.completions.includes(key)
                ? h.completions.filter((d) => d !== key)
                : [...h.completions, key],
            }
          : h,
      ),
    );
  }, []);

  const addCategory = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setCategories((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
  }, []);

  return {
    habits,
    categories,
    hydrated,
    addHabit,
    removeHabit,
    toggleCompletion,
    addCategory,
  };
}
