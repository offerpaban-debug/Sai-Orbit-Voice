import React, { useState } from 'react';
import { Logo } from './Logo';
import { Sun, Moon, Volume2, BookOpen, History, Info, Menu, X } from 'lucide-react';

export type ActiveTab = 'studio' | 'library' | 'history' | 'about';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  totalGeneratedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  totalGeneratedCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'studio', label: 'স্টুডিও', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'library', label: 'ভয়েস লাইব্রেরি', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'history', label: `ইতিহাস${totalGeneratedCount > 0 ? ` (${totalGeneratedCount})` : ''}`, icon: <History className="w-4 h-4" /> },
    { id: 'about', label: 'পরিচিতি', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-white/10 bg-[#0A0A1A]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => handleTabClick('studio')}
          >
            <Logo size="sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white">
                SAIORBIT&nbsp;<span className="text-[#6C5CE7]">VOICE</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">
                মানুষের মতো কণ্ঠ, বাংলায়
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full px-3 py-3 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#6C5CE7] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
