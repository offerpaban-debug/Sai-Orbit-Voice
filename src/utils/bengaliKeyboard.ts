/**
 * Virtual Bengali Keyboard Data and Helpers
 */

export interface KeyboardCategory {
  title: string;
  keys: string[];
}

export const BENGALI_KEYBOARD_LAYOUT: KeyboardCategory[] = [
  {
    title: 'স্বরবর্ণ (Vowels)',
    keys: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ']
  },
  {
    title: 'কার ও চিহ্ন (Vowel Signs)',
    keys: ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ', 'ং', 'ঃ', 'ঁ', 'ৎ', '্য', '্র', '্']
  },
  {
    title: 'ব্যঞ্জনবর্ণ (Consonants)',
    keys: [
      'ক', 'খ', 'গ', 'ঘ', 'ঙ',
      'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
      'ট', 'ঠ', 'ড', 'ঢ', 'ণ',
      'ত', 'থ', 'দ', 'ধ', 'ন',
      'প', 'ফ', 'ব', 'ভ', 'ম',
      'য', 'র', 'ল', 'শ', 'ষ',
      'স', 'হ', 'ড়', 'ঢ়', 'য়'
    ]
  },
  {
    title: 'যুক্তবর্ণ (Common Conjuncts)',
    keys: ['ক্ষ', 'জ্ঞ', 'ঞ্চ', 'ঞ্ছ', 'ঞ্জ', 'ঙ্ক', 'ঙ্গ', 'ন্ত', 'ন্দ', 'ম্প', 'ব্দ', 'ক্ত', 'ষ্ণ', 'ষ্ঠ']
  },
  {
    title: 'সংখ্যা ও যতিচিহ্ন (Numbers & Punctuation)',
    keys: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '।', '॥', '?', '!', ',', ';', ':', '-']
  }
];

export const SAMPLE_BENGALI_TEXTS = [
  {
    title: '🔥 ভাইরাল রিল হুক (Bangla Hook)',
    category: 'reel',
    text: 'দাঁড়ান দাঁড়ান! স্ক্রোল করার আগে মাত্র ৩০ সেকেন্ড সময় দিন। এই ৩টি এআই ট্রিক আপনার কাজকে ১০ গুণ দ্রুত করে দেবে!'
  },
  {
    title: '🇮🇳 হিন্দি ভাইরাল রিল (Hindi Reel)',
    category: 'hindi',
    text: 'रुको भाई! अगर तुम भी २०२৬ में फाइनेंशियली फ्री होना चाहते हो, तो ये ৩ गलतियां कभी मत करना। आखिरी टिप सबसे ज्यादा जरूरी है।'
  },
  {
    title: '🇬🇧 ভাইরাল ইনস্টা রিল (English Reel)',
    category: 'english',
    text: 'Stop scrolling right now! Did you know that 99% of people are completely unaware of this hidden psychology secret?'
  },
  {
    title: '🎬 ডার্ক মিস্ট্রি শর্ট (Crime Mystery)',
    category: 'mystery',
    text: 'পৃথিবীর গভীরতম সমুদ্রে এমন একটি সংকেত পাওয়া গেছে যা কোনো মানুষের তৈরি যন্ত্রের সাথে মেলে না। বিজ্ঞানীরা আজও এর ব্যাখ্যা দিতে পারেননি...'
  },
  {
    title: '🗿 সিগমা মোটিভেশন (Gym Motivation)',
    category: 'sigma',
    text: 'Never complain, never explain. Let them talk while you build your empire in pure silence.'
  },
  {
    title: 'সংবাদ বুলেটিন (News)',
    category: 'news',
    text: 'আন্তর্জাতিক বিজ্ঞান ও প্রযুক্তি সম্মেলনে সাইঅরবিট কৃত্রিম বুদ্ধিমত্তা চালিত নতুন বহুভাষিক ভয়েস মডেল উন্মোচন করেছে।'
  },
  {
    title: 'অনুপ্রেরণামূলক গল্প (Story)',
    category: 'story',
    text: 'নদীর তীরে দাঁড়িয়ে অনিক দূরের দিগন্তের দিকে তাকাল। বাতাসে এক অদ্ভুত শীতলতা ছিল। সে জানত, প্রতিটি অন্ধকার রাতের পরেই এক উজ্জ্বল সোনালী সকাল অপেক্ষা করে।'
  }
];
