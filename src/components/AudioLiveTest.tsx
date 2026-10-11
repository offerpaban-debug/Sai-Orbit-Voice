import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Activity,
  Play,
  Radio,
  Sliders,
  Zap,
  Gauge,
  Info,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { getAudioContext } from '../utils/audioEngine';
import { VOICE_CATALOG } from '../utils/voiceCatalog';
import { EMOTION_PROFILES, EmotionType } from '../utils/ssmlBuilder';

export const AudioLiveTest: React.FC = () => {
  // Mic state
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [activeInputSource, setActiveInputSource] = useState<'hardware' | 'virtual'>('hardware');
  const [micVolume, setMicVolume] = useState(0);
  const [selectedEffect, setSelectedEffect] = useState<'none' | 'female' | 'deep' | 'radio'>('none');
  const [inputNotice, setInputNotice] = useState<string | null>(null);

  // Live TTS Test state
  const [testText, setTestText] = useState('নমস্কার! এটি সাইঅরবিটের লাইভ স্পিচ টেস্ট ল্যাব।');
  const [selectedVoiceId, setSelectedVoiceId] = useState('bn-IN-Wavenet-A');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('neutral');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // Audio Context & nodes
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const virtualOscillatorRef = useRef<OscillatorNode | null>(null);
  const virtualGainRef = useRef<GainNode | null>(null);
  const biquadFilterRef = useRef<BiquadFilterNode | null>(null);

  // Real-time canvas spectrum visualization
  const startCanvasDrawing = (analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Average volume calculation
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Frequency bars
      const barCount = 48;
      const step = Math.floor(bufferLength / barCount);
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i * step] || 0;
        const barHeight = Math.max(4, (val / 255) * (height * 0.9));
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#00B894');
        grad.addColorStop(0.5, '#6C5CE7');
        grad.addColorStop(1, '#FD79A8');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    draw();
  };

  // Stop any ongoing audio streams & generators
  const stopAudioInput = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (virtualOscillatorRef.current) {
      try {
        virtualOscillatorRef.current.stop();
        virtualOscillatorRef.current.disconnect();
      } catch {
        // ignore
      }
      virtualOscillatorRef.current = null;
    }
    setIsAudioActive(false);
    setMicVolume(0);
  };

  // Start virtual audio generator (loopback simulation for environments without hardware mic)
  const startVirtualAudio = () => {
    stopAudioInput();

    try {
      const audioCtx = getAudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Create rich vocal harmonic oscillator with frequency sweeps
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);

      // Periodic vibrato & speech cadence modulation
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(3.5, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(45, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      // Shaping filter
      const filter = audioCtx.createBiquadFilter();
      updateFilterParameters(filter, selectedEffect);
      biquadFilterRef.current = filter;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      virtualGainRef.current = gain;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);
      // Analyser not connected to destination to avoid unwanted loud speaker loop in background
      osc.start();
      virtualOscillatorRef.current = osc;

      startCanvasDrawing(analyser);
      setIsAudioActive(true);
      setActiveInputSource('virtual');
      setInputNotice('ভার্চুয়াল অডিও ইনপুট সক্রিয় — রিয়েল-টাইম স্পেকট্রাম বিশ্লেষণ চলছে।');
    } catch {
      // fallback
    }
  };

  // Update BiquadFilter parameters based on effect selection
  const updateFilterParameters = (filter: BiquadFilterNode, effect: string) => {
    if (effect === 'deep') {
      filter.type = 'lowshelf';
      filter.frequency.value = 350;
      filter.gain.value = 8;
    } else if (effect === 'female') {
      filter.type = 'highshelf';
      filter.frequency.value = 2400;
      filter.gain.value = 6;
    } else if (effect === 'radio') {
      filter.type = 'bandpass';
      filter.frequency.value = 1600;
      filter.Q.value = 1.8;
    } else {
      filter.type = 'allpass';
    }
  };

  // Effect change handler
  const handleEffectChange = (effect: 'none' | 'female' | 'deep' | 'radio') => {
    setSelectedEffect(effect);
    if (biquadFilterRef.current) {
      updateFilterParameters(biquadFilterRef.current, effect);
    }
  };

  // Toggle Microphone (attempts hardware, falls back cleanly to virtual if unavailable)
  const toggleMicrophone = async () => {
    if (isAudioActive) {
      stopAudioInput();
      setInputNotice(null);
      return;
    }

    // Try hardware microphone
    if (navigator?.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const audioCtx = getAudioContext();

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        const filter = audioCtx.createBiquadFilter();
        updateFilterParameters(filter, selectedEffect);
        biquadFilterRef.current = filter;

        source.connect(filter);
        filter.connect(analyser);

        startCanvasDrawing(analyser);
        setIsAudioActive(true);
        setActiveInputSource('hardware');
        setInputNotice('হার্ডওয়্যার মাইক্রোফোন সংযুক্ত — লাইভ অডিও গ্রহণ করা হচ্ছে।');
        return;
      } catch (err: unknown) {
        // Hardware mic missing or denied, switch gracefully to virtual simulation without crashing
        startVirtualAudio();
        setInputNotice('হার্ডওয়্যার মাইক্রোফোন পাওয়া যায়নি। ভার্চুয়াল অডিও ইনপুট মোডে টেস্ট চলছে।');
        return;
      }
    }

    // If navigator.mediaDevices is not available, start virtual audio
    startVirtualAudio();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudioInput();
    };
  }, []);

  // Live Instant TTS audition test
  const handleInstantTTS = async (customPhrase?: string) => {
    const textToSpeak = customPhrase || testText;
    if (!textToSpeak.trim()) return;

    setIsSynthesizing(true);
    const start = performance.now();

    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voice: selectedVoiceId,
          speed: 1.0,
          pitch: 0,
          emotion: selectedEmotion,
        }),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audio.play().catch(() => {});

        // Pipe audio to canvas visualizer
        try {
          const audioCtx = getAudioContext();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          startCanvasDrawing(analyser);
        } catch {
          // ignore
        }
      } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'bn-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // ignore
    } finally {
      setIsSynthesizing(false);
    }
  };

  const sampleQuickPhrases = [
    'দাঁড়ান! এই ৩টি এআই ট্রিক দেখে যান 🔥',
    'Stop scrolling right now! You need to hear this ⚡',
    'रुको भाई! अगर तुम २०२৬ में सफल होना चाहते हो 🇮🇳',
    'Come spend a slow rainy morning with me ✨',
    'নমস্কার, সাইঅরবিট লাইভ টেস্টে স্বাগতম!',
    'Never explain yourself. Let success make noise 🗿'
  ];

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#00B894]" />
            <span>অডিও লাইভ টেস্ট ল্যাব (Audio Live Test Lab)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            রিয়েল-টাইম অডিও ইনপুট, স্পেকট্রাম অ্যানালাইজার এবং তাৎক্ষণিক লো-ল্যাটেন্সি ভয়েস অডিশন।
          </p>
        </div>

        {/* Latency Gauge */}
        {latencyMs !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Gauge className="w-4 h-4 text-[#00B894]" />
            <span className="text-slate-400">রেসপন্স ল্যাটেন্সি:</span>
            <span className="font-mono font-bold text-[#00B894]">{latencyMs}ms</span>
          </div>
        )}
      </div>

      {/* Real-time Spectrum Visualizer Screen */}
      <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#6C5CE7]" />
            লাইভ ফ্রিকোয়েন্সি স্পেকট্রাম (Real-time Audio Spectrum)
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {isAudioActive
              ? activeInputSource === 'hardware'
                ? `হার্ডওয়্যার মাইক (${micVolume}%)`
                : `ভার্চুয়াল অডিও লুপব্যাক (${micVolume}%)`
              : 'স্ট্যান্ডবাই মোড'}
          </span>
        </div>

        {/* Canvas */}
        <div className="relative bg-black/40 rounded-lg p-2 border border-white/5 overflow-hidden flex items-center justify-center h-28">
          <canvas
            ref={canvasRef}
            width={650}
            height={110}
            className="w-full h-full block"
          />
          {!isAudioActive && !isSynthesizing && (
            <div className="absolute text-slate-500 text-xs flex items-center gap-2 select-none">
              <span>অডিও টেস্ট শুরু করতে নিচের বাটনে ক্লিক করুন</span>
            </div>
          )}
        </div>

        {/* Status Notice if any */}
        {inputNotice && (
          <div className="flex items-center gap-2 text-xs text-[#00B894] bg-[#00B894]/10 border border-[#00B894]/20 rounded-lg px-3 py-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{inputNotice}</span>
          </div>
        )}

        {/* Live Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                isAudioActive
                  ? 'bg-rose-500 text-white shadow-rose-500/20'
                  : 'bg-[#00B894] text-slate-950 hover:bg-[#00a382]'
              }`}
            >
              {isAudioActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isAudioActive ? 'অডিও বন্ধ করুন' : 'লাইভ অডিও ইনপুট চালু করুন'}</span>
            </button>

            {/* Virtual Audio Switcher */}
            <button
              type="button"
              onClick={startVirtualAudio}
              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                isAudioActive && activeInputSource === 'virtual'
                  ? 'bg-[#6C5CE7]/30 border-[#6C5CE7] text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <span>ভার্চুয়াল লুপব্যাক মোড</span>
            </button>
          </div>

          {/* Voice transformation filter select */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">লাইভ ফিল্টার:</span>
            <select
              value={selectedEffect}
              onChange={(e) => handleEffectChange(e.target.value as any)}
              className="bg-[#12122A] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#6C5CE7]"
            >
              <option value="none">স্বাভাবিক (Normal)</option>
              <option value="female">উচ্চ পিচ (High Pitch)</option>
              <option value="deep">গম্ভীর ব্রডকাস্ট (Deep Bass)</option>
              <option value="radio">রেডিও ফিল্টার (Radio Bandpass)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Instant Voice Audition (Instant TTS Testing) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>তাৎক্ষণিক লাইভ স্পিচ টেস্ট (Instant Voice Audition)</span>
          </h3>
          <span className="text-xs text-slate-400">টাইপ করে সাথে সাথে উচ্চারণ শুনুন</span>
        </div>

        {/* Input Text Box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="পরীক্ষার জন্য যেকোনো বাংলা বাক্য লিখুন..."
            className="flex-1 bg-[#0A0A1A] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6C5CE7]"
          />
          <button
            type="button"
            disabled={isSynthesizing || !testText.trim()}
            onClick={() => handleInstantTTS()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white font-bold text-xs hover:opacity-95 transition-all flex items-center gap-2 shadow-md shadow-[#6C5CE7]/30 shrink-0 disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isSynthesizing ? 'উচ্চারণ হচ্ছে...' : 'লাইভ টেস্ট'}</span>
          </button>
        </div>

        {/* Quick Sample Phrase Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <span className="text-slate-500 text-[11px] whitespace-nowrap">দ্রুত টেস্ট করুন:</span>
          {sampleQuickPhrases.map((phrase, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTestText(phrase);
                handleInstantTTS(phrase);
              }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 whitespace-nowrap transition-colors"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Voice Selector Buttons for Fast Comparison */}
        <div className="bg-[#0A0A1A]/60 border border-white/10 rounded-xl p-3.5 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">এক-ক্লিকে কণ্ঠ পরিবর্তন ও তুলনা:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VOICE_CATALOG.slice(0, 8).map((v) => {
              const isSelected = selectedVoiceId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVoiceId(v.id);
                    handleInstantTTS();
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'border-[#6C5CE7] bg-[#6C5CE7]/20 text-white shadow-sm'
                      : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold truncate">{v.nameBn}</div>
                  <div className="text-[10px] text-slate-400 truncate">{v.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
