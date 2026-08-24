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

// In-Memory Database Store
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
        sender: '@alex_vibe',
        avatar: '/pics/luthfi-alfarizi-0piYmLeSgTQ-unsplash.jpg',
        text: 'Locked in my vote for Overstory Rooftop! 🔥',
        timestamp: '14:22',
      },
      {
        id: 'm3',
        pingId: 'friday-vibes',
        sender: '🤖 @PingAI',
        avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
        text: 'AI Insight: Overstory Rooftop Lounge is leading with 5 votes! Sunset starts at 7:42 PM 🌅',
        timestamp: '14:23',
        isAi: true,
      },
    ],
  },
};

// Smart Contextual AI Response Generator
function generateAiChatResponse(text: string, pingTitle: string): { sender: string; avatar: string; text: string; isAi: boolean } {
  const lower = text.toLowerCase();

  if (lower.includes('where') || lower.includes('recommend') || lower.includes('rooftop') || lower.includes('spot')) {
    return {
      sender: '🤖 @PingAI',
      avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
      text: '🤖 AI Recommendation: Overstory Rooftop Lounge (4.9★) has 5 active votes! High vibe sunset cocktails & live DJ starting 7:30 PM.',
      isAi: true,
    };
  }

  if (lower.includes('time') || lower.includes('when') || lower.includes('schedule')) {
    return {
      sender: '🤖 @PingAI',
      avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
      text: '⏰ AI Consensus Alert: 7:30 PM has 4 squad votes. 85% of your squad is free between 7:30 PM and 9:30 PM tonight!',
      isAi: true,
    };
  }

  if (lower.includes('drink') || lower.includes('food') || lower.includes('tacos') || lower.includes('bar')) {
    return {
      sender: '@sara',
      avatar: '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
      text: 'I vote we grab mezcal cocktails and birria tacos right after 🍸🌮!',
      isAi: false,
    };
  }

  if (lower.includes('hey') || lower.includes('hi') || lower.includes('hello') || lower.includes('down')) {
    return {
      sender: '@marcus',
      avatar: '/pics/luthfi-alfarizi-0piYmLeSgTQ-unsplash.jpg',
      text: 'Hey! I’m 100% down! Just locked in my vote on the live map 🔥',
      isAi: false,
    };
  }

  // Default lively response
  const peerResponses = [
    { sender: '🤖 @PingAI', avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg', text: '🤖 Live Ping Alert: Squad consensus is at 80%! Tap "Lock It In" once everyone finishes voting.', isAi: true },
    { sender: '@sara', avatar: '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg', text: 'Count me in! See everyone in 30 mins 🚀', isAi: false },
    { sender: '@elena', avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg', text: 'Just shared the 1-click magic link with 3 more friends! 🎉', isAi: false },
  ];

  return peerResponses[Math.floor(Math.random() * peerResponses.length)];
}

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
    messages: [],
  };

  mockPings[id] = newPing;
  io.emit('ping_created', newPing);
  res.status(201).json(newPing);
});

// Post a chat message with Instant AI & Peer Trigger
app.post('/api/pings/:id/messages', (req, res) => {
  const { sender = '@guest', avatar, text } = req.body;
  const ping = mockPings[req.params.id];

  if (!ping) {
    return res.status(404).json({ error: 'Ping not found' });
  }

  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

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

  io.to(req.params.id).emit('chat_message_received', userMsg);

  // Instant AI/Peer Response after 700ms
  setTimeout(() => {
    const aiResponseData = generateAiChatResponse(text, ping.title);
    const aiMsg: ChatMessage = {
      id: `m-ai-${Date.now()}`,
      pingId: req.params.id,
      sender: aiResponseData.sender,
      avatar: aiResponseData.avatar,
      text: aiResponseData.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: aiResponseData.isAi,
    };
    ping.messages.push(aiMsg);
    io.to(req.params.id).emit('chat_message_received', aiMsg);
  }, 750);

  res.status(201).json({ success: true, message: userMsg });
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

  const sortedVenues = [...ping.venues].sort((a, b) => b.votes - a.votes);
  ping.venues.forEach((v) => {
    if (v.id === sortedVenues[0].id && v.votes > 0) {
      v.tag = 'LEADER';
    } else if (v.tag === 'LEADER') {
      v.tag = 'HOT';
    }
  });

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

  io.to(req.params.id).emit('ping_locked', {
    pingId: req.params.id,
    winningVenue,
    lockedAt: new Date().toISOString(),
  });

  res.json({ success: true, ping, winningVenue });
});

// WebSocket Event Handlers
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on('join_room', (pingId: string) => {
    socket.join(pingId);
    console.log(`📌 Socket ${socket.id} joined ping room: ${pingId}`);
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

      // Instant AI/Peer Response via Sockets after 600ms
      setTimeout(() => {
        const aiResponseData = generateAiChatResponse(data.text, ping.title);
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
      }, 650);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 PING Backend API & Real-time WebSockets running on http://localhost:${PORT}`);
});
