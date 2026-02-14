import { useAudioContext } from '../../context/AudioContext';
import { formatTime } from '../../utils/time';

interface ExpandedPlayerProps {
  onCollapse: () => void;
}

// Default image for sermons without images
const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxfGYkpO8Nty6BU8HMTiF-5IIOI9JdPg9bvkSKLLEe-4av4X7IQ0eXjTm5SmPx9EYLknNj8prCQdMjbtb7rsppjNZKXKodk7S0iV5YsgzGxAnMMWuVIC1ch8Ic8Hi9I6Ry7J8RwabzcpUJSCi452jAOKdgXmsTQCbvt2yw302DL2UG4g-WnjyS5uq6ErijH0CFFEBkwXDKuxwcIlEqSeW6yoKDxgv9FGBORhyeYv4aEb5MNNBilKdtNI33Fh8c-p9zV0YSBGCHdde';

export function ExpandedPlayer({ onCollapse }: ExpandedPlayerProps) {
  const { currentSermon, state, play, pause, seek, cyclePlaybackRate } = useAudioContext();
  const { isPlaying, isLoading, currentTime, duration, knownDuration, playbackRate } = state;

  if (!currentSermon) return null;

  // Use knownDuration from sermon metadata if available (more reliable for opus files)
  const displayDuration = knownDuration > 0 ? knownDuration : duration;
  const progress = displayDuration > 0 ? (currentTime / displayDuration) * 100 : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const backgroundImage = currentSermon.image || defaultImage;

  return (
    <div className="fixed inset-0 bg-[#fdfbf7] z-50 flex flex-col animate-slide-up overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onCollapse}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl text-[#1a0f10]">expand_more</span>
        </button>
        <h2 className="text-sm font-semibold tracking-widest uppercase opacity-60 text-[#1a0f10]">Acum Redă</h2>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors">
          <span className="material-symbols-outlined text-2xl text-[#1a0f10]">share</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-8 pb-6 max-w-md mx-auto w-full justify-center">
        {/* Central Album Art */}
        <div className="mb-6 group">
          <div className="aspect-square w-full max-h-[40vh] rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] mx-auto" style={{ maxWidth: '40vh' }}>
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url("${backgroundImage}")` }}
            />
          </div>
        </div>

        {/* Sermon Title and Speaker */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl mb-1 text-[#1a0f10] leading-tight">{currentSermon.title}</h1>
          <p className="text-primary font-medium text-base opacity-80">{currentSermon.category || 'Predică'}</p>
        </div>

        {/* Progress Bar Section */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
            <input
              type="range"
              min="0"
              max={displayDuration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              style={{ margin: 0 }}
            />
            {/* Gold Progress with Glow */}
            <div
              className="absolute top-0 left-0 h-full bg-[#D4AF37] gold-glow rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold tracking-tighter opacity-50 uppercase text-[#1a0f10]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={cyclePlaybackRate}
            className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              playbackRate !== 1
                ? 'bg-[#1a0f10] text-[#fdfbf7]'
                : 'text-[#1a0f10]/60 hover:text-[#1a0f10] hover:bg-black/5'
            }`}
          >
            {playbackRate}x
          </button>

          <div className="flex items-center gap-8">
            <button className="hover:opacity-70 transition-opacity text-[#1a0f10]">
              <span className="material-symbols-outlined text-4xl">skip_previous</span>
            </button>

            <button
              onClick={handlePlayPause}
              className="size-20 bg-primary text-white rounded-full flex items-center justify-center play-btn-shadow hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-5xl">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>

            <button className="hover:opacity-70 transition-opacity text-[#1a0f10]">
              <span className="material-symbols-outlined text-4xl">skip_next</span>
            </button>
          </div>

          {/* Spacer to balance the speed button */}
          <div className="size-10" />
        </div>
      </main>

      {/* Minimal Home Indicator Area (iOS feel) */}
      <footer className="h-8 flex justify-center items-end pb-2">
        <div className="w-32 h-1 bg-black/10 rounded-full" />
      </footer>
    </div>
  );
}
