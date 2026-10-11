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
    'https://saiorbitvoice.pages.dev',
    'https://*.saiorbitvoice.pages.dev',
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

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

// ====================================================
// Google GenAI Client
// ====================================================
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
}

// ====================================================
// Cache + Helpers
// ====================================================
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
// HEALTH / ROOT — Render + UptimeRobot
// ====================================================
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'SAIORBIT VOICE API',
    status: 'running',
    version: '1.0.0',
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

// ---------- /api/trending-voices ----------
app.get('/api/trending-voices', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    timestamp: Date.now(),
    languages: ['bn', 'hi', 'en'],
    trendingVoices: [
      // ===== ENGLISH =====
      {
        id: 'viral-adam',
        voiceId: 'insta-adam-narrator',
        name: 'Adam (The Viral Reel Narrator 🔥)',
        nameBn: 'অ্যাডাম (ডার্ক মিস্ট্রি ও ক্রাইম থ্রিলার)',
        personaTitle: 'ডার্ক মিস্ট্রি ও ক্রাইম থ্রিলার',
        langTag: 'en',
        langLabel: '🇬🇧 ইংরেজি (Instagram #1)',
        platform: 'Instagram Reels',
        statsBadge: '🔥 ২.৮ বিলিয়ন+ ভিউ',
        categoryTag: 'Suspense Documentary',
        speed: 0.95,
        pitch: -2,
        emotion: 'excited',
        humanTraits: ['গম্ভীর গমগমে সিনেম্যাটিক সুর', 'সাসপেন্স মাইক্রো-পজ ও টানটান রহস্য', '১০০% রোবটিক ভাবমুক্ত জীবন্ত বাচনভঙ্গি'],
        viralScript: 'Did you know that in 1943, scientists discovered an underground secret that changed human history forever...',
        description: 'ইনস্টাগ্রাম ও টিকটকে সবচেয়ে ভাইরাল ড্রামাটিক কণ্ঠ। ডার্ক হিস্ট্রি, রহস্য ও কনস্পিরেসি রিলসের জন্য অপরাজেয়।',
        avatarColor: 'from-amber-500 to-red-600',
      },
      {
        id: 'viral-antoni',
        voiceId: 'insta-antoni-hype',
        name: 'Antoni (TikTok & Shorts Hook Master ⚡)',
        nameBn: 'অ্যান্টনি (ভাইরাল টিকটক ও রিল হুক)',
        personaTitle: 'হাইপ শর্টস ও ওপেনিং হুক',
        langTag: 'en',
        langLabel: '🇬🇧 ইংরেজি (TikTok Viral)',
        platform: 'TikTok',
        statsBadge: '⚡ ৯৯% হুক রিটেনশন',
        categoryTag: 'Viral Hook Master',
        speed: 1.15,
        pitch: 1,
        emotion: 'excited',
        humanTraits: ['উচ্চ-উদ্দীপনাময় ফাস্ট-পেসড ডেলিভারি', 'স্ক্রোল বন্ধ করার মতো তীক্ষ্ণ হুক', 'প্রাণবন্ত আত্মবিশ্বাসী আধুনিক উচ্চারণ'],
        viralScript: 'Stop scrolling right now! If you have this hidden setting on your phone, you need to turn it off immediately.',
        description: 'প্রথম ৩ সেকেন্ডেই দর্শককে ধরে রাখার জন্য বিশ্বখ্যাত টিকটক হুক কণ্ঠ।',
        avatarColor: 'from-[#6C5CE7] to-[#FD79A8]',
      },
      {
        id: 'viral-bella',
        voiceId: 'insta-bella-vlog',
        name: 'Bella (Aesthetic Lifestyle & Mini Vlog ✨)',
        nameBn: 'বেলা (ইনস্টা নান্দনিক ভ্লগ ও ট্রাভেল)',
        personaTitle: 'নান্দনিক লাইফস্টাইল ও মিনি ভ্লগ',
        langTag: 'en',
        langLabel: '🇬🇧 ইংরেজি (Aesthetic Vlog)',
        platform: 'Instagram Reels',
        statsBadge: '✨ ১.৫ বিলিয়ন ভিউ',
        categoryTag: 'Aesthetic Lifestyle',
        speed: 0.92,
        pitch: 0,
        emotion: 'calm',
        humanTraits: ['স্নিগ্ধ মিষ্টি নিঃশ্বাস ও উষ্ণতা', 'কোমল ঘনিষ্ঠ গল্প বলার অনুভূতি', 'রিলাক্সিং ক্যাফে ও ট্রাভেল সুর'],
        viralScript: 'Come spend a slow rainy Sunday with me in Tokyo. First, hot coffee and morning journals before the city wakes up.',
        description: 'ক্যাফে ভ্লগ, স্লো ট্রাভেল রিলস ও ডেইলি স্টোরির জন্য অত্যন্ত নান্দনিক ও মিষ্টি মানবিক কণ্ঠ।',
        avatarColor: 'from-[#00B894] to-[#6C5CE7]',
      },
      {
        id: 'viral-rachel',
        voiceId: 'insta-rachel-tech',
        name: 'Rachel (Tech Review & AI Tools Shorts 📱)',
        nameBn: 'র‍্যাচেল (আন্তর্জাতিক টেক রিভিউ কুইন)',
        personaTitle: 'আন্তর্জাতিক টেক রিভিউ কুইন',
        langTag: 'en',
        langLabel: '🇬🇧 ইংরেজি (Tech & Finance)',
        platform: 'YouTube Shorts',
        statsBadge: '📱 ১.২ বিলিয়ন ভিউ',
        categoryTag: 'Tech Reviewer',
        speed: 1.05,
        pitch: 1,
        emotion: 'neutral',
        humanTraits: ['তীক্ষ্ণ, স্পষ্ট ও আধুনিক প্রফেশনাল স্বর', 'হাই-কনভার্সন গ্যাজেট উপস্থাপনা', 'ন্যাচারাল ইংরেজি ইনফ্লেকশন'],
        viralScript: 'Here are three secret AI websites that feel completely illegal to know, but let me show you anyway.',
        description: 'টেক রিভিউ, এআই টুলস ও ক্রিপ্টো/ফাইন্যান্স শর্টসের জন্য বিশ্বজুড়ে ব্যবহৃত।',
        avatarColor: 'from-cyan-500 to-blue-600',
      },
      {
        id: 'viral-shadow',
        voiceId: 'insta-shadow-mystery',
        name: 'Shadow (Midnight Crime & True Mystery 🕵️)',
        nameBn: 'শ্যাডো (ক্রাইম থ্রিলার ও ডার্ক স্টোরিজ)',
        personaTitle: 'ক্রাইম থ্রিলার ও ডার্ক স্টোরিজ',
        langTag: 'en',
        langLabel: '🇬🇧 ইংরেজি (True Crime)',
        platform: 'TikTok',
        statsBadge: '🕵️ ৯২০ মিলিয়ন ভিউ',
        categoryTag: 'Crime Documentary',
        speed: 0.88,
        pitch: -4,
        emotion: 'calm',
        humanTraits: ['ডার্ক সিনেম্যাটিক ফিসফিসানি টোন', 'লো-ফ্রিকোয়েন্সি ক্রাইম সাসপেন্স', 'কৌতূহল সৃষ্টিকারী নিঃশব্দ বিরতি'],
        viralScript: 'Nobody ever talks about what really happened in room 217 on that cold December midnight...',
        description: 'আনসলভড মিস্ট্রি, হরর এডিট এবং মিডনাইট ক্রাইম পডকাস্ট শর্টসের জন্য তৈরি।',
        avatarColor: 'from-purple-900 to-slate-900',
      },

      // ===== BENGALI =====
      {
        id: 'viral-ranbir',
        voiceId: 'insta-ranbir-bangla',
        name: 'Ranbir (Viral Bangla Reel Guy 🔥)',
        nameBn: 'রণবীর (ভাইরাল বাংলা রিল বয় 🔥)',
        personaTitle: 'বাংলা দ্রুতগতির রিলস ও সোশ্যাল হুক',
        langTag: 'bn',
        langLabel: '🇧🇩 বাংলা (Viral Reels)',
        platform: 'Instagram Reels',
        statsBadge: '🔥 ৫০০ মিলিয়ন ভিউ',
        categoryTag: 'Bangla Viral Reel',
        speed: 1.15,
        pitch: 1,
        emotion: 'excited',
        humanTraits: ['১০০% খাঁটি দেশীয় বাংলা বাচনভঙ্গি', 'সোশ্যাল মিডিয়া উপযোগী দ্রুত ও স্পষ্ট ডেলিভারি', 'ন্যাচারাল কথ্য কোলকাতা/ঢাকা স্বর'],
        viralScript: 'দাঁড়ান দাঁড়ান! স্ক্রোল করার আগে মাত্র ৩০ সেকেন্ড সময় দিন। এই ৩টি ট্রিক আপনার প্রতিদিনের সময় অর্ধেক বাঁচিয়ে দেবে!',
        description: 'বাংলায় ইনস্টাগ্রাম রিলস, ফেসবুক ওয়াচ ও শর্টসের জন্য সবচেয়ে জনপ্রিয় দ্রুতগতির ক্রিয়েটর কণ্ঠ।',
        avatarColor: 'from-[#FD79A8] to-[#E17055]',
      },
      {
        id: 'viral-ahona',
        voiceId: 'insta-ahona-vlog',
        name: 'Ahona (Bangla Aesthetic Lifestyle ✨)',
        nameBn: 'অহনা (বাংলা নান্দনিক ভ্লগ ও ট্রাভেল ✨)',
        personaTitle: 'বাংলা নান্দনিক লাইফস্টাইল ও মিনি ভ্লগ',
        langTag: 'bn',
        langLabel: '🇧🇩 বাংলা (Aesthetic Vlog)',
        platform: 'Instagram Reels',
        statsBadge: '✨ ৩৫০ মিলিয়ন ভিউ',
        categoryTag: 'Bangla Aesthetic',
        speed: 0.95,
        pitch: 1,
        emotion: 'calm',
        humanTraits: ['মিষ্টি স্নিগ্ধ বাংলা বাচনভঙ্গি', 'প্রশান্ত গল্পকথনের স্বাভাবিক সুর', 'জীবন্ত মানবীয় আবেগ ও মৃদু হাসি'],
        viralScript: 'আজকের কুয়াশাচ্ছন্ন সকালে পাহাড়ি কটেজে গরম ধোঁয়া ওঠা চায়ের কাপ আর প্রিয় বই—জীবনটা সত্যি সুন্দর।',
        description: 'ভ্রমণ ভ্লগ, স্লো-মোশন রিলস ও মিষ্টি কবিতার জন্য সবচেয়ে প্রিয় বাংলা নারী কণ্ঠ।',
        avatarColor: 'from-emerald-400 to-teal-600',
      },
      {
        id: 'viral-orko-mystery',
        voiceId: 'insta-orko-mystery',
        name: 'Orko (Bangla Thriller & Horror Documentary 🎙️)',
        nameBn: 'অর্ক (বাংলা থ্রিলার ও ভৌতিক রহস্য 🎙️)',
        personaTitle: 'বাংলা থ্রিলার ও ডার্ক সাসপেন্স স্টোরিজ',
        langTag: 'bn',
        langLabel: '🇧🇩 বাংলা (Horror & Thriller)',
        platform: 'Instagram Reels',
        statsBadge: '🎙️ ৪৫০ মিলিয়ন ভিউ',
        categoryTag: 'Bangla Suspense',
        speed: 0.92,
        pitch: -2,
        emotion: 'calm',
        humanTraits: ['গভীর ব্যারিটোন বাংলা বাচনভঙ্গি', 'রোমাঞ্চকর ভৌতিক গল্পের নিস্তব্ধ আবহ', 'পরিমিত সাসপেন্স ও টানটান নাটকীয়তা'],
        viralScript: '১৯৭২ সালের সেই কুয়াশাচ্ছন্ন মধ্যরাতে সুন্দরবনের গহীনে যা ঘটেছিল, তা আজও কোনো সাধারণ বিজ্ঞানের ব্যাখ্যায় মেলে না...',
        description: 'রহস্য রোমাঞ্চ, ভৌতিক গল্প এবং ঐতিহাসিক থ্রিলার শর্টসের জন্য অতুলনীয় বাংলা কণ্ঠ।',
        avatarColor: 'from-slate-800 to-indigo-950',
      },
      {
        id: 'viral-samiran-tech',
        voiceId: 'insta-samiran-tech',
        name: 'Samiran (Bangla Tech & AI Explainer 📱)',
        nameBn: 'সমীরণ (বাংলা টেক ও গ্যাজেট রিভিউ 📱)',
        personaTitle: 'বাংলা টেক ও গ্যাজেট শর্টস কন্টেন্ট',
        langTag: 'bn',
        langLabel: '🇧🇩 বাংলা (Tech & AI)',
        platform: 'YouTube Shorts',
        statsBadge: '📱 ৩০০ মিলিয়ন ভিউ',
        categoryTag: 'Bangla Tech Review',
        speed: 1.10,
        pitch: 0,
        emotion: 'excited',
        humanTraits: ['আধুনিক স্মার্ট বাংলা বাচনভঙ্গি', 'স্পষ্ট ও তথ্যবহুল উচ্চারণ', 'গ্যাজেট আনবক্সিং উপযোগী প্রাণবন্ত ছন্দ'],
        viralScript: 'আপনি কি জানেন এই ৩টি গোপন এআই টুল দিয়ে যেকোনো ভিডিওর ব্যাকগ্রাউন্ড মাত্র এক ক্লিকেই পরিবর্তন করা যায়?',
        description: 'ইউটিউব শর্টস ও ইনস্টাগ্রাম রিলসে বাংলা টেক রিভিউ, মোবাইল টিপস ও ট্রিকস তৈরির শ্রেষ্ঠ কণ্ঠ।',
        avatarColor: 'from-blue-500 to-indigo-600',
      },

      // ===== HINDI =====
      {
        id: 'viral-aarav',
        voiceId: 'insta-aarav-desi',
        name: 'Aarav (Desi Reel Creator - Hindi 🇮🇳)',
        nameBn: 'আরব (দেশি ভাইরাল রিল ক্রিয়েটর 🇮🇳)',
        personaTitle: 'হিন্দি মোটিভেশনাল ও ফিন্যান্স রিলস',
        langTag: 'hi',
        langLabel: '🇮🇳 হিন্দি (Viral Reels)',
        platform: 'Instagram Reels',
        statsBadge: '🇮🇳 ৯৫০ মিলিয়ন ভিউ',
        categoryTag: 'Desi Motivation',
        speed: 1.08,
        pitch: 0,
        emotion: 'happy',
        humanTraits: ['স্বাভাবিক কথ্য দেশি রিদম', 'বন্ধুত্বপূর্ণ আত্মবিশ্বাসী টোন', 'স্পষ্ট ও আবেগপূর্ণ হিন্দি উচ্চারণ'],
        viralScript: 'रुको भाई! अगर तुम भी २०२६ में फाइनेंशियली फ्री होना चाहते हो, तो ये ৩ गलतियां कभी मत करना।',
        description: 'ভারতের সোশ্যাল মিডিয়ায় সবচেয়ে ট্রেন্ডিং হিন্দি ভয়েস।',
        avatarColor: 'from-amber-400 to-orange-500',
      },
      {
        id: 'viral-raj',
        voiceId: 'insta-raj-baritone',
        name: 'Raj (Sigma & Gym Motivation Baritone 🗿)',
        nameBn: 'রাজ (সিগমা ও জিম মোটিভেশন ব্যারিটোন 🗿)',
        personaTitle: 'ডিপ ব্যারিটোন রাশভারী ভয়েস',
        langTag: 'hi',
        langLabel: '🇮🇳 হিন্দি (Gym & Sigma)',
        platform: 'YouTube Shorts',
        statsBadge: '🗿 ৮০০ মিলিয়ন ভিউ',
        categoryTag: 'Sigma Gym Baritone',
        speed: 0.90,
        pitch: -3,
        emotion: 'angry',
        humanTraits: ['গভীর ব্যারিটোন ও রাশভারী কর্তৃত্ব', 'সিগমা এডিট ও জিম মোটিভেশনের গভীর বেস', 'দৃঢ় ও আত্মবিশ্বাসী উচ্চারণ'],
        viralScript: 'लोग तुम्हारी औकात तब तक नहीं पहचानेंगे, जब तक तुम्हारी सफलता शोर नहीं मचाती।',
        description: 'জিম এডিট, সিগমা রুলস ও উচ্চ প্রভাবের হিন্দি মোটিভেশনের জন্য তৈরি।',
        avatarColor: 'from-slate-700 to-slate-900',
      },
      {
        id: 'viral-ananya',
        voiceId: 'insta-ananya-shorts',
        name: 'Ananya (Bollywood & Lifestyle Shorts 💃)',
        nameBn: 'অনন্যা (বলিউড ও ট্রেন্ডিং রিলস কুইন 💃)',
        personaTitle: 'বলিউড লাইফস্টাইল ও বিউটি শর্টস',
        langTag: 'hi',
        langLabel: '🇮🇳 হিন্দি (Bollywood Lifestyle)',
        platform: 'Instagram Reels',
        statsBadge: '💃 ৬০০ মিলিয়ন ভিউ',
        categoryTag: 'Bollywood Shorts',
        speed: 1.05,
        pitch: 2,
        emotion: 'happy',
        humanTraits: ['উচ্ছ্বসিত ও মিষ্টি বাচনভঙ্গি', 'লাইফস্টাইল ভ্লগের প্রাণবন্ত ইনফ্লেকশন', 'ন্যাচারাল কথ্য হিন্দি ও গ্ল্যামারাস টোন'],
        viralScript: 'हे गाइस! आज मैं आपके साथ शेयर कर रही हूँ मेरा सीक्रेट ग्लोइंग स्किन रूटीन।',
        description: 'ফ্যাশন, মেকআপ, বলিউড গসিপ ও নান্দনিক হিন্দি রিলসের জন্য।',
        avatarColor: 'from-pink-500 to-rose-600',
      },
      {
        id: 'viral-kabir',
        voiceId: 'insta-kabir-hinglish',
        name: 'Kabir (Urban Hinglish Podcaster 🎙️)',
        nameBn: 'কবীর (আরবান হিংলিশ পডকাস্টার 🎙️)',
        personaTitle: 'আরবান হিংলিশ পডকাস্ট ও স্টার্টআপ শর্টস',
        langTag: 'hi',
        langLabel: '🇮🇳 হিংলিশ (Urban Podcast)',
        platform: 'YouTube Shorts',
        statsBadge: '🎙️ ৪২০ মিলিয়ন ভিউ',
        categoryTag: 'Hinglish Podcast',
        speed: 1.05,
        pitch: 0,
        emotion: 'neutral',
        humanTraits: ['সহজ-সরল আধুনিক দ্বিভাষিক মিশ্রণ', 'জেন-জি ও মিলেনিয়ালদের কথ্য সুর', 'ক্যাজুয়াল আড্ডার মতো অকৃত্রিম বাচনভঙ্গি'],
        viralScript: 'Bro honestly, if you are not leveraging AI right now in your workflow, you are leaving money on the table.',
        description: 'স্টার্টআপ টক, ফিনটেক ও আধুনিক শহুরে সোশ্যাল মিডিয়া পডকাস্টের জন্য।',
        avatarColor: 'from-teal-500 to-cyan-600',
      },
      {
        id: 'viral-vikram',
        voiceId: 'insta-vikram-roast',
        name: 'Vikram (Desi Roasting & Meme Commentary 🔥)',
        nameBn: 'বিক্রম (দেশি রোস্টিং ও মিম কমেন্টারি 🔥)',
        personaTitle: 'সার্কাস্টিক মিম ও ট্রেন্ডিং কমেন্টারি',
        langTag: 'hi',
        langLabel: '🇮🇳 হিন্দি (Meme & Roast)',
        platform: 'Instagram Reels',
        statsBadge: '🔥 ৫৫০ মিলিয়ন ভিউ',
        categoryTag: 'Desi Roast Master',
        speed: 1.15,
        pitch: 1,
        emotion: 'excited',
        humanTraits: ['তীক্ষ্ণ ব্যঙ্গাত্মক রসিকতার টাইমিং', 'উচ্চ এনার্জির নাটকীয় মিম ডেলিভারি', '১০০% বিনোদনমূলক দেশি বাচনভঙ্গি'],
        viralScript: 'अरे भाई भाई भाई! रील्स पे ज्ञान देने वालों की तादाद इतनी बढ़ गई है!',
        description: 'মিম পেজ, রোস্টিং চ্যানেল ও কমেডি রিলসের জন্য সবচেয়ে জনপ্রিয়।',
        avatarColor: 'from-red-500 to-amber-500',
      },
    ]
  });
});

