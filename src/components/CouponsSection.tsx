import React, { useState } from 'react';
import { LoveCoupon } from '../types.ts';
import { Ticket, Sparkles, Check, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CouponsSectionProps {
  coupons: LoveCoupon[];
  language: 'roman' | 'ur' | 'en';
  onClaimCoupon?: (coupon: LoveCoupon) => void;
}

export const CouponsSection: React.FC<CouponsSectionProps> = ({ coupons, language, onClaimCoupon }) => {
  const [claimedIds, setClaimedIds] = useState<Record<string, boolean>>({});

  const isUrdu = language === 'ur';

  const handleClaim = (coupon: LoveCoupon) => {
    setClaimedIds((prev) => ({ ...prev, [coupon.id]: true }));
    onClaimCoupon?.(coupon);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#fbbf24', '#f43f5e'],
    });
  };

  return (
    <section id="coupons" className="relative py-16 md:py-24 border-t border-rose-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Gift className="w-4 h-4" />
            <span>{isUrdu ? 'خاص تحفہ اور واؤچرز' : 'Redeemable Love Vouchers'}</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-bold text-white tracking-tight ${
              isUrdu ? 'font-urdu' : 'font-display-romantic'
            }`}
          >
            {isUrdu ? 'آپ کے لیے لائف ٹائم فری واؤچرز 🎟️' : 'Your Lifetime Love Passes 🎟️'}
          </h2>
          <p className="mt-2 text-sm text-neutral-400 max-w-lg mx-auto">
            {isUrdu
              ? 'یہ واؤچرز کبھی ایکسپائر نہیں ہوں گے۔ آپ جب چاہیں بلا جھجھک استعمال کر سکتی ہیں۔'
              : 'These cards have no expiry date. Keep them close and redeem anytime!'}
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((coupon) => {
            const isClaimed = claimedIds[coupon.id];
            return (
              <div
                key={coupon.id}
                className="relative rounded-2xl bg-gradient-to-br from-[#1d1410] via-[#160d16] to-[#0f0914] border border-amber-500/30 p-6 flex flex-col justify-between shadow-xl overflow-hidden group hover:border-amber-400/50 transition-all duration-300"
                dir={isUrdu ? 'rtl' : 'ltr'}
              >
                {/* Perforated ticket edges effect */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0f0c13] rounded-full border border-amber-500/20" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0f0c13] rounded-full border border-amber-500/20" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Ticket className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] tracking-widest font-mono text-amber-400/80 uppercase">
                      {coupon.code}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-bold text-amber-100 ${
                      isUrdu ? 'font-urdu text-xl' : ''
                    }`}
                  >
                    {coupon.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                    {coupon.perk}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-500/15 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400/60 font-medium">
                    {isUrdu ? 'مکمل طور پر گارنٹی شدہ' : '100% Guaranteed'}
                  </span>

                  <button
                    onClick={() => handleClaim(coupon)}
                    disabled={isClaimed}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isClaimed
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'کلیم کر لیا گیا ✓' : 'Claimed ✓'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'محفوظ کریں' : 'Claim Pass'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
