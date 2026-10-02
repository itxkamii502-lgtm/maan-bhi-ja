import React from 'react';
import { Mail, Heart, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio.ts';
import confetti from 'canvas-confetti';

interface EnvelopeIntroProps {
  senderName: string;
  receiverName: string;
  language: 'roman' | 'ur' | 'en';
  onOpen: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  senderName,
  receiverName,
  language,
  onOpen,
}) => {
  const handleOpenClick = () => {
    // Subtle confetti burst without forced audio
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#ffe4e6', '#f59e0b'],
    });

    onOpen();
  };

  const isUrdu = language === 'ur';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09070c]/95 backdrop-blur-md px-4">
      {/* Decorative ambient lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-md w-full text-center">
        {/* Subtitle / Sender prompt */}
        <div className="mb-6 flex items-center justify-center gap-2 text-rose-300/80 text-sm tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{isUrdu ? 'صرف آپ کے لیے ایک خاص تحریر' : 'A special letter just for you'}</span>
          <Sparkles className="w-4 h-4 text-rose-400" />
        </div>

        {/* Vintage Envelope Card */}
        <div
          onClick={handleOpenClick}
          className="group relative cursor-pointer mx-auto p-8 rounded-2xl bg-gradient-to-b from-[#1c1421] to-[#120c18] border border-rose-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(244,63,94,0.15)] hover:border-rose-400/40 hover:shadow-[0_25px_60px_rgba(244,63,94,0.25)] transition-all duration-500"
        >
          {/* Top Envelope Flap styling */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-transparent via-rose-500/40 to-transparent rounded-full" />

          {/* Stamp / Address Badge */}
          <div className="flex justify-between items-start mb-8 text-left">
            <div>
              <p className="text-[11px] tracking-wider uppercase text-neutral-400">
                {isUrdu ? 'ارسال کنندہ' : 'From'}
              </p>
              <p className="text-sm font-semibold text-rose-200">
                {senderName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] tracking-wider uppercase text-neutral-400">
                {isUrdu ? 'بنام' : 'To'}
              </p>
              <p className="text-sm font-semibold text-rose-200">
                {receiverName} ❤️
              </p>
            </div>
          </div>

          {/* Wax Seal Centerpiece */}
          <div className="my-8 flex justify-center">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 shadow-[0_10px_25px_rgba(225,29,72,0.4)] border border-rose-400/40 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-1 rounded-full border border-dashed border-rose-300/30" />
              <Heart className="w-8 h-8 text-rose-100 fill-rose-200/90 animate-pulse-subtle" />
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <h2
              className={`text-2xl font-bold text-white tracking-tight ${
                isUrdu ? 'font-urdu' : 'font-serif-luxury'
              }`}
            >
              {isUrdu ? `پیاری ${receiverName}، یہ خط کھولیں` : `Dearest ${receiverName}`}
            </h2>
            <p className="text-sm text-neutral-300/80">
              {isUrdu
                ? 'دل کی بات کہنے کے لیے ایک چھوٹی سی کوشش...'
                : 'Someone who cares about you deeply has a heartfelt message for you.'}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenClick();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white font-medium text-sm shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>{isUrdu ? 'خط کھولیں اور پڑھیں 💌' : 'Open My Heartfelt Letter 💌'}</span>
            </button>
          </div>
        </div>

        {/* Quiet footer tip */}
        <p className="mt-4 text-xs text-neutral-500">
          {isUrdu ? 'بہترین احساس کے لیے آواز آن رکھیں' : 'Turn up your volume for the romantic melody'}
        </p>
      </div>
    </div>
  );
};
