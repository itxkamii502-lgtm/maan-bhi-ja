import React, { useState, useEffect, useRef } from 'react';
import {
  ProposalPayload,
  PRESET_BEST_FRIEND_ROMAN,
  DateOption,
  LoveCoupon,
} from './types.ts';
import {
  fetchProposalFromServer,
  trackProposalEvent,
  saveProposalToServer,
} from './utils/api.ts';
import { deserializePayload } from './utils/urlPayload.ts';
import { PetalBackground } from './components/PetalBackground.tsx';
import { TopNav } from './components/TopNav.tsx';
import { EnvelopeIntro } from './components/EnvelopeIntro.tsx';
import { LetterSection } from './components/LetterSection.tsx';
import { PromisesSection } from './components/PromisesSection.tsx';
import { ForgiveGame } from './components/ForgiveGame.tsx';
import { PunishmentGame } from './components/PunishmentGame.tsx';
import { DateProposalPoll } from './components/DateProposalPoll.tsx';
import { CouponsSection } from './components/CouponsSection.tsx';
import { CustomizerModal } from './components/CustomizerModal.tsx';
import { AdminDashboardModal } from './components/AdminDashboardModal.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Sliders, Activity, Sparkles } from 'lucide-react';

export default function App() {
  const [payload, setPayload] = useState<ProposalPayload>(PRESET_BEST_FRIEND_ROMAN);
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return (
        p.get('pin') === '987778899' ||
        p.get('admin') === '987778899' ||
        localStorage.getItem('admin_pin_session') === '987778899'
      );
    }
    return false;
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [envelopeOpened, setEnvelopeOpened] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isForgiven, setIsForgiven] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const trackingFiredRef = useRef<boolean>(false);

  // Initialize on mount: check URL params
  useEffect(() => {
    async function init() {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      const pParam = params.get('p');
      const keyParam = params.get('adminKey');
      const pinParam = params.get('pin') || params.get('admin');

      const isPinAuth =
        pinParam === '987778899' ||
        localStorage.getItem('admin_pin_session') === '987778899';

      // 1. Instant client-side decoding if payload exists in URL
      if (pParam) {
        const decoded = deserializePayload(pParam);
        if (decoded) {
          setPayload(decoded);
        }
      }

      if (idParam) {
        // Fetch proposal by ID from server if available
        const serverData = await fetchProposalFromServer(idParam);
        if (serverData) {
          setPayload(serverData);
        }

        // Authenticated as Admin ONLY if verified via PIN: 987778899
        if (isPinAuth) {
          setIsAdmin(true);
        } else {
          // Pure receiver mode! No admin buttons, no login required.
          setIsAdmin(false);
        }

        // Track page visit for receiver (only when not admin)
        if (!isPinAuth && !trackingFiredRef.current) {
          trackingFiredRef.current = true;
          const sessionKey = `visited_${idParam}`;
          const isRefresh = sessionStorage.getItem(sessionKey) === 'true';

          if (isRefresh) {
            trackProposalEvent(idParam, 'page_refresh');
          } else {
            sessionStorage.setItem(sessionKey, 'true');
            trackProposalEvent(idParam, 'page_view');
          }
        }
      } else {
        // No ID in URL -> default initial template.
        if (isPinAuth) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        saveProposalToServer(PRESET_BEST_FRIEND_ROMAN).then((res) => {
          setPayload((prev) => ({ ...prev, id: res.id, adminKey: res.adminKey }));
          setAdminKey(res.adminKey);
        });
      }

      setLoading(false);
    }

    init();
  }, []);

  // Sync HTML title
  useEffect(() => {
    if (payload.receiverName) {
      document.title = `${payload.receiverName}, Maan Jao Na 🥺❤️`;
    }
  }, [payload.receiverName]);

  // Event Trackers
  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    if (payload.id) {
      trackProposalEvent(payload.id, 'envelope_opened');
    }
  };

  const handleNoDodged = (dodgeCount: number, pleadMessage: string) => {
    if (payload.id) {
      trackProposalEvent(payload.id, 'no_dodged', { dodgeCount, pleadMessage });
    }
  };

  const handleForgivenYes = () => {
    setIsForgiven(true);
    if (payload.id) {
      trackProposalEvent(payload.id, 'forgiven_yes');
    }
  };

  const handlePunishmentChosen = (title: string, details?: string) => {
    if (payload.id) {
      trackProposalEvent(payload.id, 'punishment_chosen', { title, details });
    }
  };

  const handleSelectDateOption = (opt: DateOption) => {
    if (payload.id) {
      trackProposalEvent(payload.id, 'date_selected', { id: opt.id, title: opt.title });
    }
  };

  const handleSendNote = (note: string) => {
    if (payload.id && note.trim()) {
      trackProposalEvent(payload.id, 'note_submitted', { note: note.trim() });
    }
  };

  const handleClaimCoupon = (coupon: LoveCoupon) => {
    if (payload.id) {
      trackProposalEvent(payload.id, 'coupon_claimed', {
        id: coupon.id,
        title: coupon.title,
        code: coupon.code,
      });
    }
  };

  const handleDirectUpdatePayload = async (updated: ProposalPayload) => {
    setPayload(updated);
    if (updated.id) {
      await saveProposalToServer(updated, adminKey);
    }
  };

  const handleReopenEnvelope = () => {
    setEnvelopeOpened(false);
    setIsForgiven(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setIsAdminLoginOpen(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_pin_session');
    setIsAdmin(false);
    setIsCustomizerOpen(false);
    setIsAdminDashboardOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0912] flex items-center justify-center text-rose-300">
        <Sparkles className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0912] text-[#f4efe8] selection:bg-rose-500/30 selection:text-rose-200 relative font-sans">
      {/* Background Petals & Ambient Lighting */}
      <PetalBackground />

      {/* Opening Envelope Overlay if not yet opened */}
      {!envelopeOpened && (
        <EnvelopeIntro
          senderName={payload.senderName}
          receiverName={payload.receiverName}
          language={payload.language}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Main Experience Once Opened */}
      <div className={`transition-opacity duration-1000 ${envelopeOpened ? 'opacity-100' : 'opacity-0'}`}>
        <TopNav
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onOpenDashboard={isAdmin ? () => setIsAdminDashboardOpen(true) : undefined}
          language={payload.language}
          isAdmin={isAdmin}
          soundEnabled={payload.enableBackgroundAudio}
        />

        <main className="relative z-10">
          {/* Apology Letter Section */}
          <LetterSection
            payload={payload}
            onUpdatePayload={handleDirectUpdatePayload}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            isAdmin={isAdmin}
          />

          {/* Promises & Memories Bento (if enabled) */}
          {payload.showPromises && payload.promises.length > 0 && (
            <PromisesSection
              promises={payload.promises}
              senderName={payload.senderName}
              receiverName={payload.receiverName}
              language={payload.language}
            />
          )}

          {/* Interactive "Do You Forgive Me?" Game (if enabled) */}
          {payload.showForgiveGame && (
            <ForgiveGame
              senderName={payload.senderName}
              receiverName={payload.receiverName}
              language={payload.language}
              isForgiven={isForgiven}
              onForgiven={handleForgivenYes}
              onNoDodged={handleNoDodged}
            />
          )}

          {/* Interactive "Choose My Punishment" Saza Game (if enabled) */}
          {payload.showPunishmentGame && (
            <PunishmentGame
              punishments={payload.punishments || []}
              senderName={payload.senderName}
              receiverName={payload.receiverName}
              language={payload.language}
              onPunishmentChosen={handlePunishmentChosen}
            />
          )}

          {/* Date Invitation / Treat Poll (if enabled) */}
          {payload.showDateInvite && payload.dateOptions.length > 0 && (
            <DateProposalPoll
              dateOptions={payload.dateOptions}
              senderName={payload.senderName}
              receiverName={payload.receiverName}
              language={payload.language}
              onSelectOption={handleSelectDateOption}
              onSendNote={handleSendNote}
            />
          )}

          {/* Romantic / Bestie Redeemable Coupons (if enabled) */}
          {payload.showCoupons && payload.coupons.length > 0 && (
            <CouponsSection
              coupons={payload.coupons}
              language={payload.language}
              onClaimCoupon={handleClaimCoupon}
            />
          )}
        </main>

        <Footer
          senderName={payload.senderName}
          receiverName={payload.receiverName}
          language={payload.language}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onReopenEnvelope={handleReopenEnvelope}
          isAdmin={isAdmin}
          onAdminLogin={() => setIsAdminLoginOpen(true)}
          onAdminLogout={handleAdminLogout}
        />

        {/* Floating Quick Action Bar (Visible ONLY for authenticated Admin) */}
        {isAdmin && (
          <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-medium text-xs sm:text-sm shadow-[0_8px_25px_rgba(147,51,234,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              title="Live Real-time Activity Tracking"
            >
              <Activity className="w-4 h-4 animate-pulse text-emerald-300" />
              <span>Live Activity Report</span>
            </button>

            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-xs sm:text-sm shadow-[0_8px_25px_rgba(244,63,94,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Edit & Share</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Passcode Modal (PIN: 987778899) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Customizer & Content Editor Modal */}
      <CustomizerModal
        payload={payload}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onUpdatePayload={(updated) => setPayload(updated)}
        onTriggerPreview={handleReopenEnvelope}
        onOpenDashboard={() => setIsAdminDashboardOpen(true)}
        adminKey={adminKey}
      />

      {/* Admin Real-Time Tracking & Analytics Dashboard */}
      <AdminDashboardModal
        payload={payload}
        adminKey={adminKey}
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onOpenEditor={() => setIsCustomizerOpen(true)}
      />
    </div>
  );
}
