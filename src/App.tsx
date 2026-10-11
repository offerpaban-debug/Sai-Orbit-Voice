import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TextEditor } from './components/TextEditor';
import { AudioPlayer } from './components/AudioPlayer';
import { ControlsPanel } from './components/ControlsPanel';
import { VoiceLibrary } from './components/VoiceLibrary';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutPricing } from './components/AboutPricing';
import { BengaliKeyboardModal } from './components/BengaliKeyboardModal';
import { Toast, ToastMessage } from './components/Toast';
import { VOICE_CATALOG } from './utils/voiceCatalog';
import { EmotionType } from './utils/ssmlBuilder';
import {
  decodeAudioBase64,
  applyPostProcessing,
  synthesizeWithWebSpeech,
  audioBufferToWavBlob,
  blobToBase64,
} from './utils/audioEngine';
import { splitBengaliSentences } from './utils/bengaliNormalizer';

// ============================================================
// BACKEND API URL — Cloudflare Pages → Render backend
// ============================================================
const API_BASE = 'https://saiorbit-voice.onrender.com';

export interface HistoryItem {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  emotion: EmotionType;
  speed: number;
  pitch: number;
  durationSec: number;
  audioBase64?: string;
  timestamp: number;
  isFavorite?: boolean;
}

const DEFAULT_SAMPLE_TEXT =
  'আন্তর্জাতিক বিজ্ঞান ও প্রযুক্তি সম্মেলনে সাইঅরবিট কৃত্রিম বুদ্ধিমত্তা চালিত নতুন বাংলা ভয়েস মডেল উন্মোচন করেছে। বিশেষজ্ঞদের মতে এটি বাংলা বাক-সংশ্লেষণের ক্ষেত্রে এক বিরাট অগ্রগতি।';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('saiorbit_theme') as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [text, setText] = useState(DEFAULT_SAMPLE_TEXT);
  const [selectedVoiceId, setSelectedVoiceId] = useState('insta-ranbir-bangla');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [emotion, setEmotion] = useState<EmotionType>('neutral');
  const [normalize, setNormalize] = useState(true);
  const [warmthEq, setWarmthEq] = useState(true);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [sentences, setSentences] = useState<
    Array<{ text: string; startSec: number; endSec: number }>
  >([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('saiorbit_voice_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('saiorbit_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('saiorbit_voice_history', JSON.stringify(history.slice(0, 100)));
  }, [history]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: String(Date.now()), type, message });
  };

  const currentVoice = VOICE_CATALOG.find((v) => v.id === selectedVoiceId) || VOICE_CATALOG[0];

  // ============================================================
  // PRIMARY VOICE GENERATION — Fixed with API_BASE
  // ============================================================
  const handleGenerateVoice = async () => {
    if (!text.trim()) {
      showToast('অনুগ্রহ করে কোনো বাংলা টেক্সট লিখুন', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE}/api/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoiceId,
          lang: currentVoice.langCode,
          speed,
          pitch,
          emotion,
          volume: 0,
          postProcessing: { normalize, warmthEq },
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();

      let finalBuffer: AudioBuffer | null = null;
      let finalSentences = data.sentences || [];

      if (data.audioBase64) {
        const decoded = await decodeAudioBase64(data.audioBase64);
        finalBuffer = await applyPostProcessing(decoded, { normalize, warmthEq });
        setAudioBuffer(finalBuffer);
        setAudioBase64(data.audioBase64);
      } else {
        const synthesized = await synthesizeWithWebSpeech(text.trim(), {
          langCode: currentVoice.langCode,
          speed,
          pitch: 1.0 + pitch * 0.05,
          gender: currentVoice.gender,
        });

        finalBuffer = await applyPostProcessing(synthesized.audioBuffer, { normalize, warmthEq });
        setAudioBuffer(finalBuffer);
        setAudioBase64(null);

        const splitText = splitBengaliSentences(text.trim());
        const duration = synthesized.durationSec;
        const totalChars = text.length || 1;
        let cur = 0;
        finalSentences = splitText.map((s) => {
          const frac = s.length / totalChars;
          const dur = Math.max(0.8, frac * duration);
          const item = {
            text: s,
            startSec: Math.round(cur * 100) / 100,
            endSec: Math.round((cur + dur) * 100) / 100,
          };
          cur += dur;
          return item;
        });
      }

      setSentences(finalSentences);

      let savedAudioBase64 = data.audioBase64 || undefined;
      if (!savedAudioBase64 && finalBuffer) {
        try {
          const wavBlob = audioBufferToWavBlob(finalBuffer);
          savedAudioBase64 = await blobToBase64(wavBlob);
          setAudioBase64(savedAudioBase64);
        } catch {}
      }

      const newHistoryItem: HistoryItem = {
        id: `gen-${Date.now()}`,
        text: text.trim(),
        voiceId: selectedVoiceId,
        voiceName: currentVoice.nameBn,
        emotion,
        speed,
        pitch,
        durationSec: finalBuffer ? Math.round(finalBuffer.duration * 10) / 10 : 3,
        audioBase64: savedAudioBase64,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 99)]);
      showToast(data.cached ? 'ক্যাশ থেকে লোড হয়েছে!' : 'ভয়েস সফলভাবে তৈরি হয়েছে!');
    } catch (err) {
      console.error('Generation failed:', err);
      showToast('ভয়েস তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // ============================================================
  // ENHANCE TEXT WITH AI — Fixed API_BASE
  // ============================================================
  const handleEnhanceWithAI = async () => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch(`${API_BASE}/api/enhance-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (data.enhancedText) {
        setText(data.enhancedText);
        showToast('কৃত্রিম বুদ্ধিমত্তা দিয়ে টেক্সট নিখুঁত করা হয়েছে!');
      }
    } catch (err) {
      console.error('Enhance failed:', err);
      showToast('টেক্সট পরিমার্জন করা যায়নি।', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  // ============================================================
  // PREVIEW SAMPLE — Fixed API_BASE
  // ============================================================
  const handlePreviewSample = async (
    voiceId: string,
    sampleSpeed: number,
    samplePitch: number,
    sampleEmotion: string,
    customSampleText?: string,
    shouldSwitchTab = true
  ) => {
    const v = VOICE_CATALOG.find((item) => item.id === voiceId) || VOICE_CATALOG[0];
    setSelectedVoiceId(voiceId);
    setSpeed(sampleSpeed);
    setPitch(samplePitch);
    setEmotion(sampleEmotion as EmotionType);

    try {
      const textToSynthesize = customSampleText || v.sampleText;
      const res = await fetch(`${API_BASE}/api/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSynthesize,
          voice: voiceId,
          lang: v.langCode,
          speed: sampleSpeed,
          pitch: samplePitch,
          emotion: sampleEmotion,
          isTrending: voiceId.startsWith('insta-'),
        }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        const decoded = await decodeAudioBase64(data.audioBase64);
        setAudioBuffer(decoded);
        setAudioBase64(data.audioBase64);
        setSentences(data.sentences || []);
        if (shouldSwitchTab) setActiveTab('studio');
        showToast(`নমুনা প্লে হচ্ছে: ${v.nameBn}`);
      }
    } catch {
      showToast('নমুনা অডিও লোড করা যায়নি', 'error');
    }
  };

  const handleApplyPreset = (preset: any, customText?: string) => {
    setSelectedVoiceId(preset.voiceId);
    setSpeed(preset.speed);
    setPitch(preset.pitch);
    setEmotion(preset.emotion as EmotionType);
    if (customText) setText(customText);
    setActiveTab('studio');
    showToast(`প্রিসেট সক্রিয়: ${preset.name}`);
  };

  const handleInsertChar = (char: string) => setText((prev) => prev + char);
  const handleBackspace = () => setText((prev) => prev.slice(0, -1));
  const handleEnter = () => setText((prev) => prev + '\n');
  const handleClear = () => setText('');

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1A] text-slate-100 transition-colors">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        totalGeneratedCount={history.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
        {activeTab === 'studio' && (
          <>
            <ControlsPanel
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={(id) => {
                setSelectedVoiceId(id);
                const v = VOICE_CATALOG.find((x) => x.id === id);
                if (v) {
                  setSpeed(v.speedDefault);
                  setPitch(v.pitchDefault);
                }
              }}
              speed={speed}
              setSpeed={setSpeed}
              pitch={pitch}
              setPitch={setPitch}
              emotion={emotion}
              setEmotion={setEmotion}
              normalize={normalize}
              setNormalize={setNormalize}
              warmthEq={warmthEq}
              setWarmthEq={setWarmthEq}
              onPreviewSample={handlePreviewSample}
            />

            <TextEditor
              text={text}
              setText={setText}
              onOpenKeyboard={() => setIsKeyboardOpen(true)}
              onEnhanceWithAI={handleEnhanceWithAI}
              isEnhancing={isEnhancing}
            />

            <button
              onClick={handleGenerateVoice}
              disabled={isGenerating || !text.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C5CE7] via-[#FD79A8] to-[#00B894] text-white font-bold text-base shadow-xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? '⏳ কণ্ঠ তৈরি হচ্ছে...' : '🔊 কণ্ঠ তৈরি করুন (Generate Voice)'}
            </button>

            {(audioBuffer || audioBase64) && (
              <AudioPlayer
                audioBuffer={audioBuffer}
                audioBase64={audioBase64}
                sentences={sentences}
                voiceName={currentVoice.nameBn}
              />
            )}
          </>
        )}

        {activeTab === 'library' && (
          <VoiceLibrary
            onApplyPreset={handleApplyPreset}
            onPreviewSample={handlePreviewSample}
            currentVoiceId={selectedVoiceId}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onSelectItem={(item) => {
              setText(item.text);
              setSelectedVoiceId(item.voiceId);
              setEmotion(item.emotion);
              setSpeed(item.speed);
              setPitch(item.pitch);
              if (item.audioBase64) {
                setAudioBase64(item.audioBase64);
                decodeAudioBase64(item.audioBase64)
                  .then(setAudioBuffer)
                  .catch(() => {});
              }
              setActiveTab('studio');
            }}
            onClearHistory={() => setHistory([])}
            onDeleteItem={(id) => setHistory((prev) => prev.filter((x) => x.id !== id))}
            onToggleFavorite={(id) =>
              setHistory((prev) =>
                prev.map((x) => (x.id === id ? { ...x, isFavorite: !x.isFavorite } : x))
              )
            }
          />
        )}

        {activeTab === 'about' && <AboutPricing />}
      </main>

      <BengaliKeyboardModal
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onInsertChar={handleInsertChar}
        onBackspace={handleBackspace}
        onEnter={handleEnter}
        onClear={handleClear}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
