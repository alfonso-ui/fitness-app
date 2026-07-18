import type { SetLog } from '@fitness-app/types';

/** "90s" → "1m 30s", "60" → "1m", "45" → "45s". */
export function formatRest(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest}s`;
  if (rest === 0) return `${minutes}m`;
  return `${minutes}m ${rest}s`;
}

/** Clock style for the rest timer: "1:23", "0:05". */
export function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

type Targets = { targetSets: number; targetRepsMin: number; targetRepsMax: number };

/** "3 × 8–12" or "3 × 10" when the range collapses to one number. */
export function formatTargets({ targetSets, targetRepsMin, targetRepsMax }: Targets): string {
  const reps =
    targetRepsMin === targetRepsMax ? `${targetRepsMin}` : `${targetRepsMin}–${targetRepsMax}`;
  return `${targetSets} × ${reps}`;
}

/** One set as "20 × 10" (weight × reps) or just "10" when there's no load. */
export function formatSet(set: Pick<SetLog, 'weight' | 'reps'>): string {
  const reps = set.reps ?? 0;
  return set.weight != null ? `${set.weight} × ${reps}` : `${reps}`;
}

/** A row of completed sets: "20×10 · 20×10 · 20×8". */
export function formatSetLine(sets: SetLog[]): string {
  return sets.map((set) => formatSet(set).replace(/ /g, '')).join(' · ');
}

/** "Today", "Yesterday", or a short date like "17 Jul". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/** Whole-minute duration: "42 min", "1h 05 min". */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours}h ${minutes.toString().padStart(2, '0')} min`;
}
