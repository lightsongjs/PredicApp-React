import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-serif text-2xl font-bold text-text mb-2">
          Pagina nu a fost găsită
        </h2>
        <p className="text-text opacity-60 mb-6">
          Ne pare rău, dar pagina pe care o cauți nu există.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          Înapoi la pagina principală
        </button>
      </div>
    </div>
  );
}
