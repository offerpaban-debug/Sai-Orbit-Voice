import React, { useState } from 'react';
import { VOICE_CATALOG, VoiceItem } from '../utils/voiceCatalog';
import { Sparkles, SlidersHorizontal, Play, ArrowRight, Loader2 } from 'lucide-react';

interface VoiceBlendingProps {
  onGenerateBlended: (voiceA: string, voiceB: string, ratio: number, text: string) => Promise<void>;
  isGenerating: boolean;
}

export const VoiceBlending: React.FC<VoiceBlendingProps> = ({
  onGenerateBlended,
  isGenerating,
}) => {
  const [voiceAId, setVoiceAId] = useState('bn-IN-Wavenet-A');
  const [voiceBId, setVoiceBId] = useState('bn-IN-Wavenet-B');
  const [ratio, setRatio] = useState(50); // 0 to 100
  const [testText, setTestText] = useState(
    'দুইটি ভিন্ন বাংলা কণ্ঠস্বরের সমন্বয়ে একটি সম্পূর্ণ নতুন ও অনন্য হাইব্রিড কণ্ঠ তৈরি হচ্ছে।'
  );

  const voiceA = VOICE_CATALOG.find((v) => v.id === voiceAId) || VOICE_CATALOG[0];
  const voiceB = VOICE_CATALOG.find((v) => v.id === voiceBId) || VOICE_CATALOG[1];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testText.trim()) return;
    await onGenerateBlended(voiceAId, voiceBId, ratio / 100, testText.trim());
  };

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FD79A8]" />
          <span>ভয়েস ব্লেন্ডিং স্টুডিও (Voice Blending)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          দুটি স্বতন্ত্র কণ্ঠস্বর ও শৈলীকে একত্রিত করে একদম নতুন ও প্রাকৃতিক হাইব্রিড কণ্ঠ তৈরি করুন।
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Voice Selection Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice A */}
          <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6C5CE7]">কণ্ঠস্বর ১ (Voice A)</span>
              <span className="text-xs font-mono text-slate-400">{100 - ratio}% অনুপাত</span>
            </div>
            <select
              value={voiceAId}
              onChange={(e) => setVoiceAId(e.target.value)}
              className="w-full bg-[#12122A] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6C5CE7]"
            >
              {VOICE_CATALOG.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nameBn} ({v.langLabelBn})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 italic">&ldquo;{voiceA.sampleText}&rdquo;</p>
          </div>

          {/* Voice B */}
          <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#00B894]">কণ্ঠস্বর ২ (Voice B)</span>
              <span className="text-xs font-mono text-slate-400">{ratio}% অনুপাত</span>
            </div>
            <select
              value={voiceBId}
              onChange={(e) => setVoiceBId(e.target.value)}
              className="w-full bg-[#12122A] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00B894]"
            >
              {VOICE_CATALOG.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nameBn} ({v.langLabelBn})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 italic">&ldquo;{voiceB.sampleText}&rdquo;</p>
          </div>
        </div>

        {/* Blend Ratio Slider */}
        <div className="bg-[#0A0A1A]/70 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#FD79A8]" />
              ব্লেন্ডিং অনুপাত (Morphing Ratio)
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[#6C5CE7]">{voiceA.nameBn} ({100 - ratio}%)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[#00B894]">{voiceB.nameBn} ({ratio}%)</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={ratio}
            onChange={(e) => setRatio(parseInt(e.target.value, 10))}
            className="w-full accent-[#FD79A8] cursor-pointer h-2 bg-white/10 rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>১০০% কণ্ঠ ১</span>
            <span>৫০% সম-সমন্বয় (Balanced Blend)</span>
            <span>১০০% কণ্ঠ ২</span>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            পরীক্ষামূলক টেক্সট (Test Script)
          </label>
          <textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full bg-[#0A0A1A] border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#6C5CE7]"
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !testText.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] via-[#FD79A8] to-[#00B894] text-white font-semibold text-sm shadow-lg shadow-[#6C5CE7]/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>ব্লেন্ড কণ্ঠ তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>ব্লেন্ড কণ্ঠ তৈরি করুন (Synthesize Blend)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
