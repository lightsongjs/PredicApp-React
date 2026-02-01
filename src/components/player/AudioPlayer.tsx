import { X, Share2 } from 'lucide-react';
import type { Sermon } from '../../data/types';
import { useAudio } from '../../hooks/useAudio';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import SpeedControl from './SpeedControl';

interface AudioPlayerProps {
  sermon: Sermon;
  onClose: () => void;
}

export default function AudioPlayer({ sermon, onClose }: AudioPlayerProps) {
  console.log('🎬 [AudioPlayer] Rendering with sermon:', sermon.title);
  const { play, pause, seek, setVolume, setPlaybackRate, skipForward, skipBackward, state } = useAudio(sermon.audio_url);

  console.log('📊 [AudioPlayer] Current state:', {
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    currentTime: state.currentTime,
    duration: state.duration,
    error: state.error
  });

  const handlePlayPause = () => {
    console.log('🎯 [AudioPlayer] Play/Pause button clicked! isPlaying:', state.isPlaying);
    if (state.isPlaying) {
      console.log('⏸️ [AudioPlayer] Calling pause()');
      pause();
    } else {
      console.log('▶️ [AudioPlayer] Calling play()');
      play();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: `Ascultă: ${sermon.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiat în clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary-dark to-primary z-50 flex flex-col">
      {/* Header with close and share */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-accent-light transition-colors shadow-lg"
        >
          <X className="w-6 h-6 text-primary-dark" />
        </button>
        <h3 className="text-white text-sm font-semibold">Redare Predică</h3>
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-accent-light transition-colors shadow-lg"
        >
          <Share2 className="w-5 h-5 text-primary-dark" />
        </button>
      </div>

      {/* Spotify-style player layout */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-6xl mx-auto w-full">

        {/* Main content area - Spotify style horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Left: Album Art */}
          <div className="flex justify-center md:justify-start">
            <div className="w-64 h-64 md:w-72 md:h-72 bg-white bg-opacity-10 rounded-2xl overflow-hidden shadow-2xl">
              {sermon.image ? (
                <img
                  src={sermon.image}
                  alt={sermon.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-1/2 h-1/2 text-accent opacity-80"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L12 22M2 12L22 12M6 6L12 2L18 6M6 18L12 22L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Center/Right: Song Info */}
          <div className="md:col-span-2 flex flex-col justify-center text-center md:text-left">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {sermon.title}
            </h1>
            <p className="text-accent text-lg font-semibold mb-2">
              {sermon.category}
            </p>
            {sermon.subcategory && (
              <p className="text-white text-opacity-70 text-sm mb-3">
                {sermon.subcategory}
              </p>
            )}
            {sermon.gospelReading && (
              <p className="text-accent text-sm">
                📖 {sermon.gospelReading}
              </p>
            )}
            {sermon.description && (
              <p className="text-white text-opacity-60 text-sm mt-4 max-w-2xl">
                {sermon.description}
              </p>
            )}
          </div>
        </div>

        {/* Bottom controls area - Spotify style */}
        <div className="space-y-4">

          {/* Progress bar - full width like Spotify */}
          <ProgressBar
            currentTime={state.currentTime}
            duration={state.duration}
            onSeek={seek}
          />

          {/* Controls row - Spotify style: Volume | Controls | Extra */}
          <div className="grid grid-cols-3 gap-4 items-center">

            {/* Left: Volume (like Spotify) */}
            <div className="hidden md:block">
              <VolumeControl
                volume={state.volume}
                onVolumeChange={setVolume}
              />
            </div>

            {/* Center: Playback controls */}
            <div className="col-span-3 md:col-span-1">
              <PlayerControls
                isPlaying={state.isPlaying}
                isLoading={state.isLoading}
                onPlayPause={handlePlayPause}
                onSkipForward={() => skipForward(15)}
                onSkipBackward={() => skipBackward(15)}
              />
            </div>

            {/* Right: Speed control and extra info */}
            <div className="hidden md:flex justify-end items-center gap-3">
              <SpeedControl
                playbackRate={state.playbackRate}
                onSpeedChange={setPlaybackRate}
              />
              {sermon.duration && (
                <span className="text-white text-opacity-60 text-sm">
                  Durată: {sermon.duration}
                </span>
              )}
            </div>
          </div>

          {/* Mobile speed control */}
          <div className="md:hidden flex justify-center">
            <SpeedControl
              playbackRate={state.playbackRate}
              onSpeedChange={setPlaybackRate}
            />
          </div>

          {/* Error message */}
          {state.error && (
            <div className="text-center text-red-300 text-sm font-semibold bg-red-900 bg-opacity-30 rounded-lg py-3 px-4">
              ⚠️ {state.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
