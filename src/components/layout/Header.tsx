import { useState } from 'react';
import { Church, Search, User } from 'lucide-react';

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
  const buildTime = __BUILD_TIME__;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div
          className="flex items-center gap-3 relative cursor-pointer"
          onMouseEnter={() => setShowBuildInfo(true)}
          onMouseLeave={() => setShowBuildInfo(false)}
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Church className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-primary">
              Predicile Părintelui
            </h1>
            <p className="text-xs text-text opacity-70">Biserica Ortodoxă</p>
          </div>
          {showBuildInfo && (
            <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
              Built: {getTimeAgo(buildTime)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-background rounded-full transition-colors">
            <Search className="w-5 h-5 text-text" />
          </button>
          <button className="p-2 hover:bg-background rounded-full transition-colors">
            <User className="w-5 h-5 text-text" />
          </button>
        </div>
      </div>
    </header>
  );
}
