import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TextEditor } from './components/TextEditor';
import { AudioPlayer } from './components/AudioPlayer';
import { ControlsPanel } from './components/ControlsPanel';
import { VoiceLibrary } from './components/VoiceLibrary';
import { VoiceBlending } from './components/VoiceBlending';
import { SSMLEditor } from './components/SSMLEditor';
import { BatchMode } from './components/BatchMode';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutPricing } from './components/AboutPricing';
import { BengaliKeyboardModal } from './components/BengaliKeyboardModal';
import { LoginModal, UserProfile } from './components/LoginModal';
import { PaidFeaturesModal } from './components/PaidFeaturesModal';
import { AudioLiveTest } from './components/AudioLiveTest';
import { Toast, ToastMessage } from './components/Toast';
import { Logo } from './components/Logo';
import { VOICE_CATALOG, VoicePreset } from './utils/voiceCatalog';
import { EmotionType } from './utils/ssmlBuilder';
import {
  decodeAudioBase64,
  applyPostProcessing,
  synthesizeWithWebSpeech,
  audioBufferToWavBlob,
} from './utils/audioEngine';
import { splitBengaliSentences } from './utils/bengaliNormalizer';
import { Volume2, Sparkles, Loader2, ArrowRight, Crown, Radio } from 'lucide-react';

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
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('saiorbit_theme') as 'dark' | 'light') || 'dark';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');

  // User & Authentication State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('saiorbit_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      isLoggedIn: true,
      name: 'পাবন (Paban)',
      email: 'offer.paban@gmail.com',
      plan: 'pro',
      charactersUsed: 14250,
      charactersLimit: 150000,
    };
  });

  // Paid / Pro Studio State
  const [isProActive, setIsProActive] = useState<boolean>(() => {
    return localStorage.getItem('saiorbit_pro_active') !== 'false';
  });
  const [proBitrate, setProBitrate] = useState<'standard' | 'ultra48k'>('ultra48k');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(100);
  const [voiceCloningEnabled, setVoiceCloningEnabled] = useState<boolean>(false);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaidFeaturesModalOpen, setIsPaidFeaturesModalOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Studio Input & Settings
  const [text, setText] = useState(DEFAULT_SAMPLE_TEXT);
  const [selectedVoiceId, setSelectedVoiceId] = useState('bn-IN-Wavenet-A');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [emotion, setEmotion] = useState<EmotionType>('neutral');
  const [normalize, setNormalize] = useState(true);
  const [warmthEq, setWarmthEq] = useState(true);

  // Audio Output State
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [sentences, setSentences] = useState<
    Array<{ text: string; startSec: number; endSec: number }>
  >([]);

  // Loading States & Telemetry
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generationTimeMs, setGenerationTimeMs] = useState<number | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('saiorbit_voice_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Apply theme to document
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

  // Persist user and pro status
  useEffect(() => {
    localStorage.setItem('saiorbit_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('saiorbit_pro_active', String(isProActive));
  }, [isProActive]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('saiorbit_voice_history', JSON.stringify(history.slice(0, 100)));
  }, [history]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  const currentVoice =
    VOICE_CATALOG.find((v) => v.id === selectedVoiceId) || VOICE_CATALOG[0];

  // Auth Handlers
  const handleLogin = (email: string, name: string) => {
    setUser({
      isLoggedIn: true,
      name,
      email,
      plan: 'pro',
      charactersUsed: user.charactersUsed || 14250,
      charactersLimit: 150000,
    });
    showToast(`স্বাগতম, ${name}! সফলভাবে লগইন হয়েছে।`);
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      name: 'অতিথি (Guest)',
      email: '',
      plan: 'free',
      charactersUsed: 0,
      charactersLimit: 10000,
    });
    showToast('লগআউট সম্পন্ন হয়েছে', 'info');
  };

  const handleUpgradeToPro = () => {
    setIsProActive(true);
    setUser((prev) => ({ ...prev, plan: 'pro', charactersLimit: 250000 }));
    showToast('অভিনন্দন! প্রো স্টুডিও মোড সক্রিয় হয়েছে 👑');
  };

  // ----------------------------------------------------------------
  // PRIMARY VOICE GENERATION
  // ----------------------------------------------------------------
  const handleGenerateVoice = async () => {
    if (!text.trim()) {
      showToast('অনুগ্রহ করে কোনো বাংলা টেক্সট লিখুন', 'error');
      return;
    }

    setIsGenerating(true);
    const startTime = performance.now();

    try {
      // 1. Call Backend TTS endpoint
      const response = await fetch('/api/synthesize', {
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
          proMode: isProActive,
          proBitrate,
          emotionIntensity,
        }),
      });

      const data = await response.json();
      const elapsed = Math.round(performance.now() - startTime);
      setGenerationTimeMs(elapsed);

      let finalBuffer: AudioBuffer | null = null;
      let finalSentences = data.sentences || [];

      if (data.audioBase64) {
        // Decode base64 audio
        const decoded = await decodeAudioBase64(data.audioBase64);
        // Apply post-processing DSP if toggled
        finalBuffer = await applyPostProcessing(decoded, {
          normalize,
          warmthEq,
        });
        setAudioBuffer(finalBuffer);
        setAudioBase64(data.audioBase64);
      } else {
        // Fallback to high-fidelity Web Speech + Audio Formant synthesis
        const synthesized = await synthesizeWithWebSpeech(text.trim(), {
          langCode: currentVoice.langCode,
          speed,
          pitch: 1.0 + pitch * 0.05,
          gender: currentVoice.gender,
        });

        finalBuffer = await applyPostProcessing(synthesized.audioBuffer, {
          normalize,
          warmthEq,
        });
        setAudioBuffer(finalBuffer);
        setAudioBase64(null);

        // Calculate sentences if not provided
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

      // Increment quota used
      setUser((prev) => ({
        ...prev,
        charactersUsed: prev.charactersUsed + text.length,
      }));

      // Save to History (max 100 items)
      const newHistoryItem: HistoryItem = {
        id: `gen-${Date.now()}`,
        text: text.trim(),
        voiceId: selectedVoiceId,
        voiceName: currentVoice.nameBn,
        emotion,
        speed,
        pitch,
        durationSec: finalBuffer ? Math.round(finalBuffer.duration * 10) / 10 : 3,
        audioBase64: data.audioBase64 || undefined,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 99)]);
      showToast(
        data.cached
          ? 'ক্যাশ থেকে তাৎক্ষণিক ভয়েস লোড হয়েছে!'
          : isProActive
          ? 'আল্ট্রা-এইচডি স্টুডিও ভয়েস সফলভাবে তৈরি হয়েছে! 👑'
          : 'ভয়েস সফলভাবে তৈরি হয়েছে!'
      );
    } catch (err) {
      console.error('Generation failed:', err);
      showToast('ভয়েস তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // ----------------------------------------------------------------
  // ENHANCE TEXT WITH GEMINI AI
  // ----------------------------------------------------------------
  const handleEnhanceWithAI = async () => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-text', {
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
      showToast('টেক্সট পরিমার্জন সম্পন্ন করা যায়নি।', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  // ----------------------------------------------------------------
  // PREVIEW SAMPLE VOICE
  // ----------------------------------------------------------------
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
      const res = await fetch('/api/synthesize', {
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
        if (shouldSwitchTab) {
          setActiveTab('studio');
        }
        showToast(`নমুনা প্লে হচ্ছে: ${v.nameBn}`);
      }
    } catch {
      showToast('নমুনা অডিও লোড করা যায়নি', 'error');
    }
  };

  // ----------------------------------------------------------------
  // BLENDED VOICE GENERATION
  // ----------------------------------------------------------------
  const handleGenerateBlended = async (
    voiceAId: string,
    voiceBId: string,
    ratio: number,
    blendText: string
  ) => {
    setIsGenerating(true);
    try {
      const vA = VOICE_CATALOG.find((v) => v.id === voiceAId) || VOICE_CATALOG[0];
      const vB = VOICE_CATALOG.find((v) => v.id === voiceBId) || VOICE_CATALOG[1];

      // Interpolate speed and pitch between voice A & B
      const blendedSpeed = vA.speedDefault * (1 - ratio) + vB.speedDefault * ratio;
      const blendedPitch = Math.round(vA.pitchDefault * (1 - ratio) + vB.pitchDefault * ratio);
      const chosenVoiceId = ratio > 0.5 ? voiceBId : voiceAId;

      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: blendText,
          voice: chosenVoiceId,
          lang: vA.langCode,
          speed: blendedSpeed,
          pitch: blendedPitch,
          emotion: 'happy',
        }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        const decoded = await decodeAudioBase64(data.audioBase64);
        const processed = await applyPostProcessing(decoded, { normalize: true, warmthEq: true });
        setAudioBuffer(processed);
        setAudioBase64(data.audioBase64);
        setSentences(data.sentences || []);
        setText(blendText);
        setActiveTab('studio');
        showToast('হাইব্রিড ব্লেন্ড ভয়েস তৈরি হয়েছে!');
      }
    } catch (err) {
      console.error(err);
      showToast('ব্লেন্ডিং অডিও তৈরিতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // ----------------------------------------------------------------
  // SSML SYNTHESIS
  // ----------------------------------------------------------------
  const handleSynthesizeSSML = async (ssml: string) => {
    const cleanText = ssml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    setText(cleanText);
    await handleGenerateVoice();
    setActiveTab('studio');
  };

  // ----------------------------------------------------------------
  // BATCH MODE ITEM SYNTHESIZER
  // ----------------------------------------------------------------
  const handleSynthesizeBatchItem = async (
    itemText: string,
    voiceId: string,
    itemEmotion: EmotionType
  ): Promise<Blob> => {
    const res = await fetch('/api/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: itemText,
        voice: voiceId,
        speed: 1.0,
        pitch: 0,
        emotion: itemEmotion,
      }),
    });
    const data = await res.json();
    if (data.audioBase64) {
      const decoded = await decodeAudioBase64(data.audioBase64);
      return audioBufferToWavBlob(decoded);
    } else {
      const synth = await synthesizeWithWebSpeech(itemText, { speed: 1.0 });
      return audioBufferToWavBlob(synth.audioBuffer);
    }
  };

  // Virtual Keyboard
  const handleInsertChar = (char: string) => setText((prev) => prev + char);
  const handleBackspace = () => setText((prev) => prev.slice(0, -1));
  const handleEnter = () => setText((prev) => prev + '\n');
  const handleClear = () => setText('');

  // Preset
  const handleApplyPreset = (preset: VoicePreset, customText?: string) => {
    setSelectedVoiceId(preset.voiceId);
    setSpeed(preset.speed);
    setPitch(preset.pitch);
    setEmotion(preset.emotion as EmotionType);
    if (customText) {
      setText(customText);
    }
    setActiveTab('studio');
    showToast(`প্রিসেট সক্রিয় হয়েছে: ${preset.name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1A] text-slate-100 transition-colors selection:bg-[#6C5CE7]/40 selection:text-white">
      {/* Brand Responsive Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        totalGeneratedCount={history.length}
        user={user}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenPaidFeaturesModal={() => setIsPaidFeaturesModalOpen(true)}
        isProActive={isProActive}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Pro Mode Active Ribbon */}
        {isProActive && activeTab === 'studio' && (
          <div className="mb-5 bg-gradient-to-r from-amber-500/15 via-[#6C5CE7]/15 to-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Crown className="w-4 h-4 text-amber-400 fill-current shrink-0" />
              <span>
                SAIORBIT STUDIO PRO সক্রিয় (৪৮kHz আল্ট্রা-এইচডি ও ইমোশন বুস্টার আনলকড)
              </span>
            </div>
            <button
              onClick={() => setIsPaidFeaturesModalOpen(true)}
              className="text-amber-400 hover:text-amber-200 underline font-medium text-[11px] shrink-0"
            >
              সেটিংস পরিবর্তন
            </button>
          </div>
        )}

        {/* TAB 1: STUDIO (Default ElevenLabs-Style View) */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Top Split Layout: Left Text Area | Right Waveform Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Script Editor (7 Cols) */}
              <div className="lg:col-span-7">
                <TextEditor
                  text={text}
                  setText={setText}
                  onOpenKeyboard={() => setIsKeyboardOpen(true)}
                  onEnhanceWithAI={handleEnhanceWithAI}
                  isEnhancing={isEnhancing}
                />
              </div>

              {/* Right Column: Audio Waveform Player (5 Cols) */}
              <div className="lg:col-span-5">
                <AudioPlayer
                  audioBuffer={audioBuffer}
                  audioBase64={audioBase64}
                  sentences={sentences}
                  title={currentVoice.nameBn}
                  voiceName={currentVoice.name}
                />
              </div>
            </div>

            {/* Middle Section: Voice & Emotion Controls */}
            <ControlsPanel
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={setSelectedVoiceId}
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
            />

            {/* Bottom Giant CTA: Generate Voice */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isGenerating || !text.trim()}
                onClick={handleGenerateVoice}
                className="w-full relative group overflow-hidden py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-[#6C5CE7] via-[#FD79A8] to-[#00B894] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#6C5CE7]/30 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-40 cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span>কণ্ঠ তৈরি হচ্ছে (Synthesizing Speech)...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-6 h-6 fill-current" />
                    <span>🔊 কণ্ঠ তৈরি করুন (Generate Voice)</span>
                    {generationTimeMs && (
                      <span className="text-xs font-mono font-normal opacity-80 hidden sm:inline">
                        (সর্বশেষ: {generationTimeMs}ms)
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>

            {/* Quick Recent Generations Ribbon below Studio */}
            {history.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">সাম্প্রতিক অডিও (Recent Clips):</span>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="hover:text-white transition-colors flex items-center gap-1 text-[#6C5CE7]"
                  >
                    <span>সম্পূর্ণ ইতিহাস দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {history.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setText(item.text);
                        setSelectedVoiceId(item.voiceId);
                        setEmotion(item.emotion);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-left max-w-[240px] shrink-0 transition-all hover:border-[#6C5CE7]/40"
                    >
                      <div className="font-semibold text-white truncate">{item.voiceName}</div>
                      <div className="text-slate-400 truncate text-[11px] mt-0.5">&ldquo;{item.text}&rdquo;</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AUDIO LIVE TEST */}
        {activeTab === 'livetest' && <AudioLiveTest />}

        {/* TAB 3: VOICE LIBRARY */}
        {activeTab === 'library' && (
          <VoiceLibrary
            onApplyPreset={handleApplyPreset}
            onPreviewSample={handlePreviewSample}
            currentVoiceId={selectedVoiceId}
          />
        )}

        {/* TAB 4: VOICE BLENDING */}
        {activeTab === 'blend' && (
          <VoiceBlending
            onGenerateBlended={handleGenerateBlended}
            isGenerating={isGenerating}
          />
        )}

        {/* TAB 5: SSML EDITOR */}
        {activeTab === 'ssml' && (
          <SSMLEditor
            initialText={text}
            onSynthesizeSSML={handleSynthesizeSSML}
            isGenerating={isGenerating}
          />
        )}

        {/* TAB 6: BATCH MODE */}
        {activeTab === 'batch' && (
          <BatchMode onSynthesizeItem={handleSynthesizeBatchItem} />
        )}

        {/* TAB 7: HISTORY */}
        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onReplayItem={(item) => {
              setText(item.text);
              setSelectedVoiceId(item.voiceId);
              setEmotion(item.emotion);
              setActiveTab('studio');
              handleGenerateVoice();
            }}
            onLoadTextToEditor={(itemText, voiceId, itemEmotion) => {
              setText(itemText);
              setSelectedVoiceId(voiceId);
              setEmotion(itemEmotion);
              setActiveTab('studio');
              showToast('স্টুডিওতে লোড করা হয়েছে');
            }}
            onToggleFavorite={(id) => {
              setHistory(
                history.map((it) => (it.id === id ? { ...it, isFavorite: !it.isFavorite } : it))
              );
            }}
            onDeleteItem={(id) => {
              setHistory(history.filter((it) => it.id !== id));
            }}
            onClearAll={() => setHistory([])}
          />
        )}

        {/* TAB 8: ABOUT & PRICING */}
        {activeTab === 'about' && <AboutPricing />}
      </main>

      {/* LOGIN & USER PROFILE MODAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpgradeToPro={handleUpgradeToPro}
      />

      {/* PAID & PRO STUDIO FEATURES MODAL */}
      <PaidFeaturesModal
        isOpen={isPaidFeaturesModalOpen}
        onClose={() => setIsPaidFeaturesModalOpen(false)}
        isProActive={isProActive}
        onToggleProMode={() => {
          const next = !isProActive;
          setIsProActive(next);
          showToast(next ? 'প্রো মোড সক্রিয় করা হয়েছে 👑' : 'প্রো মোড বন্ধ করা হয়েছে');
        }}
        proBitrate={proBitrate}
        setProBitrate={setProBitrate}
        emotionIntensity={emotionIntensity}
        setEmotionIntensity={setEmotionIntensity}
        voiceCloningEnabled={voiceCloningEnabled}
        setVoiceCloningEnabled={setVoiceCloningEnabled}
      />

      {/* Virtual Bengali Keyboard Modal */}
      <BengaliKeyboardModal
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onInsertChar={handleInsertChar}
        onBackspace={handleBackspace}
        onEnter={handleEnter}
        onClear={handleClear}
      />

      {/* Bengali Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Brand Footer */}
      <footer className="border-t border-white/5 py-6 bg-[#0A0A1A] mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Logo size="sm" animated={false} />
            <span className="text-sm font-bold text-white">SAIORBIT VOICE</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">সাইঅরবিট ভয়েস</span>
          </div>
          <p className="text-xs text-slate-500">
            &ldquo;মানুষের মতো কণ্ঠ, বাংলায়&rdquo; · ১০০% উন্মুক্ত ও ফ্রি বাংলা টেক্সট-টু-স্পিচ ইঞ্জিন
          </p>
        </div>
      </footer>
    </div>
  );
}
