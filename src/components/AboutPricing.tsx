import React from 'react';
import { Logo } from './Logo';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Globe2,
  ShieldCheck,
  Heart,
  Volume2,
  Code
} from 'lucide-react';

export const AboutPricing: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* Hero Mission Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          SAIORBIT VOICE · সাইঅরবিট ভয়েস
        </h1>
        <p className="text-lg sm:text-xl text-[#00B894] font-medium">
          &ldquo;মানুষের মতো কণ্ঠ, বাংলায়&rdquo; — Human-like Bengali Voice, For All
        </p>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          বাংলা এবং ভারতীয় ভাষায় ১০০% মানবিক কণ্ঠস্বর সংশ্লেষণ। কোনো সাবস্ক্রিপশন ফি বা হিডেন চার্জ নেই — সম্পূর্ণ ফ্রি, দ্রুত এবং বিশ্বমানের প্রিমিয়াম অডিও কোয়ালিটি।
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7]/20 border border-[#6C5CE7]/30 flex items-center justify-center text-[#6C5CE7]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">১০০% মানবিক কণ্ঠস্বর</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ন্যাচারাল প্রসোডি এবং আবেগ নিয়ন্ত্রণ (৬টি ইমোশন)। রোবটিক ভাবমুক্ত জীবন্ত উচ্চারণ যা রেডিও এবং পডকাস্টের সমকক্ষ।
          </p>
        </div>

        <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#00B894]/20 border border-[#00B894]/30 flex items-center justify-center text-[#00B894]">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">সুপারফাস্ট জেনারেশন</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ১০০০ শব্দ মাত্র ৩০-৬০ সেকেন্ডে রূপান্তর। প্যারালাল প্রসেসিং এবং মেমরি ক্যাশিং-এর মাধ্যমে একই টেক্সটের তাৎক্ষণিক রিপ্লে।
          </p>
        </div>

        <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FD79A8]/20 border border-[#FD79A8]/30 flex items-center justify-center text-[#FD79A8]">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">১১টি ভারতীয় ভাষা</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            বাংলা (ভারত ও বাংলাদেশ), হিন্দি এবং ভারতীয় ইংরেজির পাশাপাশি তামিল, তেলুগু, মারাঠি, গুজরাটি, কন্নড়, মালায়ালাম ও পাঞ্জাবি সমর্থন।
          </p>
        </div>
      </div>

      {/* Comparison Table: SAIORBIT vs Others */}
      <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📊 SAIORBIT VOICE বনাম অন্যান্য প্ল্যাটফর্ম</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-4 font-semibold">বৈশিষ্ট্য (Feature)</th>
                <th className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/10 rounded-t-lg">SAIORBIT VOICE</th>
                <th className="py-3 px-4 font-semibold text-slate-300">ElevenLabs</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Google TTS Standard</th>
                <th className="py-3 px-4 font-semibold text-slate-300">HF Spaces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">বাংলা বাচনভঙ্গি (Quality)</td>
                <td className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/5">৯.৫ / ১০ ⭐</td>
                <td className="py-3 px-4">৯ / ১০</td>
                <td className="py-3 px-4">৮.৫ / ১০</td>
                <td className="py-3 px-4">৭ / ১০</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">গতি (১০০০ শব্দে)</td>
                <td className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/5">৩০–৬০ সেকেন্ড ⚡</td>
                <td className="py-3 px-4">২০ সেকেন্ড</td>
                <td className="py-3 px-4">৪০ সেকেন্ড</td>
                <td className="py-3 px-4">২ ঘণ্টা</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">মূল্য (Pricing)</td>
                <td className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/5">✅ সম্পূর্ণ ফ্রি (Free Forever)</td>
                <td className="py-3 px-4 text-rose-400">❌ পেইড (Paid Subscription)</td>
                <td className="py-3 px-4 text-amber-400">⚠️ লিমিটেড ফ্রি কোটা</td>
                <td className="py-3 px-4">✅ ফ্রি</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">আবেগ নিয়ন্ত্রণ (Emotions)</td>
                <td className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/5">৬টি মেজাজ (প্রফুল্ল, শান্ত, ইত্যাদি)</td>
                <td className="py-3 px-4">৫টি</td>
                <td className="py-3 px-4">২টি</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">অন-স্ক্রিন বাংলা কীবোর্ড</td>
                <td className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/5">✅ অন্তর্ভুক্ত</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">সাবটাইটেল জেনারেটর (.srt)</td>
                <td className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/5">✅ স্বয়ংক্রিয় সিঙ্ক</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">ভয়েস ব্লেন্ডিং (Hybrid Voice)</td>
                <td className="py-3 px-4 font-bold text-[#00B894] bg-[#00B894]/5">✅ দুই কণ্ঠের সংমিশ্রণ</td>
                <td className="py-3 px-4">✅ আছে</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
                <td className="py-3 px-4 text-rose-400">❌ নেই</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Free Forever Banner */}
      <div className="bg-gradient-to-r from-[#6C5CE7]/20 via-[#00B894]/20 to-[#FD79A8]/20 border border-[#6C5CE7]/40 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <span className="text-xs uppercase tracking-wider font-bold text-[#00B894] block">
          ১০০% উন্মুক্ত ও সম্পূর্ণ ফ্রি
        </span>
        <h2 className="text-2xl font-extrabold text-white">
          বাংলা ভাষার জন্য কোনো পেইড লিমিট নেই
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          শিক্ষার্থী, কনটেন্ট ক্রিয়েটর, শিক্ষক এবং ডেভেলপারদের জন্য সাইঅরবিট সর্বদা উন্মুক্ত। আপনি যেকোনো ব্যক্তিগত বা বাণিজ্যিক প্রজেক্টে অবাধে অডিও ব্যবহার করতে পারেন।
        </p>
      </div>
    </div>
  );
};
