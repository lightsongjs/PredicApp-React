import { Home, BookOpen, GraduationCap, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Library', icon: BookOpen, path: '/library' },
    { name: 'Courses', icon: GraduationCap, path: '/courses' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg md:hidden z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-text opacity-50 hover:opacity-70'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-primary' : ''}`} />
              <span className="text-xs mt-1 font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
