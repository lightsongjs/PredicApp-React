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
    pascha_offset: json.paschaOffset ?? undefined,
    duration: json.duration,
    year: json.recordingYear ?? json.year,
    liturgicalDate: json.date,
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
