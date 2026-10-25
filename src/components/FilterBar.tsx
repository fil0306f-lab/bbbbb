import { Category, categoryLabels, categoryColors, categoryIcons } from '../data/places';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFreeOnly: boolean;
  onFreeToggle: () => void;
  showOpenNow: boolean;
  onOpenNowToggle: () => void;
  showAccessible: boolean;
  onAccessibleToggle: () => void;
}

export default function FilterBar({
  selectedCategories,
  onCategoryToggle,
  searchQuery,
  onSearchChange,
  showFreeOnly,
  onFreeToggle,
  showOpenNow,
  onOpenNowToggle,
  showAccessible,
  onAccessibleToggle,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const categories = Object.keys(categoryLabels) as Category[];

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      {/* Search Bar */}
      <div className="p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск мест, адресов..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Category Pills */}
      <div className="px-3 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map(cat => {
          const isActive = selectedCategories.includes(cat);
          const color = categoryColors[cat];
          return (
            <button
              key={cat}
              onClick={() => onCategoryToggle(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={isActive ? { backgroundColor: color } : {}}
            >
              <span>{categoryIcons[cat]}</span>
              <span>{categoryLabels[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <div className="px-3 pb-3 border-t border-gray-50 pt-3 space-y-2 animate-in">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onFreeToggle}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                showFreeOnly ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🆓 Бесплатно
            </button>
            <button
              onClick={onOpenNowToggle}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                showOpenNow ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🕐 Открыто сейчас
            </button>
            <button
              onClick={onAccessibleToggle}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                showAccessible ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ♿ Доступно для маломобильных
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
