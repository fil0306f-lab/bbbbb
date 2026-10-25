import { Category, categoryLabels, categoryColors, categoryIcons } from '../data/places';
import { Search, X, SlidersHorizontal } from 'lucide-react';
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
  const activeFiltersCount = [showFreeOnly, showOpenNow, showAccessible].filter(Boolean).length;

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shrink-0">
      {/* Search Bar */}
      <div className="p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск мест, адресов..."
            className="w-full pl-9 pr-9 py-2.5 bg-gray-100/80 rounded-xl text-[14px] border-0 outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
            >
              <X size={11} className="text-white" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
            showFilters ? 'bg-blue-500 text-white' : 'bg-gray-100/80 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal size={16} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
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
        <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-2 animate-[slideUp_0.2s_ease-out]">
          <p className="text-[12px] text-gray-500 font-medium px-1">Дополнительные фильтры:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onFreeToggle}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95 ${
                showFreeOnly ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🆓 Бесплатно
            </button>
            <button
              onClick={onOpenNowToggle}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95 ${
                showOpenNow ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🕐 Открыто сейчас
            </button>
            <button
              onClick={onAccessibleToggle}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95 ${
                showAccessible ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ♿ Доступно
            </button>
          </div>
          {(showFreeOnly || showOpenNow || showAccessible) && (
            <button
              onClick={() => { onFreeToggle(); onOpenNowToggle(); onAccessibleToggle(); }}
              className="text-[12px] text-red-500 font-medium hover:underline"
            >
              Сбросить все фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
}
