import { useState } from 'react';
import { allSermons, metadata } from '../data/sermonLoader';
import HeroSermonCard from '../components/sermon/HeroSermonCard';
import SermonList from '../components/sermon/SermonList';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { ExpandedPlayer } from '../components/player/ExpandedPlayer';
import type { Sermon } from '../data/types';
import {
  getThisSundaySermon,
  getLiturgicalSermons,
  formatDateRomanian,
} from '../utils/liturgicalCalendar';

// Default series images
const seriesImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBdssHCXdE_t6Cg9gdQ40rFFVJ1IhhwS6ICNJf5D54MDOpWTTR8_BikFrz21r5KFcZr4URRQWiNdTivtnkeyrwneKTIEQ70ahu56byJmST_87dSY3pvEfAc_cJ4yC5d0-Uo6Ao97css0UgVm44IDpb5TWbLelraZS2tSUSnB-K3gTFtfk3laPPjw-BsyU0gcbokowxDMN8cCippu64Pf1EOpFRo4a7JToFdIvtilmo_u9zwoSbT-gUzXV3MvVAldEhSbOvm3tDygkZb',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAdBLQ8DF-TTTmqXoYidk8Z5KlOVa8mBzLuOWI-YW0nuo9LlTzTfcSjBCiE4bqaifzpZpx4swDIRqwHAssV48w1S9YXswQLkHN8uNGSpE8bFYoxUZsocmA3RBO-vOM49yTsg8x2nBmHm1jvJQLpeHuy8WqC9ZpZfu9yabeG3j3MM_76lWPi6GUtAdjJRobTK0Uu221AAZEIjuOvnYNI9XoLeRGz0qJ2gBgCZ0yN6isEG-h8b5osfhUsEB0LVn65Nt7UkZYUYXypuRE2',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlPn82SqThmfdJV7B_sZ6mfBkziIP0t_qicFZ6Pxv1c9Otl5CjEJAajxqW1a_kyb6MNTBLVqTRpzxVD0yLPbIzsDEZwOv9PNNpXUB9tV1QTUzKiY9X72RUs0pAnoenz0rwV8AaCHb58O9uNNe1cIsqaN7EWkG4_bj-UBa6RbVLyLDZUAsr3KZmTo-DCejzmkyAw2G-X9OmGoOBNR_kj6xt2QLw_u4dzXjftGk8tdjea-e6rA6hJH97amv6edYvH-o4dNZ0l99MqoGR',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxfGYkpO8Nty6BU8HMTiF-5IIOI9JdPg9bvkSKLLEe-4av4X7IQ0eXjTm5SmPx9EYLknNj8prCQdMjbtb7rsppjNZKXKodk7S0iV5YsgzGxAnMMWuVIC1ch8Ic8Hi9I6Ry7J8RwabzcpUJSCi452jAOKdgXmsTQCbvt2yw302DL2UG4g-WnjyS5uq6ErijH0CFFEBkwXDKuxwcIlEqSeW6yoKDxgv9FGBORhyeYv4aEb5MNNBilKdtNI33Fh8c-p9zV0YSBGCHdde',
];

export default function Home() {
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  // Get liturgical sermons for Sunday display
  const liturgicalSermons = getLiturgicalSermons(allSermons);
  const thisSunday = getThisSundaySermon(liturgicalSermons);

  // Featured sermon is this Sunday's sermon
  const featuredSermon = thisSunday.sermon || allSermons[0];
  // Recent sermons exclude the featured one
  const recentSermons = allSermons.filter(s => s.id !== featuredSermon?.id).slice(0, 10);

  const handleSermonPlay = (sermon: Sermon) => {
    setCurrentSermon(sermon);
    setIsPlayerExpanded(false);
  };

  const handleClosePlayer = () => {
    setCurrentSermon(null);
    setIsPlayerExpanded(false);
  };

  // Categories for the carousel
  const categories = [
    { name: 'Postul Mare', count: metadata.categories.liturgical, image: seriesImages[0] },
    { name: 'Parabole', count: 8, image: seriesImages[1] },
    { name: 'Cartea Psalmilor', count: 24, image: seriesImages[2] },
    { name: 'Sfinți', count: metadata.categories.saints, image: seriesImages[3] },
  ];

  return (
    <div className="max-w-[480px] mx-auto pb-32">
      {/* Hero Sermon - This Sunday */}
      <section className="p-4">
        <div className="mb-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {thisSunday.label}
          </span>
          <span className="text-xs text-[#432818] opacity-60 ml-2">
            {formatDateRomanian(thisSunday.date)}
          </span>
        </div>
        <HeroSermonCard
          sermon={featuredSermon}
          onPlay={() => handleSermonPlay(featuredSermon)}
        />
      </section>

      {/* Series Carousel */}
      <section>
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <h3 className="text-[#432818] text-lg font-serif font-bold">Serii de Predici</h3>
          <button className="text-primary text-sm font-semibold">Vezi toate</button>
        </div>
        <div className="flex overflow-x-auto snap-x scrollbar-hide px-4 gap-4 pb-4">
          {categories.map((category, index) => (
            <div key={index} className="snap-start flex-none w-44 space-y-3 cursor-pointer">
              <div
                className="aspect-square rounded-xl bg-cover bg-center shadow-md relative group border border-[#D4AF37]/20"
                style={{ backgroundImage: `url("${category.image}")` }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/0 group-hover:text-white/100 text-3xl transition-opacity">folder_open</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-sm text-[#432818] truncate">{category.name}</p>
                <p className="text-xs text-primary/60">{category.count} Predici</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Sermons */}
      <section>
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-[#432818] text-xl font-serif font-bold">Sermone Recente</h2>
          <button className="text-primary text-sm font-semibold">Vezi toate</button>
        </div>
        <div className="mt-2 space-y-1">
          <SermonList sermons={recentSermons} onSermonPlay={handleSermonPlay} />
        </div>
      </section>

      {/* Mini Player */}
      {currentSermon && !isPlayerExpanded && (
        <MiniPlayer
          sermon={currentSermon}
          onExpand={() => setIsPlayerExpanded(true)}
          onClose={handleClosePlayer}
        />
      )}

      {/* Expanded Player */}
      {currentSermon && isPlayerExpanded && (
        <ExpandedPlayer
          sermon={currentSermon}
          onCollapse={() => setIsPlayerExpanded(false)}
        />
      )}
    </div>
  );
}
