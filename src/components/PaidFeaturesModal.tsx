import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  Zap,
  Sparkles,
  Sliders,
  Radio,
  FileCheck2,
  X,
  Volume2,
  ArrowRight,
  ShieldAlert,
  Mic2
} from 'lucide-react';

interface PaidFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProActive: boolean;
  onToggleProMode: () => void;
  proBitrate: 'standard' | 'ultra48k';
  setProBitrate: (val: 'standard' | 'ultra48k') => void;
  emotionIntensity: number;
  setEmotionIntensity: (val: number) => void;
  voiceCloningEnabled: boolean;
  setVoiceCloningEnabled: (val: boolean) => void;
}

export const PaidFeaturesModal: React.FC<PaidFeaturesModalProps> = ({
  isOpen,
  onClose,
  isProActive,
  onToggleProMode,
  proBitrate,
  setProBitrate,
  emotionIntensity,
  setEmotionIntensity,
  voiceCloningEnabled,
  setVoiceCloningEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'features' | 'plans'>('features');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12122A] border border-amber-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header with Golden Crown Gradient */}
        <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-[#1A1A38] via-[#2A1E4A] to-[#1A1A38] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">SAIORBIT PRO & STUDIO FEATURES</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold uppercase tracking-wider">
                  প্রিমিয়াম
                </span>
              </div>
              <p className="text-xs text-slate-300">
                পেশাদার সাউন্ড ডিজাইনার, ব্রডকাস্টার ও কন্টেন্ট ক্রিয়েটরদের জন্য আল্ট্রা-এইচডি স্টুডিও টুলস
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#0A0A1A]">
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              activeTab === 'features'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            স্টুডিও প্রো কন্ট্রোল ও সেটিংস (Pro Controls)
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              activeTab === 'plans'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            প্ল্যান ও সাবস্ক্রিপশন (Pricing Plans)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'features' ? (
            <div className="space-y-5">
              {/* Pro Mode Status Switcher */}
              <div className="bg-gradient-to-r from-amber-500/10 via-[#6C5CE7]/10 to-[#00B894]/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {isProActive ? '✅ প্রো স্টুডিও মোড সক্রিয় (Pro Mode ON)' : '🔒 সাধারণ মোড (Standard Mode)'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {isProActive ? 'সব পেইড ফিচার আনলক করা আছে' : 'টেস্টিংয়ের জন্য তাৎক্ষণিক চালু করুন'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    আপনি একটি ক্লিকে প্রো স্টুডিও মোড সক্রিয় করে ৪৮kHz আল্ট্রা-এইচডি এবং ইমোশন কন্ট্রোল পরীক্ষা করতে পারেন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onToggleProMode}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-md ${
                    isProActive
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 hover:opacity-95'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>{isProActive ? 'প্রো মোড বন্ধ করুন' : 'প্রো মোড সক্রিয় করুন (Free Test)'}</span>
                </button>
              </div>

              {/* Pro Feature 1: Ultra-HD 48kHz Master Output */}
              <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      ১. আল্ট্রা-এইচডি ৪৮kHz স্টুডিও অডিও মাস্টার (Ultra-HD 48kHz Output)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#00B894] font-semibold">
                    {proBitrate === 'ultra48k' ? '৪৮,০০০ Hz · ২৪-বিট' : '২৪,০০০ Hz স্ট্যান্ডার্ড'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  ব্রডকাস্ট রেডিও ও সিনেমার জন্য পূর্ণাঙ্গ ডায়নামিক রেঞ্জ সহ লসলেস হাই-রেজুলেশন অডিও এনকোডিং।
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setProBitrate('standard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      proBitrate === 'standard'
                        ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    স্ট্যান্ডার্ড (২৪kHz mono)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProBitrate('ultra48k')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      proBitrate === 'ultra48k'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Crown className="w-3 h-3 fill-current" />
                    <span>আল্ট্রা-এইচডি স্টুডিও মাস্টার (৪৮kHz 24-bit)</span>
                  </button>
                </div>
              </div>

              {/* Pro Feature 2: Emotion Intensity Multiplier (0% - 150%) */}
              <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#FD79A8]" />
                    <span className="text-xs font-bold text-white">
                      ২. ইমোশন ইনটেনসিটি বুস্টার (Emotion Intensity: {emotionIntensity}%)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#FD79A8]">
                    {emotionIntensity > 100 ? 'উচ্চ আবেগ (Intense Drama)' : emotionIntensity < 70 ? 'সূক্ষ্ম মৃদু আবেগ' : 'স্বাভাবিক মাত্রা'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  নির্বাচিত আবেগের সুর ও প্রসোডির তীব্রতা ০% থেকে ১৫০% পর্যন্ত বাড়িয়ে বা কমিয়ে নাট্যরস তৈরি করুন।
                </p>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="5"
                  value={emotionIntensity}
                  onChange={(e) => setEmotionIntensity(parseInt(e.target.value, 10))}
                  className="w-full accent-[#FD79A8] cursor-pointer"
                />
              </div>

              {/* Pro Feature 3: Voice Cloning Simulator & Persona Designer */}
              <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-[#00B894]" />
                    <span className="text-xs font-bold text-white">
                      ৩. পারসোনা ভয়েস ক্লোন ও টিম্ব্রে ডিজাইনার (Voice Cloning Simulator)
                    </span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={voiceCloningEnabled}
                      onChange={(e) => setVoiceCloningEnabled(e.target.checked)}
                      className="accent-[#00B894] rounded"
                    />
                    <span className="font-semibold text-white">ক্লোন মোড সক্রিয়</span>
                  </label>
                </div>
                <p className="text-xs text-slate-400">
                  যেকোনো বাংলা বা বিদেশি কণ্ঠের ফ্রিকোয়েন্সি স্পেকট্রাম বিশ্লেষণ করে নতুন ভয়েস পারসোনা তৈরি করুন।
                </p>
              </div>

              {/* Pro Feature 4: Commercial Broadcast License */}
              <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">
                    ৪. বাণিজ্যিক লাইসেন্স ও কপিরাইট ফ্রি সার্টিফিকেট (Commercial Rights)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  টিভি বিজ্ঞাপন, রেডিও সম্প্রচার, ইউটিউব মনিটাইজেশন ও অডিওবুকে ব্যবহারের জন্য ১০০% বাণিজ্যিক ছাড়পত্র অন্তর্ভুক্ত।
                </p>
              </div>
            </div>
          ) : (
            /* Pricing Plans Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Plan 1: Free */}
              <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">ফ্রি টায়ার (Starter)</div>
                  <div className="text-2xl font-black text-white mt-1">৳০ <span className="text-xs font-normal text-slate-400">/আজীবন</span></div>
                  <p className="text-xs text-slate-400 mt-2">ব্যক্তিগত শিক্ষা ও সাধারণ প্রজেক্টের জন্য</p>
                  <ul className="space-y-1.5 text-xs text-slate-300 mt-4">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00B894]" />
                      <span>সব মৌলিক বাংলা কণ্ঠ</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00B894]" />
                      <span>৬টি আবেগ ও যতিচিহ্ন</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00B894]" />
                      <span>WAV ও MP3 ডাউনলোড</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 rounded-lg border border-white/20 text-white text-xs font-semibold hover:bg-white/5"
                >
                  বর্তমান প্ল্যান
                </button>
              </div>

              {/* Plan 2: Pro Creator */}
              <div className="bg-[#1A1A38] border-2 border-amber-400/80 rounded-xl p-4 space-y-3 flex flex-col justify-between relative shadow-xl shadow-amber-500/10">
                <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                  সর্বাধিক জনপ্রিয়
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>প্রো ক্রিয়েটর (Creator Pro)</span>
                  </div>
                  <div className="text-2xl font-black text-white mt-1">৳৪৯৯ <span className="text-xs font-normal text-slate-400">/মাস</span></div>
                  <p className="text-xs text-slate-300 mt-2">ইউটিউবার ও পডকাস্টারদের জন্য সেরা</p>
                  <ul className="space-y-1.5 text-xs text-slate-200 mt-4">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>৪৮kHz আল্ট্রা-এইচডি স্টুডিও অডিও</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>০.৪ সেকেন্ড সুপারফাস্ট স্পিড</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>বাণিজ্যিক স্বত্বাধিকার</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>ইমোশন ইনটেনসিটি মাল্টিপ্লায়ার</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isProActive) onToggleProMode();
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold hover:opacity-95 shadow-md shadow-amber-500/20"
                >
                  {isProActive ? 'সক্রিয় আছে (Active)' : '১-ক্লিকে টেস্ট মোড চালু করুন'}
                </button>
              </div>

              {/* Plan 3: Enterprise */}
              <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-purple-400 uppercase">এন্টারপ্রাইজ স্টুডিও</div>
                  <div className="text-2xl font-black text-white mt-1">৳১৯৯৯ <span className="text-xs font-normal text-slate-400">/মাস</span></div>
                  <p className="text-xs text-slate-400 mt-2">টিভি চ্যানেল ও অডিওবুক প্রকাশকদের জন্য</p>
                  <ul className="space-y-1.5 text-xs text-slate-300 mt-4">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                      <span>কাস্টম ভয়েস ক্লোনিং ট্রেনিং</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                      <span>সীমাহীন ব্যাচ জেনারেশন</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                      <span>ডেডিকেটেড এপিআই ও সাপোর্ট</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isProActive) onToggleProMode();
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-xs font-semibold"
                >
                  যোগাযোগ / টেস্ট
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#1A1A38]/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isProActive ? '💎 প্রো স্টুডিও সুবিধা আনলক করা হয়েছে' : '💡 টিপ: প্রো মোড সম্পূর্ণ ফ্রিতে টেস্ট করা যাবে'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
