import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { MiniPlayer } from '../player/MiniPlayer';
import { ExpandedPlayer } from '../player/ExpandedPlayer';
import { useAudioContext } from '../../context/AudioContext';

export default function Layout() {
  const { currentSermon } = useAudioContext();
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <Header />
      <main className="pb-24 md:pb-8">
        <Outlet />
      </main>
      {/* Bottom nav only on mobile */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Mini Player - Global */}
      {currentSermon && !isPlayerExpanded && (
        <MiniPlayer onExpand={() => setIsPlayerExpanded(true)} />
      )}

      {/* Expanded Player - Global */}
      {currentSermon && isPlayerExpanded && (
        <ExpandedPlayer onCollapse={() => setIsPlayerExpanded(false)} />
      )}
    </div>
  );
}
