import React from 'react';
import { BENGALI_KEYBOARD_LAYOUT } from '../utils/bengaliKeyboard';
import { X, Delete, CornerDownLeft, Space } from 'lucide-react';

interface BengaliKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onClear: () => void;
}

export const BengaliKeyboardModal: React.FC<BengaliKeyboardModalProps> = ({
  isOpen,
  onClose,
  onInsertChar,
  onBackspace,
  onEnter,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12122A] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#1A1A38]/50">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-white">বাংলা ভার্চুয়াল কীবোর্ড</span>
            <span className="text-xs text-slate-400">অন-স্ক্রিন বাংলা টাইপিং</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {BENGALI_KEYBOARD_LAYOUT.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="text-xs font-medium text-[#FD79A8] block">{cat.title}</span>
              <div className="flex flex-wrap gap-1.5">
                {cat.keys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onInsertChar(key)}
                    className="min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-2 rounded-lg bg-white/5 hover:bg-[#6C5CE7] hover:text-white border border-white/10 text-slate-200 text-sm sm:text-base font-medium transition-colors active:scale-95 flex items-center justify-center"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Control Actions */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#1A1A38]/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onInsertChar(' ')}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5"
            >
              <Space className="w-4 h-4" />
              <span>স্পেসবার</span>
            </button>
            <button
              onClick={onBackspace}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5"
            >
              <Delete className="w-4 h-4" />
              <span>মুছুন</span>
            </button>
            <button
              onClick={onEnter}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5"
            >
              <CornerDownLeft className="w-4 h-4" />
              <span>নতুন লাইন</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
            >
              সব মুছুন
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#6C5CE7] text-white text-xs font-medium hover:bg-[#5b4cdb] transition-colors"
            >
              সম্পন্ন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
