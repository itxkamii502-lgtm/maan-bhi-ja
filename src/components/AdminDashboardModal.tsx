import React, { useState, useEffect } from 'react';
import { ProposalPayload, ProposalAnalytics, ProposalEvent } from '../types.ts';
import { fetchProposalAnalytics } from '../utils/api.ts';
import { buildPublicShareUrl, buildAdminUrl } from '../utils/urlPayload.ts';
import {
  Activity,
  Eye,
  RefreshCw,
  Heart,
  Mail,
  ShieldAlert,
  Calendar,
  Ticket,
  Clock,
  Sparkles,
  Share2,
  Copy,
  Check,
  MessageCircle,
  X,
  ExternalLink,
  Gavel,
} from 'lucide-react';

interface AdminDashboardModalProps {
  payload: ProposalPayload;
  adminKey: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenEditor: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  payload,
  adminKey,
  isOpen,
  onClose,
  onOpenEditor,
}) => {
  const [analytics, setAnalytics] = useState<ProposalAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);

  const proposalId = payload.id || 'current';

  const loadData = async () => {
    if (!proposalId) return;
    setLoading(true);
    const data = await fetchProposalAnalytics(proposalId, adminKey);
    setAnalytics(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, proposalId, adminKey]);

  // Polling every 5 seconds if modal is open
  useEffect(() => {
    if (!isOpen || !autoRefresh) return;
    const interval = setInterval(() => {
      fetchProposalAnalytics(proposalId, adminKey).then((data) => {
        if (data) setAnalytics(data);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, autoRefresh, proposalId, adminKey]);

  if (!isOpen) return null;

  const publicUrl = buildPublicShareUrl(payload);
  const adminUrl = buildAdminUrl(payload, adminKey);

  const handleCopyPublic = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyAdmin = () => {
    navigator.clipboard.writeText(adminUrl);
    setCopiedAdminLink(true);
    setTimeout(() => setCopiedAdminLink(false), 2500);
  };

  const formatEventDesc = (evt: ProposalEvent) => {
    switch (evt.eventType) {
      case 'page_view':
        return {
          title: 'Opened the Proposal Link',
          desc: `She visited the page for the first time. (${evt.device || 'Mobile'})`,
          color: 'text-sky-400',
          bg: 'bg-sky-500/10 border-sky-500/20',
          icon: <Eye className="w-4 h-4 text-sky-400" />,
        };
      case 'page_refresh':
        return {
          title: 'Refreshed the Page',
          desc: 'She reloaded or revisited the proposal page.',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/20',
          icon: <RefreshCw className="w-4 h-4 text-blue-400" />,
        };
      case 'envelope_opened':
        return {
          title: 'Opened the Envelope 💌',
          desc: 'She tapped the wax seal and opened your letter with romantic music!',
          color: 'text-pink-400',
          bg: 'bg-pink-500/10 border-pink-500/20',
          icon: <Mail className="w-4 h-4 text-pink-400" />,
        };
      case 'no_dodged':
        return {
          title: `Attempted to Click 'No' (Dodged #${evt.data?.dodgeCount || 1})`,
          desc: `She tried to say no, but the button dodged! Message shown: "${evt.data?.pleadMessage || 'Aray please maan jao na 🥺'}"`,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
          icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
        };
      case 'forgiven_yes':
        return {
          title: '🎉 Clicked "YES, I FORGIVE YOU!"',
          desc: 'She forgave you! Confetti celebration and romantic victory was triggered on her screen!',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/15 border-emerald-500/30 ring-1 ring-emerald-500/40',
          icon: <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" />,
        };
      case 'punishment_chosen':
        return {
          title: `⚖️ Saza Imposed: "${evt.data?.title || 'Punishment'}"`,
          desc: `She decreed this punishment for you: "${evt.data?.title || ''}" ${evt.data?.details ? `- ${evt.data.details}` : ''}`,
          color: 'text-amber-400',
          bg: 'bg-amber-500/15 border-amber-500/30 ring-1 ring-amber-500/40',
          icon: <Gavel className="w-4 h-4 text-amber-400" />,
        };
      case 'date_selected':
        return {
          title: `Selected Date Plan: ${evt.data?.title || 'Date'}`,
          desc: `She picked this plan for your makeup meetup: "${evt.data?.title}"`,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/20',
          icon: <Calendar className="w-4 h-4 text-rose-400" />,
        };
      case 'note_submitted':
        return {
          title: 'Sent You a Note / Reply',
          desc: `Her message: "${evt.data?.note || ''}"`,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10 border-purple-500/20',
          icon: <MessageCircle className="w-4 h-4 text-purple-400" />,
        };
      case 'coupon_claimed':
        return {
          title: `Claimed Love Coupon: ${evt.data?.title || 'Coupon'}`,
          desc: `She saved this voucher to her passes: "${evt.data?.title}"`,
          color: 'text-amber-300',
          bg: 'bg-amber-500/10 border-amber-500/20',
          icon: <Ticket className="w-4 h-4 text-amber-300" />,
        };
      default:
        return {
          title: evt.eventType,
          desc: JSON.stringify(evt.data || {}),
          color: 'text-neutral-300',
          bg: 'bg-neutral-800 border-neutral-700',
          icon: <Activity className="w-4 h-4 text-neutral-400" />,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#120c18] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-[#191021]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Live Activity & Analytics Dashboard
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Tracking
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Tracking actions for: <strong className="text-rose-200">{payload.receiverName}</strong> (Sent by {payload.senderName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
              title="Refresh now"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Page Views & Refreshes */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Total Visits
              </span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {analytics?.totalViews || 0}
                </span>
                <span className="text-xs text-neutral-400 ml-1.5">
                  ({analytics?.totalRefreshes || 0} refreshes)
                </span>
              </div>
              <span className="text-[10px] text-sky-400 mt-2 block">
                {analytics?.lastActiveAt ? `Last active: ${new Date(analytics.lastActiveAt).toLocaleTimeString()}` : 'Awaiting open'}
              </span>
            </div>

            {/* Envelope Opened */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Envelope Opened
              </span>
              <div className="mt-2 flex items-center gap-2">
                {analytics?.envelopeOpened ? (
                  <span className="text-base sm:text-lg font-bold text-emerald-300 flex items-center gap-1.5">
                    <Check className="w-5 h-5 text-emerald-400" /> Opened 💌
                  </span>
                ) : (
                  <span className="text-base font-semibold text-neutral-500">
                    Not opened yet
                  </span>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 mt-2 block">
                {analytics?.envelopeOpenedAt ? new Date(analytics.envelopeOpenedAt).toLocaleTimeString() : 'Waiting for her to tap'}
              </span>
            </div>

            {/* No Button Dodges */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                "No" Dodges
              </span>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums">
                  {analytics?.timesNoDodged || 0}
                </span>
                <span className="text-xs text-neutral-400 ml-1">times</span>
              </div>
              <span className="text-[10px] text-amber-400/80 mt-2 block">
                {analytics?.timesNoDodged ? 'Playfully attempted' : 'No attempts yet'}
              </span>
            </div>

            {/* Forgiveness Result */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              analytics?.isForgiven
                ? 'bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/30'
                : 'bg-neutral-900/80 border-neutral-800'
            }`}>
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Forgiven Status
              </span>
              <div className="mt-2">
                {analytics?.isForgiven ? (
                  <span className="text-base sm:text-lg font-bold text-emerald-300 flex items-center gap-1">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                    Forgiven! 🎉
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-neutral-400">
                    ⏳ Decision Pending
                  </span>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 mt-2 block">
                {analytics?.forgivenAt ? new Date(analytics.forgivenAt).toLocaleTimeString() : 'Waiting for answer'}
              </span>
            </div>
          </div>

          {/* Date Choice, Punishment & Custom Note Callout */}
          {(analytics?.chosenPunishment || analytics?.selectedDate || analytics?.customNote) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-pink-950/40 border border-amber-500/30 space-y-3">
              {analytics.chosenPunishment && (
                <div>
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                    Her Decreed Punishment (سزا کا فیصلہ):
                  </span>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-amber-400" />
                    <span>{analytics.chosenPunishment}</span>
                  </p>
                </div>
              )}
              {analytics.selectedDate && (
                <div>
                  <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block mb-1">
                    Her Date / Treat Choice:
                  </span>
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <span>{analytics.selectedDate}</span>
                  </p>
                </div>
              )}
              {analytics.customNote && (
                <p className="text-xs text-neutral-200 italic bg-black/30 p-2.5 rounded-xl border border-white/5">
                  "{analytics.customNote}"
                </p>
              )}
            </div>
          )}

          {/* Links Management Card */}
          <div className="p-5 rounded-2xl bg-[#170e20] border border-rose-500/20 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-1">
                Shareable Links & Access
              </h3>
              <p className="text-xs text-neutral-400">
                Send the <strong>Receiver Link</strong> to her. Save the <strong>Admin Dashboard Link</strong> for yourself to watch her live activity anytime.
              </p>
            </div>

            {/* Public Link for Her */}
            <div>
              <span className="text-[11px] font-semibold text-rose-300 block mb-1">
                1. Link for {payload.receiverName} (Public View):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 bg-black/60 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-200 select-all truncate"
                />
                <button
                  onClick={handleCopyPublic}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Hey ${payload.receiverName}, I made something special for you to say sorry: ${publicUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Private Admin Link */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
                2. Your Private Admin Link (Only for You):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={adminUrl}
                  className="flex-1 bg-black/60 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-400 select-all truncate"
                />
                <button
                  onClick={handleCopyAdmin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  {copiedAdminLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAdminLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Chronological Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-400" />
                Live Chronological Activity Timeline
              </h3>
              <span className="text-xs text-neutral-400">
                {analytics?.events?.length || 0} events recorded
              </span>
            </div>

            {analytics?.events && analytics.events.length > 0 ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {analytics.events.map((evt, idx) => {
                  const item = formatEventDesc(evt);
                  return (
                    <div
                      key={evt.id || idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${item.bg}`}
                    >
                      <div className="mt-0.5">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-bold truncate ${item.color}`}>
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-neutral-400 tabular-nums whitespace-nowrap">
                            {new Date(evt.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-neutral-900/40 border border-dashed border-neutral-800">
                <Eye className="w-8 h-8 text-neutral-600 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-neutral-300">
                  Waiting for {payload.receiverName} to open the link...
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  As soon as she opens the link or clicks anything, live updates will appear here instantly!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-rose-500/20 bg-[#160d1e]">
          <button
            onClick={() => {
              onClose();
              onOpenEditor();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Edit Proposal Content & Items</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
