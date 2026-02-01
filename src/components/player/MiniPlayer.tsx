import { Play, Pause, X } from 'lucide-react';
import { useEffect } from 'react';
import { useAudio } from '../../hooks/useAudio';
import type { Sermon } from '../../data/types';

interface MiniPlayerProps {
  sermon: Sermon;
  onExpand: () => void;
  onClose: () => void;
  autoPlay?: boolean;
}

export function MiniPlayer({ sermon, onExpand, onClose, autoPlay = false }: MiniPlayerProps) {
  const { state, play, pause } = useAudio(sermon.audio_url);

  useEffect(() => {
    if (autoPlay) {
      play();
    }
  }, [autoPlay]);
  const { isPlaying, isLoading, currentTime, duration } = state;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 px-3 z-40 animate-slide-up">
      <div
        className="bg-primary text-white rounded-xl shadow-2xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-3xl transition-shadow"
        onClick={onExpand}
      >
        {/* Album Art */}
        <div
          className="w-12 h-12 rounded-lg bg-white/20 bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url(${sermon.image})` }}
        />

        {/* Sermon Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{sermon.title}</p>
          <p className="text-xs opacity-80 uppercase tracking-tight truncate">
            {sermon.category}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/20 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-accent-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            onClick={handlePlayPause}
          >
            {isLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-0.5" />
            )}
          </button>

          <button
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
