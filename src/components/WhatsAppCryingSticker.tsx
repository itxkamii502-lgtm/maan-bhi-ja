import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Sparkles, RefreshCw, Send, HeartCrack } from 'lucide-react';

interface WhatsAppCryingStickerProps {
  senderName: string;
  receiverName: string;
  language: 'roman' | 'ur' | 'en';
}

interface StickerItem {
  id: string;
  name: string;
  nameUrdu: string;
  mood: string;
  caption: string;
  captionUrdu: string;
  type: 'waterfall' | 'puppy' | 'tissue' | 'ears';
}

const STICKERS: StickerItem[] = [
  {
    id: 'waterfall',
    name: 'Waterfall Tears 😭',
    nameUrdu: 'آنسوؤں کی برسات 😭',
    mood: 'Uncontrollable crying',
    caption: 'Itna mat rulao please... ab maan bhi jao na 🥺💔',
    captionUrdu: 'اتنا مت رلائیں پلیز... اب مان بھی جائیں نا 🥺💔',
    type: 'waterfall',
  },
  {
    id: 'ears',
    name: 'Kaan Pakad Ke Sorry 👂🥺',
    nameUrdu: 'کان پکڑ کر معافی 👂🥺',
    mood: 'Holding ears with tears',
    caption: 'Kaan pakad kar sorry bol raha hoon... sach mein dil se pachtawa hai! 🥺🙏',
    captionUrdu: 'دونوں کان پکڑ کر دل سے معافی مانگ رہا ہوں... پلیز معاف کر دیں! 🥺🙏',
    type: 'ears',
  },
  {
    id: 'puppy',
    name: 'Pleading Puppy Eyes 🥺💧',
    nameUrdu: 'معصوم روتی آنکھیں 🥺💧',
    mood: 'Innocent weeping eyes',
    caption: 'Meri ghalti thi, ab ghussa khatam karo na bestie 🥺❤️',
    captionUrdu: 'مجھ سے غلطی ہو گئی، اب پلیز اپنا غصہ ختم کر دیجیے نا 🥺❤️',
    type: 'puppy',
  },
  {
    id: 'tissue',
    name: 'Tissue Paper Crying 🤧💔',
    nameUrdu: 'ٹشو پیپر سے روتا ہوا 🤧💔',
    mood: 'Sniffles and tissues',
    caption: 'Roo roo kar bura haal ho gaya hai... ek baar smile to kar do 🥺',
    captionUrdu: 'رو رو کر برا حال ہو گیا ہے... ایک بار تو مسکرا دیجیے 🥺',
    type: 'tissue',
  },
];

