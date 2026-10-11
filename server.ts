import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ====================================================
// CORS SETUP — Cloudflare Frontend allowed
// ====================================================
app.use(cors({
  origin: [
    'https://saiorbit-voice.pages.dev',
    'https://*.saiorbit-voice.pages.dev',
    'https://saiorbitvoice.com',
    'https://www.saiorbitvoice.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Cache
interface CacheEntry {
  audioBase64: string;
  mimeType: string;
  durationSec: number;
  sentences: Array<{ text: string; startSec: number; endSec: number }>;
  timestamp: number;
}
const audioCache = new Map<string, CacheEntry>();

let totalCharactersProcessed = 0;
let totalRequestsServed = 0;
let cacheHits = 0;

function getCacheKey(text: string, voice: string, emotion: string, speed: number, pitch: number): string {
  return `${voice}_${emotion}_${speed}_${pitch}_${text.trim()}`;
}

function estimateSentenceTiming(text: string, totalDurationSec: number): Array<{ text: string; startSec: number; endSec: number }> {
  const rawSentences = text
    .split(/([।॥?!.\n]+)/)
    .reduce<string[]>((acc, part, idx, arr) => {
      if (idx % 2 === 0) {
        const nextPunct = arr[idx + 1] || '';
        const sentence = (part + nextPunct).trim();
        if (sentence) acc.push(sentence);
      }
      return acc;
    }, []);

  const validSentences = rawSentences.length > 0 ? rawSentences : [text.trim()];
  const totalChars = validSentences.reduce((sum, s) => sum + s.length, 0) || 1;

  let currentStart = 0;
  return validSentences.map((sentence) => {
    const fraction = sentence.length / totalChars;
    const duration = Math.max(0.8, fraction * totalDurationSec);
    const item = {
      text: sentence,
      startSec: Math.round(currentStart * 100) / 100,
      endSec: Math.round((currentStart + duration) * 100) / 100,
    };
    currentStart += duration;
    return item;
  });
}

// ====================================================
// HEALTH CHECK — Render + UptimeRobot এর জন্য
// ====================================================
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'SAIORBIT VOICE API',
    status: 'running',
    timestamp: Date.now(),
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'SAIORBIT VOICE' });
});

// ====================================================
// API ROUTES
// ====================================================

const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', '10minutemail.net', 'mailinator.com', 'tempmail.com', 'temp-mail.org',
  'temp-mail.io', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'trashmail.com',
  'trashmail.net', 'throwawaymail.com', 'fakeinbox.com', 'burnermail.io', 'dispostable.com',
  'yopmail.com', 'sharklasers.com', 'getairmail.com', 'mohmal.com', 'dropmail.me', '0147.org',
  'crazymailing.com', 'nada.ltd', 'getnada.com', 'emailondeck.com', 'tempmailaddress.com',
  'tmail.ws', 'discard.email', 'mailcatch.com', 'mytrashmail.com', 'spambog.com', 'maildrop.cc'
]);

app.get('/api/trending-voices', (_req: Request, res: Response) => {
  // ... আপনার আগের trending voices code (একই রাখুন)
  res.json({
    status: 'success',
    timestamp: Date.now(),
    languages: ['bn', 'hi', 'en'],
    trendingVoices: [
      // আপনার আগের trending voices array এখানে বসান
      // (কোনো change নেই, তাই পুরো array copy করুন)
    ]
  });
});

app.post('/api/validate-email', (req: Request, res: Response) => {
  const { email } = req.body;
  const trimmed = String(email || '').trim().toLowerCase();

  if (!trimmed || !trimmed.includes('@')) {
    return res.status(400).json({
      isValid: false,
      isOriginal: false,
      error: 'Invalid email address',
      messageBn: 'অবৈধ ইমেইল ঠিকানা'
    });
  }

  const parts = trimmed.split('@');
  const domain = parts[1] || '';

  if (DISPOSABLE_DOMAINS.has(domain) || domain.includes('temp') || domain.includes('dispos') || domain.includes('burner') || domain.includes('fake') || domain.includes('throwaway')) {
    return res.status(400).json({
      isValid: false,
      isOriginal: false,
      isDisposable: true,
      error: 'Disposable and temporary emails are strictly blocked.',
      messageBn: '⛔ ডিসপোজেবল বা টেম্পোরারি ইমেইল নিষিদ্ধ।'
    });
  }

  return res.json({
    isValid: true,
    isOriginal: true,
    domain,
    message: 'Original email verified',
    messageBn: '✓ অরিজিনাল ইমেইল ভেরিফাইড'
  });
});

