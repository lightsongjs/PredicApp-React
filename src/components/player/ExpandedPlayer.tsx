import { Play, Pause, SkipBack, SkipForward, ChevronDown, Volume2 } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import type { Sermon } from '../../data/types';
import { formatTime } from '../../utils/time';

interface ExpandedPlayerProps {
  sermon: Sermon;
  onCollapse: () => void;
}

export function ExpandedPlayer({ sermon, onCollapse }: ExpandedPlayerProps) {
  const { state, play, pause, seek, setVolume } = useAudio(sermon.audio_url);
  const { isPlaying, isLoading, currentTime, duration, volume } = state;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary/95 to-primary z-50 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onCollapse}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
        <p className="text-white/80 text-sm uppercase tracking-wider font-semibold">
          Acum se redă
        </p>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="w-full max-w-md aspect-square rounded-2xl bg-cover bg-center shadow-2xl border-4 border-white/10"
          style={{ backgroundImage: `url(${sermon.image})` }}
        />
      </div>

      {/* Sermon Info */}
      <div className="px-8 pb-6">
        <h2 className="text-white text-2xl font-bold mb-2">{sermon.title}</h2>
        <p className="text-white/70 text-sm">{sermon.category} • {sermon.subcategory}</p>
        {sermon.description && (
          <p className="text-white/60 text-sm mt-2">{sermon.description}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-8 pb-2">
        <div
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer hover:h-3 transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-accent-gold rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-white/60 text-xs mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 pb-8 flex items-center justify-center gap-6">
        <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
          <SkipBack className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={handlePlayPause}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
        >
          {isLoading ? (
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8 text-primary" />
          ) : (
            <Play className="w-8 h-8 text-primary ml-1" />
          )}
        </button>

        <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
          <SkipForward className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="px-8 pb-8 flex items-center gap-3">
        <Volume2 className="w-5 h-5 text-white/60" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 accent-accent-gold"
        />
      </div>
    </div>
  );
}
