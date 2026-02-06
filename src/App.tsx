import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Player from './pages/Player';
import Library from './pages/Library';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="library" element={<Library />} />
            <Route path="search" element={<Navigate to="/library" replace />} />
            <Route path="player/:sermonId" element={<Player />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  );
}

export default App;
