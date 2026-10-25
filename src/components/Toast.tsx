interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Toast({ message, type }: ToastProps) {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className={`${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-[slideUp_0.3s_ease-out] min-w-[200px]`}>
      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[11px] font-bold">
        {icons[type]}
      </span>
      <p className="text-[13px] font-medium">{message}</p>
    </div>
  );
}
