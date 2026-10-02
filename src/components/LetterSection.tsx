import React, { useState } from 'react';
import { ProposalPayload } from '../types.ts';
import { Heart, Sparkles, Quote, Edit3, Check, X, Sliders } from 'lucide-react';
import { WhatsAppCryingSticker } from './WhatsAppCryingSticker.tsx';

interface LetterSectionProps {
  payload: ProposalPayload;
  onUpdatePayload?: (updated: ProposalPayload) => void;
  onOpenCustomizer?: () => void;
  isAdmin?: boolean;
}

export const LetterSection: React.FC<LetterSectionProps> = ({
  payload,
  onUpdatePayload,
  onOpenCustomizer,
  isAdmin = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(payload.headline);
  const [subheadline, setSubheadline] = useState(payload.subheadline);
  const [letterBody, setLetterBody] = useState(payload.letter);

  const isUrdu = payload.language === 'ur';

  // Format letter paragraphs
  const paragraphs = payload.letter
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  const handleSaveEdit = () => {
    if (onUpdatePayload) {
      onUpdatePayload({
        ...payload,
        headline: headline.trim() || payload.headline,
        subheadline: subheadline.trim() || payload.subheadline,
        letter: letterBody.trim() || payload.letter,
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setHeadline(payload.headline);
    setSubheadline(payload.subheadline);
    setLetterBody(payload.letter);
    setIsEditing(false);
  };

  return (
    <section id="letter" className="relative py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header kicker & Edit Toggle Action */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>{isUrdu ? 'دلی ندامت اور محبت' : 'With All My Heart'}</span>
            </div>

            {/* Direct Text Edit Button (Visible only to authenticated Admin) */}
            {!isEditing && isAdmin ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 hover:border-rose-400 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                title="Edit this text directly"
              >
                <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                <span>{isUrdu ? 'متن خود ایڈٹ کریں ✏️' : 'Edit Text ✏️'}</span>
              </button>
            ) : null}
          </div>

          {/* Interactive In-line Heading / Subheading Editor */}
          {isEditing ? (
            <div className="p-4 sm:p-6 rounded-2xl bg-[#1a1221] border border-rose-500/30 text-left mb-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1">
                  {isUrdu ? 'مین ہیڈ لائن (عنوان)' : 'Page Main Headline'}
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-neutral-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  dir={isUrdu ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider mb-1">
                  {isUrdu ? 'وضاحتی سب ہیڈ لائن (Subheadline)' : 'Explanatory Subheadline'}
                </label>
                <input
                  type="text"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-neutral-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  dir={isUrdu ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          ) : (
            <>
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight ${
                  isUrdu ? 'font-urdu' : 'font-display-romantic'
                }`}
              >
                {payload.headline}
              </h1>
              <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
                {payload.subheadline}
              </p>
            </>
          )}
        </div>

        {/* Letter Container with Visual Asset */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#19121e]/90 via-[#130c18]/90 to-[#0e0913]/90 border border-rose-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden">
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Hero Photography Banner */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden border-b border-rose-500/20">
            <img
              src="/images/romantic_letter_hero_1790879074771.jpg"
              alt="Romantic vintage love letter with wax seal and rose petals"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.background =
                  'linear-gradient(135deg, #271424 0%, #150b18 100%)';
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Elegant gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#130c18] via-[#130c18]/40 to-transparent" />

            {/* Dedication Badge over image */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs sm:text-sm text-neutral-300">
              <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                <Sparkles className="w-4 h-4 text-rose-400" />
                {isUrdu ? `از قلم: ${payload.senderName}` : `Written by ${payload.senderName}`}
              </span>
              <span className="text-neutral-400">
                {isUrdu ? `برائے: ${payload.receiverName}` : `Dedicated to ${payload.receiverName}`}
              </span>
            </div>
          </div>

          {/* Letter Prose Area */}
          <div className="p-6 sm:p-10 md:p-12">
            <div className="relative">
              <Quote className="w-10 h-10 text-rose-500/20 absolute -top-4 -left-2 transform -scale-x-100" />

              {/* If in edit mode, show large full letter textarea */}
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                      {isUrdu ? 'اپنا خط مکمل یہاں لکھیں:' : 'Write Your Full Letter Here:'}
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      Paragraphs create separate spaces
                    </span>
                  </div>

                  <textarea
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    rows={12}
                    className="w-full rounded-2xl bg-black/70 border border-neutral-700 p-4 text-sm text-white focus:outline-none focus:border-rose-400 leading-relaxed font-sans"
                    dir={isUrdu ? 'rtl' : 'ltr'}
                    placeholder="Write your apology or message here..."
                  />

                  {/* Save / Cancel action buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isUrdu ? 'تبدیلیاں محفوظ کریں' : 'Save Changes'}</span>
                    </button>

                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>{isUrdu ? 'منسوخ کریں' : 'Cancel'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`space-y-6 text-neutral-200 text-base sm:text-lg leading-relaxed relative z-10 ${
                      isUrdu
                        ? 'font-urdu text-right leading-[2.4] text-xl'
                        : 'font-serif-luxury text-justify sm:text-left'
                    }`}
                    dir={isUrdu ? 'rtl' : 'ltr'}
                  >
                    {paragraphs.map((p, idx) => (
                      <p key={idx} className="tracking-wide">
                        {p}
                      </p>
                    ))}
                  </div>

                  {/* Signature block */}
                  <div
                    className={`mt-10 pt-6 border-t border-rose-500/20 flex flex-col ${
                      isUrdu ? 'items-start text-right' : 'items-end text-right'
                    }`}
                    dir={isUrdu ? 'rtl' : 'ltr'}
                  >
                    <span className="text-xs uppercase tracking-widest text-neutral-400">
                      {isUrdu ? 'ہمیشہ آپ کا منتظر' : 'Forever & Sincerest,'}
                    </span>
                    <span className="text-2xl font-bold text-rose-300 font-display-romantic mt-1">
                      {payload.senderName} ❤️
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp Crying Apology Sticker Widget (Right below letter) */}
        <div className="mt-8">
          <WhatsAppCryingSticker
            senderName={payload.senderName}
            receiverName={payload.receiverName}
            language={payload.language}
          />
        </div>
      </div>
    </section>
  );
};
