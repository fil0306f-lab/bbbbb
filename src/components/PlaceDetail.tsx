import { Place, categoryLabels, categoryColors, categoryIcons, places } from '../data/places';
import { Star, MapPin, Clock, Phone, Globe, Navigation, Heart, Share2, Flag, ArrowLeft, ExternalLink, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import PlaceCard from './PlaceCard';
import { useApp } from '../context/AppContext';

interface PlaceDetailProps {
  place: Place;
  onBack: () => void;
  onPlaceSelect: (place: Place) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function PlaceDetail({ place, onBack, onPlaceSelect, favorites, onToggleFavorite }: PlaceDetailProps) {
  const { theme } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'nearby'>('info');
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Анна К.', rating: 5, text: 'Прекрасное место! Обязательно рекомендую к посещению. Очень атмосферно и интересно.', date: '15 октября 2024', helpful: 12 },
    { id: 2, user: 'Дмитрий П.', rating: 4, text: 'Хорошее место для прогулки. Немного людно в выходные, но в целом очень приятно.', date: '8 октября 2024', helpful: 8 },
    { id: 3, user: 'Мария С.', rating: 5, text: 'Были с детьми — все в восторге! Персонал дружелюбный, всё чисто и ухожено.', date: '2 октября 2024', helpful: 15 },
  ]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const isFavorite = favorites.includes(place.id);
  const color = categoryColors[place.category];
  const icon = categoryIcons[place.category];

  const nearbyPlaces = places
    .filter(p => p.id !== place.id)
    .map(p => ({
      ...p,
      distance: Math.sqrt(Math.pow(p.lat - place.lat, 2) + Math.pow(p.lon - place.lon, 2)) * 111,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  const handleShare = async () => {
    const shareData = {
      title: place.name,
      text: `${place.name} — ${place.description}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована!');
    }
  };

  const handleRoute = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`, '_blank');
  };

  const handleReport = () => {
    alert('Спасибо за обращение! Мы рассмотрим вашу жалобу.');
  };

  const handleSubmitReview = () => {
    if (!newReview.trim()) return;
    setReviews([
      { id: Date.now(), user: 'Вы', rating: newRating, text: newReview, date: 'Только что', helpful: 0 },
      ...reviews,
    ]);
    setNewReview('');
    setShowReviewForm(false);
    alert('Отзыв отправлен на модерацию!');
  };

  return (
    <div className={`h-full overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#f2f2f7]'}`}>
      {/* Hero Image */}
      <div className="relative h-56 sm:h-64">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.style.background = `linear-gradient(135deg, ${color}60, ${color}30)`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Top Buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-9 h-9 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft size={18} className="text-gray-800" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <Share2 size={16} className="text-gray-700" />
            </button>
            <button
              onClick={() => onToggleFavorite(place.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-xl text-gray-700 hover:bg-white'
              }`}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white mb-2"
            style={{ backgroundColor: color }}
          >
            {icon} {categoryLabels[place.category]}
          </span>
          <h1 className="text-[20px] font-bold text-white leading-tight">{place.name}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={13} className={s <= Math.round(place.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'} />
              ))}
            </div>
            <span className="text-white text-[13px] font-semibold">{place.rating}</span>
            <span className="text-white/70 text-[12px]">({place.reviewCount} отзывов)</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`grid grid-cols-4 gap-2 p-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b`}>
        <button onClick={handleRoute} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} active:scale-95 transition-all`}>
          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Navigation size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Маршрут</span>
        </button>
        <button onClick={() => place.phone && window.open(`tel:${place.phone}`)} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-green-50'} active:scale-95 transition-all`}>
          <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Phone size={16} className="text-green-600 dark:text-green-400" />
          </div>
          <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Звонок</span>
        </button>
        <button onClick={() => place.website && window.open(place.website, '_blank')} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-purple-50'} active:scale-95 transition-all`}>
          <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Globe size={16} className="text-purple-600 dark:text-purple-400" />
          </div>
          <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Сайт</span>
        </button>
        <button onClick={() => onToggleFavorite(place.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-red-50'} active:scale-95 transition-all`}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isFavorite ? 'bg-red-100 dark:bg-red-900/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <Heart size={16} className={isFavorite ? 'text-red-600 dark:text-red-400' : 'text-red-400'} fill={isFavorite ? 'currentColor' : 'none'} />
          </div>
          <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>{isFavorite ? 'В избранном' : 'В избранное'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'} backdrop-blur-xl border-b z-10`}>
        <div className="flex">
          {[
            { key: 'info', label: 'Инфо' },
            { key: 'reviews', label: `Отзывы` },
            { key: 'nearby', label: 'Рядом' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : `border-transparent ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
              }`}
            >
              {tab.label}
              {tab.key === 'reviews' && <span className="ml-1 text-[11px] text-gray-400">({reviews.length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3 pb-8">
        {activeTab === 'info' && (
          <>
            {/* Address */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className={`text-[14px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{place.address}</p>
                  <button onClick={handleRoute} className="text-[12px] text-blue-500 mt-1 hover:underline flex items-center gap-1 font-medium">
                    <Navigation size={11} /> Проложить маршрут
                  </button>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-start gap-3">
                <Clock size={18} className={place.isOpenNow ? 'text-green-500' : 'text-red-400'} />
                <div className="flex-1">
                  <span className={`text-[13px] font-semibold ${place.isOpenNow ? 'text-green-600' : 'text-red-500'}`}>
                    {place.isOpenNow ? '● Открыто сейчас' : '● Закрыто'}
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {Object.entries(place.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-[12px]">
                        <span className="text-gray-500">{day}</span>
                        <span className={hours === 'Выходной' ? 'text-red-400 font-medium' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            {place.price && (
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
                <h3 className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1.5`}>💰 Стоимость</h3>
                <p className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{place.price}</p>
              </div>
            )}

            {/* Description */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
              <h3 className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1.5`}>📝 Описание</h3>
              <p className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{place.description}</p>
            </div>

            {/* History */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
              <h3 className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1.5`}>📜 История</h3>
              <p className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{place.history}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {place.tags.map(tag => (
                <span key={tag} className={`px-3 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} text-[12px] rounded-full shadow-sm`}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Contact */}
            {(place.phone || place.website) && (
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
                <h3 className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>📞 Контакты</h3>
                <div className="space-y-2">
                  {place.phone && (
                    <a href={`tel:${place.phone}`} className="flex items-center gap-2 text-[13px] text-blue-600 hover:underline font-medium">
                      <Phone size={14} /> {place.phone}
                    </a>
                  )}
                  {place.website && (
                    <a href={place.website} target="_blank" rel="noopener" className="flex items-center gap-2 text-[13px] text-blue-600 hover:underline font-medium">
                      <ExternalLink size={14} /> {place.website}
                    </a>
                  )}
                </div>
              </div>
            )}

            <button onClick={handleReport} className="w-full flex items-center justify-center gap-2 py-3 text-[13px] text-gray-400 hover:text-red-400 transition-colors">
              <Flag size={14} /> Пожаловаться
            </button>
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            {/* Rating Summary */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{place.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={11} className={s <= Math.round(place.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{place.reviewCount} отзывов</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 w-2">{stars}</span>
                      <div className={`h-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : '2%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full mt-4 py-2.5 bg-blue-500 text-white rounded-xl text-[13px] font-semibold hover:bg-blue-600 active:scale-[0.98] transition-all"
              >
                ✍️ Написать отзыв
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm space-y-3 animate-[slideUp_0.2s_ease-out]`}>
                <div className="flex items-center gap-1">
                  <span className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mr-2`}>Оценка:</span>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setNewRating(s)}>
                      <Star size={20} className={s <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReview}
                  onChange={e => setNewReview(e.target.value)}
                  placeholder="Расскажите о вашем впечатлении..."
                  className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'} rounded-xl text-[13px] resize-none h-24 outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className={`flex-1 py-2.5 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-xl text-[13px] font-medium`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-[13px] font-semibold"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviews.map(review => (
              <div key={review.id} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-[12px] font-semibold text-white">{review.user[0]}</span>
                    </div>
                    <div>
                      <p className={`text-[13px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{review.user}</p>
                      <p className="text-[11px] text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={11} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-3 leading-relaxed`}>{review.text}</p>
                <button className="flex items-center gap-1.5 mt-3 text-[12px] text-gray-400 hover:text-blue-500 transition-colors">
                  <ThumbsUp size={12} /> Полезно ({review.helpful})
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'nearby' && (
          <>
            <p className={`text-[13px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} font-medium px-1`}>Интересные места поблизости:</p>
            {nearbyPlaces.map(p => (
              <PlaceCard key={p.id} place={p} onClick={() => onPlaceSelect(p)} compact />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
