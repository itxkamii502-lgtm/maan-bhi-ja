import React from 'react';
import { Heart, Share2, Sliders, Lock, Unlock } from 'lucide-react';

interface FooterProps {
  senderName: string;
  receiverName: string;
  language: 'roman' | 'ur' | 'en';
  onOpenCustomizer: () => void;
  onReopenEnvelope: () => void;
  isAdmin?: boolean;
  onAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  senderName,
  receiverName,
  language,
  onOpenCustomizer,
  onReopenEnvelope,
  isAdmin = false,
  onAdminLogin,
  onAdminLogout,
}) => {
  const isUrdu = language === 'ur';

  return (
    <footer className="border-t border-rose-500/15 bg-[#09060c] py-12 text-neutral-400 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display-romantic text-sm text-neutral-200">
            {isUrdu
              ? `صرف ${receiverName} کے لیے، ${senderName} کی طرف سے`
              : `Crafted with all my love for ${receiverName}, by ${senderName}`}
          </p>
          <p className="mt-1 text-neutral-500 text-[11px]">
            {isUrdu
              ? 'محبت، معافی اور ایک نئے آغاز کی مخلصانہ کوشش۔'
              : 'Dedicated to forgiveness, patience, and fresh beginnings.'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-neutral-400">
          <button
            onClick={onReopenEnvelope}
            className="hover:text-rose-300 transition-colors cursor-pointer"
          >
            {isUrdu ? 'خط دوبارہ کھولیں' : 'Replay Envelope 💌'}
          </button>

          {isAdmin ? (
            <>
              <span>·</span>
              <button
                onClick={onOpenCustomizer}
                className="inline-flex items-center gap-1.5 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-rose-400" />
                <span>{isUrdu ? 'سیٹنگز و ایڈیٹر' : 'Edit & Customize'}</span>
              </button>
              <span>·</span>
              <button
                onClick={onAdminLogout}
                className="inline-flex items-center gap-1 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                title="Lock admin controls"
              >
                <Unlock className="w-3 h-3 text-emerald-400" />
                <span>Admin Logout</span>
              </button>
            </>
          ) : (
            <>
              <span>·</span>
              <button
                onClick={onAdminLogin}
                className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
                title="Admin Passcode Login"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
