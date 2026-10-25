import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, MapPin, Star, Heart, MessageCircle, Camera, Award } from 'lucide-react';

interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { notifications, theme } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const mockNotifications = [
    {
      id: 1,
      type: 'event',
      title: 'Ночь музеев',
      message: 'Завтра в Пензе проходит акция "Ночь музеев" - бесплатный вход во все музеи!',
      icon: '🎭',
      time: '2 часа назад',
      unread: true,
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Новое достижение!',
      message: 'Вы получили достижение "Исследователь" - посетили 10 мест',
      icon: '🏆',
      time: '1 день назад',
      unread: true,
    },
    {
      id: 3,
      type: 'review',
      title: 'Новый отзыв',
      message: 'Кто-то оценил ваш отзыв в "Пензенская картинная галерея"',
      icon: '💬',
      time: '2 дня назад',
      unread: false,
    },
    {
      id: 4,
      type: 'place',
      title: 'Новое место рядом',
      message: 'В вашем районе открылась новая выставка "Современное искусство Пензы"',
      icon: '📍',
      time: '3 дня назад',
      unread: false,
    },
  ];

  const allNotifications = [...mockNotifications, ...notifications];

  const filteredNotifications = filter === 'unread' 
    ? allNotifications.filter(n => n.unread)
    : allNotifications;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[500px] max-h-[80vh] shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Уведомления</h2>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}
            >
              <X size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                filter === 'unread'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Непрочитанные
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-300 mb-3" />
              <p className={`text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Нет уведомлений</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-2xl transition-all ${
                  notification.unread
                    ? theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                    : theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                } border`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{notification.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-[13px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-0.5`}>
                      {notification.message}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