app.post('/api/enhance-text', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ai) {
      const cleaned = text.replace(/([।॥?!])/g, '$1 ').replace(/\s+/g, ' ').trim();
      return res.json({ enhancedText: cleaned, note: 'Normalized using built-in rule engine' });
    }

    const prompt = `তুমি একজন সিনিয়র Bengali Linguistics ও Speech Synthesis (TTS) বিশেষজ্ঞ...`;  // আপনার আগের prompt

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    const enhanced = response.text?.trim() || text;
    res.json({ enhancedText: enhanced });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Enhance text error:', msg);
    res.json({ enhancedText: req.body.text, warning: msg });
  }
});

// ====================================================
// SHARED VOICE CLIPS
// ====================================================
interface SharedClip {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  emotion: string;
  speed: number;
  pitch: number;
  durationSec: number;
  audioBase64?: string;
  mimeType?: string;
  createdAt: number;
}
const sharedClips = new Map<string, SharedClip>();

app.post('/api/share-clip', (req: Request, res: Response) => {
  try {
    const {
      text, voiceId = 'bn-IN-Wavenet-A', voiceName = 'স্বর্ণা (Swarna)',
      emotion = 'neutral', speed = 1.0, pitch = 0, durationSec = 3, audioBase64,
    } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const clipId = 'clip_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    const clipData: SharedClip = {
      id: clipId, text: text.trim(), voiceId, voiceName, emotion,
      speed: Number(speed) || 1.0, pitch: Number(pitch) || 0,
      durationSec: Number(durationSec) || 3,
      audioBase64: audioBase64 || undefined,
      mimeType: audioBase64 && !audioBase64.startsWith('UklGR') ? 'audio/mp3' : 'audio/wav',
      createdAt: Date.now(),
    };

    sharedClips.set(clipId, clipData);

    if (sharedClips.size > 500) {
      const oldestKey = sharedClips.keys().next().value;
      if (oldestKey) sharedClips.delete(oldestKey);
    }

    res.json({
      success: true, clipId, clip: clipData,
      sharePath: `/?clip=${clipId}`,
      audioUrl: audioBase64 ? `/api/audio/${clipId}.wav` : null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});

app.get('/api/clip/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const clip = sharedClips.get(id);
  if (!clip) return res.status(404).json({ error: 'Clip not found or expired' });
  res.json({ success: true, clip });
});

app.get('/api/audio/:id.:ext', (req: Request, res: Response) => {
  const { id, ext } = req.params;
  const clip = sharedClips.get(id);
  if (!clip || !clip.audioBase64) {
    return res.status(404).json({ error: 'Audio file not found' });
  }

  const audioBuf = Buffer.from(clip.audioBase64, 'base64');
  const contentType = ext === 'mp3' ? 'audio/mpeg' : 'audio/wav';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', audioBuf.length);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Content-Disposition', `inline; filename="saiorbit_${id}.${ext}"`);
  res.send(audioBuf);
});

