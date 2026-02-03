import { useNavigate } from 'react-router-dom';
import { allSermons } from '../data/sermonLoader';
import SermonList from '../components/sermon/SermonList';
import type { Sermon } from '../data/types';

export default function Library() {
  const navigate = useNavigate();

  const handleSermonPlay = (sermon: Sermon) => {
    navigate(`/player/${sermon.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-text mb-2">
          Biblioteca
        </h1>
        <p className="text-text opacity-60">
          {allSermons.length} predici disponibile
        </p>
      </div>

      <div className="mb-6">
        <h2 className="font-serif text-xl font-bold text-text mb-4">
          Februarie 2026 - Triodion
        </h2>
        <SermonList sermons={allSermons} onSermonPlay={handleSermonPlay} />
      </div>
    </div>
  );
}
