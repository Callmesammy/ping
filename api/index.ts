import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;
let sql: ReturnType<typeof neon> | null = null;

if (DATABASE_URL) {
  try {
    sql = neon(DATABASE_URL);
  } catch (err) {
    console.warn('Neon connection fallback:', err);
  }
}

interface Venue {
  id: string;
  pingId: string;
  name: string;
  category: string;
  address: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  upvotedBy: string[];
  downvotedBy: string[];
  imageUrl: string;
  tag: string;
  price: string;
}

interface ChatMessage {
  id: string;
  pingId: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
}

interface Ping {
  id: string;
  title: string;
  tag: string;
  status: 'VOTING' | 'LOCKED' | 'COMPLETED';
  createdBy: string;
  createdAt: string;
  venues: Venue[];
  timeSlots: { id: string; time: string; votes: number; selected: boolean }[];
  messages: ChatMessage[];
}

const mockPings: Record<string, Ping> = {
  'friday-vibes': {
    id: 'friday-vibes',
    title: 'FRIDAY NIGHT VIBE CHECK 🍸',
    tag: '🍹 Drinks & Sunset',
    status: 'VOTING',
    createdBy: '@alex',
    createdAt: new Date().toISOString(),
    venues: [
      {
        id: 'v1',
        pingId: 'friday-vibes',
        name: 'Overstory Rooftop Lounge',
        category: 'Cocktails & Sunset Views',
        address: '152 Pine Street, Downtown',
        votes: 8,
        upvotes: 8,
        downvotes: 1,
        votedBy: ['@alex_vibe', '@sara', '@marcus', '@elena', '@jordan', '@sam', '@dave', '@maya', '@lisa'],
        upvotedBy: ['@alex_vibe', '@sara', '@marcus', '@elena', '@jordan', '@sam', '@dave', '@maya'],
        downvotedBy: ['@lisa'],
        imageUrl: '/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg',
        tag: 'LEADER',
        price: '$$$',
      },
      {
        id: 'v2',
        pingId: 'friday-vibes',
        name: 'Tacos & Mezcal Social',
        category: 'Late Night Tacos & Birria',
        address: '88 Mercado Way',
        votes: 6,
        upvotes: 6,
        downvotes: 2,
        votedBy: ['@sam', '@dave', '@maya', '@lisa', '@chloe', '@zack', '@leo', '@elena'],
        upvotedBy: ['@sam', '@dave', '@maya', '@lisa', '@chloe', '@zack'],
        downvotedBy: ['@leo', '@elena'],
        imageUrl: '/pics/brands-people-en-u6xqnbsg-unsplash.jpg',
        tag: 'HOT',
        price: '$$',
      },
    ],
    timeSlots: [
      { id: 't1', time: '7:30 PM', votes: 4, selected: true },
      { id: 't2', time: '8:15 PM', votes: 2, selected: false },
    ],
    messages: [],
  },
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', neonConnected: !!sql, timestamp: new Date().toISOString() });
});

app.get('/api/pings', (req, res) => {
  res.json(Object.values(mockPings));
});

app.get('/api/pings/:id', (req, res) => {
  const ping = mockPings[req.params.id];
  if (!ping) return res.status(404).json({ error: 'Ping not found' });
  res.json(ping);
});

app.post('/api/pings', (req, res) => {
  const { title, tag } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `ping-${Date.now()}`;
  const newPing: Ping = {
    id,
    title: title.toUpperCase(),
    tag: tag || '🔥 Social Vibe',
    status: 'VOTING',
    createdBy: '@you',
    createdAt: new Date().toISOString(),
    venues: [
      {
        id: `v-${Date.now()}-1`,
        pingId: id,
        name: 'Rooftop Sunset Lounge',
        category: 'Craft Cocktails & DJ',
        address: '100 Sky High Boulevard',
        votes: 1,
        upvotes: 1,
        downvotes: 0,
        votedBy: ['@you'],
        upvotedBy: ['@you'],
        downvotedBy: [],
        imageUrl: '/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg',
        tag: 'NEW',
        price: '$$$',
      },
    ],
    timeSlots: [{ id: 't1', time: '7:30 PM', votes: 1, selected: true }],
    messages: [],
  };
  mockPings[id] = newPing;
  res.status(201).json(newPing);
});

app.post('/api/pings/:id/vote', (req, res) => {
  const { venueId, userName = '@guest', voteType = 'up' } = req.body;
  const ping = mockPings[req.params.id];
  if (!ping) return res.status(404).json({ error: 'Ping not found' });
  const venue = ping.venues.find((v) => v.id === venueId);
  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  if (!venue.upvotedBy) venue.upvotedBy = [];
  if (!venue.downvotedBy) venue.downvotedBy = [];

  const hasUpvoted = venue.upvotedBy.includes(userName);
  const hasDownvoted = venue.downvotedBy.includes(userName);

  if (voteType === 'up') {
    if (hasUpvoted) {
      venue.upvotedBy = venue.upvotedBy.filter((u) => u !== userName);
      venue.upvotes = Math.max(0, venue.upvotes - 1);
    } else {
      if (hasDownvoted) {
        venue.downvotedBy = venue.downvotedBy.filter((u) => u !== userName);
        venue.downvotes = Math.max(0, venue.downvotes - 1);
      }
      venue.upvotedBy.push(userName);
      venue.upvotes += 1;
    }
  } else {
    if (hasDownvoted) {
      venue.downvotedBy = venue.downvotedBy.filter((u) => u !== userName);
      venue.downvotes = Math.max(0, venue.downvotes - 1);
    } else {
      if (hasUpvoted) {
        venue.upvotedBy = venue.upvotedBy.filter((u) => u !== userName);
        venue.upvotes = Math.max(0, venue.upvotes - 1);
      }
      venue.downvotedBy.push(userName);
      venue.downvotes += 1;
    }
  }

  venue.votedBy = Array.from(new Set([...venue.upvotedBy, ...venue.downvotedBy]));
  venue.votes = venue.upvotes;

  res.json({ success: true, venue, ping });
});

export default app;
