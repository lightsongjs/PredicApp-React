import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { allSermons } from '../data/sermonLoader';
import SermonList from '../components/sermon/SermonList';
import type { Sermon } from '../data/types';
import sermonLibrary from '../../complete-sermon-library.json';

interface CategoryData {
  name: string;
  description?: string;
  count: number;
}

interface SermonLibrary {
  metadata: {
    categories: Record<string, number>;
  };
  categories: Record<string, CategoryData>;
}

const library = sermonLibrary as unknown as SermonLibrary;

// Category display names
const categoryNames: Record<string, string> = {
  liturgical: 'Predici Liturgice',
  courses: 'Cursuri',
  saints: 'Sfinți',
  topical: 'Tematice',
  archived: 'Arhivă',
};

export default function Library() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sermons by category and search
  const filteredSermons = useMemo(() => {
    let sermons = allSermons;

    // Filter by category
    if (selectedCategory && categoryNames[selectedCategory]) {
      const categoryName = categoryNames[selectedCategory];
      sermons = sermons.filter(s => s.category === categoryName);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sermons = sermons.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    return sermons;
  }, [selectedCategory, searchQuery]);

  const handleSermonPlay = (sermon: Sermon) => {
    navigate(`/player/${sermon.id}`);
  };

  const handleCategoryClick = (category: string | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // Get available categories with counts
  const categories = Object.entries(library.metadata.categories)
    .filter(([key]) => key !== 'archived')
    .map(([key, count]) => ({
      key,
      name: categoryNames[key] || key,
      count,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#432818] mb-2">
          Biblioteca
        </h1>
        <p className="text-[#432818]/60">
          {filteredSermons.length} predici {selectedCategory ? `în ${categoryNames[selectedCategory]}` : 'disponibile'}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#432818]/40">
            search
          </span>
          <input
            type="text"
            placeholder="Caută predici..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-[#432818]"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary text-white'
              : 'bg-white border border-primary/20 text-[#432818] hover:bg-primary/5'
          }`}
        >
          Toate ({allSermons.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-primary text-white'
                : 'bg-white border border-primary/20 text-[#432818] hover:bg-primary/5'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Breadcrumb when category is selected */}
      {selectedCategory && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link to="/library" className="text-primary hover:underline">
            Biblioteca
          </Link>
          <span className="text-[#432818]/40">/</span>
          <span className="text-[#432818]">{categoryNames[selectedCategory]}</span>
        </div>
      )}

      {/* Sermon List */}
      <div className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden">
        {filteredSermons.length > 0 ? (
          <SermonList sermons={filteredSermons} onSermonPlay={handleSermonPlay} />
        ) : (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-[#432818]/20 mb-4">search_off</span>
            <p className="text-[#432818]/60">Nu am găsit predici care să corespundă căutării.</p>
          </div>
        )}
      </div>
    </div>
  );
}
