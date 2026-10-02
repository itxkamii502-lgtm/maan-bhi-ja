import React, { useState } from 'react';
import { DateOption } from '../types.ts';
import { Heart, Send, CheckCircle2, MessageCircle, Sparkles, MapPin } from 'lucide-react';
import { generateReplyWhatsAppLink } from '../utils/urlPayload.ts';

interface DateProposalPollProps {
  dateOptions: DateOption[];
  senderName: string;
  receiverName: string;
  language: 'roman' | 'ur' | 'en';
  onSelectOption?: (opt: DateOption) => void;
  onSendNote?: (note: string) => void;
}

export const DateProposalPoll: React.FC<DateProposalPollProps> = ({
  dateOptions,
  senderName,
  receiverName,
  language,
  onSelectOption,
  onSendNote,
}) => {
  const [selectedId, setSelectedId] = useState<string>(dateOptions[0]?.id || 'icecream');
  const [customNote, setCustomNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const isUrdu = language === 'ur';

  const selectedOption = dateOptions.find((d) => d.id === selectedId) || dateOptions[0];

  const handleSelect = (opt: DateOption) => {
    setSelectedId(opt.id);
    onSelectOption?.(opt);
  };

  const handleSendWhatsApp = () => {
    onSendNote?.(customNote);
    const link = generateReplyWhatsAppLink(
      senderName,
      selectedOption?.title || '',
      customNote,
      language
    );
    window.open(link, '_blank');
  };

  const handleCopyAnswer = () => {
    const text = isUrdu
      ? `پیارے ${senderName}! میں مان گئی ہوں۔ میری پسند: ${selectedOption?.title} ${customNote ? `(نوٹ: ${customNote})` : ''}`
      : `Hey ${senderName}, I forgive you! Let's go for: ${selectedOption?.title} ${customNote ? `("${customNote}")` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="date-invite" className="relative py-16 md:py-24 border-t border-rose-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{isUrdu ? 'صلح کی دعوت اور ملاقات' : 'Reconciliation Date Proposal'}</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight ${
              isUrdu ? 'font-urdu' : 'font-display-romantic'
            }`}
          >
            {isUrdu
              ? 'اب بتائیے، ہم منانے کے لیے کہاں چلیں؟ 🌹'
              : `Let Me Treat You, ${receiverName}! Where Are We Going? 🌹`}
          </h2>
          <p className="mt-3 text-neutral-300 text-sm sm:text-base max-w-xl mx-auto">
            {isUrdu
              ? 'اپنی پسند کی جگہ کا انتخاب کیجئے اور مجھے بتائیے تاکہ میں ابھی سے تیاری شروع کر سکوں۔'
              : 'Pick your dream makeup plan. All treats, smiles, and undivided attention are on me!'}
          </p>
        </div>

        {/* Feature visual banner */}
        <div className="relative mb-10 rounded-3xl overflow-hidden border border-rose-500/20 shadow-2xl h-56 sm:h-72">
          <img
            src="/images/romantic_date_invitation_1790879106288.jpg"
            alt="Romantic candlelit dinner table"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.background =
                'linear-gradient(135deg, #2b1123 0%, #110915 100%)';
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100a15] via-[#100a15]/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-400" />
              <span className="text-sm font-semibold tracking-wide">
                {isUrdu ? 'آپ کا من پسند گوشہ' : 'Your Choice, My Pleasure'}
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-rose-300 bg-rose-950/70 border border-rose-500/30 px-3 py-1 rounded-full">
              Exclusive RSVP
            </span>
          </div>
        </div>

        {/* Date Choice Cards (Poll Options) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {dateOptions.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-950/70 to-pink-950/40 border-rose-400/80 shadow-[0_0_25px_rgba(244,63,94,0.25)] ring-1 ring-rose-400/50'
                    : 'bg-[#150d1a]/80 border-neutral-800 hover:border-neutral-600 hover:bg-[#1a1120]'
                }`}
                dir={isUrdu ? 'rtl' : 'ltr'}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-700/40">
                    {opt.icon}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium tracking-wide text-rose-300/80 uppercase">
                      {opt.tag}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-rose-400 fill-rose-500/20" />
                    )}
                  </div>
                </div>

                <h3
                  className={`mt-4 text-lg font-bold text-white ${
                    isSelected ? 'text-rose-100' : ''
                  } ${isUrdu ? 'font-urdu' : ''}`}
                >
                  {opt.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-300/80 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* RSVP Card & WhatsApp Action */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1b1222] to-[#120a17] border border-rose-500/25 shadow-xl">
          <h3
            className={`text-xl font-bold text-white mb-2 ${
              isUrdu ? 'font-urdu text-right' : ''
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {isUrdu ? 'ایک چھوٹا سا پیغام ساتھ لکھیے (اختیاری):' : 'Add a sweet note (optional):'}
          </h3>

          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder={
              isUrdu
                ? 'جیسے: ٹھیک ہے میں مان گئی ہوں لیکن آئس کریم آپ کی طرف سے ہو گی!'
                : 'e.g. "Okay fine, but you owe me an extra treat!"'
            }
            rows={2}
            className="w-full rounded-xl bg-neutral-900/70 border border-neutral-700/70 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors mb-6 resize-none"
            dir={isUrdu ? 'rtl' : 'ltr'}
          />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="text-left w-full sm:w-auto">
              <span className="text-xs text-neutral-400 block">
                {isUrdu ? 'منتخب شدہ تاریخ:' : 'Selected Date:'}
              </span>
              <span className="text-sm font-semibold text-rose-300 flex items-center gap-1.5 mt-0.5">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                {selectedOption?.title}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyAnswer}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {copied ? '✓ Copied Answer!' : isUrdu ? 'جواب کاپی کریں' : 'Copy Response'}
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-xs sm:text-sm shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {isUrdu ? `واٹس ایپ پر ${senderName} کو بھیجیں` : `Send to ${senderName} on WhatsApp`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
