import { ProposalPayload, PRESET_BEST_FRIEND_ROMAN, PRESET_BEST_FRIEND_URDU, PRESET_ROMAN_URDU, PRESET_URDU, PRESET_ENGLISH } from '../types.ts';

/**
 * Gets the public URL origin that works on any browser without Google ID or AI Studio login.
 * In AI Studio:
 * - ais-dev-* requires the creator's Google Account login.
 * - ais-pre-* is the public shared production preview that opens freely everywhere.
 */
export function getPublicOrigin(): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;

  // If running on dev domain, convert to public shared preview
  if (origin.includes('ais-dev-')) {
    return origin.replace('ais-dev-', 'ais-pre-');
  }
  return origin;
}

/**
 * Encodes payload into URL-safe base64 string
 */
export function serializePayload(payload: ProposalPayload): string {
  try {
    const jsonStr = JSON.stringify(payload);
    // UTF-8 safe base64 encoding
    const encoded = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return encodeURIComponent(encoded);
  } catch (err) {
    console.error('Error serializing proposal payload', err);
    return '';
  }
}

/**
 * Decodes URL-safe base64 string back into ProposalPayload
 */
export function deserializePayload(encodedStr: string): ProposalPayload | null {
  try {
    const decodedUri = decodeURIComponent(encodedStr);
    const binaryStr = atob(decodedUri);
    const jsonStr = decodeURIComponent(Array.from(binaryStr).map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.senderName && parsed.receiverName) {
      return parsed as ProposalPayload;
    }
    return null;
  } catch (err) {
    console.warn('Could not decode payload from URL', err);
    return null;
  }
}

/**
 * Reads payload from current window location (query ?p=... or hash #p=...)
 */
export function getPayloadFromLocation(): ProposalPayload | null {
  if (typeof window === 'undefined') return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const queryParam = searchParams.get('p');
    if (queryParam) {
      const decoded = deserializePayload(queryParam);
      if (decoded) return decoded;
    }

    if (window.location.hash.startsWith('#p=')) {
      const hashParam = window.location.hash.substring(3);
      const decoded = deserializePayload(hashParam);
      if (decoded) return decoded;
    }
  } catch {
    // Ignore URL parse errors
  }

  return null;
}

/**
 * Builds the Universal Public Shareable URL for the receiver:
 * - Uses the public `ais-pre-` domain (or current public domain)
 * - Includes both `id` for server tracking AND `p` for instant zero-lag client rendering
 * - Works 100% on any device, mobile, VPS, or incognito without Google ID!
 */
export function buildPublicShareUrl(payload: ProposalPayload): string {
  if (typeof window === 'undefined') return '';

  const publicOrigin = getPublicOrigin();
  const id = payload.id || 'p_share';
  const encoded = serializePayload(payload);

  return `${publicOrigin}/?id=${id}&p=${encoded}`;
}

/**
 * Builds the Private Admin URL (for the creator to view analytics & live tracking)
 */
export function buildAdminUrl(payload: ProposalPayload, adminKey: string): string {
  if (typeof window === 'undefined') return '';

  const origin = window.location.origin;
  const id = payload.id || 'p_share';

  return `${origin}/?id=${id}&pin=987778899&adminKey=${adminKey}`;
}

/**
 * Generates direct WhatsApp share link with friendly invitation text
 */
export function generateWhatsAppLink(payload: ProposalPayload, targetUrl: string): string {
  let message = '';
  const isBestie = payload.relationshipTone === 'bestie';

  if (payload.language === 'ur') {
    if (isBestie) {
      message = `سنو ${payload.receiverName}، بہترین دوست ایسی چھوٹی باتوں پر ناراض نہیں رہتے... میں نے آپ کے لیے ایک خاص پیج بنایا ہے، پلیز اسے ایک بار کھول کر دیکھیں: \n\n${targetUrl}`;
    } else {
      message = `پیاری ${payload.receiverName}، میں جانتا ہوں آپ مجھ سے ناراض ہیں... میں نے اپنے دل کی بات آپ تک پہنچانے کے لیے ایک خاص تحفہ بنایا ہے۔ پلیز اسے ایک بار کھول کر دیکھئے گا: \n\n${targetUrl}`;
    }
  } else if (payload.language === 'roman') {
    if (isBestie) {
      message = `Hey ${payload.receiverName}, suno na... Best friends aisi baaton par naraz nahi rehte. Maine dil se tumhare liye ek special page banaya hai, please ek baar open kar ke zaroor dekhna: \n\n${targetUrl}`;
    } else {
      message = `Meri pyari ${payload.receiverName}, mujhe pata hai aap mujh se naraz ho... Maine dil se aapke liye ek special letter banaya hai. Please ek baar zaroor open kar ke dekhna: \n\n${targetUrl}`;
    }
  } else {
    message = `Hey ${payload.receiverName}, I made something special straight from my heart because your friendship means the world to me. Please open this: \n\n${targetUrl}`;
  }

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp response message that the receiver can send back to the sender
 */
export function generateReplyWhatsAppLink(
  senderName: string,
  selectedDateTitle: string,
  customNote: string,
  language: string
): string {
  let replyText = '';
  if (language === 'ur') {
    replyText = `السلام علیکم ${senderName}! ❤️\nمیں نے آپ کا میسج دیکھا... اور میں مان گئی ہوں۔\nہماری ٹریٹ / پلان: ${selectedDateTitle}\n${customNote ? `میرا پیغام: "${customNote}"` : ''}`;
  } else if (language === 'roman') {
    replyText = `Hey ${senderName}! ❤️\nMaine tumhara message dekha... and I forgive you! Maan gayi hoon.\nOur meetup plan: ${selectedDateTitle}\n${customNote ? `My message: "${customNote}"` : ''}`;
  } else {
    replyText = `Hey ${senderName}! ❤️\nI went through your letter and I forgive you! Let's start fresh.\nMy choice for our date: ${selectedDateTitle}\n${customNote ? `My note: "${customNote}"` : ''}`;
  }

  return `https://wa.me/?text=${encodeURIComponent(replyText)}`;
}

export function getPresetForLanguage(lang: 'roman' | 'ur' | 'en', tone: 'bestie' | 'romantic' = 'bestie'): ProposalPayload {
  if (tone === 'bestie') {
    if (lang === 'ur') return PRESET_BEST_FRIEND_URDU;
    return PRESET_BEST_FRIEND_ROMAN;
  }
  if (lang === 'ur') return PRESET_URDU;
  if (lang === 'en') return PRESET_ENGLISH;
  return PRESET_ROMAN_URDU;
}
