import { Check, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProgressRing } from "./ProgressRing";
import {
  addDays,
  currentStreak,
  frequencyLabel,
  isCompleted,
  isScheduled,
  toISODate,
  weeklyProgress,
  type Habit,
} from "@/lib/habits";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, date?: Date) => void;
  onRemove: (id: string) => void;
}

export function HabitCard({ habit, onToggle, onRemove }: HabitCardProps) {
  const today = new Date();
  const done = isCompleted(habit, today);
  const scheduledToday = isScheduled(habit, today);
  const streak = currentStreak(habit, today);
  const progress = weeklyProgress(habit, today);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!done) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(t);
  }, [done]);

  const lastSeven = Array.from({ length: 7 }, (_, i) => addDays(today, -6 + i));

  return (
    <article className="card-soft group animate-rise p-5">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => onToggle(habit.id)}
          aria-pressed={done}
          aria-label={done ? `Mark ${habit.title} incomplete` : `Complete ${habit.title}`}
          className={cn(
            "press mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2",
            done
              ? "border-sage bg-sage text-primary-foreground"
              : "border-border bg-transparent text-muted-foreground hover:border-sage hover:text-sage",
          )}
        >
          <Check className={cn("h-5 w-5", pulse && "animate-pop")} strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "truncate font-display text-lg leading-tight",
                done && "text-muted-foreground line-through decoration-sage",
              )}
            >
              {habit.title}
            </h3>
            {streak > 0 && (
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {streak}-day streak 🔥
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {frequencyLabel(habit.frequency)}
            {!scheduledToday && " · not scheduled today"}
          </p>

          {habit.notes && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{habit.notes}</p>
          )}

          <div className="mt-4 flex items-center gap-1.5">
            {lastSeven.map((day) => {
              const filled = isCompleted(habit, day);
              const scheduled = isScheduled(habit, day);
              return (
                <button
                  key={toISODate(day)}
                  type="button"
                  onClick={() => onToggle(habit.id, day)}
                  aria-label={`${filled ? "Unmark" : "Mark"} ${toISODate(day)}`}
                  className={cn(
                    "h-2.5 flex-1 rounded-full transition-colors duration-200",
                    filled ? "bg-sage" : scheduled ? "bg-muted" : "bg-muted/50",
                  )}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ProgressRing value={progress} label={`${habit.title} weekly progress`} />
          <button
            type="button"
            onClick={() => onRemove(habit.id)}
            aria-label={`Delete ${habit.title}`}
            className="press rounded-md p-1 text-muted-foreground opacity-0 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
