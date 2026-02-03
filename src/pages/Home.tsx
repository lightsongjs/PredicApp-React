import { useState } from 'react';
import { Link } from 'react-router-dom';
import { allSermons, metadata } from '../data/sermonLoader';
import HeroSermonCard from '../components/sermon/HeroSermonCard';
import SermonList from '../components/sermon/SermonList';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { ExpandedPlayer } from '../components/player/ExpandedPlayer';
import type { Sermon } from '../data/types';
import {
  getThisSundaySermon,
  getLiturgicalSermons,
  getUpcomingSermons,
  findRelatedSermons,
  formatDateRomanian,
} from '../utils/liturgicalCalendar';

// Category data with images
const categoryData = [
  {
    key: 'liturgical',
    name: 'Predici Liturgice',
    description: 'Predici pentru duminici și sărbători',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdssHCXdE_t6Cg9gdQ40rFFVJ1IhhwS6ICNJf5D54MDOpWTTR8_BikFrz21r5KFcZr4URRQWiNdTivtnkeyrwneKTIEQ70ahu56byJmST_87dSY3pvEfAc_cJ4yC5d0-Uo6Ao97css0UgVm44IDpb5TWbLelraZS2tSUSnB-K3gTFtfk3laPPjw-BsyU0gcbokowxDMN8cCippu64Pf1EOpFRo4a7JToFdIvtilmo_u9zwoSbT-gUzXV3MvVAldEhSbOvm3tDygkZb',
  },
  {
    key: 'courses',
    name: 'Cursuri',
    description: 'Cursuri și serii tematice',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdBLQ8DF-TTTmqXoYidk8Z5KlOVa8mBzLuOWI-YW0nuo9LlTzTfcSjBCiE4bqaifzpZpx4swDIRqwHAssV48w1S9YXswQLkHN8uNGSpE8bFYoxUZsocmA3RBO-vOM49yTsg8x2nBmHm1jvJQLpeHuy8WqC9ZpZfu9yabeG3j3MM_76lWPi6GUtAdjJRobTK0Uu221AAZEIjuOvnYNI9XoLeRGz0qJ2gBgCZ0yN6isEG-h8b5osfhUsEB0LVn65Nt7UkZYUYXypuRE2',
  },
  {
    key: 'saints',
    name: 'Sfinți',
    description: 'Predici despre sfinți',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlPn82SqThmfdJV7B_sZ6mfBkziIP0t_qicFZ6Pxv1c9Otl5CjEJAajxqW1a_kyb6MNTBLVqTRpzxVD0yLPbIzsDEZwOv9PNNpXUB9tV1QTUzKiY9X72RUs0pAnoenz0rwV8AaCHb58O9uNNe1cIsqaN7EWkG4_bj-UBa6RbVLyLDZUAsr3KZmTo-DCejzmkyAw2G-X9OmGoOBNR_kj6xt2QLw_u4dzXjftGk8tdjea-e6rA6hJH97amv6edYvH-o4dNZ0l99MqoGR',
  },
  {
    key: 'topical',
    name: 'Tematice',
    description: 'Predici pe teme specifice',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxfGYkpO8Nty6BU8HMTiF-5IIOI9JdPg9bvkSKLLEe-4av4X7IQ0eXjTm5SmPx9EYLknNj8prCQdMjbtb7rsppjNZKXKodk7S0iV5YsgzGxAnMMWuVIC1ch8Ic8Hi9I6Ry7J8RwabzcpUJSCi452jAOKdgXmsTQCbvt2yw302DL2UG4g-WnjyS5uq6ErijH0CFFEBkwXDKuxwcIlEqSeW6yoKDxgv9FGBORhyeYv4aEb5MNNBilKdtNI33Fh8c-p9zV0YSBGCHdde',
  },
];

