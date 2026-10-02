import { ProposalPayload, ProposalAnalytics, ProposalEvent } from '../types.ts';

const LOCAL_STORAGE_PREFIX = 'maan_jao_proposal_';
const LOCAL_STORAGE_EVENTS = 'maan_jao_events_';

/**
 * Saves proposal to backend server (or localStorage fallback)
 */
export async function saveProposalToServer(
  payload: ProposalPayload,
  adminKey?: string
): Promise<{ id: string; adminKey: string; proposal: ProposalPayload }> {
  try {
    if (payload.id && adminKey) {
      // Update existing
      const res = await fetch(`/api/proposals/${payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        return {
          id: payload.id,
          adminKey: adminKey,
          proposal: json.proposal || payload,
        };
      }
    } else {
      // Create new
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        // Save admin key locally
        localStorage.setItem(`admin_key_${json.id}`, json.adminKey);
        return {
          id: json.id,
          adminKey: json.adminKey,
          proposal: json.proposal,
        };
      }
    }
  } catch (err) {
    console.warn('Backend unavailable, using client fallback', err);
  }

  // Fallback offline mock generator
  const fallbackId = payload.id || 'p_' + Math.random().toString(36).substring(2, 9);
  const fallbackAdminKey = adminKey || 'adm_' + Math.random().toString(36).substring(2, 9);
  localStorage.setItem(LOCAL_STORAGE_PREFIX + fallbackId, JSON.stringify(payload));
  localStorage.setItem(`admin_key_${fallbackId}`, fallbackAdminKey);

  return {
    id: fallbackId,
    adminKey: fallbackAdminKey,
    proposal: { ...payload, id: fallbackId, adminKey: fallbackAdminKey },
  };
}

/**
 * Fetches proposal by ID
 */
export async function fetchProposalFromServer(id: string): Promise<ProposalPayload | null> {
  try {
    const res = await fetch(`/api/proposals/${id}`);
    if (res.ok) {
      const json = await res.json();
      return json.proposal;
    }
  } catch (err) {
    console.warn('Failed to fetch from backend, checking localStorage', err);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_PREFIX + id);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Records an activity event from receiver
 */
export async function trackProposalEvent(
  proposalId: string,
  eventType: ProposalEvent['eventType'],
  data?: Record<string, any>
): Promise<void> {
  if (!proposalId) return;

  try {
    await fetch(`/api/proposals/${proposalId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, data }),
    });
  } catch (err) {
    // Save to local storage for testing fallback
    const key = LOCAL_STORAGE_EVENTS + proposalId;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      id: 'evt_' + Date.now(),
      proposalId,
      eventType,
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

/**
 * Fetches real-time analytics for creator
 */
export async function fetchProposalAnalytics(
  proposalId: string,
  adminKey: string
): Promise<ProposalAnalytics | null> {
  try {
    const res = await fetch(`/api/proposals/${proposalId}/analytics?adminKey=${encodeURIComponent(adminKey)}`);
    if (res.ok) {
      const json = await res.json();
      return {
        ...json.summary,
        events: json.events || [],
      };
    }
  } catch (err) {
    console.warn('Backend analytics fetch failed, calculating from local fallback', err);
  }

  // Fallback from localStorage
  const key = LOCAL_STORAGE_EVENTS + proposalId;
  const rawEvents: ProposalEvent[] = JSON.parse(localStorage.getItem(key) || '[]');

  let totalViews = 0;
  let totalRefreshes = 0;
  let envelopeOpened = false;
  let envelopeOpenedAt: string | null = null;
  let timesNoDodged = 0;
  let isForgiven = false;
  let forgivenAt: string | null = null;
  let selectedDate: string | null = null;
  let customNote: string | null = null;
  const claimedCoupons: string[] = [];
  let lastActiveAt: string | null = null;

  for (const evt of rawEvents) {
    lastActiveAt = evt.timestamp;
    if (evt.eventType === 'page_view') totalViews++;
    if (evt.eventType === 'page_refresh') totalRefreshes++;
    if (evt.eventType === 'envelope_opened') {
      envelopeOpened = true;
      envelopeOpenedAt = evt.timestamp;
    }
    if (evt.eventType === 'no_dodged') timesNoDodged++;
    if (evt.eventType === 'forgiven_yes') {
      isForgiven = true;
      forgivenAt = evt.timestamp;
    }
    if (evt.eventType === 'date_selected') selectedDate = evt.data?.title || null;
    if (evt.eventType === 'note_submitted') customNote = evt.data?.note || null;
    if (evt.eventType === 'coupon_claimed' && evt.data?.title && !claimedCoupons.includes(evt.data.title)) {
      claimedCoupons.push(evt.data.title);
    }
  }

  return {
    totalViews,
    totalRefreshes,
    envelopeOpened,
    envelopeOpenedAt,
    timesNoDodged,
    isForgiven,
    forgivenAt,
    selectedDate,
    customNote,
    claimedCoupons,
    lastActiveAt,
    events: [...rawEvents].reverse(),
  };
}
