/**
 * Voice Catalog for SAIORBIT VOICE
 * Supported Bengali & Indian regional voices, character presets, Instagram Trending voices, and metadata.
 */

export interface VoiceItem {
  id: string;
  name: string;
  nameBn: string;
  langCode: string;
  langLabelBn: string;
  gender: 'female' | 'male';
  isPremium: boolean;
  isTrending?: boolean;
  trendingPlatform?: 'instagram' | 'tiktok' | 'youtube';
  category: 'insta-trending' | 'bengali' | 'hindi' | 'english' | 'regional' | 'expressive';
  sampleText: string;
  speedDefault: number;
  pitchDefault: number;
  badge?: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'all', labelBn: 'সব ভাষা (All)', labelEn: 'All Languages' },
  { code: 'insta', labelBn: '🔥 ইনস্টা ট্রেন্ডিং (Insta Viral)', labelEn: 'Trending Reels' },
  { code: 'bn', labelBn: '🇧🇩 বাংলা (Bengali)', labelEn: 'Bengali' },
  { code: 'hi', labelBn: '🇮🇳 হিন্দি (Hindi)', labelEn: 'Hindi' },
  { code: 'en', labelBn: '🇬🇧 ইংরেজি (English)', labelEn: 'English' },
  { code: 'regional', labelBn: '🌐 অন্যান্য ভারতীয় (Regional)', labelEn: 'Regional Indian' }
];

