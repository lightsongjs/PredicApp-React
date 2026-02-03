export type SermonType = 'fixed' | 'movable';

export interface Sermon {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  audio_url: string;
  type: SermonType;
  fixed_month?: number;
  fixed_day?: number;
  pascha_offset?: number;
  duration?: string;
  description?: string;
  gospelReading?: string;
  liturgicalDate?: string;
  year?: number;  // Year the sermon was recorded
  image?: string;  // Image URL for sermon artwork
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  knownDuration: number; // Duration from sermon metadata (more reliable than browser-reported)
  volume: number;
  error: string | null;
}
