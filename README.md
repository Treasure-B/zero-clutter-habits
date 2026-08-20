# Habitat

A modern, minimalist habit and goal tracking web application designed for high productivity and zero visual clutter.

![Habitat Screenshot](https://zero-clutter-habits.lovable.app/og-image.png)

## Features

- **Clean, Distraction-Free UI** — Spacious layout with a soothing color palette (Sage Green, Soft Charcoal, and Crisp Off-White).
- **Dark & Light Mode** — Seamless theme toggle with system preference detection.
- **Habit Management** — Create, organize, and delete habits with custom categories.
- **Smart Scheduling** — Set habits as daily or choose specific days of the week.
- **One-Tap Completion** — Quick check-off system with smooth micro-animations.
- **Visual Progress** — Inline progress rings and weekly completion stats for each habit.
- **Streak Tracking** — Automatic streak counters that keep you motivated.
- **Local Persistence** — Habits, categories, completions, and theme preference are saved to local storage.
- **Category Groups** — Organize habits into Mindfulness, Health, Work, Personal, or your own custom categories.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — Full-stack React framework
- [React 19](https://react.dev) — UI library
- [TypeScript](https://www.typescriptlang.org) — Type-safe development
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first styling
- [shadcn/ui](https://ui.shadcn.com) — Accessible UI components

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [Bun](https://bun.sh) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd habitat

# Install dependencies
bun install
# or
npm install

# Start the development server
bun dev
# or
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `bun dev`       | Start the development server         |
| `bun run build` | Build the application for production |
| `bun run start` | Start the production server          |
| `bun run lint`  | Run ESLint                           |

## Project Structure

```
src/
├── components/habits/    # Habit-specific UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and business logic
├── routes/               # TanStack Start file-based routes
├── styles.css            # Tailwind v4 theme and global styles
```

## Design Philosophy

Habitat is built around the idea that the best productivity app is the one you actually use. By removing clutter and focusing on the essentials — habits, progress, and streaks — the app helps you build consistent routines without friction.

## License

[MIT](LICENSE)

---

Built with [Lovable](https://lovable.dev).