export const VOICE_CATALOG: VoiceItem[] = [
  // =================================================================
  // 🔥 INSTAGRAM REELS & TIKTOK TRENDING VIRAL AI VOICES (LEADERBOARD)
  // =================================================================
  {
    id: 'insta-adam-narrator',
    name: 'Adam (The Viral Reel Narrator 🔥)',
    nameBn: 'অ্যাডাম (ডার্ক মিস্ট্রি ও রিল ন্যারেটর 🔥)',
    langCode: 'en-US',
    langLabelBn: 'ইংরেজি (ভাইরাল রিল)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '🔥 #1 INSTA REELS',
    sampleText: 'Did you know that in 1943, scientists discovered an underground secret that changed human history forever...',
    speedDefault: 0.95,
    pitchDefault: -2
  },
  {
    id: 'insta-antoni-hype',
    name: 'Antoni (TikTok & Shorts Hook Master ⚡)',
    nameBn: 'অ্যান্টনি (ভাইরাল টিকটক ও রিল হুক ⚡)',
    langCode: 'en-US',
    langLabelBn: 'ইংরেজি (হাইপ শর্টস)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'tiktok',
    category: 'insta-trending',
    badge: '⚡ VIRAL HOOK',
    sampleText: 'Stop scrolling right now! If you have this on your phone, you need to turn it off immediately.',
    speedDefault: 1.15,
    pitchDefault: 1
  },
  {
    id: 'insta-bella-vlog',
    name: 'Bella (Aesthetic Lifestyle & Mini Vlog ✨)',
    nameBn: 'বেলা (ইনস্টা লাইফস্টাইল ও মিনি ভ্লগ ✨)',
    langCode: 'en-US',
    langLabelBn: 'ইংরেজি (লাইফস্টাইল)',
    gender: 'female',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '✨ AESTHETIC VLOG',
    sampleText: 'Come spend a slow rainy Sunday with me in Tokyo. First, coffee and journals before the city wakes up.',
    speedDefault: 0.92,
    pitchDefault: 0
  },
  {
    id: 'insta-rachel-tech',
    name: 'Rachel (Tech Review & Finance Shorts 📱)',
    nameBn: 'র‍্যাচেল (টেক রিভিউ ও শর্টস কুইন 📱)',
    langCode: 'en-US',
    langLabelBn: 'ইংরেজি (টেক শর্টস)',
    gender: 'female',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'youtube',
    category: 'insta-trending',
    badge: '📱 TECH VIRAL',
    sampleText: 'Here are three secret AI tools that are completely illegal to know, but let me show you anyway.',
    speedDefault: 1.05,
    pitchDefault: 1
  },
  {
    id: 'insta-aarav-desi',
    name: 'Aarav (Desi Reel Creator - Hindi 🇮🇳)',
    nameBn: 'আরব (দেশি ভাইরাল রিল ক্রিয়েটর 🇮🇳)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি (ইনস্টা রিল)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '🇮🇳 TRENDING DESI',
    sampleText: 'रुको भाई! अगर तुम भी २०२৬ में फाइनेंशियली फ्री होना चाहते हो, तो ये ৩ गलतियां कभी मत करना।',
    speedDefault: 1.08,
    pitchDefault: 0
  },
  {
    id: 'insta-ananya-shorts',
    name: 'Ananya (Bollywood & Lifestyle Shorts 💃)',
    nameBn: 'অনন্যা (বলিউড ও ট্রেন্ডিং রিলস 💃)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি (লাইফস্টাইল শর্টস)',
    gender: 'female',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '💃 REEL QUEEN',
    sampleText: 'हे गाइस! आज मैं आपके साथ शेयर कर रही हूँ मेरा सीक्रेट ग्लोइंग स्किन रूटीन जो सिर्फ ৫ मिनट में तैयार होता है।',
    speedDefault: 1.05,
    pitchDefault: 2
  },
  {
    id: 'insta-raj-baritone',
    name: 'Raj (Sigma & Gym Motivation Baritone 🗿)',
    nameBn: 'রাজ (সিগমা ও জিম মোটিভেশন 🗿)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি (মোটিভেশনাল)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'youtube',
    category: 'insta-trending',
    badge: '🗿 SIGMA REEL',
    sampleText: 'लोग तुम्हारी औकात तब तक नहीं पहचानेंगे, जब तक तुम्हारी सफलता शोर नहीं मचाती। खामोशी से मेहनत करो।',
    speedDefault: 0.9,
    pitchDefault: -3
  },
  {
    id: 'insta-shadow-mystery',
    name: 'Shadow (Midnight Crime & True Mystery 🕵️)',
    nameBn: 'শ্যাডো (ক্রাইম থ্রিলার ও ডার্ক স্টোরিজ 🕵️)',
    langCode: 'en-US',
    langLabelBn: 'ইংরেজি (মিস্ট্রি)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'tiktok',
    category: 'insta-trending',
    badge: '🕵️ THRILLER REEL',
    sampleText: 'Nobody ever talks about what really happened in room 217 on that cold December midnight...',
    speedDefault: 0.88,
    pitchDefault: -4
  },
  {
    id: 'insta-ranbir-bangla',
    name: 'Ranbir (Viral Bangla Reel Guy 🔥)',
    nameBn: 'রণবীর (ভাইরাল বাংলা রিল বয় 🔥)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (ভাইরাল রিল)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '🔥 BANGLA VIRAL',
    sampleText: 'দাঁড়ান দাঁড়ান! স্ক্রোল করার আগে শুনে যান—এই ৩টি ট্রিক আপনার প্রতিদিনের সময় অর্ধেক বাঁচিয়ে দেবে!',
    speedDefault: 1.15,
    pitchDefault: 1
  },
  {
    id: 'insta-ahona-vlog',
    name: 'Ahona (Bangla Aesthetic Lifestyle ✨)',
    nameBn: 'অহনা (বাংলা নান্দনিক ভ্লগ ও ট্রাভেল ✨)',
    langCode: 'bn-BD',
    langLabelBn: 'বাংলা (লাইফস্টাইল)',
    gender: 'female',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '✨ BANGLA VLOG',
    sampleText: 'আজকের কুয়াশাচ্ছন্ন সকালে পাহাড়ি কটেজে গরম ধোঁয়া ওঠা চায়ের কাপ আর প্রিয় বই—জীবনটা সত্যি সুন্দর।',
    speedDefault: 0.95,
    pitchDefault: 1
  },
  {
    id: 'insta-kabir-hinglish',
    name: 'Kabir (Urban Hinglish Podcaster 🎙️)',
    nameBn: 'কবীর (আরবান হিংলিশ পডকাস্টার 🎙️)',
    langCode: 'hi-IN',
    langLabelBn: 'হিংলিশ (পডকাস্ট)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'youtube',
    category: 'insta-trending',
    badge: '🎙️ HINGLISH PODCAST',
    sampleText: 'Bro honestly, if you are not leveraging AI right now in your workflow, you are literally leaving money on the table.',
    speedDefault: 1.05,
    pitchDefault: 0
  },
  {
    id: 'insta-orko-mystery',
    name: 'Orko (Bangla Thriller & Horror Documentary 🎙️)',
    nameBn: 'অর্ক (বাংলা থ্রিলার ও ডার্ক মিস্ট্রি 🎙️)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (থ্রিলার রিল)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '🎙️ BANGLA THRILLER',
    sampleText: '১৯৭২ সালের সেই কুয়াশাচ্ছন্ন মধ্যরাতে সুন্দরবনের গহীনে যা ঘটেছিল, তা আজও কোনো সাধারণ বিজ্ঞানের ব্যাখ্যায় মেলে না...',
    speedDefault: 0.92,
    pitchDefault: -2
  },
  {
    id: 'insta-samiran-tech',
    name: 'Samiran (Bangla Tech & AI Explainer 📱)',
    nameBn: 'সমীরণ (বাংলা টেক ও গ্যাজেট রিভিউ 📱)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (টেক হ্যাকস)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'youtube',
    category: 'insta-trending',
    badge: '📱 BANGLA TECH',
    sampleText: 'আপনি কি জানেন এই ৩টি গোপন এআই টুল দিয়ে যেকোনো ভিডিওর ব্যাকগ্রাউন্ড এক ক্লিকেই পরিবর্তন করা যায়?',
    speedDefault: 1.10,
    pitchDefault: 0
  },
  {
    id: 'insta-vikram-roast',
    name: 'Vikram (Desi Roasting & Meme Commentary 🔥)',
    nameBn: 'বিক্রম (দেশি রোস্টিং ও মিম কমেন্টারি 🔥)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি (মিম ও রোস্টিং)',
    gender: 'male',
    isPremium: true,
    isTrending: true,
    trendingPlatform: 'instagram',
    category: 'insta-trending',
    badge: '🔥 MEME ROASTER',
    sampleText: 'अरे भाई भाई भाई! रील्स पे ज्ञान देने वालों की तादाद इतनी बढ़ गई है कि अब असली टैलेंट ढूंढने के लिए दूरबीन लगानी पड़ती है!',
    speedDefault: 1.15,
    pitchDefault: 1
  },

  // =================================================================
  // 🇧🇩 BENGALI VOICES (PRIMARY REGION - INDIA & BANGLADESH)
  // =================================================================
  {
    id: 'bn-IN-Wavenet-A',
    name: 'Ronita Wavenet-A (মহিলা - প্রিমিয়াম ⭐)',
    nameBn: 'রণিতা (Wavenet-A)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (ভারত)',
    gender: 'female',
    isPremium: true,
    category: 'bengali',
    badge: '⭐ PREMIUM FEMALE',
    sampleText: 'নমস্কার, সাইঅরবিট ভয়েসে আপনাকে স্বাগতম। এটি একটি উচ্চমানের মানবিক কণ্ঠ।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'bn-IN-Wavenet-B',
    name: 'Orko Wavenet-B (পুরুষ - প্রিমিয়াম ⭐)',
    nameBn: 'অর্ক (Wavenet-B)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (ভারত)',
    gender: 'male',
    isPremium: true,
    category: 'bengali',
    badge: '⭐ PREMIUM MALE',
    sampleText: 'নমস্কার, আমি অর্ক। সাইঅরবিটের মাধ্যমে আপনার যেকোনো লেখা জীবন্ত করে তুলব।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'bn-IN-Wavenet-C',
    name: 'Shampa Wavenet-C (মহিলা v2)',
    nameBn: 'শম্পা (Wavenet-C)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (ভারত)',
    gender: 'female',
    isPremium: true,
    category: 'bengali',
    sampleText: 'সুপ্রভাত! আজকের সংবাদ ও শিক্ষণীয় তথ্যের জন্য আমার কণ্ঠ ব্যবহার করুন।',
    speedDefault: 1.0,
    pitchDefault: 1
  },
  {
    id: 'bn-IN-Wavenet-D',
    name: 'Soumya Wavenet-D (পুরুষ v2)',
    nameBn: 'সৌম্য (Wavenet-D)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (ভারত)',
    gender: 'male',
    isPremium: true,
    category: 'bengali',
    sampleText: 'শুভ অপরাহ্ন! গল্প ও পডকাস্টের জন্য আমার গম্ভীর স্বর বেশ চমৎকার।',
    speedDefault: 0.95,
    pitchDefault: -1
  },
  {
    id: 'bn-BD-Wavenet-A',
    name: 'Nasrin Wavenet-A (মহিলা - বাংলাদেশ)',
    nameBn: 'নাসরিন (bn-BD)',
    langCode: 'bn-BD',
    langLabelBn: 'বাংলা (বাংলাদেশ)',
    gender: 'female',
    isPremium: true,
    category: 'bengali',
    badge: '🇧🇩 BANGLADESH',
    sampleText: 'আসসালামু আলাইকুম, সাইঅরবিট ভয়েসে আপনাকে স্বাগতম।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'bn-BD-Wavenet-B',
    name: 'Mahmud Wavenet-B (পুরুষ - বাংলাদেশ)',
    nameBn: 'মাহমুদ (bn-BD)',
    langCode: 'bn-BD',
    langLabelBn: 'বাংলা (বাংলাদেশ)',
    gender: 'male',
    isPremium: true,
    category: 'bengali',
    badge: '🇧🇩 BANGLADESH',
    sampleText: 'আসসালামু আলাইকুম, আমি মাহমুদ। সাইঅরবিটের মাধ্যমে চমৎকার বাংলা অডিও উপভোগ করুন।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'bn-IN-Standard-A',
    name: 'Tanushree Standard-A (মহিলা)',
    nameBn: 'তনুশ্রী (Standard-A)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (ভারত)',
    gender: 'female',
    isPremium: false,
    category: 'bengali',
    sampleText: 'স্বাগতম, যেকোনো সাধারণ টেক্সট থেকে দ্রুত অডিও তৈরি করতে এটি ব্যবহার করুন।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'bn-IN-Standard-B',
    name: 'Pritam Standard-B (পুরুষ)',
    nameBn: 'প্রীতম (Standard-B)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা (ভারত)',
    gender: 'male',
    isPremium: false,
    category: 'bengali',
    sampleText: 'নমস্কার, দ্রুত অডিও জেনারেশনের জন্য আমি প্রস্তুত।',
    speedDefault: 1.0,
    pitchDefault: 0
  },

  // =================================================================
  // 🇮🇳 HINDI VOICES (হিন্দি ভাষা)
  // =================================================================
  {
    id: 'hi-IN-Wavenet-A',
    name: 'Madhura Wavenet-A (Hindi Female)',
    nameBn: 'মধুরা (hi-IN-A)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি',
    gender: 'female',
    isPremium: true,
    category: 'hindi',
    badge: '🇮🇳 HINDI FEMALE',
    sampleText: 'नमस्ते, साइऑर्बिट वॉयस में आपका स्वागत है। यह एक स्पष्ट और मधुर आवाज़ है।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'hi-IN-Wavenet-B',
    name: 'Aditya Wavenet-B (Hindi Male)',
    nameBn: 'আদিত্য (hi-IN-B)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি',
    gender: 'male',
    isPremium: true,
    category: 'hindi',
    badge: '🇮🇳 HINDI MALE',
    sampleText: 'नमस्ते! मैं आदित्य हूँ, उच्च गुणवत्ता वाली हिंदी आवाज़ और पॉडकास्ट के लिए तैयार।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'hi-IN-Wavenet-C',
    name: 'Rohan Wavenet-C (Hindi Male v2)',
    nameBn: 'রোহন (hi-IN-C)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি',
    gender: 'male',
    isPremium: true,
    category: 'hindi',
    sampleText: 'नमस्ते दोस्तों, यह एक प्राकृतिक, शांत और सहज हिंदी वाचन शैली है।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'hi-IN-Wavenet-D',
    name: 'Priya Wavenet-D (Hindi Female v2)',
    nameBn: 'প্রিয়া (hi-IN-D)',
    langCode: 'hi-IN',
    langLabelBn: 'হিন্দি',
    gender: 'female',
    isPremium: true,
    category: 'hindi',
    sampleText: 'नमस्ते, कहानियों और ज्ञानवर्धक ऑडियो के लिए मेरा स्वर उपयुक्त है।',
    speedDefault: 1.0,
    pitchDefault: 0
  },

  // =================================================================
  // 🇬🇧 / 🇺🇸 ENGLISH VOICES (INDIAN & GLOBAL ENGLISH)
  // =================================================================
  {
    id: 'en-IN-Wavenet-A',
    name: 'Kavya Wavenet-A (Indian English Female)',
    nameBn: 'কাব্য (en-IN-A)',
    langCode: 'en-IN',
    langLabelBn: 'ভারতীয় ইংরেজি',
    gender: 'female',
    isPremium: true,
    category: 'english',
    badge: '🇮🇳 INDIAN ENGLISH',
    sampleText: 'Welcome to SAIORBIT VOICE. Experience natural Indian English accents for your global audience.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'en-IN-Wavenet-B',
    name: 'Kabir Wavenet-B (Indian English Male)',
    nameBn: 'কবীর (en-IN-B)',
    langCode: 'en-IN',
    langLabelBn: 'ভারতীয় ইংরেজি',
    gender: 'male',
    isPremium: true,
    category: 'english',
    badge: '🇮🇳 INDIAN ENGLISH',
    sampleText: 'Hello there! Perfect for corporate presentations, software tutorials and educational reels.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'en-IN-Wavenet-C',
    name: 'Arjun Wavenet-C (Indian English Male v2)',
    nameBn: 'অর্জুন (en-IN-C)',
    langCode: 'en-IN',
    langLabelBn: 'ভারতীয় ইংরেজি',
    gender: 'male',
    isPremium: true,
    category: 'english',
    sampleText: 'Greetings! Saiorbit provides high quality neural voices effortlessly for your videos.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'en-IN-Wavenet-D',
    name: 'Ananya Wavenet-D (Indian English Female v2)',
    nameBn: 'অনন্যা (en-IN-D)',
    langCode: 'en-IN',
    langLabelBn: 'ভারতীয় ইংরেজি',
    gender: 'female',
    isPremium: true,
    category: 'english',
    sampleText: 'Hi! Let us transform your written scripts into lively spoken narratives with perfect clarity.',
    speedDefault: 1.0,
    pitchDefault: 0
  },

  // =================================================================
  // 🌐 REGIONAL INDIAN LANGUAGES (তামিল, তেলুগু, মারাঠি, ইত্যাদি)
  // =================================================================
  {
    id: 'ta-IN-Wavenet-A',
    name: 'Deepa Wavenet-A (Tamil Female)',
    nameBn: 'দীপা (তামিল)',
    langCode: 'ta-IN',
    langLabelBn: 'তামিল (Tamil)',
    gender: 'female',
    isPremium: true,
    category: 'regional',
    sampleText: 'வணக்கம், சாய்ஆர்பிட் குரலுக்கு உங்களை வரவேற்கிறோம்.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'te-IN-Wavenet-A',
    name: 'Vani Wavenet-A (Telugu Female)',
    nameBn: 'বাণী (তেলুগু)',
    langCode: 'te-IN',
    langLabelBn: 'তেলুগু (Telugu)',
    gender: 'female',
    isPremium: true,
    category: 'regional',
    sampleText: 'నమస్కారం, సాయిఆర్బిట్ వాయిస్‌కి స్వాగతం.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'mr-IN-Wavenet-A',
    name: 'Anandi Wavenet-A (Marathi Female)',
    nameBn: 'আনন্দী (মারাঠি)',
    langCode: 'mr-IN',
    langLabelBn: 'মারাঠি (Marathi)',
    gender: 'female',
    isPremium: true,
    category: 'regional',
    sampleText: 'नमस्कार, सायऑर्बिट व्हॉइसमध्ये आपले स्वागत आहे.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'gu-IN-Wavenet-A',
    name: 'Dhriti Wavenet-A (Gujarati Female)',
    nameBn: 'ধৃতি (গুজরাটি)',
    langCode: 'gu-IN',
    langLabelBn: 'গুজরাটি (Gujarati)',
    gender: 'female',
    isPremium: true,
    category: 'regional',
    sampleText: 'નમસ્તે, સાઇઓર્બિટ વોઇસમાં તમારું સ્વાગત છે.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'kn-IN-Wavenet-A',
    name: 'Kavya Wavenet-A (Kannada Female)',
    nameBn: 'কাব্য (কন্নড়)',
    langCode: 'kn-IN',
    langLabelBn: 'কন্নড় (Kannada)',
    gender: 'female',
    isPremium: true,
    category: 'regional',
    sampleText: 'ನಮಸ್ಕಾರ, ಸಾಯೋರ್ಬಿಟ್ ವಾಯ್ಸ್‌ಗೆ ನಿಮಗೆ ಸ್ವಾಗತ.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'ml-IN-Wavenet-A',
    name: 'Mallika Wavenet-A (Malayalam Female)',
    nameBn: 'মল্লিকা (মালায়ালাম)',
    langCode: 'ml-IN',
    langLabelBn: 'মালায়ালাম (Malayalam)',
    gender: 'female',
    isPremium: true,
    category: 'regional',
    sampleText: 'നമസ്കാരം, സായ്ഓർബിറ്റ് വോയ്സിലേക്ക് സ്വാഗതം.',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'pa-IN-Wavenet-A',
    name: 'Harpreet Wavenet-A (Punjabi Female)',
    nameBn: 'হরপ্রীত (পাঞ্জাবি)',
    langCode: 'pa-IN',
    langLabelBn: 'পাঞ্জাবি (Punjabi)',
    gender: 'female',
    isPremium: true,
    category: 'regional',
    sampleText: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਸਾਈਔਰਬਿਟ ਵੌਇਸ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।',
    speedDefault: 1.0,
    pitchDefault: 0
  },

  // =================================================================
  // ✨ EXPRESSIVE NEURAL STUDIO VOICES
  // =================================================================
  {
    id: 'gemini-kore',
    name: 'Kore (Expressive Studio)',
    nameBn: 'মৈত্রী (Kore)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা/গ্লোবাল',
    gender: 'female',
    isPremium: true,
    category: 'expressive',
    badge: '✨ AI EXPRESSIVE',
    sampleText: 'নমস্কার! আমি অত্যন্ত অনুভূতিশীল এবং সাবলীল বাচনভঙ্গিতে কথা বলতে পারি।',
    speedDefault: 1.0,
    pitchDefault: 0
  },
  {
    id: 'gemini-fenrir',
    name: 'Fenrir (Deep Narrator)',
    nameBn: 'অনির্বাণ (Fenrir)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা/গ্লোবাল',
    gender: 'male',
    isPremium: true,
    category: 'expressive',
    badge: '🎙️ DEEP NARRATOR',
    sampleText: 'নমস্কার, গম্ভীর ডকুমেন্টারি ও গভীর নাট্য-উচ্চারণের জন্য আমার কণ্ঠ উপযুক্ত।',
    speedDefault: 0.95,
    pitchDefault: -1
  },
  {
    id: 'gemini-puck',
    name: 'Puck (Youthful & Energetic)',
    nameBn: 'অনন্যা (Puck)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা/গ্লোবাল',
    gender: 'female',
    isPremium: true,
    category: 'expressive',
    badge: '⚡ YOUTHFUL',
    sampleText: 'হ্যালো! ইউটিউব ভিডিও এবং চঞ্চল কন্টেন্টের জন্য আমি দারুণ পছন্দ।',
    speedDefault: 1.05,
    pitchDefault: 2
  },
  {
    id: 'gemini-zephyr',
    name: 'Zephyr (Warm Storyteller)',
    nameBn: 'রুদ্র (Zephyr)',
    langCode: 'bn-IN',
    langLabelBn: 'বাংলা/গ্লোবাল',
    gender: 'male',
    isPremium: true,
    category: 'expressive',
    badge: '🍃 WARM STORY',
    sampleText: 'নমস্কার! ঘুমপাড়ানি গল্প ও অডিওবুকের শান্তিময় আবহে আমার কণ্ঠ শুনুন।',
    speedDefault: 0.9,
    pitchDefault: -2
  }
];

