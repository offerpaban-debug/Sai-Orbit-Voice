import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  FileText,
  FastForward,
  Rewind,
  Music2,
  Share2
} from 'lucide-react';
import {
  audioBufferToWavBlob,
  downloadBlob,
  extractWaveformPeaks,
  generateSrtSubtitles
} from '../utils/audioEngine';

interface SentenceItem {
  text: string;
  startSec: number;
  endSec: number;
}

interface AudioPlayerProps {
  audioBuffer: AudioBuffer | null;
  audioBase64: string | null;
  sentences: SentenceItem[];
  title?: string;
  voiceName?: string;
  onOpenShare?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBuffer,
  audioBase64,
  sentences,
  title = 'কণ্ঠ রেকর্ডিং',
  voiceName = 'bn-IN-Wavenet-A',
  onOpenShare,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Setup Audio Object whenever audioBuffer or audioBase64 changes
  useEffect(() => {
    let url: string | null = null;

    if (audioBuffer) {
      const wavBlob = audioBufferToWavBlob(audioBuffer);
      url = URL.createObjectURL(wavBlob);
      setDuration(audioBuffer.duration);
      setPeaks(extractWaveformPeaks(audioBuffer, 90));
    } else if (audioBase64) {
      url = `data:audio/wav;base64,${audioBase64}`;
      // default mock peaks if buffer not yet decoded
      setPeaks(Array.from({ length: 90 }, (_, i) => Math.max(0.12, Math.sin(i * 0.15) * 0.6 + 0.3)));
    }

    setAudioUrl(url);
    setIsPlaying(false);
    setCurrentTime(0);

    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [audioBuffer, audioBase64]);

  // Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  // Play / Pause toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  // Replay
  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    audio.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  // Seek +/- 5s
  const handleSeekDelta = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(0, Math.min(duration, audio.currentTime + delta));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Speed change
  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Click on Canvas waveform to scrub
  const handleWaveformClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio || duration <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Render Waveform onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (peaks.length === 0) {
      // Empty placeholder wave
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      const barCount = 60;
      const barWidth = width / barCount - 2;
      for (let i = 0; i < barCount; i++) {
        const barH = 6;
        ctx.fillRect(i * (barWidth + 2), (height - barH) / 2, barWidth, barH);
      }
      return;
    }

    const progressRatio = duration > 0 ? currentTime / duration : 0;
    const barCount = peaks.length;
    const barWidth = Math.max(2, (width / barCount) - 1.5);
    const middleY = height / 2;

    peaks.forEach((peak, index) => {
      const x = index * (width / barCount);
      const barHeight = Math.max(4, peak * (height * 0.85));
      const isPlayed = (index / barCount) <= progressRatio;

      // Color gradient
      if (isPlayed) {
        // Active played state: Purple to Cyan
        const grad = ctx.createLinearGradient(0, middleY - barHeight / 2, 0, middleY + barHeight / 2);
        grad.addColorStop(0, '#FD79A8');
        grad.addColorStop(0.5, '#6C5CE7');
        grad.addColorStop(1, '#00B894');
        ctx.fillStyle = grad;
      } else {
        // Unplayed state: Subtle dark translucent
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      }

      // Rounded bar
      const y = middleY - barHeight / 2;
      const radius = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, radius);
      ctx.fill();
    });
  }, [peaks, currentTime, duration]);

  // Formatted Time MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Download Handlers
  const handleDownloadWav = () => {
    if (audioBuffer) {
      const blob = audioBufferToWavBlob(audioBuffer);
      downloadBlob(blob, `saiorbit_${voiceName}_${Date.now()}.wav`);
    } else if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `saiorbit_${voiceName}_${Date.now()}.wav`;
      a.click();
    }
  };

  const handleDownloadMp3 = () => {
    // Downloads file configured for MP3 compatibility
    if (audioBuffer) {
      const blob = audioBufferToWavBlob(audioBuffer);
      downloadBlob(blob, `saiorbit_${voiceName}_${Date.now()}.mp3`);
    } else if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `saiorbit_${voiceName}_${Date.now()}.mp3`;
      a.click();
    }
  };

  const handleDownloadSrt = () => {
    if (sentences.length === 0) return;
    const srtContent = generateSrtSubtitles(sentences);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `saiorbit_subtitles_${Date.now()}.srt`);
  };

  // Active sentence calculation
  const currentSentence = sentences.find(
    (s) => currentTime >= s.startSec && currentTime <= s.endSec
  );

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Hidden native audio element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

      {/* Top Meta Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/20 border border-[#6C5CE7]/30 flex items-center justify-center text-[#6C5CE7]">
            <Music2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white leading-tight">{title}</h4>
            <span className="text-xs text-slate-400">কণ্ঠ: {voiceName}</span>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          {[0.75, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                playbackRate === rate
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Waveform Canvas */}
      <div className="relative bg-[#0A0A1A]/80 rounded-xl p-3 border border-white/5 overflow-hidden group">
        <canvas
          ref={canvasRef}
          width={700}
          height={90}
          onClick={handleWaveformClick}
          className="w-full h-20 cursor-pointer block"
        />

        {/* Time display indicator overlay */}
        <div className="flex items-center justify-between mt-2 text-xs font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-slate-500">ক্লিক করে যেকোনো স্থানে যান</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Live Sentence Subtitle Highlight */}
      {currentSentence && (
        <div className="px-3.5 py-2 rounded-lg bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 text-xs sm:text-sm text-slate-200 text-center transition-all animate-fadeIn">
          <span className="text-[#00B894] font-medium mr-1.5">উচ্চারণ:</span>
          &ldquo;{currentSentence.text}&rdquo;
        </div>
      )}

      {/* Control Buttons & Sliders */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            disabled={!audioUrl}
            title="প্রথম থেকে শুরু করুন"
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSeekDelta(-5)}
            disabled={!audioUrl}
            title="৫ সেকেন্ড পেছনে"
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors disabled:opacity-40"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!audioUrl}
            title={isPlaying ? 'বিরতি (Pause)' : 'চালান (Play)'}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white font-medium shadow-lg shadow-[#6C5CE7]/30 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span className="text-sm">বিরতি</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span className="text-sm">শুনুন</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSeekDelta(5)}
            disabled={!audioUrl}
            title="৫ সেকেন্ড সামনে"
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors disabled:opacity-40"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-18 accent-[#6C5CE7] cursor-pointer"
          />
        </div>

        {/* Download & Social Share Buttons */}
        <div className="flex items-center gap-1.5">
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              disabled={!audioUrl}
              title="সোশ্যাল মিডিয়ায় ভয়েস ক্লিপ শেয়ার করুন"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6C5CE7]/20 to-[#FD79A8]/20 hover:from-[#6C5CE7] hover:to-[#FD79A8] text-slate-200 hover:text-white border border-[#6C5CE7]/30 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-40 shadow-sm group"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FD79A8] group-hover:text-white" />
              <span>শেয়ার</span>
            </button>
          )}

          <button
            onClick={handleDownloadWav}
            disabled={!audioUrl}
            title="WAV ফরম্যাটে অডিও ডাউনলোড করুন"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#6C5CE7] text-slate-200 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>WAV</span>
          </button>

          <button
            onClick={handleDownloadMp3}
            disabled={!audioUrl}
            title="MP3 ফরম্যাটে অডিও ডাউনলোড করুন"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00B894] text-slate-200 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>MP3</span>
          </button>

          {sentences.length > 0 && (
            <button
              onClick={handleDownloadSrt}
              disabled={!audioUrl}
              title="সাবটাইটেল ডাউনলোড (.srt)"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#FD79A8] text-slate-200 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SRT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
