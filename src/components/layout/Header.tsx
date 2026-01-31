import { Church, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Church className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-primary">
              Predicile Părintelui
            </h1>
            <p className="text-xs text-text opacity-70">Biserica Ortodoxă</p>
          </div>
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
