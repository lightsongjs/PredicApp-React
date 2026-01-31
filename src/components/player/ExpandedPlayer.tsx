import { Play, Pause, SkipBack, SkipForward, ChevronDown, Volume2, Shuffle, Repeat } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary via-primary to-primary-dark z-50 flex flex-col animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <button
          onClick={onCollapse}
          className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-95"
        >
          <ChevronDown className="w-7 h-7 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white/90 text-xs uppercase tracking-[0.2em] font-semibold">
            Acum se redă
          </p>
        </div>
        <div className="w-11" /> {/* Spacer for centering */}
      </div>

      {/* Album Art - Spotify Style */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 md:px-12">
        <div
          className="w-full max-w-sm md:max-w-md aspect-square rounded-lg bg-cover bg-center shadow-2xl"
          style={{ backgroundImage: `url(${sermon.image})` }}
        />
      </div>

      {/* Sermon Info - Spotify Typography */}
      <div className="px-6 md:px-12 pb-4">
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-2 truncate">
          {sermon.title}
        </h1>
        <p className="text-white/60 text-sm md:text-base font-medium">
          {sermon.category}
        </p>
      </div>

      {/* Progress Bar - Spotify Style */}
      <div className="px-6 md:px-12 pb-2">
        <div className="relative w-full py-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{ margin: 0 }}
          />
          <div className="w-full h-1 bg-white/20 rounded-full relative pointer-events-none">
            <div
              className="h-full bg-white rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
        <div className="flex justify-between text-white/50 text-xs font-medium mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls - Spotify Layout */}
      <div className="px-6 md:px-12 pb-6 flex items-center justify-between">
        <button className="p-2 text-white/60 hover:text-white transition-colors active:scale-95">
          <Shuffle className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <button className="p-2 text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95">
            <SkipBack className="w-7 h-7" />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-100 transition-transform shadow-xl"
          >
            {isLoading ? (
              <div className="w-7 h-7 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 md:w-8 md:h-8 text-primary fill-primary" />
            ) : (
              <Play className="w-7 h-7 md:w-8 md:h-8 text-primary fill-primary ml-0.5" />
            )}
          </button>

          <button className="p-2 text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95">
            <SkipForward className="w-7 h-7" />
          </button>
        </div>

        <button className="p-2 text-white/60 hover:text-white transition-colors active:scale-95">
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Volume Control - Spotify Style */}
      <div className="px-6 md:px-12 pb-8 flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-white/60 flex-shrink-0" />
        <div className="flex-1 relative py-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{ margin: 0 }}
          />
          <div className="h-1 bg-white/20 rounded-full relative pointer-events-none">
            <div
              className="h-full bg-white rounded-full relative"
              style={{ width: `${volume * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
