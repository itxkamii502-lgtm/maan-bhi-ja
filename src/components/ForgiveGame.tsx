import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Smile, PartyPopper } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio.ts';

interface ForgiveGameProps {
  senderName: string;
  receiverName: string;
  language: 'roman' | 'ur' | 'en';
  onForgiven: () => void;
  onNoDodged?: (count: number, pleadMessage: string) => void;
  isForgiven: boolean;
}

export const ForgiveGame: React.FC<ForgiveGameProps> = ({
  senderName,
  receiverName,
  language,
  onForgiven,
  onNoDodged,
  isForgiven,
}) => {
  const isUrdu = language === 'ur';

  const [dodgeCount, setDodgeCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pleadMessages = isUrdu
    ? [
        'نہیں 😤',
        'ارے پلیز مان جاؤ نا 🥺',
        'ایک آخری چانس چاکلیٹ کے ساتھ 🍫',
        'کان پکڑ کے سوری بول رہا ہوں! 👂',
        'دیکھو یس والا بٹن کتنا پیارا لگ رہا ہے 🥹',
        'اتنا غصہ صحت کے لیے اچھا نہیں ہوتا 🙈',
        'پلیززز میری جان، معاف کر دو ❤️',
        'اب سے کبھی نہیں ستاؤں گا، پکا وعدہ! 🤞',
      ]
    : language === 'roman'
    ? [
        'No 😤',
        'Aray please maan jao na 🥺',
        'Ek aakhri chance chocolate ke sath 🍫',
        'Kaan pakad ke sorry bolta hoon! 👂',
        'Dekho Yes button kitna pyara lag raha hai 🥹',
        'Itna ghussa sehat ke liye acha nahi hota! 🙈',
        'Pleaseee meri jaan, maan jao na ❤️',
        'Ab se no ghalti, pakka promise! 🤞',
      ]
    : [
        'No 😤',
        'Please forgive me? 🥺',
        'I promise unlimited chocolates! 🍫',
        'Look how pretty the YES button is 🥹',
        'One more chance please! 🤞',
        'Holding my ears and saying sorry! 👂',
        'You know you want to say yes ❤️',
        'Pinky promise to be better! 🌸',
      ];

  const currentPleadMessage = pleadMessages[dodgeCount % pleadMessages.length];

  // Calculate runaway offset
  const handleNoDodge = () => {
    romanticAudio.playCuteDodge();
    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);
    onNoDodged?.(nextCount, currentPleadMessage);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = Math.min(180, rect.width / 2 - 80);
      const maxY = Math.min(120, rect.height / 2 - 50);

      // Random offset
      const randX = (Math.random() - 0.5) * 2 * maxX;
      const randY = (Math.random() - 0.5) * 2 * maxY;

      setNoButtonPosition({ x: randX, y: randY });
    }
  };

  const handleYesClick = () => {
    romanticAudio.playRomanticVictory();

    // Multiphase Confetti explosion
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#fb7185', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    onForgiven();
  };

  // Grow "Yes" button slightly each time "No" is dodged
  const yesScale = Math.min(1.4, 1 + dodgeCount * 0.08);

  return (
    <section id="forgive-poll" className="relative py-16 md:py-24 border-t border-rose-500/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          ref={containerRef}
          className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#1f1325] via-[#150d1b] to-[#0f0914] border border-rose-500/30 text-center shadow-[0_20px_70px_rgba(244,63,94,0.15)] overflow-hidden"
        >
          {/* Ambient center radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{isUrdu ? 'سب سے اہم سوال' : 'The Ultimate Question'}</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${
              isUrdu ? 'font-urdu' : 'font-display-romantic'
            }`}
          >
            {isUrdu
              ? `کیا آپ ${senderName} کو معاف کرتی ہیں؟ 🥺❤️`
              : `Do you forgive me, ${receiverName}? 🥺❤️`}
          </h2>

          <p className="mt-3 text-neutral-300 text-sm sm:text-base max-w-lg mx-auto">
            {isUrdu
              ? 'اپنے پیارے سے دل سے سچ بتائیے گا... ایک بار معاف کر کے مسکرا دیجئے!'
              : 'Listen to your heart. Give us another chance to make beautiful memories together.'}
          </p>

          {/* Interactive Button Arena */}
          {!isForgiven ? (
            <div className="mt-10 min-h-[140px] flex flex-wrap items-center justify-center gap-6 relative">
              {/* YES BUTTON (Grows bigger) */}
              <button
                onClick={handleYesClick}
                style={{ transform: `scale(${yesScale})` }}
                className="relative z-10 inline-flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-rose-500 to-pink-500 text-white font-bold text-base shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>
                  {isUrdu
                    ? 'ہاں، میں نے معاف کر دیا! ❤️'
                    : language === 'roman'
                    ? 'Haan, Maan Gayi! I Forgive You ❤️'
                    : 'Yes, I Forgive You! ❤️'}
                </span>
              </button>

              {/* NO BUTTON (Runs away playfully) */}
              <button
                type="button"
                onMouseEnter={handleNoDodge}
                onTouchStart={handleNoDodge}
                onClick={handleNoDodge}
                style={
                  noButtonPosition
                    ? {
                        transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      }
                    : {
                        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      }
                }
                className="inline-flex items-center gap-1.5 py-3 px-6 rounded-2xl bg-neutral-800/90 border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 hover:text-white transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{currentPleadMessage}</span>
              </button>
            </div>
          ) : (
            /* Celebration State */
            <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-rose-950/60 via-pink-950/60 to-purple-950/60 border border-rose-500/40 animate-pulse-subtle">
              <div className="flex justify-center mb-3">
                <span className="p-3 rounded-full bg-rose-500/20 text-rose-400">
                  <PartyPopper className="w-8 h-8 animate-bounce" />
                </span>
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-bold text-rose-200 ${
                  isUrdu ? 'font-urdu' : 'font-display-romantic'
                }`}
              >
                {isUrdu
                  ? 'شکریہ میری جان! آپ کا دل سچ میں بہت خوبصورت ہے ❤️'
                  : language === 'roman'
                  ? 'Yayyy! Thank You Meri Jaan ❤️ Aapka Dil Bohat Pyara Hai!'
                  : 'Yay! Thank You My Love! You have the kindest heart ❤️'}
              </h3>
              <p className="mt-2 text-sm text-rose-300/90 max-w-md mx-auto">
                {isUrdu
                  ? 'اب جب کہ آپ مان گئی ہیں، تو آئیں مل کر ایک خوبصورت شام کا پلان بناتے ہیں!'
                  : 'Now that we are all good, let me make it up to you with a special date! See options below.'}
              </p>
            </div>
          )}

          {dodgeCount > 0 && !isForgiven && (
            <p className="mt-6 text-xs text-neutral-400 italic">
              {isUrdu
                ? `(پیار بھری کوششیں: ${dodgeCount} بار... پلیز ہاں پر کلک کر دیں ناں 🥹)`
                : `(Pleading attempts: ${dodgeCount} times... you know you want to click Yes 🥺)`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
