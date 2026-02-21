import type { Sermon } from './types';
import sermonLibrary from '../../complete-sermon-library.json';

interface JsonSermon {
  id: string;
  title: string;
  date?: string;
  year?: number;
  category: string;
  subcategory?: string;
  audioFile: string;
  duration?: string;
  fileSize?: number;
  recordingYear?: number | null;
  type?: string;
  paschaOffset?: number | null;
  keywords?: string[];
  partNumber?: number;
  totalParts?: number;
}

interface CategoryData {
  name: string;
  description?: string;
  count: number;
  sermons: JsonSermon[];
}

interface SermonLibrary {
  metadata: {
    totalFiles: number;
    totalSize: number;
    totalSizeMB: number;
    totalDuration: string;
    lastUpdated: string;
    categories: Record<string, number>;
  };
  categories: Record<string, CategoryData>;
}

function transformSermon(json: JsonSermon): Sermon {
  return {
    id: json.id,
    title: json.title,
    category: json.category,
    subcategory: json.subcategory,
    audio_url: json.audioFile,
    type: json.type === 'fixed-feast' ? 'fixed' : 'movable',
    paschaOffset: json.paschaOffset ?? undefined,
    duration: json.duration,
    year: json.recordingYear ?? json.year,
    liturgicalDate: json.date,
    partNumber: json.partNumber,
  };
}

function loadAllSermons(): Sermon[] {
  const library = sermonLibrary as unknown as SermonLibrary;
  const allSermons: Sermon[] = [];

  for (const categoryKey of Object.keys(library.categories)) {
    const category = library.categories[categoryKey];
    if (category.sermons) {
      for (const sermon of category.sermons) {
        allSermons.push(transformSermon(sermon));
      }
    }
  }

  return allSermons;
}

export const allSermons = loadAllSermons();
export const metadata = (sermonLibrary as unknown as SermonLibrary).metadata;

// Series/Playlist type
export interface Series {
  id: string;
  name: string;
  description?: string;
  sermons: Sermon[];
  image?: string;
}

// Extract series from courses category
function loadSeries(): Series[] {
  const library = sermonLibrary as unknown as SermonLibrary;
  const courses = library.categories.courses;

  if (!courses || !courses.sermons) return [];

  // Group sermons by subcategory (series name)
  const seriesMap: Record<string, Sermon[]> = {};

  for (const sermon of courses.sermons) {
    const key = sermon.subcategory || 'Alte Cursuri';
    if (!seriesMap[key]) seriesMap[key] = [];
    seriesMap[key].push(transformSermon(sermon));
  }

  // Convert to Series array, sorted by number of sermons (descending)
  const seriesArray: Series[] = Object.entries(seriesMap)
    .map(([name, sermons]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name,
      sermons: sermons.sort((a, b) => (a.partNumber || 0) - (b.partNumber || 0)),
    }))
    .sort((a, b) => b.sermons.length - a.sermons.length);

  return seriesArray;
}

export const allSeries = loadSeries();
