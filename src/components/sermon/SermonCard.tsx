import type { Sermon } from '../../data/types';

interface SermonCardProps {
  sermon: Sermon;
  onPlay: () => void;
}

// Default Byzantine icon images for sermons
const defaultImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDDiJxOj7gWBBcKS4xbBjNqYrSzTrtphXKeuAZb8fuJ5BP98zGf6f2IEDJcP0ED8ZpNFJ3PtBEi4jXuDkP228a6zM_RnmnwvXzb3EQnryiqneFnMfqxivpDNaQrfKcban3n3BwlLpRLoFbTJ1_BVexlxz2pLMv6RdEQoOgojvh_7ZfpPq3vXyVhAx0MFQi9kQRPotsObg0cU0Ebh_kBhpqpC7LShYzMzlS9pf6J2ek8LzLn7UQSfRHqfG6T04BtPPVAS3fI2-kuik3P',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAMI0MZXlHHUjEmwKL-PV-Hm21lchc44GyxprWSYb4pOnHaZKc18MP783yumfAQsW_FnlAUFbNdFcDvK8DnxcJnojwCSzHd6CZ20LZIZX_Le998JYioQ4rGrk-wprmz_1HuH42nj6fefdxkPfnixwpbpm8MBpv5xl4AFKT9mYtp-NqxLdinwQYtpZZX4s0T8bIaSEOGIFFrGZ2pYgX8gUW84yJ7GyPvkEAbK2OesM7jnksE_FFIl7HjPHoveJAQ74NzW7p6pldgji0W',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBNQz5qDJA910i4WOzPwO3Ds7ZqBsMHOWQSdKn9Q3NNgkZQ2CE8rUC59hzUbmjBRZJ7G5KgYjlwYIfSiTZBC_AjoHHEp1HtsX8_tftVPpfMyhXFdj1iGtVKEM7OjjZaqCXwJCtpW-q2pmjZ721IwOhXOpeHsC2s8Qz99-6WlFkLOV_ap2WklBpQFdHvX95ImulKnblGpJw3SNxDS9-Et61s4YkY2dQurH9b6aTGkYm9cs2mS4Gkut8X--R-zh23BbF32rByiNRg0LNv',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDie2w5Yj6rY1CwY4fA-rEAh0_lJMdPnr7O5NJwjNbR1IKcnRE7ahrX0LiAx3bJ7VoFd3X10ouOrEeUlds94O1SJJAdaoajtzDe_xQcWH-6NSfXQvwwgLmjbiHiADPlTa6L8Ie8lC3iJZEQOGg9g3S2hym5q_RIhsuZTe1SIUu6odcw6KErFqFyRVI4HcvQIL5n0mDRrp980mvTLBxIot5EdBNR5NWuMi21zj7CaU_2KAGLUzsvpTeT4047bMEwFbc-FNjCYk7ZVuvB',
];

export default function SermonCard({ sermon, onPlay }: SermonCardProps) {
  // Use sermon image or pick a random default based on sermon id
  const imageIndex = sermon.id ? sermon.id.charCodeAt(0) % defaultImages.length : 0;
  const backgroundImage = sermon.image || defaultImages[imageIndex];

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 hover:bg-primary/5 transition-colors cursor-pointer group"
      onClick={onPlay}
    >
      {/* Thumbnail Image */}
      <div
        className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shadow-sm flex-shrink-0"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors rounded-lg" />
      </div>

      {/* Sermon Info */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <p className="text-[#432818] text-base font-semibold leading-tight line-clamp-1">
          {sermon.title}
        </p>
        <p className="text-[#432818]/60 text-xs font-medium mt-1 uppercase tracking-wide">
          {sermon.category} {sermon.duration && `• ${sermon.duration}`}
        </p>
      </div>

      {/* Play Button */}
      <div className="play-btn shrink-0 flex items-center justify-center size-10 rounded-full border border-primary/20 bg-white group-hover:bg-primary transition-all">
        <span className="material-symbols-outlined text-[24px] text-primary transition-colors">play_arrow</span>
      </div>
    </div>
  );
}
