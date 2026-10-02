import React from 'react';
import { MemoryPromise } from '../types.ts';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface PromisesSectionProps {
  promises: MemoryPromise[];
  senderName: string;
  receiverName: string;
  language: 'roman' | 'ur' | 'en';
}

export const PromisesSection: React.FC<PromisesSectionProps> = ({
  promises,
  senderName,
  receiverName,
  language,
}) => {
  const isUrdu = language === 'ur';

  return (
    <section id="promises" className="relative py-12 md:py-20 border-t border-rose-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>{isUrdu ? 'میرے سچے وعدے اور عہد' : 'My Sincere Commitments'}</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight ${
              isUrdu ? 'font-urdu' : 'font-display-romantic'
            }`}
          >
            {isUrdu
              ? `آپ کے لیے ${senderName} کے 4 پکے وعدے`
              : `4 Heartfelt Promises from ${senderName} to ${receiverName}`}
          </h2>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl mx-auto">
            {isUrdu
              ? 'یہ صرف الفاظ نہیں بلکہ میرے دل سے نکلے ہوئے پکے عہد ہیں جن پر میں ہمیشہ قائم رہوں گا۔'
              : 'Actions speak louder than apologies. Here are the promises I solemnly commit to.'}
          </p>
        </div>

        {/* Bento Grid: Memory Photo Spotlight + 4 Promise Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Spotlight Card with Generated Romantic Photo */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#1c1322] to-[#120b18] border border-rose-500/20 overflow-hidden flex flex-col shadow-xl">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="/images/romantic_memories_moment_1790879090932.jpg"
                alt="Two lovers holding hands over coffee"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.background =
                    'linear-gradient(135deg, #30172c 0%, #150b18 100%)';
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120b18] via-transparent to-transparent" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between" dir={isUrdu ? 'rtl' : 'ltr'}>
              <div>
                <span className="text-xs font-semibold text-rose-400 tracking-wider uppercase">
                  {isUrdu ? 'ہماری خوبصورت یادیں' : 'Treasured Moments'}
                </span>
                <h3
                  className={`text-xl font-bold text-white mt-1 ${
                    isUrdu ? 'font-urdu' : 'font-serif-luxury'
                  }`}
                >
                  {isUrdu
                    ? 'ہمارا رشتہ کسی بھی بحث سے کہیں زیادہ انمول ہے'
                    : 'What we share is worth fighting for, not with each other.'}
                </h3>
                <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                  {isUrdu
                    ? 'جب ہم ایک دوسرے کے ساتھ ہوتے ہیں تو باقی ساری دنیا تھم جاتی ہے۔ میں اس خوبصورت احساس کو کبھی کھونا نہیں چاہتا۔'
                    : 'Every conversation, late-night laugh, and shared quiet moment with you is something I hold sacred in my heart.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-500/15 flex items-center justify-between text-xs text-neutral-400">
                <span>{isUrdu ? 'ہمیشہ آپ کے ساتھ' : 'Forever by your side'}</span>
                <span className="text-rose-400">❤️</span>
              </div>
            </div>
          </div>

          {/* 4 Promise Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promises.map((p, index) => (
              <div
                key={p.id || index}
                className="rounded-2xl p-6 bg-gradient-to-br from-[#1a1220]/80 to-[#120a17]/90 border border-rose-500/15 hover:border-rose-400/35 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                dir={isUrdu ? 'rtl' : 'ltr'}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 group-hover:scale-110 transition-transform">
                      {p.emoji || '✨'}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wider text-rose-300/80 uppercase">
                      {p.tag}
                    </span>
                  </div>

                  <h4
                    className={`text-base font-bold text-white group-hover:text-rose-200 transition-colors ${
                      isUrdu ? 'font-urdu text-lg' : ''
                    }`}
                  >
                    {p.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>{isUrdu ? 'پکا اور سچا عہد' : 'Solemn vow'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
