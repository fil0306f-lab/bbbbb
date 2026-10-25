import { useState } from 'react';
import { Trophy, MapPin, Star, Camera, MessageCircle, X, Check, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface QuestsPanelProps {
  onClose: () => void;
}

export default function QuestsPanel({ onClose }: QuestsPanelProps) {
  const { theme, stats, updateStats } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const quests = [
    {
      id: 'explorer',
      title: 'Исследователь Пензы',
      description: 'Посетите 10 различных мест',
      icon: MapPin,
      progress: Math.min(stats.placesVisited, 10),
      maxProgress: 10,
      reward: '100 XP',
      completed: stats.placesVisited >= 10,
    },
    {
      id: 'critic',
      title: 'Критик',
      description: 'Напишите 5 отзывов',
      icon: MessageCircle,
      progress: Math.min(stats.reviewsWritten, 5),
      maxProgress: 5,
      reward: '75 XP',
      completed: stats.reviewsWritten >= 5,
    },
    {
      id: 'photographer',
      title: 'Фотограф',
      description: 'Загрузите 10 фотографий',
      icon: Camera,
      progress: Math.min(stats.photosUploaded, 10),
      maxProgress: 10,
      reward: '150 XP',
      completed: stats.photosUploaded >= 10,
    },
    {
      id: 'navigator',
      title: 'Навигатор',
      description: 'Создайте 3 маршрута',
      icon: MapPin,
      progress: Math.min(stats.routesCreated, 3),
      maxProgress: 3,
      reward: '50 XP',
      completed: stats.routesCreated >= 3,
    },
    {
      id: 'social',
      title: 'Социальная бабочка',
      description: 'Поделитесь 5 местами с друзьями',
      icon: Star,
      progress: 0,
      maxProgress: 5,
      reward: '80 XP',
      completed: false,
      locked: true,
    },
  ];

  const activeQuests = quests.filter(q => !q.completed && !q.locked);
  const completedQuests = quests.filter(q => q.completed);
  const lockedQuests = quests.filter(q => q.locked);

  const claimReward = (questId: string, reward: string) => {
    const xp = parseInt(reward);
    updateStats('experience', stats.experience + xp);
    alert(`Получено ${xp} XP! 🎉`);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className={`${theme === 'dark' ? 'bg-black border-yellow-500' : 'bg-white border-black'} border-2 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[500px] max-h-[90vh] shadow-2xl overflow-hidden animate-slideUp flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b-2 ${theme === 'dark' ? 'border-yellow-500/30' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Trophy size={20} className="text-black" />
              </div>
              <div>
                <h2 className={`text-[18px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                  Квесты
                </h2>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Выполняйте задания и получайте награды
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

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === 'active'
                  ? 'bg-yellow-500 text-black'
                  : theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Активные ({activeQuests.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === 'completed'
                  ? 'bg-yellow-500 text-black'
                  : theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Выполнено ({completedQuests.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'active' && (
            <>
              {activeQuests.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className={`text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Все квесты выполнены! 🎉
                  </p>
                </div>
              ) : (
                activeQuests.map(quest => (
                  <div
                    key={quest.id}
                    className={`p-4 ${theme === 'dark' ? 'bg-gray-900 border-yellow-500/30' : 'bg-gray-50 border-gray-300'} border-2 rounded-2xl`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100'} rounded-xl flex items-center justify-center`}>
                        <quest.icon size={24} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'} mb-1`}>
                          {quest.title}
                        </h3>
                        <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                          {quest.description}
                        </p>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className={`h-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                            <div
                              className="h-full bg-yellow-500 transition-all duration-500"
                              style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {quest.progress} / {quest.maxProgress}
                            </span>
                            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                              🎁 {quest.reward}
                            </span>
                          </div>
                        </div>

                        {quest.progress >= quest.maxProgress && (
                          <button
                            onClick={() => claimReward(quest.id, quest.reward)}
                            className="w-full mt-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[13px] rounded-xl transition-all hover:scale-105"
                          >
                            Получить награду
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Locked quests */}
              {lockedQuests.length > 0 && (
                <div className="pt-4">
                  <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-2 font-semibold`}>
                    Заблокированные квесты
                  </p>
                  {lockedQuests.map(quest => (
                    <div
                      key={quest.id}
                      className={`p-4 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-100 border-gray-200'} border-2 rounded-2xl opacity-50`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-xl flex items-center justify-center`}>
                          <Lock size={20} className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {quest.title}
                          </h3>
                          <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
                            {quest.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              {completedQuests.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className={`text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Пока нет выполненных квестов
                  </p>
                </div>
              ) : (
                completedQuests.map(quest => (
                  <div
                    key={quest.id}
                    className={`p-4 ${theme === 'dark' ? 'bg-yellow-500/10 border-yellow-500' : 'bg-yellow-50 border-yellow-500'} border-2 rounded-2xl`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <Check size={24} className="text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-[14px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                          {quest.title}
                        </h3>
                        <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {quest.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[11px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                          ✓ Выполнено
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
