import { useAudioContext } from '../../context/AudioContext';

interface MiniPlayerProps {
  onExpand: () => void;
}

// Default image for sermons without images
const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZpk9fAfdmCcl-9QzxgEFdROTb9AeYxkD-dRG_C_cH05n3mJRonotdTV5YP_34sLDf5c_HhJp4nDXOiDzRbLjd7nxXMU_Y_FJuakJELPcZHXQIWrCm6lYhoj4ewacn8_PdIrAQ1N9p3IIpKkbNSHSixkgWt5w-pwwJox_VO5mjkAHEU4TZm1MScmigaU1EJ_mwrTUmTAWblLNgld3_DOYa6sGaEw6He8P9DHUdSC5NAHLE-rf1xem-N6J28I1M7_h90YNLUHptjzPt';

export function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const { currentSermon, state, play, pause, closePlayer } = useAudioContext();
  const { isPlaying, isLoading, currentTime, duration } = state;

  if (!currentSermon) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const backgroundImage = currentSermon.image || defaultImage;

  return (
    <div className="fixed bottom-[72px] md:bottom-4 left-0 right-0 z-40 animate-slide-up">
      <div className="max-w-[480px] md:max-w-md mx-auto px-4">
        {/* Mini Player Container - Solid background */}
        <div
          className="px-4 py-3 flex items-center gap-3 bg-white border border-primary/20 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={onExpand}
        >
          {/* Thumbnail */}
          <div
            className="size-12 rounded-lg overflow-hidden flex-shrink-0 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
          />

          {/* Sermon Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Acum se redă</p>
            <p className="text-sm font-semibold text-[#432818] truncate">{currentSermon.title}</p>
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              className="text-primary p-2 hover:bg-primary/10 rounded-full transition-colors"
              onClick={handlePlayPause}
            >
              {isLoading ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <span className="material-symbols-outlined text-2xl">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>

            <button
              className="text-[#432818]/60 p-2 hover:bg-primary/10 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                closePlayer();
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
