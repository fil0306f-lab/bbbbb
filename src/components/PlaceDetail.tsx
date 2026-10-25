import { Place, categoryLabels, categoryColors, categoryIcons, places } from '../data/places';
import { Star, MapPin, Clock, Phone, Globe, Navigation, Heart, Share2, Flag, ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import PlaceCard from './PlaceCard';

interface PlaceDetailProps {
  place: Place;
  onBack: () => void;
  onPlaceSelect: (place: Place) => void;
}

export default function PlaceDetail({ place, onBack, onPlaceSelect }: PlaceDetailProps) {
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'nearby'>('info');
  const color = categoryColors[place.category];
  const icon = categoryIcons[place.category];

  const nearbyPlaces = places
    .filter(p => p.id !== place.id)
    .map(p => ({
      ...p,
      distance: Math.sqrt(Math.pow(p.lat - place.lat, 2) + Math.pow(p.lon - place.lon, 2)) * 111,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4);

  const mockReviews = [
    { id: 1, user: 'Анна К.', rating: 5, text: 'Прекрасное место! Обязательно рекомендую к посещению. Очень атмосферно и интересно.', date: '15 октября 2024', helpful: 12 },
    { id: 2, user: 'Дмитрий П.', rating: 4, text: 'Хорошее место для прогулки. Немного людно в выходные, но в целом очень приятно.', date: '8 октября 2024', helpful: 8 },
    { id: 3, user: 'Мария С.', rating: 5, text: 'Были с детьми — все в восторге! Персонал дружелюбный, всё чисто и ухожено.', date: '2 октября 2024', helpful: 15 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div
        className="relative h-56 flex items-end"
        style={{
          background: `linear-gradient(135deg, ${color}60, ${color}20)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFav(!isFav)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFav ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <Share2 size={18} />
          </button>
        </div>

        <div className="relative z-10 p-5 w-full">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white mb-2"
            style={{ backgroundColor: color }}
          >
            {icon} {categoryLabels[place.category]}
          </span>
          <h1 className="text-xl font-bold text-white leading-tight">{place.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={14} className={s <= Math.round(place.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/50'} />
              ))}
            </div>
            <span className="text-white text-sm font-medium">{place.rating}</span>
            <span className="text-white/70 text-xs">({place.reviewCount} отзывов)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex">
          {[
            { key: 'info', label: 'Информация' },
            { key: 'reviews', label: `Отзывы (${place.reviewCount})` },
            { key: 'nearby', label: 'Рядом' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'info' && (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <Navigation size={20} className="text-blue-500" />
                <span className="text-xs text-blue-700 font-medium">Маршрут</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <Phone size={20} className="text-green-500" />
                <span className="text-xs text-green-700 font-medium">Позвонить</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                <Globe size={20} className="text-purple-500" />
                <span className="text-xs text-purple-700 font-medium">Сайт</span>
              </button>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{place.address}</p>
                  <button className="text-xs text-blue-500 mt-1 hover:underline flex items-center gap-1">
                    <Navigation size={12} /> Проложить маршрут
                  </button>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Clock size={18} className={place.isOpenNow ? 'text-green-500' : 'text-red-400'} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${place.isOpenNow ? 'text-green-600' : 'text-red-500'}`}>
                      {place.isOpenNow ? '● Открыто сейчас' : '● Закрыто'}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {Object.entries(place.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-xs">
                        <span className="text-gray-500">{day}</span>
                        <span className={hours === 'Выходной' ? 'text-red-400' : 'text-gray-700'}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            {place.price && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">💰 Стоимость</h3>
                <p className="text-sm text-gray-600">{place.price}</p>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">📝 Описание</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{place.description}</p>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">📜 Историческая справка</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{place.history}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {place.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Contact */}
            {place.phone && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">📞 Контакты</h3>
                <div className="space-y-2">
                  <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Phone size={14} /> {place.phone}
                  </a>
                  {place.website && (
                    <a href={place.website} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <ExternalLink size={14} /> {place.website}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Report */}
            <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-red-400 transition-colors">
              <Flag size={14} /> Пожаловаться
            </button>
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            {/* Rating Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{place.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} className={s <= Math.round(place.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{place.reviewCount} отзывов</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{stars}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : '2%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                ✍️ Написать отзыв
              </button>
            </div>

            {/* Reviews List */}
            {mockReviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{review.user[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{review.user}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{review.text}</p>
                <button className="flex items-center gap-1 mt-3 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                  👍 Полезно ({review.helpful})
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'nearby' && (
          <>
            <p className="text-sm text-gray-500 mb-3">Интересные места поблизости:</p>
            {nearbyPlaces.map(p => (
              <PlaceCard key={p.id} place={p} onClick={() => onPlaceSelect(p)} compact />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
