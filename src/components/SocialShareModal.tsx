import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Play,
  Pause,
  ExternalLink,
  QrCode,
  Code,
  Radio,
  FileAudio,
  Sparkles,
  Volume2
} from 'lucide-react';
import {
  audioBufferToWavBlob,
  base64ToBlob,
  downloadBlob,
  downloadBase64Audio
} from '../utils/audioEngine';
import { EMOTION_PROFILES, EmotionType } from '../utils/ssmlBuilder';

export interface ShareClipData {
  id?: string;
  text: string;
  voiceId: string;
  voiceName: string;
  emotion: string;
  speed?: number;
  pitch?: number;
  durationSec?: number;
  audioBase64?: string | null;
  audioBuffer?: AudioBuffer | null;
}

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  clipData: ShareClipData | null;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  clipData,
  onToast
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isSharingServerClip, setIsSharingServerClip] = useState(false);
  const [serverClipId, setServerClipId] = useState<string | null>(null);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Generate public shareable URL
  useEffect(() => {
    if (!isOpen || !clipData) return;

    // Reset preview state
    setIsPlayingPreview(false);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
    }

    const origin = window.location.origin;

    // Default universal URL with parameters
    const params = new URLSearchParams();
    params.set('text', clipData.text);
    params.set('voice', clipData.voiceId);
    params.set('emotion', clipData.emotion || 'neutral');
    if (clipData.speed && clipData.speed !== 1.0) params.set('speed', String(clipData.speed));
    if (clipData.pitch && clipData.pitch !== 0) params.set('pitch', String(clipData.pitch));

    const portableUrl = `${origin}/?${params.toString()}`;
    setShareUrl(portableUrl);

    // Call backend to store clip and generate short share link
    const registerClipOnServer = async () => {
      try {
        setIsSharingServerClip(true);
        const res = await fetch('/api/share-clip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: clipData.text,
            voiceId: clipData.voiceId,
            voiceName: clipData.voiceName,
            emotion: clipData.emotion,
            speed: clipData.speed || 1.0,
            pitch: clipData.pitch || 0,
            durationSec: clipData.durationSec || 3,
            audioBase64: clipData.audioBase64 || undefined
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.clipId) {
            setServerClipId(data.clipId);
            setShareUrl(`${origin}/?clip=${data.clipId}`);
          }
        }
      } catch (err) {
        console.warn('Could not register short clip on server, using portable URL fallback', err);
      } finally {
        setIsSharingServerClip(false);
      }
    };

    registerClipOnServer();
  }, [isOpen, clipData]);

  if (!isOpen || !clipData) return null;

  const currentEmotion =
    EMOTION_PROFILES[clipData.emotion as EmotionType] || EMOTION_PROFILES.neutral;

  // Audio source for in-modal preview
  let audioPreviewSrc: string | null = null;
  if (clipData.audioBase64) {
    audioPreviewSrc = `data:audio/wav;base64,${clipData.audioBase64}`;
  }

  // Toggle preview playback
  const togglePreviewPlay = () => {
    if (!audioPreviewSrc) {
      if (onToast) onToast('অডিও প্রিভিউ পাওয়া যায়নি', 'error');
      return;
    }

    if (!previewAudioRef.current) {
      const audio = new Audio(audioPreviewSrc);
      previewAudioRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch(() => {
        setIsPlayingPreview(false);
      });
    }
  };

  // Close & stop audio
  const handleModalClose = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
    onClose();
  };

  // Copy share URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    if (onToast) onToast('ভয়েস ক্লিপের লিংক কপি করা হয়েছে! 🔗');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy HTML Embed code
  const embedCodeSnippet = `<iframe src="${shareUrl}" width="100%" height="160" frameborder="0" allow="autoplay" style="border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.3);"></iframe>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedEmbed(true);
    if (onToast) onToast('এম্বেড কোড কপি করা হয়েছে! 💻');
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  // Direct Audio Download Handlers
  const handleDownloadWav = () => {
    const filename = `saiorbit_${clipData.voiceId}_${Date.now()}.wav`;
    if (clipData.audioBuffer) {
      const blob = audioBufferToWavBlob(clipData.audioBuffer);
      downloadBlob(blob, filename);
      if (onToast) onToast('WAV অডিও ডাউনলোড শুরু হয়েছে 📥');
    } else if (clipData.audioBase64) {
      downloadBase64Audio(clipData.audioBase64, filename, 'audio/wav');
      if (onToast) onToast('WAV অডিও ডাউনলোড শুরু হয়েছে 📥');
    } else {
      if (onToast) onToast('অডিও ডাউনলোড ফাইল প্রস্তুত নয়', 'error');
    }
  };

  const handleDownloadMp3 = () => {
    const filename = `saiorbit_${clipData.voiceId}_${Date.now()}.mp3`;
    if (clipData.audioBuffer) {
      const blob = audioBufferToWavBlob(clipData.audioBuffer);
      downloadBlob(blob, filename);
      if (onToast) onToast('MP3 অডিও ডাউনলোড শুরু হয়েছে 📥');
    } else if (clipData.audioBase64) {
      downloadBase64Audio(clipData.audioBase64, filename, 'audio/mp3');
      if (onToast) onToast('MP3 অডিও ডাউনলোড শুরু হয়েছে 📥');
    } else {
      if (onToast) onToast('অডিও ডাউনলোড ফাইল প্রস্তুত নয়', 'error');
    }
  };

  // Snippet text for captions
  const textSnippet =
    clipData.text.length > 90 ? clipData.text.slice(0, 90) + '...' : clipData.text;

  // Social share links
  const encodedUrl = encodeURIComponent(shareUrl);
  const shareMessage = `🎙️ সাইঅরবিট ভয়েস এ তৈরি চমৎকার এআই ভয়েস ক্লিপ শুনুন: "${textSnippet}"\n\nশুনতে ক্লিক করুন: ${shareUrl}`;
  const encodedShareMessage = encodeURIComponent(shareMessage);
  const tweetText = encodeURIComponent(
    `🎙️ "${textSnippet}" — SAIORBIT AI দিয়ে বাংলা ভয়েস তৈরি করা হয়েছে! শুনুন: #BanglaAI #SAIORBIT`
  );

  const socialLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedShareMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent('🎙️ সাইঅরবিট ভয়েস ক্লিপ: ' + textSnippet)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  // Native Web Share API (supports sharing audio files directly to WhatsApp, Instagram, Telegram)
  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleCopyLink();
      return;
    }

    try {
      let fileToShare: File | null = null;
      if (clipData.audioBuffer) {
        const blob = audioBufferToWavBlob(clipData.audioBuffer);
        fileToShare = new File([blob], `saiorbit_voice_${Date.now()}.wav`, { type: 'audio/wav' });
      } else if (clipData.audioBase64) {
        const blob = base64ToBlob(clipData.audioBase64, 'audio/wav');
        fileToShare = new File([blob], `saiorbit_voice_${Date.now()}.wav`, { type: 'audio/wav' });
      }

      if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
        await navigator.share({
          title: `SAIORBIT VOICE - ${clipData.voiceName}`,
          text: `🎙️ "${textSnippet}"`,
          url: shareUrl,
          files: [fileToShare]
        });
        if (onToast) onToast('সফলভাবে শেয়ার করা হয়েছে!');
      } else {
        await navigator.share({
          title: `SAIORBIT VOICE - ${clipData.voiceName}`,
          text: `🎙️ "${textSnippet}"`,
          url: shareUrl
        });
        if (onToast) onToast('সফলভাবে শেয়ার করা হয়েছে!');
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        handleCopyLink();
      }
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    shareUrl
  )}&bgcolor=12122A&color=6C5CE7&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#12122A] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#FD79A8] p-0.5 flex items-center justify-center shadow-lg shadow-[#6C5CE7]/30">
              <div className="w-full h-full bg-[#12122A] rounded-[14px] flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#FD79A8]" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                ভয়েস ক্লিপ শেয়ার ও এক্সপোর্ট
              </h3>
              <p className="text-xs text-slate-400">
                সোশ্যাল মিডিয়ায় অডিও লিংক শেয়ার করুন বা সরাসরি ফাইল ডাউনলোড করুন
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clip Preview Card */}
        <div className="bg-[#0A0A1A]/90 border border-white/10 rounded-2xl p-4 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                🎙️ {clipData.voiceName}
              </span>
              <span className="text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                {currentEmotion.icon} {currentEmotion.labelBn}
              </span>
            </div>

            {clipData.durationSec ? (
              <span className="text-[#00B894] font-mono font-medium text-xs bg-[#00B894]/10 border border-[#00B894]/20 px-2 py-0.5 rounded-md">
                ⏱️ {clipData.durationSec}s
              </span>
            ) : null}
          </div>

          {/* Text preview quote */}
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-3 leading-relaxed italic border-l-2 border-[#6C5CE7] pl-3 py-0.5">
            &ldquo;{clipData.text}&rdquo;
          </p>

          {/* In-modal Audio Player preview button if audio available */}
          {audioPreviewSrc && (
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>শেয়ার করার আগে শুনুন:</span>
              </span>
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-95 active:scale-95 transition-all shadow-sm"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>বিরতি (Pause)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>প্রিভিউ শুনুন</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 1-Click Social Media Platforms */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              সোশ্যাল মিডিয়ায় শেয়ার করুন (1-Click Share)
            </label>
            {Boolean(navigator.share) && (
              <span className="text-[10px] text-[#00B894] font-medium bg-[#00B894]/10 px-2 py-0.5 rounded-full">
                ✓ ডিভাইস শেয়ার সক্রিয়
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>হোয়াটসঅ্যাপ</span>
            </a>

            {/* Facebook */}
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>ফেসবুক</span>
            </a>

            {/* X (Twitter) */}
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (টুইটার)</span>
            </a>

            {/* Telegram */}
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.535-.197 1.006.128.832.939z" />
              </svg>
              <span>টেলিগ্রাম</span>
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>লিংকডইন</span>
            </a>

            {/* Native Mobile Share / More */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7]/20 to-[#FD79A8]/20 hover:from-[#6C5CE7]/30 hover:to-[#FD79A8]/30 border border-[#6C5CE7]/40 text-white text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4 text-[#FD79A8] shrink-0" />
              <span>ইনস্টাগ্রাম / অন্য অ্যাপ</span>
            </button>
          </div>
        </div>

        {/* Copy Shareable URL Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>পাবলিক শেয়ার লিংক (Public Voice Link)</span>
            {isSharingServerClip && (
              <span className="text-[11px] text-[#6C5CE7] lowercase animate-pulse font-normal">
                সংক্ষিপ্ত লিংক তৈরি হচ্ছে...
              </span>
            )}
          </label>

          <div className="flex items-center gap-2 bg-[#0A0A1A] border border-white/15 rounded-xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-xs text-slate-200 outline-none truncate font-mono select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-lg bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-md shadow-[#6C5CE7]/20"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00B894]" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি লিংক</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Download Section */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-[#00B894]" />
            <span>সরাসরি অডিও ফাইল ডাউনলোড (Download Audio File)</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownloadWav}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#6C5CE7]/20 text-slate-200 hover:text-white border border-white/10 hover:border-[#6C5CE7]/50 text-xs font-semibold transition-all flex items-center justify-center gap-2 group"
            >
              <FileAudio className="w-4 h-4 text-[#6C5CE7] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-bold">WAV ডাউনলোড</div>
                <div className="text-[10px] text-slate-400">মাস্টার কোয়ালিটি (Lossless)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadMp3}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#00B894]/20 text-slate-200 hover:text-white border border-white/10 hover:border-[#00B894]/50 text-xs font-semibold transition-all flex items-center justify-center gap-2 group"
            >
              <Download className="w-4 h-4 text-[#00B894] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-bold">MP3 ডাউনলোড</div>
                <div className="text-[10px] text-slate-400">সোশ্যাল মিডিয়া ফ্রেন্ডলি</div>
              </div>
            </button>
          </div>
        </div>

        {/* Advanced Options: QR Code & Embed Player */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={() => {
              setShowQrCode(!showQrCode);
              setShowEmbedCode(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showQrCode
                ? 'bg-[#6C5CE7]/20 border-[#6C5CE7]/50 text-white'
                : 'bg-white/5 border-white/10 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#FD79A8]" />
            <span>মোবাইলে QR স্ক্যান</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowEmbedCode(!showEmbedCode);
              setShowQrCode(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showEmbedCode
                ? 'bg-[#6C5CE7]/20 border-[#6C5CE7]/50 text-white'
                : 'bg-white/5 border-white/10 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#00B894]" />
            <span>ওয়েবসাইটে এম্বেড কোড</span>
          </button>
        </div>

        {/* QR Code Section */}
        {showQrCode && (
          <div className="bg-[#0A0A1A] border border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 animate-fadeIn text-center">
            <p className="text-xs text-slate-300">
              ফোনের ক্যামেরা বা QR স্ক্যানার দিয়ে স্ক্যান করে সরাসরি শুনুন:
            </p>
            <div className="p-3 bg-[#12122A] rounded-2xl border border-white/10 shadow-lg">
              <img
                src={qrImageUrl}
                alt="QR Code to voice clip"
                className="w-36 h-36 rounded-lg block"
              />
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              মোবাইলে যেকোনো ব্রাউজারে চলবে
            </span>
          </div>
        )}

        {/* Embed Code Snippet Section */}
        {showEmbedCode && (
          <div className="bg-[#0A0A1A] border border-white/15 rounded-2xl p-4 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">HTML5 আইফ্রেম এম্বেড কোড:</span>
              <button
                type="button"
                onClick={handleCopyEmbed}
                className="px-2.5 py-1 rounded-md bg-[#6C5CE7]/20 hover:bg-[#6C5CE7] text-slate-200 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1"
              >
                {copiedEmbed ? (
                  <>
                    <Check className="w-3 h-3 text-[#00B894]" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>কোড কপি করুন</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={3}
              value={embedCodeSnippet}
              className="w-full bg-[#12122A] border border-white/10 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 select-all focus:outline-none"
            />
            <p className="text-[10px] text-slate-500">
              ওয়ার্ডপ্রেস, ব্লগার বা যেকোনো ব্লগে পেস্ট করলে স্বয়ংক্রিয় প্লেয়ার প্রদর্শিত হবে।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
