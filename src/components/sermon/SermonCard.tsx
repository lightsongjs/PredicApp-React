import { Play, Clock } from 'lucide-react';
import type { Sermon } from '../../data/types';
import { formatDate } from '../../utils/formatTime';

interface SermonCardProps {
  sermon: Sermon;
  onPlay: () => void;
}

export default function SermonCard({ sermon, onPlay }: SermonCardProps) {
  return (
    <div className="bg-white rounded-xl border border-primary border-opacity-10 p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onPlay}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Play className="w-6 h-6 text-primary" fill="currentColor" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-text text-base mb-1 truncate">
            {sermon.title}
          </h3>
          <p className="text-sm text-text opacity-60 mb-1 truncate">
            {sermon.category}
          </p>
          <div className="flex items-center gap-2 text-xs text-text opacity-50">
            <Clock className="w-3 h-3" />
            <span>{sermon.duration}</span>
            {sermon.liturgicalDate && (
              <>
                <span>•</span>
                <span>{formatDate(sermon.liturgicalDate)}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors flex-shrink-0"
        >
          <Play className="w-5 h-5 text-white" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
