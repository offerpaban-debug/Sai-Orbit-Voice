/**
 * SSML Builder for SAIORBIT VOICE
 * Generates natural prosody, emotion-tailored pitch and rate, and pause intervals for Bengali & Indian TTS.
 */

export type EmotionType = 'neutral' | 'happy' | 'calm' | 'excited' | 'sad' | 'angry';

export interface EmotionProfile {
  id: EmotionType;
  labelBn: string;
  labelEn: string;
  icon: string;
  color: string;
  pitchOffset: string; // e.g. "+3st", "-2st"
  pitchNumber: number; // in semitones
  rateMultiplier: number;
  pauseModifier: number; // multiplier for pause duration
  descriptionBn: string;
}

export const EMOTION_PROFILES: Record<EmotionType, EmotionProfile> = {
  neutral: {
    id: 'neutral',
    labelBn: 'নিরপেক্ষ',
    labelEn: 'Neutral',
    icon: '⚖️',
    color: '#6C5CE7',
    pitchOffset: '+0st',
    pitchNumber: 0,
    rateMultiplier: 1.0,
    pauseModifier: 1.0,
    descriptionBn: 'স্বাভাবিক ও স্পষ্ট পাঠশৈলী'
  },
  happy: {
    id: 'happy',
    labelBn: 'প্রফুল্ল',
    labelEn: 'Happy',
    icon: '😊',
    color: '#00B894',
    pitchOffset: '+3st',
    pitchNumber: 3,
    rateMultiplier: 1.1,
    pauseModifier: 0.85,
    descriptionBn: 'উজ্জ্বল, হাসিখুশি ও প্রাণবন্ত প্রকাশ'
  },
  calm: {
    id: 'calm',
    labelBn: 'শান্ত',
    labelEn: 'Calm',
    icon: '🍃',
    color: '#0984E3',
    pitchOffset: '-2st',
    pitchNumber: -2,
    rateMultiplier: 0.9,
    pauseModifier: 1.3,
    descriptionBn: 'স্নিগ্ধ, ধীর ও প্রশান্ত কণ্ঠস্বর'
  },
  excited: {
    id: 'excited',
    labelBn: 'উত্তেজিত',
    labelEn: 'Excited',
    icon: '⚡',
    color: '#FD79A8',
    pitchOffset: '+5st',
    pitchNumber: 5,
    rateMultiplier: 1.2,
    pauseModifier: 0.75,
    descriptionBn: 'উদ্দীপনাময় ও দ্রুতগতির উচ্চারণ'
  },
  sad: {
    id: 'sad',
    labelBn: 'দুঃখিত',
    labelEn: 'Sad',
    icon: '🌧️',
    color: '#636E72',
    pitchOffset: '-4st',
    pitchNumber: -4,
    rateMultiplier: 0.82,
    pauseModifier: 1.5,
    descriptionBn: 'ভারাক্রান্ত ও আবেগঘন মন্থর সুর'
  },
  angry: {
    id: 'angry',
    labelBn: 'রাগান্বিত',
    labelEn: 'Angry',
    icon: '🔥',
    color: '#E17055',
    pitchOffset: '+2st',
    pitchNumber: 2,
    rateMultiplier: 1.15,
    pauseModifier: 0.8,
    descriptionBn: 'দৃঢ়, তীব্র ও কঠোর কণ্ঠভঙ্গি'
  }
};

export interface SSMLOptions {
  speed?: number; // 0.5 to 2.0
  pitch?: number; // -10 to +10 semitones
  emotion?: EmotionType;
  volumeDb?: number; // -6 to +6 dB
  smartPauses?: boolean;
}

/**
 * Builds valid SSML markup with natural prosody and emotion modifications
 */
export function buildBengaliSSML(text: string, options: SSMLOptions = {}): string {
  const {
    speed = 1.0,
    pitch = 0,
    emotion = 'neutral',
    volumeDb = 0,
    smartPauses = true
  } = options;

  const emotionProfile = EMOTION_PROFILES[emotion] || EMOTION_PROFILES.neutral;
  
  // Calculate total pitch and rate
  const totalPitch = pitch + emotionProfile.pitchNumber;
  const pitchString = `${totalPitch >= 0 ? '+' : ''}${totalPitch}st`;
  
  const totalRate = Math.max(0.5, Math.min(2.0, speed * emotionProfile.rateMultiplier));
  const ratePercentage = `${Math.round(totalRate * 100)}%`;
  const volumeString = `${volumeDb >= 0 ? '+' : ''}${volumeDb}dB`;

  let processedText = text;

  // Smart pause replacements for SSML
  if (smartPauses) {
    const pauseMod = emotionProfile.pauseModifier;
    const pauseDari = Math.round(350 * pauseMod);
    const pauseComma = Math.round(180 * pauseMod);
    const pauseQuestion = Math.round(420 * pauseMod);
    const pauseExclamation = Math.round(420 * pauseMod);

    // Escape raw XML special characters
    processedText = processedText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // Insert pause breaks
    processedText = processedText
      .replace(/([।॥])/g, `$1<break time="${pauseDari}ms"/>`)
      .replace(/,/g, `,<break time="${pauseComma}ms"/>`)
      .replace(/\?/g, `?<break time="${pauseQuestion}ms"/>`)
      .replace(/!/g, `!<break time="${pauseExclamation}ms"/>`)
      .replace(/\n+/g, `<break time="${Math.round(400 * pauseMod)}ms"/>`);
  } else {
    processedText = processedText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  return `<speak>
  <prosody pitch="${pitchString}" rate="${ratePercentage}" volume="${volumeString}">
    ${processedText}
  </prosody>
</speak>`;
}
