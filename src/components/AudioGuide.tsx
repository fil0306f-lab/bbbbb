import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AudioGuideProps {
  placeName: string;
  onClose: () => void;
}

export default function AudioGuide({ placeName, onClose }: AudioGuideProps) {
  const { theme } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 минуты
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const audioContent = `Добро пожаловать на ${placeName}! Это одно из самых интересных мест Пензы. Здесь вы можете узнать много нового об истории нашего города. Обратите внимание на архитектуру и детали, которые рассказывают удивительные истории прошлого.`;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className={`${theme === 'dark' ? 'bg-gray-900 border-yellow-500' : 'bg-white border-black'} border-2 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b-2 ${theme === 'dark' ? 'border-yellow-500/30' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
              <Volume2 size={20} className="text-black" />
            </div>
            <div>
              <h3 className={`text-[15px] font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-black'}`}>
                🎧 Аудиогид
              </h3>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {placeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}
          >
            <X size={16} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Waveform visualization */}
          <div className={`h-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl flex items-center justify-center gap-1 overflow-hidden`}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 ${theme === 'dark' ? 'bg-yellow-500' : 'bg-black'} rounded-full transition-all duration-150 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.05}s`,
                  opacity: isPlaying ? 1 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className={`h-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-yellow-500 transition-all duration-1000"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className={theme === 'dark' ? 'text-yellow-500' : 'text-black'}>
                {formatTime(currentTime)}
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              className={`w-12 h-12 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-all`}
            >
              <SkipBack size={20} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-yellow-500 hover:bg-yellow-400 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isPlaying ? (
                <Pause size={28} className="text-black" />
              ) : (
                <Play size={28} className="text-black ml-1" />
              )}
            </button>

            <button
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
              className={`w-12 h-12 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-all`}
            >
              <SkipForward size={20} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3">
            <Volume2 size={16} className={theme === 'dark' ? 'text-yellow-500' : 'text-black'} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
            />
            <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {volume}%
            </span>
          </div>

          {/* Transcript */}
          <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
            <p className={`text-[12px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed italic`}>
              "{audioContent}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
