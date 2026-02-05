import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { allSermons, allSeries } from '../data/sermonLoader';
import { useAudioContext } from '../context/AudioContext';
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

// Normalize Romanian diacritics for search
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ăâ]/g, 'a')
    .replace(/[î]/g, 'i')
    .replace(/[șş]/g, 's')
    .replace(/[țţ]/g, 't');
}

// Natural sort: compare strings so embedded numbers sort numerically
// e.g. "Duminica a 3-a" < "Duminica a 27-a" < "Duminica a 29-a" < "Duminica a 30-a"
function naturalCompare(a: string, b: string): number {
  const ax = a.match(/(\d+|\D+)/g) || [];
  const bx = b.match(/(\d+|\D+)/g) || [];
  for (let i = 0; i < Math.max(ax.length, bx.length); i++) {
    if (i >= ax.length) return -1;
    if (i >= bx.length) return 1;
    const an = parseInt(ax[i], 10);
    const bn = parseInt(bx[i], 10);
    if (!isNaN(an) && !isNaN(bn)) {
      if (an !== bn) return an - bn;
    } else {
      const cmp = ax[i].localeCompare(bx[i], 'ro');
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
}

// Category display names - must match actual sermon.category values
const categoryNames: Record<string, string> = {
  liturgical: 'Predici Liturgice',
  courses: 'Cursuri Biblice',
  saints: 'Despre Sfinți',
  topical: 'Învățături Tematice',
  archived: 'Arhivă',
};

export default function Library() {
  const { loadSermon } = useAudioContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const selectedTab = searchParams.get('tab') || 'sermons';
  const selectedSeriesId = searchParams.get('series');
  const urlSearchQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [expandedSeries, setExpandedSeries] = useState<string | null>(selectedSeriesId);

  // Sync search query from URL when it changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Expand series from URL parameter
  useEffect(() => {
    if (selectedSeriesId) {
      setExpandedSeries(selectedSeriesId);
    }
  }, [selectedSeriesId]);

  // Filter sermons by category and search
  const filteredSermons = useMemo(() => {
    let sermons = allSermons;

    // Filter by category
    if (selectedCategory && categoryNames[selectedCategory]) {
      const categoryName = categoryNames[selectedCategory];
      sermons = sermons.filter(s => s.category === categoryName);
    }

    // Filter by search query (diacritic-insensitive)
    if (searchQuery.trim()) {
      const query = normalizeText(searchQuery);
      sermons = sermons.filter(s =>
        normalizeText(s.title).includes(query) ||
        normalizeText(s.category).includes(query)
      );
    }

    return sermons.sort((a, b) => naturalCompare(a.title, b.title));
  }, [selectedCategory, searchQuery]);

  const handleSermonPlay = (sermon: Sermon) => {
    loadSermon(sermon);
  };

  const handleCategoryClick = (category: string | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'sermons') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  const handleSeriesToggle = (seriesId: string) => {
    if (expandedSeries === seriesId) {
      setExpandedSeries(null);
    } else {
      setExpandedSeries(seriesId);
    }
  };

  const handlePlayAll = (seriesSermons: Sermon[]) => {
    if (seriesSermons.length > 0) {
      loadSermon(seriesSermons[0]);
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
          {selectedTab === 'series'
            ? `${allSeries.length} serii de predici`
            : `${filteredSermons.length} predici ${selectedCategory ? `în ${categoryNames[selectedCategory]}` : 'disponibile'}`
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-1 bg-primary/5 p-1 rounded-xl w-fit">
        <button
          onClick={() => handleTabClick('sermons')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedTab === 'sermons'
              ? 'bg-white text-primary shadow-sm'
              : 'text-[#432818]/60 hover:text-[#432818]'
          }`}
        >
          Predici
        </button>
        <button
          onClick={() => handleTabClick('series')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            selectedTab === 'series'
              ? 'bg-white text-primary shadow-sm'
              : 'text-[#432818]/60 hover:text-[#432818]'
          }`}
        >
          Serii
        </button>
      </div>

      {selectedTab === 'sermons' ? (
        <>
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
        </>
      ) : (
        /* Series Tab Content */
        <div className="space-y-4">
          {allSeries.map((series) => (
            <div
              key={series.id}
              className="bg-white rounded-xl shadow-md border border-primary/10 overflow-hidden"
            >
              {/* Series Header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => handleSeriesToggle(series.id)}
              >
                <div className="shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">playlist_play</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#432818] truncate">{series.name}</h3>
                  <p className="text-sm text-[#432818]/60">{series.sermons.length} părți</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAll(series.sermons);
                  }}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                  <span className="hidden sm:inline">Redă tot</span>
                </button>
                <span className={`material-symbols-outlined text-[#432818]/40 transition-transform ${expandedSeries === series.id ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>

              {/* Expanded Series Content */}
              {expandedSeries === series.id && (
                <div className="border-t border-primary/10">
                  {series.sermons.map((sermon, index) => (
                    <div
                      key={sermon.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors cursor-pointer border-b border-primary/5 last:border-b-0"
                      onClick={() => handleSermonPlay(sermon)}
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#432818] text-sm font-medium truncate">{sermon.title}</p>
                        <p className="text-[#432818]/60 text-xs">
                          {sermon.duration || 'Durată necunoscută'}
                        </p>
                      </div>
                      <div className="play-btn shrink-0 flex items-center justify-center size-9 rounded-full border border-primary/20 bg-white hover:bg-primary transition-all">
                        <span className="material-symbols-outlined text-lg text-primary transition-colors">play_arrow</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
