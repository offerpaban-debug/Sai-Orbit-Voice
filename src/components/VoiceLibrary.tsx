import React, { useState, useEffect, useRef } from 'react';
import {
  DEFAULT_VOICE_PRESETS,
  VoicePreset,
  VOICE_CATALOG,
  VoiceItem,
} from '../utils/voiceCatalog';
import { EmotionType, EMOTION_PROFILES } from '../utils/ssmlBuilder';
import {
  BookOpen,
  Plus,
  Trash2,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Check,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  Volume2,
  Radio,
  Sliders,
  CheckCircle2,
  MessageSquare,
  X,
  Loader2,
  Filter
} from 'lucide-react';

export interface ViralReelConfig {
  id: string;
  voiceId: string;
  name: string;
  nameBn: string;
  personaTitle: string;
  langTag: 'bn' | 'hi' | 'en';
  langLabel: string;
  platform: 'Instagram Reels' | 'TikTok' | 'YouTube Shorts';
  statsBadge: string;
  categoryTag: string;
  speed: number;
  pitch: number;
  emotion: EmotionType;
  humanTraits: string[];
  viralScript: string;
  description: string;
  avatarColor: string;
}

export const VIRAL_REEL_CONFIGS: ViralReelConfig[] = [
  // -------------------------------------------------------------
  // ENGLISH VIRAL SENSATIONS (GLOBAL INSTAGRAM & TIKTOK)
  // -------------------------------------------------------------
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
    humanTraits: [
      'গম্ভীর গমগমে সিনেম্যাটিক সুর',
      'সাসপেন্স মাইক্রো-পজ ও টানটান রহস্য',
      '১০০% রোবটিক ভাবমুক্ত জীবন্ত বাচনভঙ্গি'
    ],
    viralScript:
      'Did you know that in 1943, scientists discovered an underground secret that changed human history forever...',
    description:
      'ইনস্টাগ্রাম ও টিকটকে সবচেয়ে ভাইরাল ড্রামাটিক কণ্ঠ। ডার্ক হিস্ট্রি, রহস্য ও কনস্পিরেসি রিলসের জন্য অপরাজেয়।',
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
    humanTraits: [
      'উচ্চ-উদ্দীপনাময় ফাস্ট-পেসড ডেলিভারি',
      'স্ক্রোল বন্ধ করার মতো তীক্ষ্ণ হুক',
      'প্রাণবন্ত আত্মবিশ্বাসী আধুনিক উচ্চারণ'
    ],
    viralScript:
      'Stop scrolling right now! If you have this hidden setting on your phone, you need to turn it off immediately.',
    description:
      'প্রথম ৩ সেকেন্ডেই দর্শককে ধরে রাখার জন্য বিশ্বখ্যাত টিকটক হুক কণ্ঠ। গ্যাজেট ও লাইফ হ্যাকসে দারুণ কাজ করে।',
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
    humanTraits: [
      'স্নিগ্ধ মিষ্টি নিঃশ্বাস ও উষ্ণতা',
      'কোমল ঘনিষ্ঠ গল্প বলার অনুভূতি',
      'রিলাক্সিং ক্যাফে ও ট্রাভেল সুর'
    ],
    viralScript:
      'Come spend a slow rainy Sunday with me in Tokyo. First, hot coffee and morning journals before the city wakes up.',
    description:
      'ক্যাফে ভ্লগ, স্লো ট্রাভেল রিলস ও ডেইলি স্টোরির জন্য অত্যন্ত নান্দনিক ও মিষ্টি মানবিক কণ্ঠ।',
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
    humanTraits: [
      'তীক্ষ্ণ, স্পষ্ট ও আধুনিক প্রফেশনাল স্বর',
      'হাই-কনভার্সন গ্যাজেট উপস্থাপনা',
      'ন্যাচারাল ইংরেজি ইনফ্লেকশন'
    ],
    viralScript:
      'Here are three secret AI websites that feel completely illegal to know, but let me show you anyway.',
    description:
      'টেক রিভিউ, এআই টুলস ও ক্রিপ্টো/ফাইন্যান্স শর্টসের জন্য বিশ্বজুড়ে ব্যবহৃত আন্তর্জাতিক ইংরেজি কণ্ঠ।',
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
    humanTraits: [
      'ডার্ক সিনেম্যাটিক ফিসফিসানি টোন',
      'লো-ফ্রিকোয়েন্সি ক্রাইম সাসপেন্স',
      'কৌতূহল সৃষ্টিকারী নিঃশব্দ বিরতি'
    ],
    viralScript:
      'Nobody ever talks about what really happened in room 217 on that cold December midnight...',
    description:
      'আনসলভড মিস্ট্রি, হরর এডিট এবং মিডনাইট ক্রাইম পডকাস্ট শর্টসের জন্য তৈরি লো-পিচ রহস্যময় কণ্ঠ।',
    avatarColor: 'from-purple-900 to-slate-900',
  },

  // -------------------------------------------------------------
  // BENGALI VIRAL VOICES (বাংলা রিলস ও সোশ্যাল মিডিয়া)
  // -------------------------------------------------------------
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
    humanTraits: [
      '১০০% খাঁটি দেশীয় বাংলা বাচনভঙ্গি',
      'সোশ্যাল মিডিয়া উপযোগী দ্রুত ও স্পষ্ট ডেলিভারি',
      'ন্যাচারাল কথ্য কোলকাতা/ঢাকা স্বর'
    ],
    viralScript:
      'দাঁড়ান দাঁড়ান! স্ক্রোল করার আগে মাত্র ৩০ সেকেন্ড সময় দিন। এই ৩টি ট্রিক আপনার প্রতিদিনের সময় অর্ধেক বাঁচিয়ে দেবে!',
    description:
      'বাংলায় ইনস্টাগ্রাম রিলস, ফেসবুক ওয়াচ ও শর্টসের জন্য সবচেয়ে জনপ্রিয় দ্রুতগতির ক্রিয়েটর কণ্ঠ।',
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
    humanTraits: [
      'মিষ্টি স্নিগ্ধ বাংলা বাচনভঙ্গি',
      'প্রশান্ত গল্পকথনের স্বাভাবিক সুর',
      'জীবন্ত মানবীয় আবেগ ও মৃদু হাসি'
    ],
    viralScript:
      'আজকের কুয়াশাচ্ছন্ন সকালে পাহাড়ি কটেজে গরম ধোঁয়া ওঠা চায়ের কাপ আর প্রিয় বই—জীবনটা সত্যি সুন্দর।',
    description:
      'ভ্রমণ ভ্লগ, স্লো-মোশন রিলস ও মিষ্টি কবিতার জন্য সবচেয়ে প্রিয় বাংলা নারী কণ্ঠ।',
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
    humanTraits: [
      'গভীর ব্যারিটোন বাংলা বাচনভঙ্গি',
      'রোমাঞ্চকর ভৌতিক গল্পের নিস্তব্ধ আবহ',
      'পরিমিত সাসপেন্স ও টানটান নাটকীয়তা'
    ],
    viralScript:
      '১৯৭২ সালের সেই কুয়াশাচ্ছন্ন মধ্যরাতে সুন্দরবনের গহীনে যা ঘটেছিল, তা আজও কোনো সাধারণ বিজ্ঞানের ব্যাখ্যায় মেলে না...',
    description:
      'রহস্য রোমাঞ্চ, ভৌতিক গল্প এবং ঐতিহাসিক থ্রিলার শর্টসের জন্য অতুলনীয় বাংলা কণ্ঠ।',
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
    humanTraits: [
      'আধুনিক স্মার্ট বাংলা বাচনভঙ্গি',
      'স্পষ্ট ও তথ্যবহুল উচ্চারণ',
      'গ্যাজেট আনবক্সিং উপযোগী প্রাণবন্ত ছন্দ'
    ],
    viralScript:
      'আপনি কি জানেন এই ৩টি গোপন এআই টুল দিয়ে যেকোনো ভিডিওর ব্যাকগ্রাউন্ড মাত্র এক ক্লিকেই পরিবর্তন করা যায়?',
    description:
      'ইউটিউব শর্টস ও ইনস্টাগ্রাম রিলসে বাংলা টেক রিভিউ, মোবাইল টিপস ও ট্রিকস তৈরির শ্রেষ্ঠ কণ্ঠ।',
    avatarColor: 'from-blue-500 to-indigo-600',
  },

  // -------------------------------------------------------------
  // HINDI & HINGLISH VIRAL VOICES (হিন্দি ও হিংলিশ ট্রেন্ডিং)
  // -------------------------------------------------------------
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
    humanTraits: [
      'স্বাভাবিক কথ্য দেশি রিদম',
      'বন্ধুত্বপূর্ণ আত্মবিশ্বাসী টোন',
      'স্পষ্ট ও আবেগপূর্ণ হিন্দি উচ্চারণ'
    ],
    viralScript:
      'रुको भाई! अगर तुम भी २०२৬ में फाइनेंशियली फ्री होना चाहते हो, तो ये ৩ गलतियां कभी मत करना।',
    description:
      'ভারতের সোশ্যাল মিডিয়ায় সবচেয়ে ট্রেন্ডিং হিন্দি ভয়েস। মোটিভেশন, বিজনেস টিপস ও স্টোরিটেলিংয়ে শীর্ষে।',
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
    humanTraits: [
      'গভীর ব্যারিটোন ও রাশভারী কর্তৃত্ব',
      'সিগমা এডিট ও জিম মোটিভেশনের গভীর বেস',
      'দৃঢ় ও আত্মবিশ্বাসী উচ্চারণ'
    ],
    viralScript:
      'लोग तुम्हारी औकात तब तक नहीं पहचानेंगे, जब तक तुम्हारी सफलता शोर नहीं मचाती। खामोशी से मेहनत करो।',
    description:
      'জিম এডিট, সিগমা রুলস ও উচ্চ প্রভাবের হিন্দি মোটিভেশনের জন্য তৈরি গম্ভীর রাশভারী কণ্ঠ।',
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
    humanTraits: [
      'উচ্ছ্বসিত ও মিষ্টি বাচনভঙ্গি',
      'লাইফস্টাইল ভ্লগের প্রাণবন্ত ইনফ্লেকশন',
      'ন্যাচারাল কথ্য হিন্দি ও গ্ল্যামারাস টোন'
    ],
    viralScript:
      'हे गाइस! आज मैं आपके साथ शेयर कर रही हूँ मेरा सीक्रेट ग्लोइंग स्किन रूटीन जो सिर्फ ৫ मिनट में तैयार होता है।',
    description:
      'ফ্যাশন, মেকআপ, বলিউড গসিপ ও নান্দনিক হিন্দি রিলসের জন্য সুপার-পপুলার ক্রিয়েটর ভয়েস।',
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
    humanTraits: [
      'সহজ-সরল আধুনিক দ্বিভাষিক মিশ্রণ',
      'জেন-জি ও মিলেনিয়ালদের কথ্য সুর',
      'ক্যাজুয়াল আড্ডার মতো অকৃত্রিম বাচনভঙ্গি'
    ],
    viralScript:
      'Bro honestly, if you are not leveraging AI right now in your workflow, you are literally leaving money on the table.',
    description:
      'স্টার্টআপ টক, ফিনটেক ও আধুনিক শহুরে সোশ্যাল মিডিয়া পডকাস্টের জন্য সবচেয়ে প্রিয় হিংলিশ ভয়েস।',
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
    humanTraits: [
      'তীক্ষ্ণ ব্যঙ্গাত্মক রসিকতার টাইমিং',
      'উচ্চ এনার্জির নাটকীয় মিম ডেলিভারি',
      '১০০% বিনোদনমূলক দেশি বাচনভঙ্গি'
    ],
    viralScript:
      'अरे भाई भाई भाई! रील्स पे ज्ञान देने वालों की तादाद इतनी बढ़ गई है कि अब असली टैलेंट ढूंढने के लिए दूरबीन लगानी पड़ती है!',
    description:
      'মিম পেজ, রোস্টিং চ্যানেল ও কমেডি রিলসের জন্য সবচেয়ে জনপ্রিয় হাই-পেসড ভাইরাল হিন্দি কণ্ঠ।',
    avatarColor: 'from-red-500 to-amber-500',
  },
];

