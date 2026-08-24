import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Neon Database Connection
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
  votedBy: string[];
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
        votes: 5,
        votedBy: ['@alex', '@sara', '@marcus', '@elena', '@jordan'],
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
        votes: 4,
        votedBy: ['@sam', '@dave', '@maya', '@lisa'],
        imageUrl: '/pics/brands-people-en-u6xqnbsg-unsplash.jpg',
        tag: 'HOT',
        price: '$$',
      },
    ],
    timeSlots: [
      { id: 't1', time: '7:30 PM', votes: 4, selected: true },
      { id: 't2', time: '8:15 PM', votes: 2, selected: false },
    ],
    messages: [
      {
        id: 'm1',
        pingId: 'friday-vibes',
        sender: '@sara',
        avatar: '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
        text: '7:30 PM slot looks ideal! Let’s meet at Overstory 🍸',
        timestamp: '14:20',
      },
      {
        id: 'm2',
        pingId: 'friday-vibes',
        sender: '🤖 @PingAI',
        avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
        text: '🤖 AI Curator: Overstory Rooftop Lounge has 5 active votes! Sunset starts at 7:42 PM 🌅',
        timestamp: '14:23',
        isAi: true,
      },
    ],
  },
};

function generateAiChatResponse(text: string): { sender: string; avatar: string; text: string; isAi: boolean } {
  const lower = text.toLowerCase();
  if (lower.includes('where') || lower.includes('recommend') || lower.includes('rooftop')) {
    return {
      sender: '🤖 @PingAI',
      avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
      text: '🤖 AI Recommendation: Overstory Rooftop Lounge (4.9★) has 5 active votes! High vibe sunset cocktails starting 7:30 PM.',
      isAi: true,
    };
  }
  if (lower.includes('time') || lower.includes('when')) {
    return {
      sender: '🤖 @PingAI',
      avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
      text: '⏰ AI Consensus Alert: 7:30 PM has 4 squad votes. 85% of your squad is free tonight!',
      isAi: true,
    };
  }
  return {
    sender: '🤖 @PingAI',
    avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
    text: '🤖 Live Ping Alert: Squad consensus is at 80%! Tap "Lock It In" once voting completes.',
    isAi: true,
  };
}

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
        votedBy: ['@you'],
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

app.post('/api/pings/:id/messages', (req, res) => {
  const { sender = '@guest', avatar, text } = req.body;
  const ping = mockPings[req.params.id];
  if (!ping) return res.status(404).json({ error: 'Ping not found' });

  const userMsg: ChatMessage = {
    id: `m-${Date.now()}`,
    pingId: req.params.id,
    sender,
    avatar: avatar || '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  if (!ping.messages) ping.messages = [];
  ping.messages.push(userMsg);

  const aiResp = generateAiChatResponse(text);
  const aiMsg: ChatMessage = {
    id: `m-ai-${Date.now()}`,
    pingId: req.params.id,
    sender: aiResp.sender,
    avatar: aiResp.avatar,
    text: aiResp.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAi: aiResp.isAi,
  };
  ping.messages.push(aiMsg);

  res.status(201).json({ success: true, message: userMsg, aiReply: aiMsg });
});

app.post('/api/pings/:id/vote', (req, res) => {
  const { venueId, userName = '@guest' } = req.body;
  const ping = mockPings[req.params.id];
  if (!ping) return res.status(404).json({ error: 'Ping not found' });
  const venue = ping.venues.find((v) => v.id === venueId);
  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  const hasVoted = venue.votedBy.includes(userName);
  if (hasVoted) {
    venue.votes = Math.max(0, venue.votes - 1);
    venue.votedBy = venue.votedBy.filter((u) => u !== userName);
  } else {
    venue.votes += 1;
    venue.votedBy.push(userName);
  }

  res.json({ success: true, venue, ping });
});

export default app;
