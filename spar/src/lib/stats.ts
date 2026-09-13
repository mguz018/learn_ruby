/** Pure helpers for the Home and Progress numbers. No I/O. */

export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) return sorted[mid] ?? null;

  const lower = sorted[mid - 1];
  const upper = sorted[mid];
  if (lower === undefined || upper === undefined) return null;
  return (lower + upper) / 2;
}

/** Local calendar day for an ISO timestamp, as YYYY-MM-DD. */
function localDay(iso: string): string {
  const d = new Date(iso);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function addDays(day: string, delta: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + delta);
  return localDay(date.toISOString());
}

/**
 * Consecutive days ending today, or ending yesterday if nothing has been done
 * yet today — a streak should not read as broken until the day is actually over.
 */
export function computeStreak(timestamps: readonly string[], now = new Date()): number {
  if (timestamps.length === 0) return 0;

  const days = new Set(timestamps.map(localDay));
  const today = localDay(now.toISOString());

  let cursor = days.has(today) ? today : addDays(today, -1);
  if (!days.has(cursor)) return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function formatSeconds(ms: number | null): string {
  if (ms === null) return '—';
  return `${(ms / 1000).toFixed(1)}s`;
}