// ---------- /api/validate-email ----------
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
      error: 'Disposable emails are blocked.',
      messageBn: '⛔ ডিসপোজেবল ইমেইল নিষিদ্ধ।'
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

// ---------- /api/enhance-text ----------
app.post('/api/enhance-text', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!ai) {
      const cleaned = text.replace(/([।॥?!])/g, '$1 ').replace(/\s+/g, ' ').trim();
      return res.json({ enhancedText: cleaned, note: 'Rule engine' });
    }

    const prompt = `তুমি একজন সিনিয়র Bengali Linguistics ও TTS বিশেষজ্ঞ। 
নিচের বাংলা টেক্সটটি মানুষের স্বাভাবিক বাচনভঙ্গির উপযোগী করে পরিমার্জন কর:
1. যুক্তাক্ষর ও ব্যাকরণ সঠিক রাখ।
2. বাংলা সংখ্যা কথ্য বাংলায় রূপান্তর কর।
3. যতিচিহ্ন সঠিক রাখ।
4. সংক্ষিপ্ত রূপ পূর্ণ শব্দে রূপান্তর কর।
5. মূল ভাব পরিবর্তন করবে না।

মূল টেক্সট:
"""
${text}
"""

শুধুমাত্র পরিমার্জিত বাংলা টেক্সট দাও।`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    const enhanced = response.text?.trim() || text;
    res.json({ enhancedText: enhanced });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Enhance error:', msg);
    res.json({ enhancedText: req.body.text, warning: msg });
  }
});

// ---------- Shared Clips ----------
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
const sharedClips = new Map<string, Sha
