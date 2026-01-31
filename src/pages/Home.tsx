import { useState } from 'react';
import { BookOpen, Headphones, Clock } from 'lucide-react';
import { allSermons } from '../data/sermons';
import HeroSermonCard from '../components/sermon/HeroSermonCard';
import SermonList from '../components/sermon/SermonList';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { ExpandedPlayer } from '../components/player/ExpandedPlayer';
import type { Sermon } from '../data/types';

export default function Home() {
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  const featuredSermon = allSermons[0];
  const recentSermons = allSermons.slice(1);

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
      {/* Hero Sermon */}
      <section>
        <HeroSermonCard
          sermon={featuredSermon}
          onPlay={() => handleSermonPlay(featuredSermon)}
        />
      </section>

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
          <div className="font-serif text-2xl font-bold text-text">3</div>
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

      {/* Recent Sermons */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-text">
            Predici Recente
          </h2>
        </div>
        <SermonList sermons={recentSermons} onSermonPlay={handleSermonPlay} />
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-serif text-xl font-bold text-text mb-4">
          Categorii
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-primary border-opacity-10 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-serif font-bold text-text mb-1">Triodion</h3>
            <p className="text-xs text-text opacity-60">
              {allSermons.length} predici
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-primary border-opacity-10 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">✝️</div>
            <h3 className="font-serif font-bold text-text mb-1">Liturgice</h3>
            <p className="text-xs text-text opacity-60">
              {allSermons.length} predici
            </p>
          </div>
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
