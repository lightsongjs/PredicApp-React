import { useAudio } from '../../hooks/useAudio';
import type { Sermon } from '../../data/types';

interface MiniPlayerProps {
  sermon: Sermon;
  onExpand: () => void;
  onClose: () => void;
}

// Default image for sermons without images
const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZpk9fAfdmCcl-9QzxgEFdROTb9AeYxkD-dRG_C_cH05n3mJRonotdTV5YP_34sLDf5c_HhJp4nDXOiDzRbLjd7nxXMU_Y_FJuakJELPcZHXQIWrCm6lYhoj4ewacn8_PdIrAQ1N9p3IIpKkbNSHSixkgWt5w-pwwJox_VO5mjkAHEU4TZm1MScmigaU1EJ_mwrTUmTAWblLNgld3_DOYa6sGaEw6He8P9DHUdSC5NAHLE-rf1xem-N6J28I1M7_h90YNLUHptjzPt';

export function MiniPlayer({ sermon, onExpand, onClose }: MiniPlayerProps) {
  const { state, play, pause } = useAudio(sermon.audio_url);
  const { isPlaying, isLoading } = state;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const backgroundImage = sermon.image || defaultImage;

  return (
    <div className="fixed bottom-[72px] left-0 right-0 z-40 animate-slide-up">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Mini Player Container */}
        <div
          className="px-4 py-2 flex items-center gap-3 bg-primary/5 border border-primary/5 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={onExpand}
        >
          {/* Thumbnail */}
          <div
            className="size-10 rounded overflow-hidden flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
          />

          {/* Sermon Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-primary uppercase tracking-tighter">Acum se redă</p>
            <p className="text-sm font-semibold text-[#432818] truncate">{sermon.title}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              className="text-primary p-1 hover:bg-primary/10 rounded-full transition-colors"
              onClick={handlePlayPause}
            >
              {isLoading ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <span className="material-symbols-outlined">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>

            <button
              className="text-primary p-1 hover:bg-primary/10 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
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
