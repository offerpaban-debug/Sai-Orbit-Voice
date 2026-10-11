import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Sun,
  Moon,
  Volume2,
  Sparkles,
  BookOpen,
  Layers,
  Code,
  History,
  Info,
  Crown,
  User,
  Radio,
  Menu,
  X,
  LogIn
} from 'lucide-react';
import { UserProfile } from './LoginModal';

export type ActiveTab = 'studio' | 'livetest' | 'library' | 'blend' | 'ssml' | 'batch' | 'history' | 'about';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  totalGeneratedCount: number;
  user: UserProfile;
  onOpenLoginModal: () => void;
  onOpenPaidFeaturesModal: () => void;
  isProActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  totalGeneratedCount,
  user,
  onOpenLoginModal,
  onOpenPaidFeaturesModal,
  isProActive,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-white/10 dark:border-white/10 bg-[#0A0A1A]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
            onClick={() => handleTabClick('studio')}
          >
            <Logo size="sm" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center">
                  SAIORBIT&nbsp;<span className="text-[#6C5CE7]">VOICE</span>
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-[#00B894] bg-[#00B894]/10 border border-[#00B894]/20 hidden md:inline-block">
                  সাইঅরবিট ভয়েস
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                মানুষের মতো কণ্ঠ, বাংলায়
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleTabClick('studio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>স্টুডিও</span>
            </button>

            <button
              onClick={() => handleTabClick('livetest')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 relative ${
                activeTab === 'livetest'
                  ? 'bg-[#00B894] text-slate-950 font-bold shadow-md shadow-[#00B894]/30'
                  : 'text-[#00B894] hover:bg-[#00B894]/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>লাইভ টেস্ট</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FD79A8] animate-ping" />
            </button>

            <button
              onClick={() => handleTabClick('library')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>লাইব্রেরি</span>
            </button>

            <button
              onClick={() => handleTabClick('blend')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'blend'
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ব্লেন্ডিং</span>
            </button>

            <button
              onClick={() => handleTabClick('ssml')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ssml'
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>SSML</span>
            </button>

            <button
              onClick={() => handleTabClick('batch')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'batch'
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ব্যাচ</span>
            </button>

            <button
              onClick={() => handleTabClick('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>ইতিহাস</span>
              {totalGeneratedCount > 0 && (
                <span className="text-[10px] px-1.5 rounded-full bg-white/10 text-slate-200">
                  {totalGeneratedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('about')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>পরিচিতি</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* PAID / PRO FEATURES MODAL TRIGGER */}
            <button
              type="button"
              onClick={onOpenPaidFeaturesModal}
              title="পেইড ও প্রো স্টুডিও ফিচার দেখুন"
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                isProActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-amber-400/10 border border-amber-400/40 text-amber-300'
              }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isProActive ? 'PRO মোড' : 'প্রো ফিচার'}</span>
            </button>

            {/* USER LOGIN / PROFILE BUTTON */}
            <button
              type="button"
              onClick={onOpenLoginModal}
              title={user.isLoggedIn ? user.email : 'লগইন করুন'}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#FD79A8] flex items-center justify-center text-white text-[11px] font-bold">
                {user.isLoggedIn ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-medium hidden md:inline truncate max-w-[90px]">
                {user.isLoggedIn ? user.name.split(' ')[0] : 'লগইন'}
              </span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
              className="p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="মোবাইল মেনু"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu (When Open) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0A0A1A]/95 border-b border-white/15 backdrop-blur-xl p-4 shadow-2xl space-y-3 animate-slideDown z-50">
            {/* Quick Profile Ribbon on Mobile */}
            <div
              onClick={() => {
                onOpenLoginModal();
                setIsMobileMenuOpen(false);
              }}
              className="bg-[#12122A] border border-white/10 rounded-xl p-3 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#FD79A8] flex items-center justify-center text-white text-xs font-bold">
                  {user.isLoggedIn ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#6C5CE7]/20 text-[#6C5CE7] font-semibold">
                {isProActive ? 'PRO' : 'FREE'}
              </span>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleTabClick('studio')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'studio' ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-300'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>স্টুডিও</span>
              </button>

              <button
                onClick={() => handleTabClick('livetest')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'livetest' ? 'bg-[#00B894] text-slate-950 font-bold' : 'bg-white/5 text-[#00B894]'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>লাইভ টেস্ট 🔴</span>
              </button>

              <button
                onClick={() => handleTabClick('library')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'library' ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>লাইব্রেরি</span>
              </button>

              <button
                onClick={() => handleTabClick('blend')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'blend' ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>ব্লেন্ডিং</span>
              </button>

              <button
                onClick={() => handleTabClick('ssml')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'ssml' ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-300'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>SSML</span>
              </button>

              <button
                onClick={() => handleTabClick('batch')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'batch' ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-300'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>ব্যাচ মোড</span>
              </button>

              <button
                onClick={() => handleTabClick('history')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'history' ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-300'
                }`}
              >
                <History className="w-4 h-4" />
                <span>ইতিহাস ({totalGeneratedCount})</span>
              </button>

              <button
                onClick={() => handleTabClick('about')}
                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 ${
                  activeTab === 'about' ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-300'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>পরিচিতি</span>
              </button>
            </div>

            {/* Pro Button on Mobile */}
            <button
              onClick={() => {
                onOpenPaidFeaturesModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>পেইড ও প্রো স্টুডিও ফিচার কনসোল</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
