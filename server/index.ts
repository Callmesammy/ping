import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Neon Database Connection
const DATABASE_URL = process.env.DATABASE_URL;
let sql: ReturnType<typeof neon> | null = null;

if (DATABASE_URL) {
  try {
    sql = neon(DATABASE_URL);
    console.log('⚡ Neon PostgreSQL Database connected successfully!');
  } catch (err) {
    console.warn('⚠️ Neon database connection error:', err);
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
      {
        id: 'v3',
        pingId: 'friday-vibes',
        name: 'Neon Arcade & Underground Bar',
        category: 'Pinball, Draft Beer & Retro Gaming',
        address: '404 Cyber Lane',
        votes: 4,
        upvotes: 4,
        downvotes: 3,
        votedBy: ['@leo', '@chloe', '@zack', '@marcus', '@sara', '@dave', '@lisa'],
        upvotedBy: ['@leo', '@chloe', '@zack', '@marcus'],
        downvotedBy: ['@sara', '@dave', '@lisa'],
        imageUrl: '/pics/micaela-peduzi-ch4Fc1cGTq4-unsplash.jpg',
        tag: 'VIBES',
        price: '$',
      },
    ],
    timeSlots: [
      { id: 't1', time: '7:30 PM', votes: 4, selected: true },
      { id: 't2', time: '8:15 PM', votes: 2, selected: false },
      { id: 't3', time: '9:00 PM (Late)', votes: 1, selected: false },
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
    ],
  },
};

function generateAiChatResponse(text: string): { sender: string; avatar: string; text: string; isAi: boolean } {
  const lower = text.toLowerCase();
  if (lower.includes('where') || lower.includes('recommend') || lower.includes('rooftop')) {
    return {
      sender: '🤖 @PingAI',
      avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
      text: '🤖 AI Recommendation: Overstory Rooftop Lounge (4.9★) has 8 YES votes! High vibe sunset cocktails starting 7:30 PM.',
      isAi: true,
    };
  }
  return {
    sender: '🤖 @PingAI',
    avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
    text: '🤖 Live Ping Alert: Squad consensus is at 85%! Tap "Lock It In" once voting completes.',
    isAi: true,
  };
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', neonConnected: !!sql, timestamp: new Date().toISOString() });
});

// List all pings
app.get('/api/pings', (req, res) => {
  res.json(Object.values(mockPings));
});

// Get specific ping details
app.get('/api/pings/:id', (req, res) => {
  const ping = mockPings[req.params.id];
  if (!ping) return res.status(404).json({ error: 'Ping not found' });
  res.json(ping);
});

// Create a new ping
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
      {
        id: `v-${Date.now()}-2`,
        pingId: id,
        name: 'Tacos & Mezcal Patio',
        category: 'Street Tacos & Craft Tequila',
        address: '42 Barrio Street',
        votes: 0,
        upvotes: 0,
        downvotes: 0,
        votedBy: [],
        upvotedBy: [],
        downvotedBy: [],
        imageUrl: '/pics/brands-people-en-u6xqnbsg-unsplash.jpg',
        tag: 'HOT',
        price: '$$',
      },
    ],
    timeSlots: [{ id: 't1', time: '7:30 PM', votes: 1, selected: true }],
    messages: [],
  };

  mockPings[id] = newPing;
  io.emit('ping_created', newPing);
  res.status(201).json(newPing);
});

// Vote (YES / NO) for a venue
app.post('/api/pings/:id/vote', (req, res) => {
  const { venueId, userName = '@guest', voteType = 'up' } = req.body;
  const ping = mockPings[req.params.id];

  if (!ping) return res.status(404).json({ error: 'Ping not found' });
  const venue = ping.venues.find((v) => v.id === venueId);
  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  if (!venue.upvotedBy) venue.upvotedBy = [];
  if (!venue.downvotedBy) venue.downvotedBy = [];
  if (!venue.votedBy) venue.votedBy = [];

  const hasUpvoted = venue.upvotedBy.includes(userName);
  const hasDownvoted = venue.downvotedBy.includes(userName);

  if (voteType === 'up') {
    if (hasUpvoted) {
      // Toggle off upvote
      venue.upvotedBy = venue.upvotedBy.filter((u) => u !== userName);
      venue.upvotes = Math.max(0, venue.upvotes - 1);
    } else {
      // Add upvote & remove downvote if present
      if (hasDownvoted) {
        venue.downvotedBy = venue.downvotedBy.filter((u) => u !== userName);
        venue.downvotes = Math.max(0, venue.downvotes - 1);
      }
      venue.upvotedBy.push(userName);
      venue.upvotes += 1;
    }
  } else {
    if (hasDownvoted) {
      // Toggle off downvote
      venue.downvotedBy = venue.downvotedBy.filter((u) => u !== userName);
      venue.downvotes = Math.max(0, venue.downvotes - 1);
    } else {
      // Add downvote & remove upvote if present
      if (hasUpvoted) {
        venue.upvotedBy = venue.upvotedBy.filter((u) => u !== userName);
        venue.upvotes = Math.max(0, venue.upvotes - 1);
      }
      venue.downvotedBy.push(userName);
      venue.downvotes += 1;
    }
  }

  // Combine unique voters
  const allVoters = Array.from(new Set([...venue.upvotedBy, ...venue.downvotedBy]));
  venue.votedBy = allVoters;
  venue.votes = venue.upvotes;

  // Recalculate Leader Tag
  const sortedVenues = [...ping.venues].sort((a, b) => b.upvotes - a.upvotes);
  ping.venues.forEach((v) => {
    if (v.id === sortedVenues[0].id && v.upvotes > 0) {
      v.tag = 'LEADER';
    } else if (v.tag === 'LEADER') {
      v.tag = 'HOT';
    }
  });

  io.to(req.params.id).emit('vote_updated', {
    pingId: req.params.id,
    venueId,
    newVotes: venue.upvotes,
    votedBy: venue.votedBy,
    venues: ping.venues,
  });

  res.json({ success: true, venue, ping });
});

// WebSocket Event Handlers
io.on('connection', (socket) => {
  socket.on('join_room', (pingId: string) => {
    socket.join(pingId);
  });

  socket.on('send_message', (data: { pingId: string; sender: string; avatar: string; text: string }) => {
    const ping = mockPings[data.pingId];
    if (ping) {
      const newMessage: ChatMessage = {
        id: `m-${Date.now()}`,
        pingId: data.pingId,
        sender: data.sender,
        avatar: data.avatar || '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      if (!ping.messages) ping.messages = [];
      ping.messages.push(newMessage);

      io.to(data.pingId).emit('chat_message_received', newMessage);

      setTimeout(() => {
        const aiResponseData = generateAiChatResponse(data.text);
        const aiMsg: ChatMessage = {
          id: `m-ai-${Date.now()}`,
          pingId: data.pingId,
          sender: aiResponseData.sender,
          avatar: aiResponseData.avatar,
          text: aiResponseData.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: aiResponseData.isAi,
        };
        ping.messages.push(aiMsg);
        io.to(data.pingId).emit('chat_message_received', aiMsg);
      }, 500);
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 PING Backend API & Real-time WebSockets running on http://localhost:${PORT}`);
});
