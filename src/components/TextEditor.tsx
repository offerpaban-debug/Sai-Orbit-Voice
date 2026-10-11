import React, { useState } from 'react';
import {
  SAMPLE_BENGALI_TEXTS,
} from '../utils/bengaliKeyboard';
import {
  normalizeBengaliText,
  convertNumberToBengaliWords,
} from '../utils/bengaliNormalizer';
import {
  Keyboard,
  Wand2,
  Trash2,
  Eye,
  FileCheck,
  Loader2,
  Copy,
  Check
} from 'lucide-react';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  onOpenKeyboard: () => void;
  onEnhanceWithAI: () => Promise<void>;
  isEnhancing: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  setText,
  onOpenKeyboard,
  onEnhanceWithAI,
  isEnhancing,
}) => {
  const [showNormalizedPreview, setShowNormalizedPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const maxChars = 5000;

  // Convert English number to Bengali digits string for UI
  const toBanglaDigits = (num: number) => {
    return num.toString().replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const normalizedText = normalizeBengaliText(text);

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Editor Header: Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">📝 আপনার লেখা (Script Input)</span>
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            বাংলা বা ভারতীয় ভাষায় লিখুন
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* AI Enhance Button */}
          <button
            type="button"
            onClick={onEnhanceWithAI}
            disabled={isEnhancing || !text.trim()}
            title="কৃত্রিম বুদ্ধিমত্তা দিয়ে বানান, সংখ্যা ও উচ্চারণ ঠিক করুন"
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#FD79A8] text-white text-xs font-medium hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>পরিমার্জন হচ্ছে...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>AI দিয়ে নিখুঁত করুন</span>
              </>
            )}
          </button>

          {/* Virtual Keyboard Button */}
          <button
            type="button"
            onClick={onOpenKeyboard}
            title="অন-স্ক্রিন বাংলা কীবোর্ড খুলুন"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#00B894]" />
            <span>বাংলা কীবোর্ড</span>
          </button>

          {/* Normalize Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowNormalizedPreview(!showNormalizedPreview)}
            title="সংখ্যা ও সংক্ষেপণের বাচনরূপ দেখুন"
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
              showNormalizedPreview
                ? 'bg-[#00B894]/20 border-[#00B894]/40 text-[#00B894]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">উচ্চারণ প্রিভিউ</span>
          </button>

          {/* Clear Text */}
          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              title="টেক্সট মুছে ফেলুন"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Script Templates */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
        <span className="text-slate-400 text-[11px] whitespace-nowrap">নমুনা স্ক্রিপ্ট:</span>
        {SAMPLE_BENGALI_TEXTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setText(sample.text)}
            className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 whitespace-nowrap transition-colors"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Text Area Input */}
      <div className="relative">
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          placeholder="এখানে আপনার পছন্দের বাংলা লেখা লিখুন বা পেস্ট করুন... যেমন: আন্তর্জাতিক বিজ্ঞান ও প্রযুক্তি সম্মেলনে সাইঅরবিট নতুন বাংলা ভয়েস মডেল উন্মোচন করেছে।"
          className="w-full bg-[#0A0A1A] border border-white/15 rounded-xl p-4 text-white text-base leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-[#6C5CE7] transition-all resize-y min-h-[160px]"
        />

        {/* Copy Button Inside Textarea */}
        {text && (
          <button
            type="button"
            onClick={handleCopy}
            title="টেক্সট কপি করুন"
            className="absolute top-3 right-3 p-1.5 rounded-md bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00B894]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Normalized Speech Preview Bar (if toggled) */}
      {showNormalizedPreview && (
        <div className="bg-[#1A1A38]/70 border border-[#00B894]/30 rounded-xl p-3 text-xs space-y-1 animate-fadeIn">
          <div className="flex items-center gap-1 text-[#00B894] font-medium">
            <FileCheck className="w-3.5 h-3.5" />
            <span>নর্মালাইজড স্পিচ প্রিভিউ (স্বয়ংক্রিয় শব্দ রূপান্তর):</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">
            {normalizedText || '(টেক্সট খালি)'}
          </p>
        </div>
      )}

      {/* Editor Footer: Character / Word Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div className="flex items-center gap-3">
          <span>{toBanglaDigits(wordCount)} টি শব্দ</span>
          <span>·</span>
          <span>আনুমানিক সময়: ~{toBanglaDigits(Math.max(1, Math.round(wordCount / 2.5)))} সেকেন্ড</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`font-mono ${charCount > maxChars * 0.9 ? 'text-amber-400' : 'text-slate-400'}`}>
            {toBanglaDigits(charCount)} / {toBanglaDigits(maxChars)} অক্ষর
          </span>
        </div>
      </div>
    </div>
  );
};
