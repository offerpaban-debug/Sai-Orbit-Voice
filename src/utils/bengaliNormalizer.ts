/**
 * Bengali Text Normalizer for SAIORBIT VOICE
 * Handles Bengali digits, multi-digit numbers, currency, abbreviations, conjuncts, and punctuation.
 */

export const BENGALI_DIGITS: Record<string, string> = {
  '০': 'শূন্য',
  '১': 'এক',
  '২': 'দুই',
  '৩': 'তিন',
  '৪': 'চার',
  '৫': 'পাঁচ',
  '৬': 'ছয়',
  '৭': 'সাত',
  '৮': 'আট',
  '৯': 'নয়'
};

export const ENGLISH_TO_BENGALI_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const BENGALI_NUMBERS_0_TO_99: string[] = [
  'শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
  'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ',
  'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ',
  'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ',
  'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ',
  'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট',
  'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর',
  'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি',
  'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই', 'নব্বই',
  'একানব্বই', 'বানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'
];

export const BENGALI_CURRENCY_MAP: Record<string, string> = {
  '৳': 'টাকা',
  '₹': 'রুপি',
  '$': 'ডলার',
  '€': 'ইউরো',
  '£': 'পাউন্ড'
};

export const BENGALI_ABBREVIATIONS: Record<string, string> = {
  'ডঃ': 'ডক্টর',
  'ড.': 'ডক্টর',
  'মিঃ': 'মিস্টার',
  'মি.': 'মিস্টার',
  'মিসেস': 'মিসেস',
  'মো ঃ': 'মোহাম্মদ',
  'মোঃ': 'মোহাম্মদ',
  'কিঃ': 'কিলোমিটার',
  'কি.মি.': 'কিলোমিটার',
  'ইং': 'ইংরেজি',
  'খ্রিঃ': 'খ্রিস্টাব্দ',
  'খ্রি.': 'খ্রিস্টাব্দ',
  'সাঃ': 'সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম',
  'রাঃ': 'রাদিআল্লাহু আনহু',
  'প্রাঃ': 'প্রাথমিক',
  'মাঃ': 'মাধ্যমিক',
  'উঃ': 'উত্তর',
  'দঃ': 'দক্ষিণ',
  'পূঃ': 'পূর্ব',
  'পঃ': 'পশ্চিম'
};

export const BENGALI_CONJUNCTS_HINTS: Record<string, string> = {
  'ক্ষ': 'kkh',
  'জ্ঞ': 'gg',
  'ঞ্চ': 'nch',
  'ঞ্ছ': 'nchh',
  'ঞ্জ': 'nj',
  'ন্ত': 'nt',
  'ন্দ': 'nd',
  'ম্প': 'mp',
  'ঙ্ক': 'nk',
  'ঙ্গ': 'ng',
  'ব্দ': 'bd',
  'ক্ত': 'kt'
};

export const BENGALI_PUNCTUATION_PAUSES: Record<string, number> = {
  '।': 300,
  '॥': 450,
  ',': 150,
  '?': 400,
  '!': 400,
  ':': 200,
  ';': 250,
  '\n': 350
};

/**
 * Converts a Bengali number string (e.g. "২৫০" or "1050") to Bengali spoken words
 */
export function convertNumberToBengaliWords(numStr: string): string {
  // Convert any English digits to Bengali digits first
  let bengaliDigits = numStr.replace(/[0-9]/g, ch => ENGLISH_TO_BENGALI_DIGITS[ch] || ch);
  
  // Convert Bengali digit string to integer
  let n = 0;
  for (const ch of bengaliDigits) {
    const digitIdx = '০১২৩৪৫৬৭৮৯'.indexOf(ch);
    if (digitIdx !== -1) {
      n = n * 10 + digitIdx;
    }
  }

  if (isNaN(n)) return numStr;
  if (n === 0) return 'শূন্য';

  const parts: string[] = [];

  // Crores (কোটি)
  if (n >= 10000000) {
    const crore = Math.floor(n / 10000000);
    parts.push(convertNumberToBengaliWords(crore.toString()) + ' কোটি');
    n %= 10000000;
  }

  // Lakhs (লক্ষ)
  if (n >= 100000) {
    const lakh = Math.floor(n / 100000);
    parts.push(BENGALI_NUMBERS_0_TO_99[lakh] + ' লাখ');
    n %= 100000;
  }

  // Thousands (হাজার)
  if (n >= 1000) {
    const thousand = Math.floor(n / 1000);
    parts.push(BENGALI_NUMBERS_0_TO_99[thousand] + ' হাজার');
    n %= 1000;
  }

  // Hundreds (শত)
  if (n >= 100) {
    const hundred = Math.floor(n / 100);
    if (hundred === 1) {
      parts.push('একশত');
    } else {
      parts.push(BENGALI_NUMBERS_0_TO_99[hundred] + ' শত');
    }
    n %= 100;
  }

  // Remainder 1-99
  if (n > 0 && n < 100) {
    parts.push(BENGALI_NUMBERS_0_TO_99[n]);
  }

  return parts.join(' ');
}

/**
 * Full normalizer function that expands currency, abbreviations, and numbers
 */
export function normalizeBengaliText(text: string, options: { expandNumbers?: boolean; expandAbbreviations?: boolean; expandCurrency?: boolean } = {}): string {
  if (!text) return '';
  const { expandNumbers = true, expandAbbreviations = true, expandCurrency = true } = options;
  let normalized = text;

  // 1. Expand abbreviations
  if (expandAbbreviations) {
    for (const [abbr, expanded] of Object.entries(BENGALI_ABBREVIATIONS)) {
      normalized = normalized.split(abbr).join(expanded + ' ');
    }
  }

  // 2. Expand Currency symbols
  if (expandCurrency) {
    // ৳500 or 500৳ or ৳৫০০
    normalized = normalized.replace(/([৳₹$€£])\s*([০-৯0-9]+)/g, (_match, symbol, num) => {
      const curr = BENGALI_CURRENCY_MAP[symbol] || 'টাকা';
      const words = expandNumbers ? convertNumberToBengaliWords(num) : num;
      return `${words} ${curr}`;
    });
    normalized = normalized.replace(/([০-৯0-9]+)\s*([৳₹$€£])/g, (_match, num, symbol) => {
      const curr = BENGALI_CURRENCY_MAP[symbol] || 'টাকা';
      const words = expandNumbers ? convertNumberToBengaliWords(num) : num;
      return `${words} ${curr}`;
    });
  }

  // 3. Expand standalone numbers
  if (expandNumbers) {
    normalized = normalized.replace(/\b([০-৯0-9]+)\b/g, (_match, num) => {
      return convertNumberToBengaliWords(num);
    });
  }

  // 4. Clean extra spaces
  normalized = normalized.replace(/[ \t]+/g, ' ').trim();

  return normalized;
}

/**
 * Splits text into sentences based on Bengali and standard punctuation
 */
export function splitBengaliSentences(text: string): string[] {
  if (!text) return [];
  // Split on ।, ॥, ?, !, \n
  const regex = /[^।॥?!.\n]+[।॥?!.\n]*/g;
  const matches = text.match(regex);
  if (!matches) return [text.trim()];
  return matches.map(s => s.trim()).filter(Boolean);
}
