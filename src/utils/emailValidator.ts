/**
 * Email validation utility to enforce original, non-disposable, non-spam emails
 * for registration and account security.
 */

// Comprehensive blacklist of known disposable / temporary / burner email domains
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.co.uk',
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'throwawaymail.com',
  'fakeinbox.com',
  'burnermail.io',
  'dispostable.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'sharklasers.com',
  'getairmail.com',
  'mohmal.com',
  'mohmal.in',
  'dropmail.me',
  '0147.org',
  'crazymailing.com',
  'nada.ltd',
  'getnada.com',
  'emailondeck.com',
  'inoutmail.com',
  'tempmailaddress.com',
  'tmail.ws',
  'boun.cr',
  'discard.email',
  'mailcatch.com',
  'mytrashmail.com',
  'spambog.com',
  'spambog.de',
  'spamgourmet.com',
  'mytemp.email',
  'generator.email',
  'fakemailgenerator.com',
  'maildrop.cc',
  'inboxkitten.com',
  'tempail.com',
  'burnermail.com',
  'internxt.com',
  'tempm.com',
  'mailsac.com',
  'mintemail.com',
  'minuteinbox.com',
  'nowmymail.com',
  'safetymail.info',
  'trashcanmail.com',
  'trashymail.com',
  'zillamail.com',
  'chacuo.net',
  'boximail.com',
  'mohmal.im',
  'disposablemail.com',
  'emailfake.com',
  'tempmailo.com',
  'crazymail.com',
  'fakemail.net',
  'guerrillamail.biz',
  'guerrillamail.de',
  'grr.la',
  'pokemail.net',
  'spam4.me',
  'luxusmail.org',
  'clipmail.eu',
  'fammmail.com',
  'spambox.us',
  'jetable.org',
  'kasmail.com',
  'zoemail.org',
]);

// Reputable authentic original providers
export const ORIGINAL_EMAIL_PROVIDERS: Record<string, string> = {
  'gmail.com': 'Google Workspace / Gmail',
  'googlemail.com': 'Google Workspace / Gmail',
  'outlook.com': 'Microsoft Outlook',
  'hotmail.com': 'Microsoft Hotmail',
  'live.com': 'Microsoft Live',
  'msn.com': 'Microsoft MSN',
  'yahoo.com': 'Yahoo! Mail',
  'yahoo.co.in': 'Yahoo! Mail India',
  'yahoo.co.uk': 'Yahoo! Mail UK',
  'ymail.com': 'Yahoo! Mail',
  'rocketmail.com': 'Yahoo! Mail',
  'icloud.com': 'Apple iCloud',
  'me.com': 'Apple iCloud',
  'mac.com': 'Apple iCloud',
  'proton.me': 'Proton Mail',
  'protonmail.com': 'Proton Mail',
  'zoho.com': 'Zoho Mail',
  'zohomail.in': 'Zoho Mail India',
  'aol.com': 'AOL Mail',
  'gmx.com': 'GMX Mail',
  'gmx.net': 'GMX Mail',
  'mail.com': 'Mail.com',
  'tutanota.com': 'Tuta Mail',
  'tuta.com': 'Tuta Mail',
};

// Common spam / fake test patterns
const SPAM_USERNAME_PATTERNS = [
  /^test(123|ing)?$/i,
  /^asdf(ghjk)?$/i,
  /^spam(mer)?$/i,
  /^fake(mail)?$/i,
  /^temp(user)?$/i,
  /^throwaway$/i,
  /^noreply$/i,
  /^nobody$/i,
  /^abc(def|123)?$/i,
  /^qwerty(uiop)?$/i,
  /^11111+$/i,
  /^123456+$/i,
  /^(.)\1{4,}$/, // 5+ same repeated characters e.g. aaaaa
];

