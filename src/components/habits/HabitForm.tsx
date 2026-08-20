import { useState } from "react";
import { Plus } from "lucide-react";
import { WEEKDAY_LABELS, type Frequency } from "@/lib/habits";
import type { HabitDraft } from "@/hooks/useHabits";
import { cn } from "@/lib/utils";

interface HabitFormProps {
  categories: string[];
  onCreate: (draft: HabitDraft) => void;
  onAddCategory: (name: string) => void;
  onDone: () => void;
}

export function HabitForm({ categories, onCreate, onAddCategory, onDone }: HabitFormProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "Personal");
  const [mode, setMode] = useState<Frequency["type"]>("daily");
  const [days, setDays] = useState<number[]>([1, 3, 5]);
  const [newCategory, setNewCategory] = useState("");

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-sage";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      notes: notes.trim() || undefined,
      category,
      frequency: mode === "daily" ? { type: "daily" } : { type: "weekly", days },
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="card-soft animate-rise space-y-5 p-6">
      <div className="space-y-2">
        <label htmlFor="habit-title" className="text-sm font-medium">
          Habit or goal
        </label>
        <input
          id="habit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Morning meditation"
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Category</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "press rounded-full border px-3 py-1.5 text-sm",
                category === c
                  ? "border-sage bg-sage text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-sage",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            aria-label="New category"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              if (!newCategory.trim()) return;
              onAddCategory(newCategory);
              setCategory(newCategory.trim());
              setNewCategory("");
            }}
            className="press rounded-lg border border-border px-3 text-sm text-muted-foreground hover:border-sage"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Frequency</span>
        <div className="flex gap-2">
          {(["daily", "weekly"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "press rounded-lg border px-3 py-1.5 text-sm capitalize",
                mode === m
                  ? "border-sage bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-sage",
              )}
            >
              {m === "daily" ? "Daily" : "Specific days"}
            </button>
          ))}
        </div>
        {mode === "weekly" && (
          <div className="flex gap-1.5 pt-1">
            {WEEKDAY_LABELS.map((label, index) => (
              <button
                key={index}
                type="button"
                aria-pressed={days.includes(index)}
                onClick={() =>
                  setDays((prev) =>
                    prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index],
                  )
                }
                className={cn(
                  "press h-9 w-9 rounded-full border text-sm",
                  days.includes(index)
                    ? "border-sage bg-sage text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-sage",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="habit-notes" className="text-sm font-medium">
          Notes <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="habit-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="10 minutes, right after waking up"
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="press rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="press inline-flex items-center gap-1.5 rounded-lg bg-sage px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Create habit
        </button>
      </div>
    </form>
  );
}