export default function Home() {
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  // Get liturgical sermons for Sunday display
  const liturgicalSermons = getLiturgicalSermons(allSermons);
  const thisSunday = getThisSundaySermon(liturgicalSermons);

  // Featured sermon is this Sunday's sermon
  const featuredSermon = thisSunday.sermon || allSermons[0];

  // Find related sermons (same theme from different years)
  const relatedSermons = featuredSermon
    ? findRelatedSermons(allSermons, featuredSermon).slice(0, 5)
    : [];

  // Get upcoming liturgical sermons
  const upcomingSermons = getUpcomingSermons(liturgicalSermons, 10);

  const handleSermonPlay = (sermon: Sermon) => {
    setCurrentSermon(sermon);
    setIsPlayerExpanded(false);
  };

  const handleClosePlayer = () => {
    setCurrentSermon(null);
    setIsPlayerExpanded(false);
  };

  // Get category counts
  const categories = categoryData.map(cat => ({
    ...cat,
    count: metadata.categories[cat.key] || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-32 md:pb-8">
      {/* Desktop: Two Column Layout */}
      <div className="md:grid md:grid-cols-12 md:gap-8 md:py-6">
        {/* Left Column - Hero and Categories */}
        <div className="md:col-span-7 lg:col-span-8">
          {/* Hero Sermon - This Sunday */}
          <section className="py-4 md:py-0">
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

          {/* Related Sermons - Same theme from different years */}
          {relatedSermons.length > 1 && (
            <section className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#432818] text-lg md:text-xl font-serif font-bold">
                  Alte Înregistrări pe Această Temă
                </h3>
              </div>
              <div className="bg-white rounded-xl border border-primary/10 overflow-hidden">
                {relatedSermons.slice(1).map((sermon) => (
                  <div
                    key={sermon.id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-primary/5 transition-colors cursor-pointer border-b border-primary/5 last:border-b-0"
                    onClick={() => handleSermonPlay(sermon)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[#432818] text-sm font-semibold truncate">{sermon.title}</p>
                      <p className="text-[#432818]/60 text-xs mt-0.5">
                        {sermon.year && `Înregistrat în ${sermon.year}`} • {sermon.duration}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center size-10 rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-xl">play_arrow</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Series/Categories */}
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#432818] text-lg md:text-xl font-serif font-bold">Categorii</h3>
              <Link to="/library" className="text-primary text-sm font-semibold hover:underline">
                Vezi toate
              </Link>
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden flex overflow-x-auto snap-x scrollbar-hide gap-4 pb-4 -mx-4 px-4">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  to={`/library?category=${category.key}`}
                  className="snap-start flex-none w-44 space-y-3"
                >
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
                </Link>
              ))}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  to={`/library?category=${category.key}`}
                  className="group"
                >
                  <div
                    className="aspect-square rounded-xl bg-cover bg-center shadow-md relative border border-[#D4AF37]/20 mb-3"
                    style={{ backgroundImage: `url("${category.image}")` }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/0 group-hover:text-white/100 text-3xl transition-opacity">folder_open</span>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-[#432818] truncate">{category.name}</p>
                  <p className="text-xs text-primary/60">{category.count} Predici</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Upcoming Liturgical Sermons */}
        <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
          <section className="md:bg-white md:rounded-2xl md:shadow-lg md:border md:border-primary/10 md:overflow-hidden">
            <div className="flex items-center justify-between px-0 md:px-4 pt-4 md:pt-5 pb-2">
              <h2 className="text-[#432818] text-xl font-serif font-bold">Predici Viitoare</h2>
              <Link to="/library?category=liturgical" className="text-primary text-sm font-semibold hover:underline">
                Vezi toate
              </Link>
            </div>
            <p className="text-[#432818]/60 text-xs px-0 md:px-4 mb-3">
              Pregătește-te pentru duminicile următoare
            </p>
            <div className="space-y-1 md:max-h-[600px] md:overflow-y-auto">
              <SermonList sermons={upcomingSermons} onSermonPlay={handleSermonPlay} />
            </div>
          </section>
        </div>
      </div>

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
