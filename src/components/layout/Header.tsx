import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

declare const __BUILD_TIME__: string;

function getTimeAgo(buildTime: string): string {
  const now = new Date();
  const built = new Date(buildTime);
  const diffMs = now.getTime() - built.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export default function Header() {
  const [showBuildInfo, setShowBuildInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const buildTime = __BUILD_TIME__;
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Acasă', path: '/', icon: 'home' },
    { name: 'Bibliotecă', path: '/library', icon: 'library_music' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF0]/95 ios-blur border-b border-primary/10">
      <div className="flex items-center p-4 justify-between max-w-7xl mx-auto gap-4">
        {/* Mobile: Hamburger Menu */}
        <button className="md:hidden text-primary flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-primary/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Desktop: Logo and Title */}
        <Link
          to="/"
          className="hidden md:flex items-center gap-3 cursor-pointer shrink-0"
          onMouseEnter={() => setShowBuildInfo(true)}
          onMouseLeave={() => setShowBuildInfo(false)}
        >
          <img src="/favicon.svg" alt="Orthodox Cross" className="w-10 h-10" />
          <div className="relative">
            <h1 className="font-serif text-xl font-bold text-primary">
              Predici Padre
            </h1>
            {showBuildInfo && (
              <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
                Built: {getTimeAgo(buildTime)}
              </div>
            )}
          </div>
        </Link>

        {/* Mobile: Logo and Title */}
        <Link
          to="/"
          className="md:hidden flex items-center gap-2 flex-1 justify-center cursor-pointer relative"
          onMouseEnter={() => setShowBuildInfo(true)}
          onMouseLeave={() => setShowBuildInfo(false)}
        >
          <img src="/favicon.svg" alt="Orthodox Cross" className="w-8 h-8" />
          <h2 className="text-primary text-xl font-serif font-bold leading-tight tracking-tight">
            Predici Padre
          </h2>
          {showBuildInfo && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 font-sans font-normal">
              Built: {getTimeAgo(buildTime)}
            </div>
          )}
        </Link>

        {/* Desktop: Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#432818]/70 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isActive ? 'filled' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop: Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#432818]/40 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Caută predici..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-primary/10 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-[#432818] text-sm"
            />
          </div>
        </form>

        {/* Right side icons */}
        <div className="flex items-center gap-1">
          {/* Mobile: Search Button */}
          <button
            className="md:hidden flex items-center justify-center rounded-full size-10 text-primary hover:bg-primary/5 transition-colors"
            onClick={() => setShowSearch(!showSearch)}
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          {/* Profile Icon */}
          <button className="flex items-center justify-center rounded-full size-10 bg-transparent text-primary hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>

      {/* Mobile: Expandable Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#432818]/40">
                search
              </span>
              <input
                type="text"
                placeholder="Caută predici..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-[#432818]"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
