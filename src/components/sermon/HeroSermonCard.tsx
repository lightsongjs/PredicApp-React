import type { Sermon } from '../../data/types';

interface HeroSermonCardProps {
  sermon: Sermon;
  onPlay: () => void;
  relatedSermons?: Sermon[];
  onRelatedPlay?: (sermon: Sermon) => void;
}

export default function HeroSermonCard({ sermon, onPlay, relatedSermons = [], onRelatedPlay }: HeroSermonCardProps) {
  // Default Byzantine icon if sermon doesn't have one
  const sermonImage = sermon.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzSBbPQtWbGTySS5VBFd0eFMXU_-XglPITi1prQRByCBJQLpwPReVm5tUnH7RiWGkaieo4YxkP6DE5nVPSAW9c-xRIdcE-aBufsp9mb2rIhorvPtIEF1hHJ5FYTV2gqNLBWNcP8kWMpnuAzVjRYqkPXkAQg7o0qPrIGe58ICU8k8eC6_WmJiihy4g17rPDcj5W7Kg2PTns5NoHMkdfW45Pm69VSrE-P2ecgs84YNgaLYqo0B3EmgzjEy9XgblqmObPSHAe9ZH94_zW';

  // Extract the actual recording name from the audio URL
  const recordingName = (() => {
    try {
      const url = new URL(sermon.audio_url);
      const filename = decodeURIComponent(url.pathname.split('/').pop() || '');
      return filename.replace(/\.opus$/, '');
    } catch {
      return '';
    }
  })();

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white border border-[#D4AF37]/20">
      {/* Main Content - Compact horizontal layout */}
      <div className="flex items-start gap-4 p-4">
        {/* Left: Title and Info */}
        <div className="flex-1 min-w-0">
          <span className="inline-block bg-[#D4AF37] text-[#432818] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest mb-2">
            Duminica de Astăzi
          </span>
          {sermon.gospelReading && (
            <p className="text-primary/70 text-xs font-semibold uppercase tracking-wider mb-1">
              {sermon.gospelReading}
            </p>
          )}
          <h2 className="text-[#432818] text-lg md:text-xl font-serif font-bold leading-tight mb-2">
            {sermon.title}
          </h2>
          {recordingName && (
            <p className="text-[#432818]/80 text-sm mb-1">
              {recordingName}
            </p>
          )}
          <p className="text-[#432818]/60 text-xs mb-3">
            {sermon.duration}
          </p>
          <button
            onClick={onPlay}
            className="flex items-center justify-center gap-2 rounded-full h-10 px-5 bg-primary text-white text-sm font-bold shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            <span>Ascultă Acum</span>
          </button>
        </div>

        {/* Right: Small Icon/Image */}
        <div
          className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl bg-cover bg-center shadow-md border border-[#D4AF37]/20"
          style={{ backgroundImage: `url("${sermonImage}")` }}
        />
      </div>

      {/* Related Sermons - Same theme from different years */}
      {relatedSermons.length > 0 && (
        <div className="border-t border-primary/10">
          <div className="px-4 py-3 bg-primary/5">
            <h3 className="text-[#432818] text-sm font-semibold">
              Alte Înregistrări pe Această Temă
            </h3>
          </div>
          <div className="divide-y divide-primary/5">
            {relatedSermons.map((related) => (
              <div
                key={related.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={() => onRelatedPlay?.(related)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#432818] text-sm font-medium truncate">{related.title}</p>
                  <p className="text-[#432818]/60 text-xs mt-0.5">
                    {related.year && `${related.year}`} • {related.duration}
                  </p>
                </div>
                <div className="shrink-0 group/btn flex items-center justify-center size-9 rounded-full border border-primary/20 bg-white hover:bg-primary transition-all">
                  <span className="material-symbols-outlined text-lg text-primary group-hover/btn:text-white transition-colors">play_arrow</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
