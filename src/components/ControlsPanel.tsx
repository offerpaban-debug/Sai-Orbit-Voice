import React, { useState } from 'react';
import {
  VOICE_CATALOG,
  SUPPORTED_LANGUAGES,
  VoiceItem,
} from '../utils/voiceCatalog';
import {
  EMOTION_PROFILES,
  EmotionType,
} from '../utils/ssmlBuilder';
import {
  Mic,
  Sliders,
  Sparkles,
  Zap,
  Radio,
  Flame,
  Globe2,
  Check
} from 'lucide-react';

interface ControlsPanelProps {
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  emotion: EmotionType;
  setEmotion: (emotion: EmotionType) => void;
  normalize: boolean;
  setNormalize: (val: boolean) => void;
  warmthEq: boolean;
  setWarmthEq: (val: boolean) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  selectedVoiceId,
  onSelectVoice,
  speed,
  setSpeed,
  pitch,
  setPitch,
  emotion,
  setEmotion,
  normalize,
  setNormalize,
  warmthEq,
  setWarmthEq,
}) => {
  const [selectedLangTab, setSelectedLangTab] = useState<string>('all');

  const currentVoice = VOICE_CATALOG.find((v) => v.id === selectedVoiceId) || VOICE_CATALOG[0];

  // Filter voices based on selected tab
  const filteredVoices = VOICE_CATALOG.filter((v) => {
    if (selectedLangTab === 'all') return true;
    if (selectedLangTab === 'insta') return v.category === 'insta-trending';
    if (selectedLangTab === 'bn') return v.langCode.startsWith('bn');
    if (selectedLangTab === 'hi') return v.langCode === 'hi-IN';
    if (selectedLangTab === 'en') return v.langCode.startsWith('en');
    if (selectedLangTab === 'regional') return v.category === 'regional';
    return true;
  });

  // Top trending voices for quick 1-click select
  const topTrendingVoices = VOICE_CATALOG.filter((v) => v.isTrending);

  const emotionsList = Object.values(EMOTION_PROFILES);

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Language & Trending Category Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-[#00B894]" />
            <span>ভাষা ও ট্রেন্ডিং ক্যাটাগরি (Language & Trends)</span>
          </label>
          <span className="text-xs text-slate-400">
            {filteredVoices.length} টি কণ্ঠ উপলব্ধ
          </span>
        </div>

        {/* Multi-language Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLangTab === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLangTab(lang.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? lang.code === 'insta'
                      ? 'bg-gradient-to-r from-[#FD79A8] to-[#E17055] text-white border-transparent shadow-md shadow-[#FD79A8]/20'
                      : 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-md shadow-[#6C5CE7]/20'
                    : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {lang.labelBn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick 1-Click Trending Reel Voice Pills */}
      <div className="bg-[#0A0A1A]/80 border border-amber-500/20 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 fill-current" />
            <span>ইনস্টাগ্রাম ও শর্টস ভাইরাল ভয়েস (Insta Viral Hits):</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">রিলস ও টিকটক ফেভারিট</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {topTrendingVoices.slice(0, 7).map((v) => {
            const isSelected = selectedVoiceId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVoice(v.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{v.nameBn.split(' ')[0]}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-slate-200">
                  {v.badge?.split(' ')[1] || 'REEL'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Voice Dropdown Selection Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-[#6C5CE7]" />
            <span>বর্তমান নির্বাচিত কণ্ঠ (Selected Voice)</span>
          </label>
          <div className="flex items-center gap-2">
            {currentVoice.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                {currentVoice.badge}
              </span>
            )}
            <span className="text-xs text-[#00B894] font-medium">
              {currentVoice.langLabelBn} · {currentVoice.gender === 'female' ? 'মহিলা' : 'পুরুষ'}
            </span>
          </div>
        </div>

        <select
          value={selectedVoiceId}
          onChange={(e) => onSelectVoice(e.target.value)}
          className="w-full bg-[#0A0A1A] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6C5CE7] transition-colors"
        >
          {filteredVoices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.isTrending ? '🔥 ' : ''}{v.nameBn} — {v.name} ({v.langLabelBn})
            </option>
          ))}
        </select>
      </div>

      {/* Emotion Selector (6 Emotions) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FD79A8]" />
            <span>আবেগ ও বাচনভঙ্গি (Emotion & Cadence)</span>
          </label>
          <span className="text-xs text-slate-400">
            {EMOTION_PROFILES[emotion]?.descriptionBn}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {emotionsList.map((emo) => {
            const isSelected = emotion === emo.id;
            return (
              <button
                key={emo.id}
                type="button"
                onClick={() => setEmotion(emo.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-[#6C5CE7] bg-[#6C5CE7]/20 text-white shadow-md shadow-[#6C5CE7]/20 scale-[1.02]'
                    : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base mb-1">{emo.icon}</span>
                <span>{emo.labelBn}</span>
                <span className="text-[10px] text-slate-400">{emo.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speed & Pitch Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Speed Slider + Presets */}
        <div className="bg-[#0A0A1A]/60 border border-white/5 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              গতি (Speed): {speed.toFixed(2)}x
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSpeed(1.0)}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  speed === 1.0 ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                স্বাভাবিক
              </button>
              <button
                type="button"
                onClick={() => setSpeed(1.15)}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  speed === 1.15 ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                রিলস (1.15x)
              </button>
              <button
                type="button"
                onClick={() => setSpeed(0.9)}
                className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                  speed === 0.9 ? 'bg-[#6C5CE7] text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                গল্প
              </button>
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-[#6C5CE7] cursor-pointer"
          />
        </div>

        {/* Pitch Slider */}
        <div className="bg-[#0A0A1A]/60 border border-white/5 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#00B894]" />
              পিচ (Pitch): {pitch > 0 ? `+${pitch}` : pitch} st
            </span>
            <button
              type="button"
              onClick={() => setPitch(0)}
              className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-400 hover:text-white"
            >
              রিসেট
            </button>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={pitch}
            onChange={(e) => setPitch(parseInt(e.target.value, 10))}
            className="w-full accent-[#00B894] cursor-pointer"
          />
        </div>
      </div>

      {/* Audio Post-Processing Toggles */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-[#6C5CE7]" />
          পোস্ট-প্রসেসিং অডিও ফিল্টার:
        </span>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={normalize}
              onChange={(e) => setNormalize(e.target.checked)}
              className="accent-[#6C5CE7] rounded"
            />
            <span>স্টুডিও নরম্যালাইজেশন (-0.3dB)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={warmthEq}
              onChange={(e) => setWarmthEq(e.target.checked)}
              className="accent-[#00B894] rounded"
            />
            <span>ব্রডকাস্ট EQ উষ্ণতা (Warmth)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
