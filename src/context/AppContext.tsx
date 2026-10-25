import { useState, useEffect, createContext, useContext } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface UserStats {
  placesVisited: number;
  reviewsWritten: number;
  photosUploaded: number;
  routesCreated: number;
  level: number;
  experience: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: any;
  setUser: (user: any) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  stats: UserStats;
  updateStats: (key: keyof UserStats, value: number) => void;
  notifications: any[];
  addNotification: (notification: any) => void;
  history: string[];
  addToHistory: (placeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('penza-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('penza-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_visit', title: 'Первый шаг', description: 'Посетите первое место', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'explorer', title: 'Исследователь', description: 'Посетите 10 мест', icon: '🗺️', unlocked: false, progress: 0, maxProgress: 10 },
    { id: 'reviewer', title: 'Критик', description: 'Напишите 5 отзывов', icon: '✍️', unlocked: false, progress: 0, maxProgress: 5 },
    { id: 'photographer', title: 'Фотограф', description: 'Загрузите 10 фото', icon: '📸', unlocked: false, progress: 0, maxProgress: 10 },
    { id: 'social', title: 'Социальный', description: 'Поделитесь 3 местами', icon: '📢', unlocked: false, progress: 0, maxProgress: 3 },
    { id: 'historian', title: 'Историк', description: 'Посетите все музеи', icon: '🏛️', unlocked: false, progress: 0, maxProgress: 12 },
    { id: 'nature_lover', title: 'Любитель природы', description: 'Посетите 5 парков', icon: '🌳', unlocked: false, progress: 0, maxProgress: 5 },
    { id: 'culture_fan', title: 'Ценитель культуры', description: 'Посетите 3 театра', icon: '🎭', unlocked: false, progress: 0, maxProgress: 3 },
  ]);

  const [stats, setStats] = useState<UserStats>({
    placesVisited: 0,
    reviewsWritten: 0,
    photosUploaded: 0,
    routesCreated: 0,
    level: 1,
    experience: 0,
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('penza-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('penza-user', JSON.stringify(user));
    }
  }, [user]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
  };

  const updateStats = (key: keyof UserStats, value: number) => {
    setStats(prev => {
      const newStats = { ...prev, [key]: value };
      const newLevel = Math.floor(newStats.experience / 100) + 1;
      newStats.level = newLevel;
      return newStats;
    });
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50));
  };

  const addToHistory = (placeId: string) => {
    setHistory(prev => [placeId, ...prev.filter(id => id !== placeId)].slice(0, 100));
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      user,
      setUser,
      achievements,
      unlockAchievement,
      stats,
      updateStats,
      notifications,
      addNotification,
      history,
      addToHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
