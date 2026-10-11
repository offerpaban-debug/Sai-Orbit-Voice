import React, { useState } from 'react';
import { buildBengaliSSML } from '../utils/ssmlBuilder';
import { Code, Play, Wand2, Copy, Check, Info, Loader2 } from 'lucide-react';

interface SSMLEditorProps {
  initialText: string;
  onSynthesizeSSML: (ssml: string) => Promise<void>;
  isGenerating: boolean;
}

export const SSMLEditor: React.FC<SSMLEditorProps> = ({
  initialText,
  onSynthesizeSSML,
  isGenerating,
}) => {
  const [ssmlCode, setSsmlCode] = useState(() =>
    buildBengaliSSML(initialText || 'সাইঅরবিট ভয়েসে স্বাগতম। এটি উন্নত এসএসএমএল প্রযুক্তি।', {
      smartPauses: true,
      emotion: 'happy',
      speed: 1.0,
      pitch: 1,
    })
  );
  const [copied, setCopied] = useState(false);

  const insertTag = (tag: string) => {
    setSsmlCode((prev) => prev + '\n' + tag);
  };

  const handleGenerateDefault = () => {
    setSsmlCode(
      buildBengaliSSML(initialText || 'সাইঅরবিট ভয়েস — মানুষের মতো কণ্ঠ, বাংলায়।', {
        smartPauses: true,
        emotion: 'neutral',
        speed: 1.0,
        pitch: 0,
      })
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ssmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-[#6C5CE7]" />
            <span>উন্নত SSML এডিটর (SSML Studio)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Speech Synthesis Markup Language (SSML) ব্যবহার করে বিরতি, সুর ও আবেগের সূক্ষ্ম নিয়ন্ত্রণ।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateDefault}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#00B894]" />
            <span>স্ক্রিপ্ট থেকে অটো SSML</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00B894]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>কপি</span>
          </button>
        </div>
      </div>

      {/* Quick Tag Insert Toolbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-slate-400 text-xs whitespace-nowrap">ট্যাগ যোগ করুন:</span>
        <button
          type="button"
          onClick={() => insertTag('<break time="300ms"/>')}
          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/5 whitespace-nowrap"
        >
          &lt;break 300ms/&gt;
        </button>
        <button
          type="button"
          onClick={() => insertTag('<break time="600ms"/>')}
          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/5 whitespace-nowrap"
        >
          &lt;break 600ms/&gt;
        </button>
        <button
          type="button"
          onClick={() => insertTag('<emphasis level="strong">গুরুত্বপূর্ণ</emphasis>')}
          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/5 whitespace-nowrap"
        >
          &lt;emphasis&gt;
        </button>
        <button
          type="button"
          onClick={() => insertTag('<prosody pitch="+3st" rate="110%">উজ্জ্বল সুর</prosody>')}
          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/5 whitespace-nowrap"
        >
          &lt;prosody&gt;
        </button>
      </div>

      {/* Code Area */}
      <div className="relative">
        <textarea
          rows={10}
          value={ssmlCode}
          onChange={(e) => setSsmlCode(e.target.value)}
          className="w-full bg-[#0A0A1A] border border-white/15 rounded-xl p-4 font-mono text-sm text-[#00B894] leading-relaxed focus:outline-none focus:border-[#6C5CE7]"
        />
      </div>

      {/* Info Tip */}
      <div className="flex items-start gap-2 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
        <Info className="w-4 h-4 text-[#FD79A8] shrink-0 mt-0.5" />
        <span>
          টিপ: বাংলা দাঁড়ি (।) এর ক্ষেত্রে স্বয়ংক্রিয়ভাবে ৩০০ মিলি-সেকেন্ড এবং কমা (,) এর ক্ষেত্রে ১৫০ মিলি-সেকেন্ড বিরতি যোগ করা সবচেয়ে স্বাভাবিক শোনায়।
        </span>
      </div>

      {/* Synthesize Button */}
      <button
        type="button"
        disabled={isGenerating || !ssmlCode.trim()}
        onClick={() => onSynthesizeSSML(ssmlCode)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white font-semibold text-sm shadow-lg shadow-[#6C5CE7]/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>SSML অডিও তৈরি হচ্ছে...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>SSML থেকে অডিও তৈরি করুন</span>
          </>
        )}
      </button>
    </div>
  );
};
