import React, { useState, useEffect, useRef } from 'react';
import { VOICE_CATALOG } from '../utils/voiceCatalog';
import { EmotionType } from '../utils/ssmlBuilder';
import { Play, Pause, Loader2, Check, Star } from 'lucide-react';

const API_BASE = 'https://saiorbit-voice.onrender.com';

interface VoiceLibraryProps {
  onApplyPreset: (preset: any, customText?: string) => void;
  onPreviewSample: (
    voiceId: string,
    speed: number,
    pitch: number,
    emotion: string,
    customText?: string,
    shouldSwitchTab?: boolean
  ) => void;
  currentVoiceId: string;
}

export const VoiceLibrary: React.FC<VoiceLibraryProps> = ({
  onApplyPreset,
  onPreviewSample,
  currentVoiceId,
}) => {
  const [filter, setFilter] = useState<'all' | 'bn' | 'hi' | 'en' | 'insta'>('insta');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const handlePreview = async (voiceId: string) => {
    if (playingId === voiceId) {
      stopAudio();
      return;
    }

    stopAudio();
    setLoadingId(voiceId);

    try {
      const v = VOICE_CATALOG.find((item) => item.id === voiceId);
      if (!v) return;

      const res = await fetch(`${API_BASE}/api/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: v.sampleText,
          voice: voiceId,
          lang: v.langCode,
          speed: v.speedDefault,
          pitch: v.pitchDefault,
          emotion: 'neutral',
        }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        audioRef.current = audio;
        setPlayingId(voiceId);

        audio.onended = () => setPlayingId(null);
        audio.onerror = () => setPlayingId(null);

        await audio.play();
      }
    } catch (err) {
      console.error('Preview failed:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSelect = (voiceId: string) => {
    stopAudio();
    const v = VOICE_CATALOG.find((item) => item.id === voiceId);
    if (v) {
      onApplyPreset({
        id: v.id,
        name: v.nameBn,
        voiceId: v.id,
        speed: v.speedDefault,
        pitch: v.pitchDefault,
        emotion: 'neutral',
      });
    }
  };

  const filtered = VOICE_CATALOG.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'insta') return v.category === 'insta-trending' || v.isTrending;
    if (filter === 'bn') return v.langCode.startsWith('bn');
    if (filter === 'hi') return v.langCode === 'hi-IN';
    if (filter === 'en') return v.langCode.startsWith('en');
    return true;
  });

  const filterTabs: Array<{ id: typeof filter; label: string }> = [
    { id: 'insta', label: '🔥 ভাইরাল' },
    { id: 'bn', label: '🇧🇩 বাংলা' },
    { id: 'hi', label: '🇮🇳 হিন্দি' },
    { id: 'en', label: '🇬🇧 ইংরেজি' },
    { id: 'all', label: 'সব' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#12122A] border border-white/10 rounded-2xl p-4">
        <h2 className="text-lg font-bold text-white mb-1">🎤 কণ্ঠ লাইব্রেরি</h2>
        <p className="text-xs text-slate-400">
          প্রিভিউ শুনুন → পছন্দ হলে নির্বাচন করুন → স্টুডিওতে generate করুন
        </p>

        <div className="flex gap-1.5 overflow-x-auto mt-3 pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-[#6C5CE7] text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((v) => {
          const isPlaying = playingId === v.id;
          const isLoading = loadingId === v.id;
          const isSelected = currentVoiceId === v.id;

          return (
            <div
              key={v.id}
              className={`bg-[#12122A] border rounded-2xl p-4 transition-all ${
                isSelected
                  ? 'border-[#6C5CE7] shadow-lg shadow-[#6C5CE7]/20'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-semibold text-white text-sm truncate">{v.nameBn}</h3>
                    {v.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {v.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">{v.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {v.langLabelBn} · {v.gender === 'female' ? 'মহিলা' : 'পুরুষ'}
                  </p>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#6C5CE7] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-3 line-clamp-2 italic">
                "{v.sampleText.slice(0, 80)}..."
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handlePreview(v.id)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>লোড হচ্ছে...</span>
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current text-[#FD79A8]" />
                      <span>থামান</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-[#00B894]" />
                      <span>প্রিভিউ</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSelect(v.id)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#6C5CE7] text-white cursor-default'
                      : 'bg-gradient-to-r from-[#6C5CE7] to-[#FD79A8] text-white hover:opacity-95'
                  }`}
                  disabled={isSelected}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>নির্বাচিত</span>
                    </>
                  ) : (
                    <>
                      <Star className="w-3.5 h-3.5" />
                      <span>বেছে নিন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
