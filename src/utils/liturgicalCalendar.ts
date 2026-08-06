import type { Sermon } from '../data/types';

// Get the most recent Sunday (or today if it's Sunday)
function getMostRecentSunday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  if (day === 0) return d;
  d.setDate(d.getDate() - day);
  return d;
}

// Get the next Sunday
function getNextSunday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  if (day === 0) {
    d.setDate(d.getDate() + 7);
  } else {
    d.setDate(d.getDate() + (7 - day));
  }
  return d;
}

// Format date as YYYY-MM-DD in the LOCAL timezone.
// toISOString() shifts the day backwards for UTC+ offsets, which is what
// produced the off-by-one fixed-feast dates in the catalog.
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Check if today is Saturday (show next Sunday as primary)
export function isSaturday(): boolean {
  return new Date().getDay() === 6;
}

// Check if today is Sunday
export function isSunday(): boolean {
  return new Date().getDay() === 0;
}

// Find sermon for a specific liturgical date.
// Several recordings can share a date (same feast, different years) - pick the newest.
export function findSermonForDate(sermons: Sermon[], targetDate: string): Sermon | null {
  const matches = sermons.filter(s => s.liturgicalDate === targetDate);
  if (matches.length === 0) return null;
  return matches.reduce((best, s) => ((s.year || 0) > (best.year || 0) ? s : best));
}

// Find the fixed feast falling on a given day (e.g. Schimbarea la Față on 6 August),
// regardless of which weekday it is.
export function getTodaysFeastSermon(sermons: Sermon[]): {
  sermon: Sermon | null;
  date: string;
  label: string;
} | null {
  const todayStr = formatDate(new Date());
  const sermon = findSermonForDate(
    sermons.filter(s => s.type === 'fixed'),
    todayStr
  );
  if (!sermon) return null;
  return { sermon, date: todayStr, label: 'Sărbătoarea de Astăzi' };
}

// The sermon to feature on the home page: today's fixed feast wins over the Sunday cycle.
export function getFeaturedSermon(sermons: Sermon[]): {
  sermon: Sermon | null;
  date: string;
  label: string;
} {
  return getTodaysFeastSermon(sermons) ?? getThisSundaySermon(sermons);
}

// Get sermon for this Sunday (last Sunday Mon-Fri, tomorrow on Sat, today on Sun)
export function getThisSundaySermon(sermons: Sermon[]): {
  sermon: Sermon | null;
  date: string;
  label: string;
} {
  const today = new Date();
  const day = today.getDay();

  let targetDate: Date;
  let label: string;

  if (day === 6) {
    // Saturday: show tomorrow (Sunday)
    targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 1);
    label = 'Predica de Mâine';
  } else if (day === 0) {
    // Sunday: show today
    targetDate = today;
    label = 'Predica de Astăzi';
  } else {
    // Mon-Fri: show last Sunday (in case you missed it)
    targetDate = getMostRecentSunday(today);
    label = 'Duminica Trecută';
  }

  const dateStr = formatDate(targetDate);
  const sermon = findSermonForDate(sermons, dateStr);

  return { sermon, date: dateStr, label };
}

// Get sermon for next Sunday
export function getNextSundaySermon(sermons: Sermon[]): {
  sermon: Sermon | null;
  date: string;
  label: string;
} {
  const today = new Date();
  const day = today.getDay();

  let targetDate: Date;

  if (day === 6) {
    // Saturday: next Sunday is tomorrow, so "next" is the week after
    targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 8); // Tomorrow + 7
  } else if (day === 0) {
    // Sunday: next Sunday is in 7 days
    targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 7);
  } else {
    // Mon-Fri: next Sunday is this coming Sunday
    targetDate = getNextSunday(today);
  }

  const dateStr = formatDate(targetDate);
  const sermon = findSermonForDate(sermons, dateStr);

  return { sermon, date: dateStr, label: 'Duminica Viitoare' };
}

// Get liturgical sermons only (those with liturgicalDate)
export function getLiturgicalSermons(sermons: Sermon[]): Sermon[] {
  return sermons.filter(s => s.liturgicalDate);
}

// Find all sermons related to a specific sermon's theme.
// Movable feasts group by paschaOffset, fixed feasts by feastKey.
export function findRelatedSermons(allSermons: Sermon[], targetSermon: Sermon): Sermon[] {
  const matchesTheme = (s: Sermon): boolean => {
    if (targetSermon.feastKey && s.feastKey === targetSermon.feastKey) return true;
    return targetSermon.paschaOffset != null && s.paschaOffset === targetSermon.paschaOffset;
  };

  if (!targetSermon.feastKey && targetSermon.paschaOffset == null) return [targetSermon];

  const related = allSermons.filter(s => s.id !== targetSermon.id && matchesTheme(s));

  // Return target sermon first, then related ones sorted by year (no year goes last)
  return [targetSermon, ...related.sort((a, b) => {
    if (a.year && b.year) return b.year - a.year;
    if (a.year) return -1;
    if (b.year) return 1;
    return 0;
  })];
}

// Get upcoming liturgical sermons (next few Sundays)
export function getUpcomingSermons(sermons: Sermon[], count: number = 10): Sermon[] {
  const today = new Date();
  const todayStr = formatDate(today);

  // One entry per liturgical date - extra recordings of the same day show up as "related"
  const byDate = new Map<string, Sermon>();
  for (const s of sermons) {
    if (!s.liturgicalDate || s.liturgicalDate < todayStr) continue;
    const existing = byDate.get(s.liturgicalDate);
    if (!existing || (s.year || 0) > (existing.year || 0)) {
      byDate.set(s.liturgicalDate, s);
    }
  }

  return [...byDate.values()]
    .sort((a, b) => (a.liturgicalDate || '').localeCompare(b.liturgicalDate || ''))
    .slice(0, count);
}

// Format date in Romanian
export function formatDateRomanian(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
