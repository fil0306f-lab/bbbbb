import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { places } from '../data/places';
import { X, Award, TrendingUp, Heart, MessageCircle, Camera, Map, LogOut, Settings, ChevronRight, Star, Trophy, Target, Zap } from 'lucide-react';

interface ProfilePanelProps {
  onClose: () => void;
}

export default function ProfilePanel({ onClose }: ProfilePanelProps) {
  const { user, setUser, achievements, stats, history } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats' | 'settings'>('overview');

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      setUser(null);
      localStorage.removeItem('penza-user');
      onClose();
    }
  };

  const visitedPlaces = history.map(id => places.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[500px] max-h-[90vh] shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Гость'}</h2>
              <p className="text-white/80 text-sm">{user?.email || 'penza@example.com'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                  Уровень {stats.level}
                </span>
                <span className="text-white/80 text-xs">{stats.experience} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {[
            { key: 'overview', label: 'Обзор', icon: Target },
            { key: 'achievements', label: 'Достижения', icon: Trophy },
            { key: 'stats', label: 'Статистика', icon: TrendingUp },
            { key: 'settings', label: 'Настройки', icon: Settings },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'overview' && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Map size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.placesVisited}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Посещено мест</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.reviewsWritten}</p>
                  <p className="text-xs text-green-700 dark:text-green-300">Отзывов</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Camera size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.photosUploaded}</p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">Фото</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Heart size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.routesCreated}</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">Маршрутов</p>
                </div>
              </div>

              {/* Recent Activity */}
              {visitedPlaces.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Недавно просмотрено</h3>
                  <div className="space-y-2">
                    {visitedPlaces.slice(0, 5).map(place => place && (
                      <div key={place.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <img src={place.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{place.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{place.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-3">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-800/20 border-yellow-300 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <span className="px-2 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full">
                            ✓ Получено
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{achievement.description}</p>
                      {!achievement.unlocked && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Прогресс</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} />
                  <h3 className="text-lg font-bold">Ваш прогресс</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Уровень {stats.level}</span>
                      <span>{stats.experience % 100}/100 XP</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${stats.experience % 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Детальная статистика</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Всего посещений</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.placesVisited}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Написано отзывов</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.reviewsWritten}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Загружено фото</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.photosUploaded}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Создано маршрутов</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.routesCreated}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Settings size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Уведомления</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Heart size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Приватность</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <LogOut size={16} className="text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Выйти из аккаунта</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
