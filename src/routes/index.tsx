import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useTheme } from "@/hooks/useTheme";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { ThemeToggle } from "@/components/habits/ThemeToggle";
import { ProgressRing } from "@/components/habits/ProgressRing";
import { isCompleted, isScheduled, type Habit } from "@/lib/habits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Habitat — Calm Habit & Goal Tracker" },
      {
        name: "description",
        content:
          "A minimalist habit and goal tracker with daily check-offs, streaks, category grouping and progress rings. Everything stays on your device.",
      },
      { property: "og:title", content: "Habitat — Calm Habit & Goal Tracker" },
      {
        property: "og:description",
        content:
          "Track habits with one tap. Streaks, weekly progress rings and calm, clutter-free design.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { habits, categories, hydrated, addHabit, removeHabit, toggleCompletion, addCategory } =
    useHabits();
  const { theme, toggle } = useTheme();
  const [showForm, setShowForm] = useState(false);

  const today = new Date();
  const dueToday = habits.filter((h) => isScheduled(h, today));
  const doneToday = dueToday.filter((h) => isCompleted(h, today)).length;
  const dayRatio = dueToday.length ? doneToday / dueToday.length : 0;

  const grouped = useMemo(() => {
    const map = new Map<string, Habit[]>();
    for (const habit of habits) {
      const list = map.get(habit.category) ?? [];
      list.push(habit);
      map.set(habit.category, list);
    }
    return [...map.entries()];
  }, [habits]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-12 sm:py-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {today.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">Habitat</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {hydrated && dueToday.length > 0
              ? `${doneToday} of ${dueToday.length} done today`
              : "Small, steady, repeatable."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing value={dayRatio} size={52} label="Today's completion" />
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
      </header>

      <section className="mt-10">
        {showForm ? (
          <HabitForm
            categories={categories}
            onCreate={addHabit}
            onAddCategory={addCategory}
            onDone={() => setShowForm(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="press flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground hover:border-sage hover:text-sage"
          >
            <Plus className="h-4 w-4" /> New habit
          </button>
        )}
      </section>

      {hydrated && habits.length === 0 && !showForm && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          Nothing tracked yet. Add your first habit to start a streak.
        </p>
      )}

      <div className="mt-12 space-y-12">
        {grouped.map(([category, list]) => (
          <section key={category}>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {category}
            </h2>
            <div className="space-y-3">
              {list.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleCompletion}
                  onRemove={removeHabit}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