interface VoiceLibraryProps {
  onApplyPreset: (preset: VoicePreset, customText?: string) => void;
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
  const [presets, setPresets] = useState<VoicePreset[]>(() => {
    try {
      const saved = localStorage.getItem('saiorbit_voice_presets');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_VOICE_PRESETS;
  });

  const [filterTab, setFilterTab] = useState<'trending' | 'all' | 'bn' | 'hi' | 'en'>('trending');
  const [selectedTrendingFilter, setSelectedTrendingFilter] = useState<'all' | 'bn' | 'hi' | 'en'>('all');

  // Dynamic Trending AI Voices fetched from API with fallback to built-in presets
  const [trendingConfigs, setTrendingConfigs] = useState<ViralReelConfig[]>(VIRAL_REEL_CONFIGS);
  const [isFetchingTrending, setIsFetchingTrending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTrendingVoices = async () => {
      setIsFetchingTrending(true);
      try {
        const res = await fetch('/api/trending-voices');
        if (res.ok) {
          const data = await res.json();
          if (data.trendingVoices && Array.isArray(data.trendingVoices) && data.trendingVoices.length > 0 && isMounted) {
            setTrendingConfigs(data.trendingVoices);
          }
        }
      } catch (err) {
        console.warn('Using local viral voice configurations:', err);
      } finally {
        if (isMounted) setIsFetchingTrending(false);
      }
    };
    fetchTrendingVoices();
    return () => {
      isMounted = false;
    };
  }, []);