app.post('/api/synthesize', async (req: Request, res: Response) => {
  try {
    const {
      text, voice = 'bn-IN-Wavenet-A', lang = 'bn-IN',
      speed = 1.0, pitch = 0, emotion = 'neutral', volume = 0, postProcessing = {}
    } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    totalRequestsServed++;
    totalCharactersProcessed += text.length;

    const cacheKey = getCacheKey(text, voice, emotion, speed, pitch);
    if (audioCache.has(cacheKey)) {
      cacheHits++;
      const cached = audioCache.get(cacheKey)!;
      return res.json({ ...cached, cached: true, cacheHits });
    }

    let geminiVoiceName = 'Kore';
    let customVoiceStyle = '';

    // আপনার আগের voice mapping (একই রাখুন)
    if (voice === 'insta-adam-narrator') {
      geminiVoiceName = 'Fenrir';
      customVoiceStyle = 'Dramatic, cinematic, deep viral reel storyteller';
    } else if (voice === 'insta-ranbir-bangla') {
      geminiVoiceName = 'Puck';
      customVoiceStyle = 'Viral young Bengali reel creator, energetic';
    } else if (voice === 'insta-ahona-vlog') {
      geminiVoiceName = 'Kore';
      customVoiceStyle = 'Sweet, melodious Bengali lifestyle vlogger';
    } else if (voice === 'insta-orko-mystery') {
      geminiVoiceName = 'Fenrir';
      customVoiceStyle = 'Deep, atmospheric Bengali thriller storyteller';
    }
    // ... বাকি voice mapping এখানে যোগ করুন (আপনার আগের code থেকে)

    let speedDirective = '';
    if (speed >= 1.2) speedDirective = 'Fast, brisk, high-energy delivery.';
    else if (speed >= 1.08) speedDirective = 'Upbeat, modern social-media tempo.';
    else if (speed <= 0.85) speedDirective = 'Slow, deliberate, atmospheric pacing.';
    else if (speed <= 0.95) speedDirective = 'Gentle, relaxed, unhurried conversational pacing.';

    let pitchDirective = '';
    if (pitch <= -2) pitchDirective = 'Deep resonant low chest voice.';
    else if (pitch >= 2) pitchDirective = 'Bright, youthful, higher-pitched vocal tone.';

    const emotionStyleMap: Record<string, string> = {
      happy: 'Joyful, smiling, radiant warmth',
      calm: 'Serene, gentle, intimate, soothing',
      excited: 'High adrenaline, thrilling, enthusiastic',
      sad: 'Melancholic, heartfelt, solemn',
      angry: 'Assertive, intense, commanding',
      neutral: 'Natural, organic conversational human presence',
    };

    const styleDescription = [
      customVoiceStyle,
      emotionStyleMap[emotion] || emotionStyleMap.neutral,
      speedDirective,
      pitchDirective,
      'Extremely authentic human speaker with natural breathing pauses.'
    ].filter(Boolean).join('. ');

    let audioBase64: string | null = null;
    let mimeType = 'audio/wav';
    let durationSec = Math.max(1.5, (text.length / 15) * (1 / speed));

    if (ai) {
      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: [{
            role: 'user',
            parts: [{ text: text, speechMetadata: { style: styleDescription } }],
          }],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: geminiVoiceName },
              },
            },
          },
        });

        const rawAudio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (rawAudio) {
          audioBase64 = rawAudio;
          mimeType = 'audio/wav';
          const bufferLen = Buffer.from(rawAudio, 'base64').length;
          durationSec = Math.max(1, Math.round((bufferLen / 48000) * 10) / 10);
        }
      } catch (geminiError: unknown) {
        console.warn('Gemini TTS failed, using fallback:', geminiError);
      }
    }

    // Google Translate TTS Fallback
    if (!audioBase64) {
      try {
        const langMap: Record<string, string> = {
          'bn-IN': 'bn', 'bn-BD': 'bn', 'hi-IN': 'hi', 'en-IN': 'en',
          'en-US': 'en', 'ta-IN': 'ta', 'te-IN': 'te', 'mr-IN': 'mr',
          'gu-IN': 'gu', 'kn-IN': 'kn', 'ml-IN': 'ml', 'pa-IN': 'pa',
        };
        const googleLang = langMap[lang] || (lang.startsWith('hi') ? 'hi' : lang.startsWith('en') ? 'en' : 'bn');
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.slice(0, 300))}&tl=${googleLang}&client=tw-ob`;
        const resp = await fetch(ttsUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        });
        if (resp.ok) {
          const ab = await resp.arrayBuffer();
          audioBase64 = Buffer.from(ab).toString('base64');
          mimeType = 'audio/mp3';
          durationSec = Math.max(1.5, (text.length / 14) * (1 / speed));
        }
      } catch (err) {
        console.warn('Google TTS fallback failed:', err);
      }
    }

    const sentences = estimateSentenceTiming(text, durationSec);

    const result: CacheEntry = {
      audioBase64: audioBase64 || '',
      mimeType,
      durationSec,
      sentences,
      timestamp: Date.now(),
    };

    if (audioBase64) {
      audioCache.set(cacheKey, result);
    }

    res.json({
      ...result,
      cached: false,
      useClientSynthesis: !audioBase64,
      voice, speed, pitch, emotion,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Synthesize error:', msg);
    res.status(500).json({ error: msg });
  }
});

app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    totalCharactersProcessed,
    totalRequestsServed,
    cacheHits,
    cachedItemsCount: audioCache.size,
    hasGeminiKey: Boolean(apiKey),
  });
});

// ====================================================
// SERVER START — Render-এর জন্য
// ====================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎙️ SAIORBIT VOICE API running on 0.0.0.0:${PORT}`);
  console.log(`✅ CORS enabled for Cloudflare frontend`);
  console.log(`✅ Gemini API: ${apiKey ? 'Connected' : 'NOT configured'}`);
});
