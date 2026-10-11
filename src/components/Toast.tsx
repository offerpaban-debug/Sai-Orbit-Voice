import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#00B894]" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    info: <Info className="w-4 h-4 text-[#6C5CE7]" />,
  };

  const borderColors = {
    success: 'border-[#00B894]/40 bg-[#12122A]',
    error: 'border-rose-500/40 bg-[#12122A]',
    info: 'border-[#6C5CE7]/40 bg-[#12122A]',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl text-xs sm:text-sm text-white ${borderColors[toast.type]}`}
      >
        {icons[toast.type]}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