  // In-Place Audio Player State (Keeps user on the page without jumping tabs!)
  const [playingConfigId, setPlayingConfigId] = useState<string | null>(null);
  const [loadingConfigId, setLoadingConfigId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Custom text testing state for viral cards
  const [customTestConfigId, setCustomTestConfigId] = useState<string | null>(null);
  const [customPhraseInput, setCustomPhraseInput] = useState<string>('');

  // Preset Creation Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newVoiceId, setNewVoiceId] = useState('bn-IN-Wavenet-A');
  const [newSpeed, setNewSpeed] = useState(1.0);
  const [newPitch, setNewPitch] = useState(0);
  const [newEmotion, setNewEmotion] = useState<EmotionType>('neutral');
  const [newDescription, setNewDescription] = useState('');

  // Persist presets
  useEffect(() => {
    localStorage.setItem('saiorbit_voice_presets', JSON.stringify(presets));
  }, [presets]);

  // Cleanup audio player on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  // Stop currently playing audio
  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    setPlayingConfigId(null);
    setAudioProgress(0);
  };

  // Play Viral Reel Sample directly in-place
  const handlePlayViralSampleInPlace = async (config: ViralReelConfig, textOverride?: string) => {
    if (playingConfigId === config.id && !textOverride) {
      // Toggle pause/stop
      stopAudio();
      return;
    }

    stopAudio();
    setLoadingConfigId(config.id);

    try {
      const textToPlay = textOverride || config.viralScript;
      const v = VOICE_CATALOG.find((item) => item.id === config.voiceId) || VOICE_CATALOG[0];

      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToPlay,
          voice: config.voiceId,
          lang: v.langCode,
          speed: config.speed,
          pitch: config.pitch,
          emotion: config.emotion,
          isTrending: true,
        }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        audioPlayerRef.current = audio;
        setPlayingConfigId(config.id);

        audio.ontimeupdate = () => {
          if (audio.duration && audio.duration > 0) {
            setAudioProgress(Math.round((audio.currentTime / audio.duration) * 100));
          }
        };

        audio.onended = () => {
          setPlayingConfigId(null);
          setAudioProgress(0);
        };

        audio.onerror = () => {
          setPlayingConfigId(null);
          setAudioProgress(0);
        };

        await audio.play();
      }
    } catch (err) {
      console.error('Failed to play viral sample in-place:', err);
    } finally {
      setLoadingConfigId(null);
    }
  };

  // Apply viral config to studio and transition smoothly
  const handleUseViralConfigInStudio = (config: ViralReelConfig) => {
    stopAudio();
    const presetItem: VoicePreset = {
      id: config.id,
      name: config.nameBn,
      voiceId: config.voiceId,
      speed: config.speed,
      pitch: config.pitch,
      emotion: config.emotion,
      description: config.description,
      isTrending: true,
    };
    onApplyPreset(presetItem, config.viralScript);
  };

  // Create custom preset
  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPreset: VoicePreset = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      voiceId: newVoiceId,
      speed: newSpeed,
      pitch: newPitch,
      emotion: newEmotion,
      description: newDescription.trim() || 'কাস্টম সংরক্ষিত ভয়েস প্রিসেট',
      isCustom: true,
    };

    setPresets([newPreset, ...presets]);
    setIsCreating(false);
    setNewName('');
    setNewDescription('');
  };

  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter((p) => p.id !== id));
  };

  // Export Presets JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(presets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `saiorbit_voices_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Presets JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setPresets([...imported, ...presets.filter((p) => !imported.some((imp) => imp.id === p.id))]);
        }
      } catch (err) {
        console.warn('JSON import error, file format invalid');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter viral configs based on selected sub-tab
  const filteredViralConfigs = trendingConfigs.filter((cfg) => {
    if (selectedTrendingFilter === 'all') return true;
    return cfg.langTag === selectedTrendingFilter;
  });

  // Filter general presets
  const filteredGeneralPresets = presets.filter((p) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'trending') return p.isTrending || p.voiceId.startsWith('insta-');
    const v = VOICE_CATALOG.find((item) => item.id === p.voiceId);
    if (!v) return true;
    if (filterTab === 'bn') return v.langCode.startsWith('bn');
    if (filterTab === 'hi') return v.langCode === 'hi-IN';
    if (filterTab === 'en') return v.langCode.startsWith('en');
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#6C5CE7]" />
              <span>ভয়েস লাইব্রেরি ও ট্রেন্ডিং এআই সাউন্ডস (Voice Library)</span>
            </h2>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 uppercase tracking-wider shadow-sm">
              ১০০% হিউম্যান সাউন্ড
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            ইনস্টাগ্রাম রিলস, টিকটক ও শর্টসে প্রতিদিন কোটি কোটি ভিউ পাওয়া ভাইরাল ভয়েস স্টাইল। কোনো রোবটিক ড্রোন বা এআই কৃত্রিমতা ছাড়া খাঁটি মানবিক বাচনভঙ্গি।
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="ভয়েস প্রিসেট ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span>এক্সপোর্ট JSON</span>
          </button>

          {/* Import JSON */}
          <label className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>ইম্পোর্ট</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          {/* New Preset Button */}
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-3.5 py-1.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5c4ce0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6C5CE7]/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন ভয়েস বানান</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 SECTION: TRENDING AI VOICES (INSTAGRAM & TIKTOK VIRAL REEL SHOWCASE) */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#18183E] via-[#141432] to-[#0E0E24] border-2 border-amber-500/35 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6C5CE7]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Title Banner with Multi-Language Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <Flame className="w-5 h-5 fill-current" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>🔥 ট্রেন্ডিং ভাইরাল এআই ভয়েস (Trending AI Voices)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00B894] border border-emerald-500/30">
                    ইনস্টা ও টিকটক ভাইরাল
                  </span>
                  {isFetchingTrending && (
                    <span className="text-[10px] text-amber-300 flex items-center gap-1 font-mono">
                      <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                      লাইভ সিঙ্ক...
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  ১২+ বিলিয়ন সম্মিলিত ভিউ সম্বলিত ভাইরাল রিল ন্যারেটর, টিকটক হুক মাস্টার ও নান্দনিক ভ্লগার স্টাইল (বাংলা, হিন্দি ও ইংরেজি)।
                </p>
              </div>
            </div>
          </div>

          {/* Sub-language tabs: All, Bengali, Hindi, English */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `সব ভাইরাল (${trendingConfigs.length} টি)` },
              { id: 'bn', label: `🇧🇩 বাংলা রিল (${trendingConfigs.filter((c) => c.langTag === 'bn').length})` },
              { id: 'hi', label: `🇮🇳 হিন্দি ও হিংলিশ (${trendingConfigs.filter((c) => c.langTag === 'hi').length})` },
              { id: 'en', label: `🇬🇧 ইংরেজি ভাইরাল (${trendingConfigs.filter((c) => c.langTag === 'en').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTrendingFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  selectedTrendingFilter === tab.id
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Informative Human Quality Trust Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-[#6C5CE7]/10 to-amber-500/10 border border-emerald-500/20 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-200 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">১০০% অর্গানিক হিউম্যান প্রোসোডি ও বাচনভঙ্গি</span>
              <span className="text-slate-400 text-[11px]">
                কোনো যান্ত্রিক রোবট বা এআই একঘেয়ে সুর নেই। প্রতিটি কণ্ঠে আছে মানবীয় নিঃশ্বাস, স্বাভাবিক বিরতি ও জীবন্ত ইমোশন।
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-amber-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>তাৎক্ষণিক ইন-প্লেস অডিও প্রিভিউ সক্রিয়</span>
          </div>
        </div>

        {/* Cards Grid: Viral Reel Configurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
          {filteredViralConfigs.map((config) => {
            const isPlaying = playingConfigId === config.id;
            const isLoading = loadingConfigId === config.id;
            const isSelected = currentVoiceId === config.voiceId;
            const isCustomTesting = customTestConfigId === config.id;

            return (
              <div
                key={config.id}
                className={`bg-[#0A0A1A]/95 border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-2xl relative group ${
                  isSelected
                    ? 'border-amber-400 shadow-amber-500/15 bg-[#12122A]'
                    : 'border-white/10 hover:border-amber-400/50'
                }`}
              >
                {/* Active Playing Ambient Glow */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-emerald-500/10 rounded-2xl pointer-events-none animate-pulse" />
                )}

                <div className="space-y-3 relative z-10">
                  {/* Top Badges: Platform + Views + Language */}
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1 font-bold">
                      <Radio className="w-3 h-3 text-amber-400" />
                      {config.platform}
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {config.statsBadge}
                    </span>
                  </div>

                  {/* Persona Header with Avatar Badge */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${config.avatarColor} p-0.5 shrink-0 shadow-md`}
                    >
                      <div className="w-full h-full rounded-[10px] bg-[#12122A] flex items-center justify-center text-white font-black text-sm">
                        {config.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base leading-snug">
                        {config.nameBn}
                      </h4>
                      <span className="text-[11px] font-semibold text-[#00B894] block mt-0.5">
                        {config.personaTitle}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {config.langLabel}
                      </span>
                    </div>
                  </div>

                  {/* Viral Script Hook Quote */}
                  <div className="bg-[#12122A] border border-white/10 rounded-xl p-3 text-xs text-slate-200 italic font-sans leading-relaxed relative group-hover:border-white/20 transition-colors">
                    <span className="text-[#FD79A8] font-black mr-1 text-sm">&ldquo;</span>
                    {config.viralScript}
                    <span className="text-[#FD79A8] font-black ml-1 text-sm">&rdquo;</span>
                  </div>

                  {/* 100% Human Traits Checklist */}
                  <div className="space-y-1.5 text-[11px] text-slate-300 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                      হিউম্যান সাউন্ড বৈশিষ্ট্য:
                    </div>
                    {config.humanTraits.map((trait, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
                        <span className="truncate">{trait}</span>
                      </div>
                    ))}
                  </div>

                  {/* Animated Waveform / Audio Equalizer Indicator when Playing */}
                  {isPlaying && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold font-mono">
                        <span className="flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                          <span>হিউম্যান অডিও বাজছে...</span>
                        </span>
                        <span>{audioProgress}%</span>
                      </div>
                      {/* Animated Soundwave Equalizer Bars */}
                      <div className="flex items-end justify-center gap-1 h-6 py-1">
                        {[12, 24, 16, 20, 10, 22, 18, 14, 24, 16, 20, 12].map((height, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-gradient-to-t from-amber-400 to-[#00B894] rounded-full animate-pulse"
                            style={{
                              height: `${Math.max(6, (height * (1 + (i % 3) * 0.2)))}px`,
                              animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                            }}
                          />
                        ))}
                      </div>
                      {/* Audio Progress Line */}
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full transition-all duration-100"
                          style={{ width: `${audioProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Custom Phrase Testing Drawer on the Card */}
                  {isCustomTesting && (
                    <div className="bg-[#12122A] border border-amber-400/40 rounded-xl p-3 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>আপনার কাস্টম টেক্সটে শুনুন:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCustomTestConfigId(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        value={customPhraseInput}
                        onChange={(e) => setCustomPhraseInput(e.target.value)}
                        placeholder="এখানে আপনার যেকোনো বাংলা, হিন্দি বা ইংরেজি লাইন লিখুন..."
                        rows={2}
                        className="w-full bg-[#0A0A1A] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none font-sans"
                      />
                      <button
                        type="button"
                        disabled={isLoading || !customPhraseInput.trim()}
                        onClick={() => handlePlayViralSampleInPlace(config, customPhraseInput.trim())}
                        className="w-full py-1.5 rounded-lg bg-[#00B894] hover:bg-[#00a383] text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>তৈরি হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>আমার টেক্সট শুনুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Parameters Meta */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                    <span>গতি: {config.speed}x</span>
                    <span>পিচ: {config.pitch > 0 ? `+${config.pitch}` : config.pitch}st</span>
                    <span className="text-amber-300 font-semibold">{EMOTION_PROFILES[config.emotion]?.labelBn}</span>
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="pt-4 mt-3 border-t border-white/10 space-y-2 relative z-10">
                  {/* Play Sample In-Place Button */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handlePlayViralSampleInPlace(config)}
                    className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isPlaying
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>অডিও লোড হচ্ছে...</span>
                      </>
                    ) : isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>পজ করুন (Pause)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-[#00B894] fill-current" />
                        <span>হিউম্যান অডিও শুনুন</span>
                      </>
                    )}
                  </button>

                  {/* Dual Action: Test with custom text & Use in Studio */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomTestConfigId(isCustomTesting ? null : config.id);
                        if (!customPhraseInput) {
                          setCustomPhraseInput(config.viralScript);
                        }
                      }}
                      className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                      title="নিজের টেক্সট দিয়ে এই ভয়েস টেস্ট করুন"
                    >
                      <MessageSquare className="w-3 h-3 text-[#FD79A8]" />
                      <span>টেক্সট টেস্ট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUseViralConfigInStudio(config)}
                      className="py-2 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[11px] font-black transition-all flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
                      title="স্টুডিওতে এই স্টাইল ও লেখা লোড করুন"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>স্টুডিওতে নিন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📚 ALL PRESETS & CUSTOM USER LIBRARY */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>সব সংরক্ষিত ভয়েস ও প্রিসেট (Saved & Custom Presets)</span>
            <span className="text-xs text-slate-400 font-normal">({filteredGeneralPresets.length} টি)</span>
          </h3>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'সব প্রিসেট' },
              { id: 'trending', label: '🔥 ট্রেন্ডিং' },
              { id: 'bn', label: 'বাংলা' },
              { id: 'hi', label: 'হিন্দি' },
              { id: 'en', label: 'ইংরেজি' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  filterTab === tab.id
                    ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Preset Creation Form Modal / Card */}
        {isCreating && (
          <form
            onSubmit={handleCreatePreset}
            className="bg-[#12122A] border border-[#6C5CE7]/40 rounded-2xl p-5 space-y-4 shadow-xl animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FD79A8]" />
                <span>নতুন কাস্টম ভয়েস প্রিসেট তৈরি করুন</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">প্রিসেট নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আমার প্রিয় পডকাস্ট কণ্ঠ"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0A0A1A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">ভয়েস মডেল নির্বাচন</label>
                <select
                  value={newVoiceId}
                  onChange={(e) => setNewVoiceId(e.target.value)}
                  className="w-full bg-[#0A0A1A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6C5CE7]"
                >
                  {VOICE_CATALOG.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nameBn} ({v.langLabelBn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">আবেগ (Emotion)</label>
                <select
                  value={newEmotion}
                  onChange={(e) => setNewEmotion(e.target.value as EmotionType)}
                  className="w-full bg-[#0A0A1A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6C5CE7]"
                >
                  {Object.entries(EMOTION_PROFILES).map(([key, prof]) => (
                    <option key={key} value={key}>
                      {prof.icon} {prof.labelBn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">সংক্ষিপ্ত বিবরণ</label>
                <input
                  type="text"
                  placeholder="ব্যবহারের ক্ষেত্র..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#0A0A1A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>গতি (Speed)</span>
                  <span className="font-mono text-amber-300">{newSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={newSpeed}
                  onChange={(e) => setNewSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#6C5CE7] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>পিচ (Pitch)</span>
                  <span className="font-mono text-pink-300">{newPitch > 0 ? `+${newPitch}` : newPitch}st</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={newPitch}
                  onChange={(e) => setNewPitch(parseInt(e.target.value))}
                  className="w-full accent-[#FD79A8] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3.5 py-1.5 rounded-xl border border-white/10 text-slate-300 text-xs hover:bg-white/5"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5c4ce0] text-white text-xs font-bold transition-all shadow-md shadow-[#6C5CE7]/30"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}

        {/* Presets Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredGeneralPresets.map((preset) => {
            const voice = VOICE_CATALOG.find((v) => v.id === preset.voiceId);
            const isSelected = currentVoiceId === preset.voiceId;

            return (
              <div
                key={preset.id}
                className={`bg-[#12122A] border rounded-2xl p-4 flex flex-col justify-between transition-all hover:scale-[1.01] ${
                  isSelected
                    ? 'border-[#6C5CE7] bg-[#161636] shadow-lg shadow-[#6C5CE7]/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{preset.name}</span>
                        {preset.isTrending && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            VIRAL
                          </span>
                        )}
                        {preset.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FD79A8]/20 text-[#FD79A8] border border-[#FD79A8]/30">
                            কাস্টম
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {voice ? `${voice.nameBn} (${voice.langLabelBn})` : preset.voiceId}
                      </span>
                    </div>

                    {preset.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeletePreset(preset.id)}
                        className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                    <span>গতি: {preset.speed}x</span>
                    <span>পিচ: {preset.pitch > 0 ? `+${preset.pitch}` : preset.pitch}st</span>
                    <span className="text-amber-300">
                      {EMOTION_PROFILES[preset.emotion as EmotionType]?.icon} {EMOTION_PROFILES[preset.emotion as EmotionType]?.labelBn}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (voice) {
                        onPreviewSample(preset.voiceId, preset.speed, preset.pitch, preset.emotion, voice.sampleText, false);
                      }
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-[#00B894] fill-current" />
                    <span>নমুনা শুনুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onApplyPreset(preset)}
                    className="flex-1 py-1.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5c4ce0] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#6C5CE7]/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>প্রয়োগ করুন</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
