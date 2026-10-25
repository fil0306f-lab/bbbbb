import { Place, categoryLabels, categoryColors, categoryIcons } from '../data/places';
import { Star, MapPin, Clock, ChevronRight, Heart } from 'lucide-react';
import { useState } from 'react';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
  compact?: boolean;
}

export default function PlaceCard({ place, onClick, compact }: PlaceCardProps) {
  const [isFav, setIsFav] = useState(false);
  const color = categoryColors[place.category];
  const icon = categoryIcons[place.category];

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-blue-200"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-800 truncate">{place.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-yellow-500">★ {place.rating}</span>
            <span className="text-xs text-gray-400">{place.address}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 shrink-0" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 hover:border-blue-200 overflow-hidden group"
    >
      {/* Header with gradient */}
      <div
        className="h-32 relative flex items-end p-4"
        style={{
          background: `linear-gradient(135deg, ${color}40, ${color}10)`,
        }}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); setIsFav(!isFav); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFav ? 'bg-red-50 text-red-500' : 'bg-white/70 text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {icon} {categoryLabels[place.category]}
          </span>
        </div>
        <span className="text-5xl opacity-60 group-hover:opacity-80 transition-opacity">{icon}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
          {place.name}
        </h3>
        
        <div className="flex items-center gap-1 mt-2">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-gray-700">{place.rating}</span>
          <span className="text-xs text-gray-400">({place.reviewCount} отзывов)</span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-gray-500">
          <MapPin size={12} />
          <span className="text-xs truncate">{place.address}</span>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Clock size={12} className={place.isOpenNow ? 'text-green-500' : 'text-red-400'} />
          <span className={`text-xs ${place.isOpenNow ? 'text-green-600' : 'text-red-500'}`}>
            {place.isOpenNow ? 'Открыто' : 'Закрыто'}
          </span>
        </div>

        {place.price && (
          <p className="text-xs text-gray-500 mt-2">{place.price}</p>
        )}

        <div className="flex flex-wrap gap-1 mt-3">
          {place.isFree && (
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
              Бесплатно
            </span>
          )}
          {place.accessible && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
              ♿ Доступно
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
