import { useState } from 'react';
import { BookOpen, Headphones, Clock } from 'lucide-react';
import { allSermons, metadata } from '../data/sermonLoader';
import HeroSermonCard from '../components/sermon/HeroSermonCard';
import SermonList from '../components/sermon/SermonList';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { ExpandedPlayer } from '../components/player/ExpandedPlayer';
import type { Sermon } from '../data/types';
import {
  getThisSundaySermon,
  getNextSundaySermon,
  getLiturgicalSermons,
  formatDateRomanian,
} from '../utils/liturgicalCalendar';

export default function Home() {
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  // Get liturgical sermons for Sunday display
  const liturgicalSermons = getLiturgicalSermons(allSermons);
  const thisSunday = getThisSundaySermon(liturgicalSermons);
  const nextSunday = getNextSundaySermon(liturgicalSermons);

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

  const totalDurationMinutes = allSermons.reduce((acc, sermon) => {
    if (sermon.duration) {
      const [mins] = sermon.duration.split(':').map(Number);
      return acc + mins;
    }
    return acc;
  }, 0);

  const totalHours = Math.floor(totalDurationMinutes / 60);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Sermon - This Sunday */}
      <section>
        <div className="mb-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {thisSunday.label}
          </span>
          <span className="text-xs text-text opacity-60 ml-2">
            {formatDateRomanian(thisSunday.date)}
          </span>
        </div>
        <HeroSermonCard
          sermon={featuredSermon}
          onPlay={() => handleSermonPlay(featuredSermon)}
        />
      </section>

      {/* Next Sunday Preview */}
      {nextSunday.sermon && (
        <section className="bg-white rounded-xl p-4 shadow-sm border border-primary border-opacity-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {nextSunday.label}
              </span>
              <span className="text-xs text-text opacity-60 ml-2">
                {formatDateRomanian(nextSunday.date)}
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            onClick={() => handleSermonPlay(nextSunday.sermon!)}
          >
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-text truncate">
                {nextSunday.sermon.title}
              </h3>
              <p className="text-xs text-text opacity-60 mt-1">
                {nextSunday.sermon.duration}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Headphones className="w-6 h-6 text-primary" />
          </div>
          <div className="font-serif text-2xl font-bold text-text">
            {allSermons.length}
          </div>
          <div className="text-xs text-text opacity-60 mt-1">Predici</div>
        </div>

        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="w-12 h-12 bg-accent bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <div className="font-serif text-2xl font-bold text-text">
            {Object.keys(metadata.categories).length}
          </div>
          <div className="text-xs text-text opacity-60 mt-1">Categorii</div>
        </div>

        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div className="font-serif text-2xl font-bold text-text">
            {totalHours}+
          </div>
          <div className="text-xs text-text opacity-60 mt-1">Ore</div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-serif text-xl font-bold text-text mb-4">
          Categorii
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-primary border-opacity-10 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-serif font-bold text-text mb-1">Predici Liturgice</h3>
            <p className="text-xs text-text opacity-60">
              {metadata.categories.liturgical} predici
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-primary border-opacity-10 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-serif font-bold text-text mb-1">Cursuri</h3>
            <p className="text-xs text-text opacity-60">
              {metadata.categories.courses} predici
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-primary border-opacity-10 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">✝️</div>
            <h3 className="font-serif font-bold text-text mb-1">Sfinți</h3>
            <p className="text-xs text-text opacity-60">
              {metadata.categories.saints} predici
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-primary border-opacity-10 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-serif font-bold text-text mb-1">Tematice</h3>
            <p className="text-xs text-text opacity-60">
              {metadata.categories.topical} predici
            </p>
          </div>
        </div>
      </section>

      {/* Recent Sermons */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-text">
            Predici Recente
          </h2>
        </div>
        <SermonList sermons={recentSermons} onSermonPlay={handleSermonPlay} />
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
