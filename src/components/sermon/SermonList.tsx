import type { Sermon } from '../../data/types';
import SermonCard from './SermonCard';

interface SermonListProps {
  sermons: Sermon[];
  onSermonPlay: (sermon: Sermon) => void;
}

export default function SermonList({ sermons, onSermonPlay }: SermonListProps) {
  return (
    <div className="space-y-3">
      {sermons.map((sermon) => (
        <SermonCard
          key={sermon.id}
          sermon={sermon}
          onPlay={() => onSermonPlay(sermon)}
        />
      ))}
    </div>
  );
}
