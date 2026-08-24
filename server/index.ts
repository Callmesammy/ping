import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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

// In-Memory Database Store for ultra-fast local state & instant WebSocket sync
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

interface Ping {
  id: string;
  title: string;
  tag: string;
  status: 'VOTING' | 'LOCKED' | 'COMPLETED';
  createdBy: string;
  createdAt: string;
  venues: Venue[];
  timeSlots: { id: string; time: string; votes: number; selected: boolean }[];
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
      {
        id: 'v3',
        pingId: 'friday-vibes',
        name: 'Neon Arcade & Underground Bar',
        category: 'Pinball, Draft Beer & Retro Gaming',
        address: '404 Cyber Lane',
        votes: 3,
        votedBy: ['@leo', '@chloe', '@zack'],
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
  },
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List all pings
app.get('/api/pings', (req, res) => {
  res.json(Object.values(mockPings));
});

// Get specific ping details
app.get('/api/pings/:id', (req, res) => {
  const ping = mockPings[req.params.id];
  if (!ping) {
    return res.status(404).json({ error: 'Ping not found' });
  }
  res.json(ping);
});

// Create a new ping
app.post('/api/pings', (req, res) => {
  const { title, tag } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

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
      {
        id: `v-${Date.now()}-2`,
        pingId: id,
        name: 'Tacos & Mezcal Patio',
        category: 'Street Tacos & Craft Tequila',
        address: '42 Barrio Street',
        votes: 0,
        votedBy: [],
        imageUrl: '/pics/brands-people-en-u6xqnbsg-unsplash.jpg',
        tag: 'HOT',
        price: '$$',
      },
    ],
    timeSlots: [
      { id: 't1', time: '7:30 PM', votes: 1, selected: true },
      { id: 't2', time: '8:30 PM', votes: 0, selected: false },
    ],
  };

  mockPings[id] = newPing;

  // Broadcast new ping created to all connected clients
  io.emit('ping_created', newPing);

  res.status(201).json(newPing);
});

// Vote for a venue
app.post('/api/pings/:id/vote', (req, res) => {
  const { venueId, userName = '@guest' } = req.body;
  const ping = mockPings[req.params.id];

  if (!ping) {
    return res.status(404).json({ error: 'Ping not found' });
  }

  const venue = ping.venues.find((v) => v.id === venueId);
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }

  const hasVoted = venue.votedBy.includes(userName);

  if (hasVoted) {
    venue.votes = Math.max(0, venue.votes - 1);
    venue.votedBy = venue.votedBy.filter((u) => u !== userName);
  } else {
    venue.votes += 1;
    venue.votedBy.push(userName);
  }

  // Update leader tag
  const sortedVenues = [...ping.venues].sort((a, b) => b.votes - a.votes);
  ping.venues.forEach((v) => {
    if (v.id === sortedVenues[0].id && v.votes > 0) {
      v.tag = 'LEADER';
    } else if (v.tag === 'LEADER') {
      v.tag = 'HOT';
    }
  });

  // Broadcast real-time vote update via WebSockets
  io.to(req.params.id).emit('vote_updated', {
    pingId: req.params.id,
    venueId,
    newVotes: venue.votes,
    votedBy: venue.votedBy,
    venues: ping.venues,
  });

  res.json({ success: true, venue, ping });
});

// Lock in a Ping
app.post('/api/pings/:id/lock', (req, res) => {
  const ping = mockPings[req.params.id];
  if (!ping) {
    return res.status(404).json({ error: 'Ping not found' });
  }

  ping.status = 'LOCKED';
  const winningVenue = [...ping.venues].sort((a, b) => b.votes - a.votes)[0];

  // Broadcast lock-in event to all room members
  io.to(req.params.id).emit('ping_locked', {
    pingId: req.params.id,
    winningVenue,
    lockedAt: new Date().toISOString(),
  });

  res.json({ success: true, ping, winningVenue });
});

// WebSocket Server Event Handlers
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on('join_room', (pingId: string) => {
    socket.join(pingId);
    console.log(`📌 Socket ${socket.id} joined ping room: ${pingId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 PING Backend API & Real-time WebSockets running on http://localhost:${PORT}`);
});
