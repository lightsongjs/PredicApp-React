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

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Check if today is Saturday (show next Sunday as primary)
export function isSaturday(): boolean {
  return new Date().getDay() === 6;
}

// Check if today is Sunday
export function isSunday(): boolean {
  return new Date().getDay() === 0;
}

// Find sermon for a specific liturgical date
export function findSermonForDate(sermons: Sermon[], targetDate: string): Sermon | null {
  return sermons.find(s => s.liturgicalDate === targetDate) || null;
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

// Find all sermons related to a specific sermon's theme (by paschaOffset)
export function findRelatedSermons(allSermons: Sermon[], targetSermon: Sermon): Sermon[] {
  if (targetSermon.paschaOffset == null) return [targetSermon];

  const related = allSermons.filter(s => {
    if (s.id === targetSermon.id) return false;
    return s.paschaOffset != null && s.paschaOffset === targetSermon.paschaOffset;
  });

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
  const todayStr = formatDateInternal(today);

  // Get sermons with future dates or recent past dates
  return sermons
    .filter(s => s.liturgicalDate)
    .sort((a, b) => {
      const dateA = a.liturgicalDate || '';
      const dateB = b.liturgicalDate || '';
      return dateA.localeCompare(dateB);
    })
    .filter(s => s.liturgicalDate && s.liturgicalDate >= todayStr)
    .slice(0, count);
}

function formatDateInternal(date: Date): string {
  return date.toISOString().split('T')[0];
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
