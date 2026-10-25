import { TrendingUp, MapPin, MessageCircle, Camera, Route, Award, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface StatsPanelProps {
  onClose: () => void;
}

export default function StatsPanel({ onClose }: StatsPanelProps) {
  const { theme, stats } = useApp();

  const weeklyData = [
    { day: 'Пн', visits: 2, reviews: 1 },
    { day: 'Вт', visits: 1, reviews: 0 },
    { day: 'Ср', visits: 3, reviews: 2 },
    { day: 'Чт', visits: 0, reviews: 1 },
    { day: 'Пт', visits: 2, reviews: 0 },
    { day: 'Сб', visits: 4, reviews: 3 },
    { day: 'Вс', visits: 3, reviews: 2 },
  ];

  const maxVisits = Math.max(...weeklyData.map(d => d.visits));

  const statCards = [
    {
      label: 'Посещено мест',
      value: stats.placesVisited,
      icon: MapPin,
      color: 'yellow',
      change: '+3 на этой неделе',
    },
    {
      label: 'Отзывов написано',
      value: stats.reviewsWritten,
      icon: MessageCircle,
      color: 'yellow',
      change: '+2 на этой неделе',
    },
    {
      label: 'Фото загружено',
      value: stats.photosUploaded,
      icon: Camera,
      color: 'yellow',
      change: '+5 на этой неделе',
    },
    {
      label: 'Маршрутов создано',
      value: stats.routesCreated,
      icon: Route,
      color: 'yellow',
      change: '+1 на этой неделе',
    },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className={`${theme === 'dark' ? 'bg-black border-yellow-500' : 'bg-white border-black'} border-2 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[600px] max-h-[90vh] shadow-2xl overflow-hidden animate-slideUp flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b-2 ${theme === 'dark' ? 'border-yellow-500/30' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-black" />
              </div>
              <div>
                <h2 className={`text-[18px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                  Статистика
                </h2>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ваша активность в приложении
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}
            >
              <X size={16} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Level Progress */}
          <div className={`p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500' : 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-500'} border-2 rounded-2xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award size={20} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
                <span className={`text-[14px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                  Уровень {stats.level}
                </span>
              </div>
              <span className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {stats.experience % 100} / 100 XP
              </span>
            </div>
            <div className={`h-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-full overflow-hidden border ${theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-300'}`}>
              <div
                className="h-full bg-yellow-500 transition-all duration-1000"
                style={{ width: `${stats.experience % 100}%` }}
              />
            </div>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              До следующего уровня: {100 - (stats.experience % 100)} XP
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`p-4 ${theme === 'dark' ? 'bg-gray-900 border-yellow-500/30' : 'bg-gray-50 border-gray-300'} border-2 rounded-2xl`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={18} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
                  <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                    {stat.label}
                  </span>
                </div>
                <p className={`text-[28px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'} mb-1`}>
                  {stat.value}
                </p>
                <p className={`text-[10px] ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-semibold`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Weekly Activity Chart */}
          <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900 border-yellow-500/30' : 'bg-gray-50 border-gray-300'} border-2 rounded-2xl`}>
            <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'} mb-4`}>
              Активность за неделю
            </h3>
            <div className="space-y-3">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} w-8`}>
                    {data.day}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className={`flex-1 h-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg overflow-hidden relative`}>
                      <div
                        className="h-full bg-yellow-500 transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${(data.visits / maxVisits) * 100}%` }}
                      >
                        {data.visits > 0 && (
                          <span className="text-[10px] font-bold text-black">{data.visits}</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} w-12 text-right`}>
                      {data.reviews} отз.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Summary */}
          <div className={`p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500' : 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-500'} border-2 rounded-2xl`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'} mb-1`}>
                  Достижения
                </h3>
                <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Получено наград
                </p>
              </div>
              <div className="text-right">
                <p className={`text-[32px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                  {Math.floor(stats.experience / 100)}
                </p>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  из 8 квестов
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
