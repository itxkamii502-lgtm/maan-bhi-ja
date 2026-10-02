import React, { useState } from 'react';
import { PunishmentOption } from '../types.ts';
import {
  Gavel,
  Sparkles,
  CheckCircle2,
  Dices,
  MessageCircle,
  ShieldAlert,
  Send,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../utils/romanticAudio.ts';

interface PunishmentGameProps {
  punishments: PunishmentOption[];
  senderName: string;
  receiverName: string;
  language: 'roman' | 'ur' | 'en';
  onPunishmentChosen?: (title: string, details?: string) => void;
}

export const PunishmentGame: React.FC<PunishmentGameProps> = ({
  punishments,
  senderName,
  receiverName,
  language,
  onPunishmentChosen,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customSaza, setCustomSaza] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const isUrdu = language === 'ur';

  const selectedPunishment = punishments.find((p) => p.id === selectedId);

  const handleSelect = (punishment: PunishmentOption) => {
    setSelectedId(punishment.id);
    setConfirmed(true);
    romanticAudio.playRomanticVictory();

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#f59e0b', '#fbbf24', '#f43f5e', '#a855f7'],
    });

    onPunishmentChosen?.(punishment.title, punishment.description);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSaza.trim()) return;

    setSelectedId('custom');
    setConfirmed(true);
    romanticAudio.playRomanticVictory();

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#ec4899', '#f43f5e', '#3b82f6'],
    });

    onPunishmentChosen?.('Custom Saza', customSaza.trim());
  };

  // Fun Random Saza Spin
  const handleRandomSpin = () => {
    if (isSpinning || punishments.length === 0) return;
    setIsSpinning(true);
    setConfirmed(false);

    let count = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * punishments.length);
      setSelectedId(punishments[randIdx].id);
      romanticAudio.playCuteDodge();
      count++;

      if (count > 12) {
        clearInterval(interval);
        setIsSpinning(false);
        setConfirmed(true);
        romanticAudio.playRomanticVictory();

        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.75 },
          colors: ['#f59e0b', '#f43f5e', '#10b981'],
        });

        const finalPick = punishments[randIdx];
        onPunishmentChosen?.(finalPick.title, finalPick.description);
      }
    }, 120);
  };

  const getChosenTitle = () => {
    if (selectedId === 'custom') return customSaza;
    return selectedPunishment?.title || '';
  };

  const handleWhatsAppSend = () => {
    const chosenTitle = getChosenTitle();
    let text = '';
    if (isUrdu) {
      text = `سنو ${senderName}! ⚖️\nآپ کی غلطی کی معافی کے بدلے میں نے یہ سزا تجویز کی ہے:\n\n👉 "${chosenTitle}"\n\nاب وعدے کے مطابق یہ سزا ہنسی خوشی قبول کرو!`;
    } else if (language === 'roman') {
      text = `Hey ${senderName}! ⚖️\nMaine tumhari ghalti ki saza chun li hai:\n\n👉 "${chosenTitle}"\n\nAb promise ke mutabiq ye saza poori karni hogi! Ready rehna!`;
    } else {
      text = `Hey ${senderName}! ⚖️\nI have picked my punishment for your mistake:\n\n👉 "${chosenTitle}"\n\nYou promised to accept it unconditionally, so get ready!`;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="punishment-game" className="relative py-16 md:py-24 border-t border-rose-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Gavel className="w-4 h-4" />
            <span>{isUrdu ? 'عدالتِ دوستی و محبت' : 'The Court of Forgiveness'}</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${
              isUrdu ? 'font-urdu' : 'font-display-romantic'
            }`}
          >
            {isUrdu
              ? 'جو بھی سزا دینا چاہو، مجھے منظور ہے! ⚖️🥺'
              : `Choose My Punishment, ${receiverName}! Whatever You Decide, I Accept ⚖️🥺`}
          </h2>

          <p className="mt-3 text-neutral-300 text-sm sm:text-base max-w-xl mx-auto">
            {isUrdu
              ? 'غلطی میری تھی، اس لیے سزا کا مکمل حق صرف آپ کا ہے۔ نیچے دی گئی سزاؤں میں سے کوئی چنیں یا اپنی مرضی کی سزا لکھیں، میں سر آنکھوں پر قبول کروں گا!'
              : 'I made the mistake, so you hold all the power. Pick any punishment below or write your own, and I solemnly vow to fulfill it!'}
          </p>

          {/* Random Spin Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleRandomSpin}
              disabled={isSpinning}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'قسمت کا فیصلہ ہو رہا ہے...' : isUrdu ? 'قرعہ اندازی سے سزا چنیں 🎲' : 'Spin Random Saza 🎲'}</span>
            </button>
          </div>
        </div>

        {/* Punishment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {punishments.map((p) => {
            const isSelected = selectedId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-950/70 via-rose-950/60 to-purple-950/60 border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-[1.02]'
                    : 'bg-[#160e1d]/80 border-neutral-800 hover:border-amber-500/40 hover:bg-[#1c1224]'
                }`}
                dir={isUrdu ? 'rtl' : 'ltr'}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-700/40">
                      {p.icon}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold tracking-wider text-amber-300/80 uppercase">
                        {p.tag}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                      )}
                    </div>
                  </div>

                  <h3
                    className={`mt-4 text-base sm:text-lg font-bold text-white ${
                      isSelected ? 'text-amber-200' : ''
                    } ${isUrdu ? 'font-urdu' : ''}`}
                  >
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-amber-300 font-bold' : 'text-neutral-400'}`}>
                    {isSelected ? '✓ سزا منتخب کر لی گئی' : 'سزا منتخب کریں'}
                  </span>
                  <span className="text-amber-400/80 text-xs">⚖️</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Punishment Box */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1a1122] to-[#120a17] border border-amber-500/25 shadow-xl">
          <div className="flex items-center gap-2 mb-3 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{isUrdu ? 'یا اپنی مرضی کی کوئی انوکھی سزا لکھیں:' : 'Or Create Your Own Custom Punishment:'}</span>
          </div>

          <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customSaza}
              onChange={(e) => setCustomSaza(e.target.value)}
              placeholder={
                isUrdu
                  ? 'جیسے: شام کو مجھے آئس کریم پارلر لے جانا ہوگا اور 1 ہفتے تک ہر بات ماننا ہو گی...'
                  : 'e.g. "You have to bring me my favorite brownies and no arguing for 3 days!"'
              }
              className="flex-1 rounded-xl bg-neutral-900/80 border border-neutral-700 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              dir={isUrdu ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              disabled={!customSaza.trim()}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              {isUrdu ? 'یہ سزا لاگو کریں ⚖️' : 'Impose Custom Saza ⚖️'}
            </button>
          </form>

          {/* Official Saza Confirmation Card */}
          {confirmed && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-rose-950/60 to-purple-950/60 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-subtle">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                  Official Verdict Stamped ⚖️
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  "{getChosenTitle()}"
                </p>
                <p className="text-xs text-neutral-300 mt-0.5">
                  {isUrdu
                    ? `میں، ${senderName}، پورے دل سے اس سزا کو قبول کرتا ہوں!`
                    : `I, ${senderName}, solemnly accept this verdict unconditionally!`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isUrdu ? `واٹس ایپ پر ${senderName} کو سزا بھیجیں` : `Send Verdict to ${senderName} on WhatsApp`}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
