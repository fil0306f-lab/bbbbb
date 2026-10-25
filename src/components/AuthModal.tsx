import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { setUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: name || email.split('@')[0], email, avatar: null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[400px] shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative pt-6 pb-4 px-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
          <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">
            {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        {/* Social Login */}
        <div className="px-6 pb-4 space-y-2">
          <button className="w-full py-3 bg-[#0077FF] text-white rounded-xl font-medium text-[15px] hover:bg-[#0066DD] transition-colors flex items-center justify-center gap-2">
            <span className="text-lg">VK</span> Войти через VK ID
          </button>
          <div className="flex gap-2">
            <button className="flex-1 py-3 bg-black text-white rounded-xl font-medium text-[14px] hover:bg-gray-800 transition-colors">
              Яндекс ID
            </button>
            <button className="flex-1 py-3 bg-[#2AABEE] text-white rounded-xl font-medium text-[14px] hover:bg-[#229ED9] transition-colors">
              Telegram
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[13px] text-gray-400">или</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {mode === 'register' && (
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Имя"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-[15px] border-0 outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-[15px] border-0 outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              required
              className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-[15px] border-0 outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-500 text-white rounded-xl font-semibold text-[15px] hover:bg-blue-600 active:scale-[0.98] transition-all shadow-sm"
          >
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="px-6 pb-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[14px] text-blue-500 font-medium hover:text-blue-600"
          >
            {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