export interface EmailValidationResult {
  isValid: boolean;
  isOriginal: boolean;
  isDisposable: boolean;
  isSpamPattern: boolean;
  providerType:
    | 'gmail'
    | 'outlook'
    | 'yahoo'
    | 'apple'
    | 'proton'
    | 'zoho'
    | 'enterprise'
    | 'education'
    | 'custom'
    | 'disposable'
    | 'spam'
    | 'invalid';
  providerLabel: string;
  domain: string;
  badgeColor: 'green' | 'amber' | 'red';
  message: string;
  messageBn: string;
}

/**
 * Validates whether an email is a legitimate, authentic personal/work email
 * and not a disposable, temporary, burner, or spam account.
 */
export function validateEmailAuthenticity(email: string): EmailValidationResult {
  const trimmed = (email || '').trim().toLowerCase();

  // Basic empty check
  if (!trimmed) {
    return {
      isValid: false,
      isOriginal: false,
      isDisposable: false,
      isSpamPattern: false,
      providerType: 'invalid',
      providerLabel: 'অপ্রত্যাশিত',
      domain: '',
      badgeColor: 'amber',
      message: 'Please enter your email address.',
      messageBn: 'অনুগ্রহ করে আপনার সক্রিয় ইমেইল ঠিকানা প্রদান করুন।',
    };
  }

  // RFC compliant email regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      isOriginal: false,
      isDisposable: false,
      isSpamPattern: false,
      providerType: 'invalid',
      providerLabel: 'ভুল ফরম্যাট',
      domain: '',
      badgeColor: 'red',
      message: 'Invalid email format. E.g. name@example.com',
      messageBn: 'ইমেইলের গঠন সঠিক নয়। যেমন: name@gmail.com',
    };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      isOriginal: false,
      isDisposable: false,
      isSpamPattern: false,
      providerType: 'invalid',
      providerLabel: 'ভুল ফরম্যাট',
      domain: '',
      badgeColor: 'red',
      message: 'Invalid email address.',
      messageBn: 'অবৈধ ইমেইল ঠিকানা।',
    };
  }

  const [username, domain] = parts;

  // Domain TLD check (must have at least 2 char TLD)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return {
      isValid: false,
      isOriginal: false,
      isDisposable: false,
      isSpamPattern: false,
      providerType: 'invalid',
      providerLabel: 'অবৈধ ডোমেইন',
      domain,
      badgeColor: 'red',
      message: 'Domain must have a valid extension (.com, .org, etc.)',
      messageBn: 'ডোমেইনের ভ্যালিড এক্সটেনশন (.com, .org ইত্যাদি) থাকা আবশ্যক।',
    };
  }

  // Check 1: Explicit Disposable Domain List
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      isOriginal: false,
      isDisposable: true,
      isSpamPattern: false,
      providerType: 'disposable',
      providerLabel: 'নিষিদ্ধ টেম্পোরারি ইমেইল',
      domain,
      badgeColor: 'red',
      message: 'Temporary / disposable emails are not permitted. Use your original email.',
      messageBn: '⛔ টেম্পোরারি বা ডিসপোজেবল ইমেইল অনুমোদিত নয়। অনুগ্রহ করে আপনার আসল জিমেইল বা পার্সোনাল ইমেইল দিন।',
    };
  }

  // Check 2: Disposable Domain Substring / Keyword heuristic
  const disposableKeywords = [
    'tempmail',
    'throwaway',
    'disposable',
    'burner',
    'fakemail',
    '10minute',
    'trashmail',
    'guerrilla',
    'mailinator',
    'sharklaser',
    'dropmail',
    'mohmal',
    'yopmail',
    'spam4me',
    'minuteinbox',
  ];

  if (disposableKeywords.some((kw) => domain.includes(kw))) {
    return {
      isValid: false,
      isOriginal: false,
      isDisposable: true,
      isSpamPattern: false,
      providerType: 'disposable',
      providerLabel: 'নিষিদ্ধ বার্নার ডোমেইন',
      domain,
      badgeColor: 'red',
      message: 'Burner / disposable email service detected. Please provide an authentic email.',
      messageBn: '⛔ বার্নার বা ডিসপোজেবল ইমেইল সার্ভিস সনাক্ত হয়েছে। দয়া করে মূল বৈধ ইমেইল ব্যবহার করুন।',
    };
  }

  // Check 3: Spam Username patterns
  if (SPAM_USERNAME_PATTERNS.some((pattern) => pattern.test(username))) {
    return {
      isValid: false,
      isOriginal: false,
      isDisposable: false,
      isSpamPattern: true,
      providerType: 'spam',
      providerLabel: 'স্প্যাম প্যাটার্ন',
      domain,
      badgeColor: 'red',
      message: 'Spam or placeholder username detected. Please provide your real name/email.',
      messageBn: '⚠️ ডামি বা স্প্যাম প্যাটার্ন সনাক্ত হয়েছে। আপনার আসল ব্যক্তিগত ইমেইল ব্যবহার করুন।',
    };
  }

  // Check 4: Check if reputable original provider
  if (ORIGINAL_EMAIL_PROVIDERS[domain]) {
    const providerLabel = ORIGINAL_EMAIL_PROVIDERS[domain];
    let providerType: EmailValidationResult['providerType'] = 'custom';

    if (domain.includes('google') || domain === 'gmail.com') providerType = 'gmail';
    else if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live') || domain.includes('msn')) providerType = 'outlook';
    else if (domain.includes('yahoo') || domain.includes('ymail')) providerType = 'yahoo';
    else if (domain.includes('icloud') || domain.includes('apple') || domain === 'me.com' || domain === 'mac.com') providerType = 'apple';
    else if (domain.includes('proton')) providerType = 'proton';
    else if (domain.includes('zoho')) providerType = 'zoho';

    return {
      isValid: true,
      isOriginal: true,
      isDisposable: false,
      isSpamPattern: false,
      providerType,
      providerLabel,
      domain,
      badgeColor: 'green',
      message: `Verified authentic email (${providerLabel})`,
      messageBn: `✓ ভেরিফাইড অরিজিনাল ইমেইল (${providerLabel})`,
    };
  }

  // Check 5: Educational domain
  if (tld === 'edu' || domain.endsWith('.edu.bd') || domain.endsWith('.ac.in') || domain.endsWith('.ac.uk')) {
    return {
      isValid: true,
      isOriginal: true,
      isDisposable: false,
      isSpamPattern: false,
      providerType: 'education',
      providerLabel: 'শিক্ষা প্রতিষ্ঠান (Educational)',
      domain,
      badgeColor: 'green',
      message: 'Verified academic email address',
      messageBn: '✓ ভেরিফাইড একাডেমিক/শিক্ষা প্রতিষ্ঠান ইমেইল',
    };
  }

  // Check 6: Reputable custom domain / corporate enterprise
  const reputableEnterpriseTLDs = ['com', 'org', 'net', 'io', 'ai', 'co', 'in', 'bd', 'co.in', 'co.uk', 'de', 'fr'];
  if (reputableEnterpriseTLDs.includes(tld) || domainParts.length >= 2) {
    return {
      isValid: true,
      isOriginal: true,
      isDisposable: false,
      isSpamPattern: false,
      providerType: 'enterprise',
      providerLabel: `কাস্টম ডোমেইন (${domain})`,
      domain,
      badgeColor: 'green',
      message: 'Valid domain verified',
      messageBn: `✓ ভেরিফাইড কাস্টম ডোমেইন (${domain})`,
    };
  }

  // Default fallback valid
  return {
    isValid: true,
    isOriginal: true,
    isDisposable: false,
    isSpamPattern: false,
    providerType: 'custom',
    providerLabel: domain,
    domain,
    badgeColor: 'green',
    message: 'Valid email address',
    messageBn: '✓ ভ্যালিড ইমেইল ঠিকানা',
  };
}
