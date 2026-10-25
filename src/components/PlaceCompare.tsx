import { useState } from 'react';
import { places, Place } from '../data/places';
import { X, Star, MapPin, Clock, Heart, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PlaceCompareProps {
  onClose: () => void;
}

export default function PlaceCompare({ onClose }: PlaceCompareProps) {
  const { theme } = useApp();
  const [place1, setPlace1] = useState<Place | null>(null);
  const [place2, setPlace2] = useState<Place | null>(null);
  const [showPicker, setShowPicker] = useState<1 | 2 | null>(null);

  const metrics = [
    { key: 'rating', label: 'Рейтинг', icon: Star, format: (v: any) => `${v} ★`, better: 'higher' },
    { key: 'reviewCount', label: 'Отзывов', icon: TrendingUp, format: (v: any) => v.toString(), better: 'higher' },
    { key: 'isFree', label: 'Вход', icon: Heart, format: (v: any) => v ? 'Бесплатно' : 'Платно', better: 'true' },
    { key: 'accessible', label: 'Доступность', icon: MapPin, format: (v: any) => v ? 'Да' : 'Нет', better: 'true' },
    { key: 'isOpenNow', label: 'Открыто', icon: Clock, format: (v: any) => v ? 'Сейчас' : 'Закрыто', better: 'true' },
  ];

  const getWinner = (metric: any, val1: any, val2: any) => {
    if (metric.better === 'higher') {
      return val1 > val2 ? 1 : val2 > val1 ? 2 : 0;
    } else if (metric.better === 'true') {
      return val1 && !val2 ? 1 : val2 && !val1 ? 2 : 0;
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[700px] max-h-[90vh] shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              ⚖️ Сравнение мест
            </h2>
            <button
              onClick={onClose}
              className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}
            >
              <X size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
            </button>
          </div>
        </div>

        {/* Place Selection */}
        <div className="p-4 grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowPicker(1)}
            className={`aspect-square ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl border-2 ${
              place1 ? 'border-blue-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            } flex flex-col items-center justify-center transition-all`}
          >
            {place1 ? (
              <>
                <img src={place1.image} alt="" className="w-full h-3/4 object-cover rounded-t-xl" />
                <p className={`text-[11px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2 px-2 text-center truncate w-full`}>
                  {place1.name}
                </p>
              </>
            ) : (
              <>
                <div className={`text-4xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>+</div>
                <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Выбрать место</p>
              </>
            )}
          </button>

          <button
            onClick={() => setShowPicker(2)}
            className={`aspect-square ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl border-2 ${
              place2 ? 'border-purple-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            } flex flex-col items-center justify-center transition-all`}
          >
            {place2 ? (
              <>
                <img src={place2.image} alt="" className="w-full h-3/4 object-cover rounded-t-xl" />
                <p className={`text-[11px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2 px-2 text-center truncate w-full`}>
                  {place2.name}
                </p>
              </>
            ) : (
              <>
                <div className={`text-4xl ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>+</div>
                <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Выбрать место</p>
              </>
            )}
          </button>
        </div>

        {/* Comparison Table */}
        {place1 && place2 && (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl overflow-hidden`}>
              {metrics.map((metric, index) => {
                const val1 = (place1 as any)[metric.key];
                const val2 = (place2 as any)[metric.key];
                const winner = getWinner(metric, val1, val2);

                return (
                  <div
                    key={metric.key}
                    className={`flex items-center justify-between p-3 ${
                      index !== metrics.length - 1 ? `border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}` : ''
                    }`}
                  >
                    <div className={`flex items-center gap-2 w-1/3 ${winner === 1 ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}>
                      <metric.icon size={14} />
                      <span className="text-[12px]">{metric.label}</span>
                    </div>
                    <div className={`flex-1 text-center text-[13px] ${
                      winner === 1 ? 'text-blue-600 dark:text-blue-400 font-bold' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {metric.format(val1)}
                      {winner === 1 && ' 🏆'}
                    </div>
                    <div className={`flex-1 text-center text-[13px] ${
                      winner === 2 ? 'text-purple-600 dark:text-purple-400 font-bold' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {metric.format(val2)}
                      {winner === 2 && ' 🏆'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className={`mt-4 p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 to-purple-50'} rounded-2xl`}>
              <h3 className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>📊 Итог сравнения</h3>
              <p className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {place1.name} и {place2.name} - оба отличных места! Выбор зависит от ваших предпочтений.
              </p>
            </div>
          </div>
        )}

        {/* Place Picker Modal */}
        {showPicker && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowPicker(null)}>
            <div
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[500px] max-h-[70vh] shadow-2xl overflow-hidden flex flex-col`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Выберите место #{showPicker}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {places.map(place => (
                  <button
                    key={place.id}
                    onClick={() => {
                      if (showPicker === 1) setPlace1(place);
                      else setPlace2(place);
                      setShowPicker(null);
                    }}
                    className={`w-full flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl transition-colors text-left`}
                  >
                    <img src={place.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>{place.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{place.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
