import { Play, BookOpen, Calendar } from 'lucide-react';
import type { Sermon } from '../../data/types';
import { formatDate } from '../../utils/formatTime';

interface HeroSermonCardProps {
  sermon: Sermon;
  onPlay: () => void;
}

export default function HeroSermonCard({ sermon, onPlay }: HeroSermonCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
        Predica Zilei
      </span>

      {sermon.gospelReading && (
        <div className="flex items-center gap-2 mt-4 text-accent text-xs uppercase">
          <BookOpen className="w-3 h-3" />
          <span>{sermon.gospelReading}</span>
        </div>
      )}

      <h2 className="font-serif text-2xl font-bold text-text mt-3 leading-tight">
        {sermon.title}
      </h2>

      <div className="flex items-center gap-3 mt-3 text-text text-sm opacity-70">
        <Calendar className="w-4 h-4" />
        <span>{sermon.liturgicalDate ? formatDate(sermon.liturgicalDate) : ''}</span>
        <span>•</span>
        <span>{sermon.duration}</span>
      </div>

      <button
        onClick={onPlay}
        className="w-full mt-6 bg-primary text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-98 transition-all"
      >
        <Play className="w-5 h-5" fill="currentColor" />
        Ascultă Acum
      </button>
    </div>
  );
}