export const WhatsAppCryingSticker: React.FC<WhatsAppCryingStickerProps> = ({
  senderName,
  receiverName,
  language,
}) => {
  const [activeStickerId, setActiveStickerId] = useState<string>('waterfall');
  const [copied, setCopied] = useState<boolean>(false);

  const isUrdu = language === 'ur';
  const activeSticker = STICKERS.find((s) => s.id === activeStickerId) || STICKERS[0];

  const handleWhatsAppSend = () => {
    let message = '';
    const caption = isUrdu ? activeSticker.captionUrdu : activeSticker.caption;

    if (isUrdu) {
      message = `😭💔 *[واٹس ایپ روتا ہوا معافی سٹیکر]*\n\n"${caption}"\n\nاز طرف: ${senderName}\nبرائے: ${receiverName} 🥺❤️\n\nپلیز میرا خط اور معافی نامہ یہاں دیکھو:\n${window.location.href}`;
    } else {
      message = `😭💔 *[WhatsApp Crying Sorry Sticker]*\n\n"${caption}"\n\nFrom: ${senderName}\nTo: ${receiverName} 🥺❤️\n\nPlease check my apology letter here:\n${window.location.href}`;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCopyCaption = () => {
    const caption = isUrdu ? activeSticker.captionUrdu : activeSticker.caption;
    navigator.clipboard.writeText(`${caption} 🥺😭💔`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-10 max-w-xl mx-auto px-4">
      {/* Container styled like a modern WhatsApp animated sticker popup */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#1b2720]/95 via-[#121c17]/95 to-[#0b120f]/95 border-2 border-emerald-500/40 shadow-[0_15px_45px_rgba(16,185,129,0.2)] backdrop-blur-xl">
        {/* Official WhatsApp sticker pill header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white shadow-md">
              <MessageCircle className="w-4 h-4 fill-white" />
            </span>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                WhatsApp Sticker Pack
              </span>
              <span className="text-[11px] text-neutral-400">
                {isUrdu ? 'واٹس ایپ کا آفیشل معافی والا روتا ہوا سٹیکر' : 'Animated Apology Sticker'}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>Active Sticker</span>
          </span>
        </div>

        {/* Animated Sticker Center Stage */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative group cursor-pointer" onClick={handleWhatsAppSend}>
            {/* Soft pulsing green-rose glow behind sticker */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-rose-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse" />

            {/* Sticker Graphic Container */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-[#09100d]/90 border border-emerald-500/30 flex items-center justify-center p-4 shadow-2xl transition-transform hover:scale-105 duration-300">
              {/* WhatsApp Sticker Badge at corner */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                <span>WA Sticker</span>
              </div>

              {/* Render Animated SVG Crying Character */}
              {activeSticker.type === 'waterfall' && (
                <div className="relative flex flex-col items-center">
                  <div className="text-7xl sm:text-8xl animate-bounce" style={{ animationDuration: '1.4s' }}>
                    😭
                  </div>
                  {/* Cascading blue water animated drops */}
                  <div className="flex justify-between w-28 mt-[-10px] px-2">
                    <div className="w-2 h-6 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
                    <div className="w-2.5 h-8 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_10px_#22d3ee]" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-6 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" style={{ animationDelay: '400ms' }} />
                  </div>
                  <span className="text-xs text-cyan-300 mt-2 font-medium tracking-wide">
                    *River of tears flowing*
                  </span>
                </div>
              )}

              {activeSticker.type === 'ears' && (
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl animate-pulse">👂</span>
                    <span className="text-6xl sm:text-7xl animate-pulse" style={{ animationDuration: '1s' }}>🥺</span>
                    <span className="text-4xl animate-pulse">👂</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-rose-300 font-semibold bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-500/30">
                    <HeartCrack className="w-3.5 h-3.5 text-rose-400" />
                    <span>Pakka Sorry! Maan jao</span>
                  </div>
                </div>
              )}

              {activeSticker.type === 'puppy' && (
                <div className="relative flex flex-col items-center text-center">
                  <div className="text-7xl sm:text-8xl animate-pulse" style={{ animationDuration: '1.2s' }}>
                    🥺
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-300 font-medium">
                    <span className="animate-ping">💧</span>
                    <span>Masoom Chehra & Weeping Eyes</span>
                  </div>
                </div>
              )}

              {activeSticker.type === 'tissue' && (
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 text-6xl sm:text-7xl">
                    <span className="animate-bounce">🤧</span>
                    <span className="text-4xl animate-pulse">🧻</span>
                  </div>
                  <span className="text-xs text-neutral-300 mt-2 font-medium">
                    *Sniffling into tissue box*
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Speech Bubble / Sticker Caption */}
          <div className="mt-5 relative w-full text-center">
            <div className="inline-block relative px-5 py-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-100 text-sm sm:text-base font-semibold shadow-md max-w-md">
              {/* Bubble pointer */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-950 border-t border-l border-emerald-500/40 transform rotate-45" />
              <p className={isUrdu ? 'font-urdu text-lg leading-relaxed' : ''}>
                "{isUrdu ? activeSticker.captionUrdu : activeSticker.caption}"
              </p>
            </div>
          </div>
        </div>

        {/* Sticker Switcher Carousel Tabs */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <p className="text-[11px] text-neutral-400 text-center mb-3 uppercase tracking-wider">
            {isUrdu ? 'دوسرا سٹیکر منتخب کریں:' : 'Choose a Crying Sticker:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STICKERS.map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStickerId(st.id)}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  activeStickerId === st.id
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-sm'
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                }`}
              >
                <span>{isUrdu ? st.nameUrdu : st.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Send via WhatsApp & Copy Caption */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleWhatsAppSend}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>
              {isUrdu
                ? `یہ سٹیکر واٹس ایپ پر ${receiverName} کو بھیجیں`
                : `Send Sticker on WhatsApp to ${receiverName}`}
            </span>
          </button>

          <button
            onClick={handleCopyCaption}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer active:scale-95"
            title="Copy caption"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{isUrdu ? 'کاپی ہو گیا!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{isUrdu ? 'کیپشن کاپی کریں' : 'Copy Caption'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
