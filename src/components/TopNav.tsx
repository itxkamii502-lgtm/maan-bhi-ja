import React from 'react';
import { AudioPlayerButton } from './AudioPlayerButton.tsx';
import { Sliders, Share2 } from 'lucide-react';

interface TopNavProps {
  onOpenCustomizer: () => void;
  onOpenDashboard?: () => void;
  language: 'roman' | 'ur' | 'en';
  isAdmin?: boolean;
  soundEnabled?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenCustomizer,
  onOpenDashboard,
  language,
  isAdmin = false,
  soundEnabled = false,
}) => {
  const isUrdu = language === 'ur';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0f0c13]/85 border-b border-rose-500/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="#letter"
          className="text-lg font-bold tracking-tight text-white font-display-romantic hover:text-rose-200 transition-colors"
        >
          {isUrdu ? 'مان جاؤ نا 🌹' : 'Maan Jao Na 🌹'}
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-300">
          <a href="#letter" className="hover:text-rose-300 transition-colors">
            {isUrdu ? 'خط' : 'The Letter'}
          </a>
          <a href="#promises" className="hover:text-rose-300 transition-colors">
            {isUrdu ? 'عہد' : 'Promises'}
          </a>
          <a href="#forgive-poll" className="hover:text-rose-300 transition-colors">
            {isUrdu ? 'معافی گیم' : 'Forgive Me?'}
          </a>
          <a href="#punishment-game" className="hover:text-amber-300 transition-colors">
            {isUrdu ? 'سزا گیم' : 'Punishments'}
          </a>
          <a href="#date-invite" className="hover:text-rose-300 transition-colors">
            {isUrdu ? 'دعوت' : 'Date Proposal'}
          </a>
          <a href="#coupons" className="hover:text-rose-300 transition-colors">
            {isUrdu ? 'واؤچرز' : 'Coupons'}
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <AudioPlayerButton enabled={soundEnabled} />

          {onOpenDashboard && (
            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-900/60 border border-purple-500/40 text-purple-200 hover:bg-purple-800/80 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title="Live Activity & Analytics"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="hidden sm:inline">Live Tracking</span>
              <span className="sm:hidden">Live</span>
            </button>
          )}

          <button
            onClick={onOpenCustomizer}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_2px_10px_rgba(244,63,94,0.3)] hover:shadow-[0_4px_15px_rgba(244,63,94,0.4)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Customize and get shareable link"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize / Share</span>
            <span className="sm:hidden">Edit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
