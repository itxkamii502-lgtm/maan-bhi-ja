import React, { useState } from 'react';
import {
  ProposalPayload,
  LanguageMode,
  RelationshipTone,
  MemoryPromise,
  DateOption,
  LoveCoupon,
  PunishmentOption,
  PRESET_BEST_FRIEND_ROMAN,
  PRESET_BEST_FRIEND_URDU,
  PRESET_ROMAN_URDU,
  PRESET_URDU,
  PRESET_ENGLISH,
} from '../types.ts';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Eye,
  Sliders,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Activity,
  Heart,
  Users,
} from 'lucide-react';
import { saveProposalToServer } from '../utils/api.ts';
import { buildPublicShareUrl, generateWhatsAppLink } from '../utils/urlPayload.ts';

interface CustomizerModalProps {
  payload: ProposalPayload;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePayload: (updated: ProposalPayload) => void;
  onTriggerPreview: () => void;
  onOpenDashboard: () => void;
  adminKey: string;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  payload,
  isOpen,
  onClose,
  onUpdatePayload,
  onTriggerPreview,
  onOpenDashboard,
  adminKey,
}) => {
  const [formData, setFormData] = useState<ProposalPayload>(payload);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'letter' | 'items' | 'share'>('basics');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToneChange = (tone: RelationshipTone) => {
    let preset: ProposalPayload;
    if (tone === 'bestie') {
      preset = formData.language === 'ur' ? PRESET_BEST_FRIEND_URDU : PRESET_BEST_FRIEND_ROMAN;
    } else {
      preset = formData.language === 'ur' ? PRESET_URDU : formData.language === 'en' ? PRESET_ENGLISH : PRESET_ROMAN_URDU;
    }

    const updated: ProposalPayload = {
      ...preset,
      relationshipTone: tone,
      senderName: formData.senderName || preset.senderName,
      receiverName: formData.receiverName || (tone === 'bestie' ? 'My Bestie' : 'Meri Jaan'),
      id: formData.id,
      adminKey: formData.adminKey,
    };

    setFormData(updated);
    onUpdatePayload(updated);
  };

  const handleLanguageChange = (lang: LanguageMode) => {
    let preset: ProposalPayload;
    if (formData.relationshipTone === 'bestie') {
      preset = lang === 'ur' ? PRESET_BEST_FRIEND_URDU : PRESET_BEST_FRIEND_ROMAN;
    } else {
      preset = lang === 'ur' ? PRESET_URDU : lang === 'en' ? PRESET_ENGLISH : PRESET_ROMAN_URDU;
    }

    const updated: ProposalPayload = {
      ...preset,
      relationshipTone: formData.relationshipTone,
      language: lang,
      senderName: formData.senderName || preset.senderName,
      receiverName: formData.receiverName || preset.receiverName,
      id: formData.id,
      adminKey: formData.adminKey,
    };

    setFormData(updated);
    onUpdatePayload(updated);
  };

  const handleFieldChange = (field: keyof ProposalPayload, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdatePayload(updated);
  };

  // Add / Remove Promises
  const handleAddPromise = () => {
    const newPromise: MemoryPromise = {
      id: 'p_' + Date.now(),
      title: 'New Sincere Commitment',
      description: 'I promise to always value our bond and respect your feelings.',
      tag: 'Promise',
      emoji: '✨',
    };
    handleFieldChange('promises', [...formData.promises, newPromise]);
  };

  const handleDeletePromise = (index: number) => {
    const updated = formData.promises.filter((_, i) => i !== index);
    handleFieldChange('promises', updated);
  };

  const handleUpdatePromise = (index: number, key: keyof MemoryPromise, value: string) => {
    const updated = [...formData.promises];
    updated[index] = { ...updated[index], [key]: value };
    handleFieldChange('promises', updated);
  };

  // Add / Remove Punishments
  const handleAddPunishment = () => {
    const newPunishment: PunishmentOption = {
      id: 'pun_' + Date.now(),
      title: 'Custom Punishment',
      description: 'Accepted unconditionally without any complaints.',
      icon: '⚖️',
      tag: 'Penalty',
    };
    handleFieldChange('punishments', [...(formData.punishments || []), newPunishment]);
  };

  const handleDeletePunishment = (index: number) => {
    const updated = (formData.punishments || []).filter((_, i) => i !== index);
    handleFieldChange('punishments', updated);
  };

  const handleUpdatePunishment = (index: number, key: keyof PunishmentOption, value: string) => {
    const updated = [...(formData.punishments || [])];
    updated[index] = { ...updated[index], [key]: value };
    handleFieldChange('punishments', updated);
  };

  // Add / Remove Date Options
  const handleAddDateOption = () => {
    const newOption: DateOption = {
      id: 'date_' + Date.now(),
      title: 'Our Custom Hangout',
      description: 'A special time spent together catching up.',
      icon: '✨',
      tag: 'Special',
    };
    handleFieldChange('dateOptions', [...formData.dateOptions, newOption]);
  };

  const handleDeleteDateOption = (index: number) => {
    const updated = formData.dateOptions.filter((_, i) => i !== index);
    handleFieldChange('dateOptions', updated);
  };

  const handleUpdateDateOption = (index: number, key: keyof DateOption, value: string) => {
    const updated = [...formData.dateOptions];
    updated[index] = { ...updated[index], [key]: value };
    handleFieldChange('dateOptions', updated);
  };

  // Add / Remove Coupons
  const handleAddCoupon = () => {
    const newCoupon: LoveCoupon = {
      id: 'c_' + Date.now(),
      title: 'VIP Pass',
      perk: 'Redeemable anytime without conditions.',
      code: 'VIP-PASS-' + Math.floor(Math.random() * 900 + 100),
    };
    handleFieldChange('coupons', [...formData.coupons, newCoupon]);
  };

  const handleDeleteCoupon = (index: number) => {
    const updated = formData.coupons.filter((_, i) => i !== index);
    handleFieldChange('coupons', updated);
  };

  // Save to Server
  const handleSaveProposal = async () => {
    setSaving(true);
    const result = await saveProposalToServer(formData, adminKey);
    const updated = {
      ...formData,
      id: result.id,
      adminKey: result.adminKey,
    };
    setFormData(updated);
    onUpdatePayload(updated);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const publicShareUrl = buildPublicShareUrl(formData);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#140e1b] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-[#1b1223]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Customize Proposal & Admin Link
              </h2>
              <p className="text-xs text-neutral-400">
                Full control to edit, add, or remove any part of your page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 p-2 bg-[#0e0913] border-b border-rose-500/15 overflow-x-auto">
          <button
            onClick={() => setActiveTab('basics')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'basics'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            1. Tone & Names
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'letter'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            2. Apology Letter
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'items'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            3. Promises & Date Items
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'share'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            4. Share & Tracking
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'basics' && (
            <div className="space-y-6">
              {/* Relationship Tone Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Relationship Tone / انداز
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleToneChange('bestie')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      formData.relationshipTone === 'bestie'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50 shadow-md'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    <Users className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">🌟 My Best Friend (بیسٹ فرینڈ)</span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        Deep friendship, fun treats, sincere apology for angry bestie
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToneChange('romantic')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      formData.relationshipTone === 'romantic'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200 ring-1 ring-rose-400/50 shadow-md'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    <Heart className="w-5 h-5 text-rose-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">💖 Romantic (میری جان)</span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        Heartfelt romantic love, date invitation & sweet promises
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Language / زبان کا انتخاب
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('roman')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      formData.language === 'roman'
                        ? 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-sm'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    💖 Roman Urdu
                    <span className="block text-[10px] text-neutral-400 mt-0.5">
                      "Maan jao na please"
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageChange('ur')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      formData.language === 'ur'
                        ? 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-sm'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    🌹 اردو (نستعلیق)
                    <span className="block text-[10px] text-neutral-400 mt-0.5 font-urdu">
                      "دل سے معافی نامہ"
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      formData.language === 'en'
                        ? 'bg-rose-500/25 border-rose-400 text-rose-200 shadow-sm'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    ✨ English
                    <span className="block text-[10px] text-neutral-400 mt-0.5">
                      "Please forgive me"
                    </span>
                  </button>
                </div>
              </div>

              {/* Names input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Your Name (Sender)
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleFieldChange('senderName', e.target.value)}
                    placeholder="e.g. Kamran"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Her Name / Pet Name (Receiver)
                  </label>
                  <input
                    type="text"
                    value={formData.receiverName}
                    onChange={(e) => handleFieldChange('receiverName', e.target.value)}
                    placeholder="e.g. My Bestie / Areeba / Meri Jaan"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              {/* Section Visibility Toggles */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Sections To Show / Hide
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showPromises}
                      onChange={(e) => handleFieldChange('showPromises', e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    <span>Promises Bento</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showForgiveGame}
                      onChange={(e) => handleFieldChange('showForgiveGame', e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    <span>Forgive Me Game</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showPunishmentGame}
                      onChange={(e) => handleFieldChange('showPunishmentGame', e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    <span>Punishment Game ⚖️</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showDateInvite}
                      onChange={(e) => handleFieldChange('showDateInvite', e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    <span>Date / Treat RSVP</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showCoupons}
                      onChange={(e) => handleFieldChange('showCoupons', e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    <span>Love Coupons</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableBackgroundAudio || false}
                      onChange={(e) => handleFieldChange('enableBackgroundAudio', e.target.checked)}
                      className="rounded accent-rose-500"
                    />
                    <span>Audio & Sounds 🎵</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'letter' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                ✍️ <strong>اپنا پیغام خود لکھیں:</strong> آپ ہیڈ لائن، وضاحتی ٹیکسٹ، اور معافی کا خط پورا اپنی مرضی کے مطابق اردو، انگلش یا رومن اردو میں یہاں لکھ اور ایڈٹ کر سکتے ہیں۔
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Page Headline (مین ہیڈ لائن)
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => handleFieldChange('headline', e.target.value)}
                  dir={formData.language === 'ur' ? 'rtl' : 'ltr'}
                  placeholder="e.g. Please Maan Jao Na... 🥺❤️"
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Explanatory Subheadline (وضاحتی ٹیکسٹ)
                </label>
                <input
                  type="text"
                  value={formData.subheadline}
                  onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                  dir={formData.language === 'ur' ? 'rtl' : 'ltr'}
                  placeholder="e.g. A sincere apology from the deepest corner of my heart"
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Full Apology Letter Text (معافی کا مکمل خط)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(formData.language)}
                    className="inline-flex items-center gap-1 text-[11px] text-rose-300 hover:text-rose-200"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset to template
                  </button>
                </div>

                <textarea
                  value={formData.letter}
                  onChange={(e) => handleFieldChange('letter', e.target.value)}
                  rows={10}
                  dir={formData.language === 'ur' ? 'rtl' : 'ltr'}
                  placeholder="یہاں اپنا مکمل خط، معافی یا محبت بھرا پیغام لکھیں..."
                  className={`w-full rounded-xl bg-neutral-900 border border-neutral-700 p-4 text-sm text-neutral-100 leading-relaxed focus:outline-none focus:border-rose-400 ${
                    formData.language === 'ur' ? 'font-urdu text-base leading-loose' : ''
                  }`}
                />
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-8">
              {/* Promises Management */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    Promises & Commitments ({formData.promises.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPromise}
                    className="inline-flex items-center gap-1 text-xs text-rose-300 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Promise
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.promises.map((p, i) => (
                    <div key={p.id || i} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={p.emoji}
                            onChange={(e) => handleUpdatePromise(i, 'emoji', e.target.value)}
                            className="w-10 text-center bg-black border border-neutral-700 rounded-lg p-1 text-sm text-white"
                            title="Emoji"
                          />
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => handleUpdatePromise(i, 'title', e.target.value)}
                            className="flex-1 bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white"
                            placeholder="Title"
                          />
                        </div>
                        <input
                          type="text"
                          value={p.description}
                          onChange={(e) => handleUpdatePromise(i, 'description', e.target.value)}
                          className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-300"
                          placeholder="Description"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePromise(i)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Options Management */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    Date / Treat Proposal Options ({formData.dateOptions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddDateOption}
                    className="inline-flex items-center gap-1 text-xs text-rose-300 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Date Option
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.dateOptions.map((opt, i) => (
                    <div key={opt.id || i} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.icon}
                            onChange={(e) => handleUpdateDateOption(i, 'icon', e.target.value)}
                            className="w-10 text-center bg-black border border-neutral-700 rounded-lg p-1 text-sm text-white"
                            title="Icon"
                          />
                          <input
                            type="text"
                            value={opt.title}
                            onChange={(e) => handleUpdateDateOption(i, 'title', e.target.value)}
                            className="flex-1 bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white"
                            placeholder="Title"
                          />
                        </div>
                        <input
                          type="text"
                          value={opt.description}
                          onChange={(e) => handleUpdateDateOption(i, 'description', e.target.value)}
                          className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-300"
                          placeholder="Description"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDateOption(i)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Punishments Management */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Punishments / سزائیں ({formData.punishments?.length || 0})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPunishment}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Saza / Punishment
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.punishments || []).map((pun, i) => (
                    <div key={pun.id || i} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pun.icon}
                            onChange={(e) => handleUpdatePunishment(i, 'icon', e.target.value)}
                            className="w-10 text-center bg-black border border-neutral-700 rounded-lg p-1 text-sm text-white"
                            title="Icon"
                          />
                          <input
                            type="text"
                            value={pun.title}
                            onChange={(e) => handleUpdatePunishment(i, 'title', e.target.value)}
                            className="flex-1 bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white"
                            placeholder="Title"
                          />
                        </div>
                        <input
                          type="text"
                          value={pun.description}
                          onChange={(e) => handleUpdatePunishment(i, 'description', e.target.value)}
                          className="w-full bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-300"
                          placeholder="Description"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePunishment(i)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6">
              {/* Save & Sync Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-pink-950/40 border border-rose-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Save Changes to Cloud</h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Syncs all edits and links live activity tracking to your unique proposal ID.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProposal}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md whitespace-nowrap cursor-pointer"
                >
                  {saving ? 'Saving...' : savedSuccess ? '✓ Saved!' : 'Save & Sync'}
                </button>
              </div>

              {/* Public Shareable Link for Receiver */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
                    Public Universal Link For {formData.receiverName}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                    ✓ No Google Login Needed
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  یہ پبلک لنک ہے جو دنیا کے کسی بھی براؤزر، موبائل فون، واٹس ایپ یا وی پی ایس پر بغیر کسی گوگل اکاؤنٹ یا لاگ ان کے کھل جائے گا۔
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicShareUrl}
                    className="flex-1 bg-black/60 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-300 select-all truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      formData.relationshipTone === 'bestie'
                        ? `Hey ${formData.receiverName}, I made this for you because best friends don't stay angry... Please check it out: ${publicShareUrl}`
                        : `Meri pyari ${formData.receiverName}, please ek baar ye open kar ke dekhein: ${publicShareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Live Tracking Access Button */}
              <div className="p-4 rounded-2xl bg-[#191122] border border-purple-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-purple-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Live Interaction Analytics
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    View every button press, dodge count, page refresh, and selected date plan in real-time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDashboard();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md whitespace-nowrap cursor-pointer"
                >
                  Open Live Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-rose-500/20 bg-[#170f20]">
          <button
            type="button"
            onClick={handleSaveProposal}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved successfully!' : 'Save changes'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onTriggerPreview();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
