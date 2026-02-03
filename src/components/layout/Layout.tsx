import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout() {
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
    </div>
  );
}
