import React, { useState } from 'react';
import { Lock, KeyRound, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const REQUIRED_PIN = '987778899';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      if (pin.trim() === REQUIRED_PIN) {
        localStorage.setItem('admin_pin_session', REQUIRED_PIN);
        setPin('');
        setError(false);
        setLoading(false);
        onSuccess();
        onClose();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1c1322] to-[#100a16] border border-rose-500/30 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900/60 border border-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Admin Login / ایڈمن لاگ ان
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          صرف ایڈمن (کامران) کے لیے مخصوص ہے۔ اپنا 9 ہندسوں کا پن کوڈ درج کریں:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter PIN (e.g. 987778899)"
              autoFocus
              className="w-full text-center tracking-[0.3em] font-mono text-lg rounded-2xl bg-black/70 border border-neutral-700 focus:border-rose-400 focus:outline-none py-3 text-white px-4 placeholder:tracking-normal placeholder:font-sans placeholder:text-neutral-600"
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>غلط پن کوڈ! صرف ایڈمن کو رسائی کی اجازت ہے۔</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition-colors"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              disabled={loading || !pin.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>لاگ ان کریں</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
