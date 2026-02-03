import type { Sermon } from '../../data/types';

interface HeroSermonCardProps {
  sermon: Sermon;
  onPlay: () => void;
}

export default function HeroSermonCard({ sermon, onPlay }: HeroSermonCardProps) {
  // Default Byzantine image if sermon doesn't have one
  const backgroundImage = sermon.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzSBbPQtWbGTySS5VBFd0eFMXU_-XglPITi1prQRByCBJQLpwPReVm5tUnH7RiWGkaieo4YxkP6DE5nVPSAW9c-xRIdcE-aBufsp9mb2rIhorvPtIEF1hHJ5FYTV2gqNLBWNcP8kWMpnuAzVjRYqkPXkAQg7o0qPrIGe58ICU8k8eC6_WmJiihy4g17rPDcj5W7Kg2PTns5NoHMkdfW45Pm69VSrE-P2ecgs84YNgaLYqo0B3EmgzjEy9XgblqmObPSHAe9ZH94_zW';

  return (
    <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden shadow-lg bg-white border border-[#D4AF37]/20">
      {/* Image with Gradient Overlay */}
      <div
        className="relative w-full aspect-[16/10] bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="bg-[#D4AF37] text-[#432818] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
            Duminica de Astăzi
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex w-full flex-col items-stretch justify-center gap-1 p-5">
        {sermon.gospelReading && (
          <p className="text-primary/70 text-sm font-semibold uppercase tracking-wider">
            Evanghelia zilei
          </p>
        )}
        <p className="text-[#432818] text-2xl font-serif font-bold leading-tight">
          {sermon.title}
        </p>
        <div className="flex items-center gap-3 justify-between mt-3">
          <p className="text-[#432818]/60 text-sm font-medium">
            {sermon.duration && `${sermon.duration} • `}Predica de la Sfânta Liturghie
          </p>
          <button
            onClick={onPlay}
            className="flex min-w-[120px] items-center justify-center gap-2 rounded-full h-10 px-5 bg-primary text-white text-sm font-bold shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            <span className="truncate">Ascultă Acum</span>
          </button>
        </div>
      </div>
    </div>
  );
}
