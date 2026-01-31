import { useParams, useNavigate } from 'react-router-dom';
import { useSermon } from '../hooks/useSermon';
import AudioPlayer from '../components/player/AudioPlayer';

export default function Player() {
  const { sermonId } = useParams<{ sermonId: string }>();
  const navigate = useNavigate();
  const { sermon } = useSermon(sermonId);

  if (!sermon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-text mb-2">
            Predica nu a fost găsită
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    );
  }

  return <AudioPlayer sermon={sermon} onClose={() => navigate(-1)} />;
}
