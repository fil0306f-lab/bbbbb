import { Place, categoryLabels, categoryColors, categoryIcons } from '../data/places';
import { Star, MapPin, Clock, Heart, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  compact?: boolean;
}

export default function PlaceCard({ place, onClick, isFavorite = false, onToggleFavorite, compact }: PlaceCardProps) {
  const { theme } = useApp();
  const color = categoryColors[place.category];
  const icon = categoryIcons[place.category];

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] border`}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-[14px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>{place.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[12px] text-yellow-600 font-medium">★ {place.rating}</span>
            <span className="text-[12px] text-gray-400">{place.address}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 shrink-0" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100/50'} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden group border`}
    >
      {/* Image */}
      <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.style.background = `linear-gradient(135deg, ${color}40, ${color}20)`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm"
            style={{ backgroundColor: `${color}dd` }}
          >
            {icon} {categoryLabels[place.category]}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite ? 'bg-red-500 text-white shadow-md' : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 flex items-center gap-1">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[12px] font-semibold text-gray-900">{place.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className={`font-semibold text-[14px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'} leading-tight line-clamp-2`}>
          {place.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mt-2 text-gray-500">
          <MapPin size={12} className="shrink-0" />
          <span className="text-[12px] truncate">{place.address}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1">
          <Clock size={12} className={place.isOpenNow ? 'text-green-500' : 'text-red-400'} />
          <span className={`text-[12px] font-medium ${place.isOpenNow ? 'text-green-600' : 'text-red-500'}`}>
            {place.isOpenNow ? 'Открыто' : 'Закрыто'}
          </span>
          <span className="text-[11px] text-gray-400">· {place.reviewCount} отзывов</span>
        </div>

        {place.price && (
          <p className="text-[12px] text-gray-500 mt-2 font-medium">{place.price}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {place.isFree && (
            <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[11px] font-medium rounded-full">
              Бесплатно
            </span>
          )}
          {place.accessible && (
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[11px] font-medium rounded-full">
              ♿ Доступно
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
