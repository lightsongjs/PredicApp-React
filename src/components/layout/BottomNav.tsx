import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const tabs = [
    { name: 'Acasă', icon: 'home', path: '/' },
    { name: 'Bibliotecă', icon: 'library_music', path: '/library' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFBF0]/95 ios-blur border-t border-primary/10 z-40">
      <div className="max-w-[480px] mx-auto flex justify-around items-center py-2 px-6">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-[#432818]/40 hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-bold uppercase">{tab.name}</span>
            </Link>
          );
        })}
      </div>
      {/* iOS Home Indicator Spacer */}
      <div className="h-6" />
    </nav>
  );
}
