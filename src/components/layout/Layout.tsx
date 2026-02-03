import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      <Header />
      <main className="pb-32">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
