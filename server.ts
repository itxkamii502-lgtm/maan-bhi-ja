import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Enable CORS for public cross-device access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-admin-key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve public static folder for images and assets
const PUBLIC_DIR = path.resolve(__dirname, 'public');
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
}

// Ensure data directory exists
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const STORE_FILE = path.join(DATA_DIR, 'proposals_store.json');

interface StoredData {
  proposals: Record<string, any>;
  events: Record<string, any[]>;
}

function readStore(): StoredData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading store file', err);
  }
  return { proposals: {}, events: {} };
}

function writeStore(data: StoredData) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file', err);
  }
}

// Generate random short ID
function generateId(prefix: string = 'p'): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${result}`;
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create new proposal
app.post('/api/proposals', (req, res) => {
  const store = readStore();
  const proposalId = generateId('p');
  const adminKey = generateId('adm');

  const proposal = {
    ...req.body,
    id: proposalId,
    adminKey: adminKey,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.proposals[proposalId] = proposal;
  store.events[proposalId] = [];
  writeStore(store);

  // Return proposal with adminKey so creator can access dashboard
  res.json({ success: true, proposal, id: proposalId, adminKey });
});

// Get proposal by ID (public receiver view)
app.get('/api/proposals/:id', (req, res) => {
  const { id } = req.params;
  const store = readStore();
  const proposal = store.proposals[id];

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' });
  }

  // Strip adminKey when sending to public receiver
  const { adminKey, ...safeProposal } = proposal;
  res.json({ success: true, proposal: safeProposal });
});

// Update proposal (requires adminKey)
app.put('/api/proposals/:id', (req, res) => {
  const { id } = req.params;
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey || req.body.adminKey;
  const store = readStore();
  const existing = store.proposals[id];

  if (!existing) {
    return res.status(404).json({ error: 'Proposal not found' });
  }

  if (existing.adminKey && existing.adminKey !== adminKey) {
    return res.status(403).json({ error: 'Unauthorized: Invalid admin key' });
  }

  const updated = {
    ...existing,
    ...req.body,
    id: id,
    adminKey: existing.adminKey,
    updatedAt: new Date().toISOString(),
  };

  store.proposals[id] = updated;
  writeStore(store);

  res.json({ success: true, proposal: updated });
});

// Log visitor interaction event
app.post('/api/proposals/:id/events', (req, res) => {
  const { id } = req.params;
  const { eventType, data } = req.body;
  const store = readStore();

  if (!store.events[id]) {
    store.events[id] = [];
  }

  const newEvent = {
    id: generateId('evt'),
    proposalId: id,
    eventType,
    data: data || {},
    timestamp: new Date().toISOString(),
    device: req.headers['user-agent'] ? 'Mobile/Desktop Web' : 'Unknown',
  };

  store.events[id].push(newEvent);

  // Cap events to last 200 per proposal to keep JSON lean
  if (store.events[id].length > 200) {
    store.events[id] = store.events[id].slice(-200);
  }

  writeStore(store);

  res.json({ success: true, eventId: newEvent.id });
});

// Get real-time analytics & activity report (for admin)
app.get('/api/proposals/:id/analytics', (req, res) => {
  const { id } = req.params;
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  const store = readStore();
  const proposal = store.proposals[id];

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' });
  }

  if (proposal.adminKey && proposal.adminKey !== adminKey) {
    return res.status(403).json({ error: 'Unauthorized: Invalid admin key' });
  }

  const rawEvents = store.events[id] || [];

  // Compute aggregate statistics
  let totalViews = 0;
  let totalRefreshes = 0;
  let envelopeOpened = false;
  let envelopeOpenedAt: string | null = null;
  let timesNoDodged = 0;
  let isForgiven = false;
  let forgivenAt: string | null = null;
  let chosenPunishment: string | null = null;
  let selectedDate: string | null = null;
  let customNote: string | null = null;
  const claimedCoupons: string[] = [];
  let lastActiveAt: string | null = null;

  for (const evt of rawEvents) {
    lastActiveAt = evt.timestamp;

    if (evt.eventType === 'page_view') {
      totalViews++;
    } else if (evt.eventType === 'page_refresh') {
      totalRefreshes++;
    } else if (evt.eventType === 'envelope_opened') {
      envelopeOpened = true;
      envelopeOpenedAt = evt.timestamp;
    } else if (evt.eventType === 'no_dodged') {
      timesNoDodged++;
    } else if (evt.eventType === 'forgiven_yes') {
      isForgiven = true;
      forgivenAt = evt.timestamp;
    } else if (evt.eventType === 'punishment_chosen') {
      chosenPunishment = evt.data?.title || null;
    } else if (evt.eventType === 'date_selected') {
      selectedDate = evt.data?.title || evt.data?.id || null;
    } else if (evt.eventType === 'note_submitted') {
      customNote = evt.data?.note || null;
    } else if (evt.eventType === 'coupon_claimed') {
      if (evt.data?.title && !claimedCoupons.includes(evt.data.title)) {
        claimedCoupons.push(evt.data.title);
      }
    }
  }

  // Return chronological sorted events (latest first)
  const reversedEvents = [...rawEvents].reverse();

  res.json({
    success: true,
    proposalId: id,
    summary: {
      totalViews,
      totalRefreshes,
      envelopeOpened,
      envelopeOpenedAt,
      timesNoDodged,
      isForgiven,
      forgivenAt,
      chosenPunishment,
      selectedDate,
      customNote,
      claimedCoupons,
      lastActiveAt,
    },
    events: reversedEvents,
  });
});

// ---------------- VITE MIDDLEWARE / STATIC FILES ----------------

async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProd && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