export interface VoicePreset {
  id: string;
  name: string;
  voiceId: string;
  speed: number;
  pitch: number;
  emotion: string;
  description: string;
  isCustom?: boolean;
  isTrending?: boolean;
}

export const DEFAULT_VOICE_PRESETS: VoicePreset[] = [
  // Viral Reel Presets
  {
    id: 'preset-insta-adam',
    name: '🔥 ইনস্টা মিস্ট্রি রিল (Adam Narrator)',
    voiceId: 'insta-adam-narrator',
    speed: 0.95,
    pitch: -2,
    emotion: 'excited',
    isTrending: true,
    description: 'ইনস্টাগ্রাম রিলসে কোটি ভিউ পাওয়া ডার্ক মিস্ট্রি, হিস্ট্রি ও ক্রাইম তথ্যচিত্র'
  },
  {
    id: 'preset-tiktok-hook',
    name: '⚡ ভাইরাল টিকটক ও রিল হুক (Antoni)',
    voiceId: 'insta-antoni-hype',
    speed: 1.15,
    pitch: 1,
    emotion: 'excited',
    isTrending: true,
    description: 'স্ক্রোল বন্ধ করার মতো উচ্চ-উদ্দীপক ওপেনিং হুক ও গ্যাজেট শর্টস'
  },
  {
    id: 'preset-desi-reel',
    name: '🇮🇳 দেশি ভাইরাল রিল (Aarav Hindi)',
    voiceId: 'insta-aarav-desi',
    speed: 1.08,
    pitch: 0,
    emotion: 'happy',
    isTrending: true,
    description: 'হিন্দি মোটিভেশনাল রিল, ফিন্যান্স টিপস ও সোশ্যাল মিডিয়া ট্রেন্ডিং সাউন্ড'
  },
  {
    id: 'preset-aesthetic-vlog',
    name: '✨ নান্দনিক ইনস্টা ভ্লগ (Bella Vlog)',
    voiceId: 'insta-bella-vlog',
    speed: 0.92,
    pitch: 0,
    emotion: 'calm',
    isTrending: true,
    description: 'ক্যাফে ভ্লগ, ট্রাভেল রিল, মিনি রিলস ও নান্দনিক স্টোরির মিষ্টি সুর'
  },
  {
    id: 'preset-sigma-gym',
    name: '🗿 সিগমা ও জিম মোটিভেশন (Raj Baritone)',
    voiceId: 'insta-raj-baritone',
    speed: 0.9,
    pitch: -3,
    emotion: 'angry',
    isTrending: true,
    description: 'জিম এডিট, সিগমা রুলস ও উচ্চ প্রভাবের গভীর ব্যারিটোন মোটিভেশন'
  },
  {
    id: 'preset-bangla-viral',
    name: '🔥 ভাইরাল বাংলা রিল (রণবীর)',
    voiceId: 'insta-ranbir-bangla',
    speed: 1.15,
    pitch: 1,
    emotion: 'excited',
    isTrending: true,
    description: 'বাংলায় দ্রুতগতির ট্রেন্ডিং রিলস ও সোশ্যাল মিডিয়া টিপস'
  },
  // Classic Broadcast Presets
  {
    id: 'preset-news',
    name: 'সংবাদ পাঠক (রণিতা)',
    voiceId: 'bn-IN-Wavenet-A',
    speed: 1.15,
    pitch: 1,
    emotion: 'neutral',
    description: 'সংবাদ বুলেটিন, তথ্যবহুল উপস্থাপনা এবং প্রাতিষ্ঠানিক প্রতিবেদন'
  },
  {
    id: 'preset-story',
    name: 'গল্পকথক (অর্ক)',
    voiceId: 'bn-IN-Wavenet-B',
    speed: 0.9,
    pitch: -1,
    emotion: 'calm',
    description: 'ছোটগল্প, অডিওবুক এবং রোমাঞ্চকর উপন্যাসের জন্য নিখুঁত'
  },
  {
    id: 'preset-child',
    name: 'শিশু ও কার্টুন (অনন্যা)',
    voiceId: 'bn-IN-Wavenet-C',
    speed: 1.1,
    pitch: 5,
    emotion: 'happy',
    description: 'ছোটদের শিক্ষণীয় গল্প, অ্যানিমেশন ও কৌতুকপূর্ণ সংলাপ'
  },
  {
    id: 'preset-ad',
    name: 'বিজ্ঞাপন ও প্রমো (অনির্বাণ)',
    voiceId: 'gemini-fenrir',
    speed: 1.2,
    pitch: 2,
    emotion: 'excited',
    description: 'টিভি ও রেডিও বিজ্ঞাপন, সোশ্যাল মিডিয়া রিলস ও হাইপ'
  }
];
