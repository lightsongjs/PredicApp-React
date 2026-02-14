import { Play, Pause, SkipBack, SkipForward, Repeat, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading?: boolean;
  playbackRate?: number;
  onPlayPause: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onCyclePlaybackRate?: () => void;
}

export default function PlayerControls({
  isPlaying,
  isLoading = false,
  playbackRate = 1,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onCyclePlaybackRate,
}: PlayerControlsProps) {
  const [repeat, setRepeat] = useState(false);

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onCyclePlaybackRate}
        className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${
          playbackRate !== 1 ? 'text-accent' : 'text-white opacity-60 hover:opacity-90'
        }`}
        disabled={isLoading}
      >
        {playbackRate}x
      </button>

      <button
        onClick={onSkipBackward}
        className="p-2 text-white opacity-80 hover:opacity-100 transition-opacity"
        disabled={isLoading}
      >
        <SkipBack className="w-6 h-6" />
      </button>

      <button
        onClick={onPlayPause}
        className="w-20 h-20 bg-accent rounded-full flex items-center justify-center hover:bg-accent-light transition-all active:scale-95 shadow-xl"
      >
        {isLoading ? (
          <Loader2 className="w-8 h-8 text-primary-dark animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-8 h-8 text-primary-dark" fill="currentColor" />
        ) : (
          <Play className="w-8 h-8 text-primary-dark ml-1" fill="currentColor" />
        )}
      </button>

      <button
        onClick={onSkipForward}
        className="p-2 text-white opacity-80 hover:opacity-100 transition-opacity"
        disabled={isLoading}
      >
        <SkipForward className="w-6 h-6" />
      </button>

      <button
        onClick={() => setRepeat(!repeat)}
        className={`p-2 transition-colors ${
          repeat ? 'text-accent' : 'text-white opacity-60 hover:opacity-90'
        }`}
        disabled={isLoading}
      >
        <Repeat className="w-5 h-5" />
      </button>
    </div>
  );
}
