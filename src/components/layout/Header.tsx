import { useState } from 'react';

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
    <header className="sticky top-0 z-50 bg-[#FFFBF0]/95 ios-blur border-b border-primary/10">
      <div className="flex items-center p-4 justify-between max-w-[480px] mx-auto">
        {/* Hamburger Menu */}
        <button className="text-primary flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-primary/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Centered Title */}
        <h2
          className="text-primary text-xl font-serif font-bold leading-tight tracking-tight flex-1 text-center cursor-pointer relative"
          onMouseEnter={() => setShowBuildInfo(true)}
          onMouseLeave={() => setShowBuildInfo(false)}
        >
          Predicile Părintelui
          {showBuildInfo && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 font-sans font-normal">
              Built: {getTimeAgo(buildTime)}
            </div>
          )}
        </h2>

        {/* Profile Icon */}
        <button className="flex items-center justify-center rounded-full size-10 bg-transparent text-primary hover:bg-primary/5 transition-colors">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
