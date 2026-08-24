import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { MapPin, ThumbsUp, ThumbsDown, Clock, Users, Share2, Flame, Lock, Radio, Trophy, Check, MessageSquare, PartyPopper, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { socket } from '../lib/socket';
import { fetchPing, voteVenueApi, lockPingApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { InviteModal } from './InviteModal';
import { InteractiveMap } from './InteractiveMap';

gsap.registerPlugin(ScrollTrigger);

interface VenueOption {
  id: string;
  name: string;
  category: string;
  address: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  upvotedBy: string[];
  downvotedBy: string[];
  image: string;
  tag: string;
  price: string;
}

const INITIAL_VENUES: VenueOption[] = [
  {
    id: 'v1',
    name: 'Overstory Rooftop Lounge',
    category: 'Cocktails & Sunset Views',
    address: '152 Pine Street, Downtown',
    votes: 8,
    upvotes: 8,
    downvotes: 1,
    votedBy: ['@alex_vibe', '@sara', '@marcus', '@elena', '@jordan', '@sam', '@dave', '@maya', '@lisa'],
    upvotedBy: ['@alex_vibe', '@sara', '@marcus', '@elena', '@jordan', '@sam', '@dave', '@maya'],
    downvotedBy: ['@lisa'],
    image: '/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg',
    tag: '#1 LEADER',
    price: '$$$',
  },
  {
    id: 'v2',
    name: 'Tacos & Mezcal Social',
    category: 'Late Night Tacos & Birria',
    address: '88 Mercado Way',
    votes: 6,
    upvotes: 6,
    downvotes: 2,
    votedBy: ['@sam', '@dave', '@maya', '@lisa', '@chloe', '@zack', '@leo', '@elena'],
    upvotedBy: ['@sam', '@dave', '@maya', '@lisa', '@chloe', '@zack'],
    downvotedBy: ['@leo', '@elena'],
    image: '/pics/brands-people-en-u6xqnbsg-unsplash.jpg',
    tag: 'RISING',
    price: '$$',
  },
  {
    id: 'v3',
    name: 'Neon Arcade & Underground Bar',
    category: 'Pinball, Draft Beer & Retro Gaming',
    address: '404 Cyber Lane',
    votes: 4,
    upvotes: 4,
    downvotes: 3,
    votedBy: ['@leo', '@chloe', '@zack', '@marcus', '@sara', '@dave', '@lisa'],
    upvotedBy: ['@leo', '@chloe', '@zack', '@marcus'],
    downvotedBy: ['@sara', '@dave', '@lisa'],
    image: '/pics/micaela-peduzi-ch4Fc1cGTq4-unsplash.jpg',
    tag: 'VIBES',
    price: '$',
  },
  {
    id: 'v4',
    name: 'Speakeasy Jazz & Bourbon',
    category: 'Live Music & Vintage Spirits',
    address: '12 Velvet Alley',
    votes: 2,
    upvotes: 2,
    downvotes: 1,
    votedBy: ['@nora', '@ben'],
    upvotedBy: ['@nora', '@ben'],
    downvotedBy: [],
    image: '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
    tag: 'QUEUED',
    price: '$$$',
  },
  {
    id: 'v5',
    name: 'Craft Beer & Woodfired Pizza',
    category: 'IPAs, Sourdough Crust & Garden',
    address: '77 Brewery Row',
    votes: 1,
    upvotes: 1,
    downvotes: 0,
    votedBy: ['@kai'],
    upvotedBy: ['@kai'],
    downvotedBy: [],
    image: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
    tag: 'QUEUED',
    price: '$$',
  },
];

const TIME_SLOTS = [
  { id: 't1', time: '7:30 PM', votes: 6, isSelected: true },
  { id: 't2', time: '8:15 PM', votes: 2, isSelected: false },
  { id: 't3', time: '9:00 PM (Late)', votes: 1, isSelected: false },
];

const MAX_DAILY_VOTES = 5;
const ROOM_DURATION_SECONDS = 1200; // 20 Minutes

interface VotingRoomProps {
  currentPingTitle?: string;
  currentPingId?: string;
}

export const VotingRoom: React.FC<VotingRoomProps> = ({
  currentPingTitle = 'FRIDAY NIGHT VIBE CHECK 🍸',
  currentPingId = 'friday-vibes',
}) => {
  const { userName } = useAuth();
  const [venues, setVenues] = useState<VenueOption[]>(INITIAL_VENUES);
  const [userUpvotedIds, setUserUpvotedIds] = useState<string[]>(['v1']);
  const [userDownvotedIds, setUserDownvotedIds] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('t1');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // 20-Min Countdown Timer State
  const [timeLeft, setTimeLeft] = useState(ROOM_DURATION_SECONDS);
  const [isExpired, setIsExpired] = useState(false);

  // Daily Votes Counter State (Max 5 per day)
  const [usedDailyVotes, setUsedDailyVotes] = useState(1);
  const [showQueuePool, setShowQueuePool] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 20-Min Live Ticking Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      setIsLocked(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          setIsLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Load Daily Vote Counter for active user handle
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `ping_daily_votes_${userName}_${todayStr}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setUsedDailyVotes(parseInt(stored, 10));
    } else {
      setUsedDailyVotes(1); // 1 initial vote cast
    }
  }, [userName]);

  // Fetch initial ping data & setup WebSockets
  useEffect(() => {
    socket.emit('join_room', currentPingId);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onVoteUpdated = (data: any) => {
      if (data.pingId === currentPingId && data.venues) {
        setVenues(
          data.venues.slice(0, 5).map((v: any) => ({
            id: v.id,
            name: v.name,
            category: v.category,
            address: v.address,
            votes: v.upvotes ?? v.votes ?? 0,
            upvotes: v.upvotes ?? v.votes ?? 0,
            downvotes: v.downvotes ?? 0,
            votedBy: v.votedBy || [],
            upvotedBy: v.upvotedBy || v.votedBy || [],
            downvotedBy: v.downvotedBy || [],
            image: v.imageUrl || v.image,
            tag: v.tag,
            price: v.price,
          }))
        );
      }
    };

    const onPingLocked = () => {
      setIsLocked(true);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('vote_updated', onVoteUpdated);
    socket.on('ping_locked', onPingLocked);

    fetchPing(currentPingId).then((data) => {
      if (data && data.venues) {
        setVenues(
          data.venues.slice(0, 5).map((v: any) => ({
            id: v.id,
            name: v.name,
            category: v.category,
            address: v.address,
            votes: v.upvotes ?? v.votes ?? 0,
            upvotes: v.upvotes ?? v.votes ?? 0,
            downvotes: v.downvotes ?? 0,
            votedBy: v.votedBy || [],
            upvotedBy: v.upvotedBy || v.votedBy || [],
            downvotedBy: v.downvotedBy || [],
            image: v.imageUrl || v.image,
            tag: v.tag,
            price: v.price,
          }))
        );
        if (data.status === 'LOCKED') setIsLocked(true);
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('vote_updated', onVoteUpdated);
      socket.off('ping_locked', onPingLocked);
    };
  }, [currentPingId]);

  const handleVote = async (venueId: string, type: 'up' | 'down') => {
    if (isLocked || isExpired) return;

    // Check Max 5 Daily Votes Cap
    if (usedDailyVotes >= MAX_DAILY_VOTES) {
      setToastMessage('⚠️ Daily limit reached! You have used all 5 votes for today.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    // Once voted, vote is locked in permanently
    const alreadyUp = userUpvotedIds.includes(venueId);
    const alreadyDown = userDownvotedIds.includes(venueId);
    if (alreadyUp || alreadyDown) return;

    // Increment Daily Votes
    const newCount = usedDailyVotes + 1;
    setUsedDailyVotes(newCount);
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`ping_daily_votes_${userName}_${todayStr}`, newCount.toString());

    // Trigger Congratulatory Confetti Blast
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#C84B31', '#FFD600', '#2D5D4B', '#F9F1F0', '#4A154B'],
    });

    const msg = type === 'up' ? `🎉 YES VOTE LOCKED IN! (${MAX_DAILY_VOTES - newCount} votes left today)` : `🔒 NO VOTE LOCKED IN! (${MAX_DAILY_VOTES - newCount} votes left today)`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);

    if (type === 'up') {
      setUserUpvotedIds((prev) => [...prev, venueId]);
      setVenues((prev) =>
        prev.map((v) =>
          v.id === venueId
            ? {
                ...v,
                upvotes: v.upvotes + 1,
                votedBy: Array.from(new Set([...(v.votedBy || []), userName])),
              }
            : v
        )
      );
    } else {
      setUserDownvotedIds((prev) => [...prev, venueId]);
      setVenues((prev) =>
        prev.map((v) =>
          v.id === venueId
            ? {
                ...v,
                downvotes: v.downvotes + 1,
                votedBy: Array.from(new Set([...(v.votedBy || []), userName])),
              }
            : v
        )
      );
    }

    await voteVenueApi(currentPingId, venueId, userName, type);
  };

  const handleLockIn = async () => {
    setIsLocked(true);
    await lockPingApi(currentPingId);
  };

  // Format 20-Min Timer Minutes & Seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const maxFiveVenues = venues.slice(0, 5);
  const sortedVenues = [...maxFiveVenues].sort((a, b) => (b.upvotes ?? b.votes) - (a.upvotes ?? a.votes));
  
  // Top 3 Visible Cards vs Queued Pool (#4 & #5)
  const topThreeVenues = sortedVenues.slice(0, 3);
  const queuedVenues = sortedVenues.slice(3, 5);
  const topVenue = sortedVenues[0] || venues[0];

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="py-24 px-4 sm:px-8 bg-[#2D5D4B] text-[#F9F1F0] transition-colors duration-700 select-none overflow-hidden relative"
    >
      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[99999] px-6 py-4 bg-[#FFD600] text-[#1E2A27] font-foudre font-black text-xl rounded-full shadow-2xl border-4 border-white flex items-center gap-3 uppercase tracking-wide"
          >
            <PartyPopper className="w-6 h-6 text-[#C84B31] animate-bounce" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1550px] mx-auto space-y-10">
        
        {/* Top Arena Header: Crimson Card */}
        <div className="bg-[#C84B31] text-white p-8 sm:p-12 rounded-[40px] shadow-2xl border-4 border-white/20 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FFD600]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-3xl z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-[#FFD600] text-[#1E2A27] font-foudre font-black text-sm uppercase tracking-wider rounded-full shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C84B31] animate-ping" />
                LIVE SQUAD VOTING ARENA
              </span>

              {/* Daily 5 Votes Cap Badge */}
              <span className="px-3.5 py-1.5 bg-black/30 text-[#FFD600] font-sans font-black text-xs rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                🎟️ Daily Votes: {Math.max(0, MAX_DAILY_VOTES - usedDailyVotes)} / {MAX_DAILY_VOTES} Left
              </span>

              <span className="px-3.5 py-1.5 bg-white/10 text-white font-sans font-bold text-xs rounded-full border border-white/20 flex items-center gap-2">
                <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-[#FFD600]' : 'text-white/60'}`} />
                {isConnected ? 'Real-Time Sync Active' : 'Offline Mode'}
              </span>
            </div>

            <h2 className="font-foudre font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.88]">
              {currentPingTitle}
            </h2>

            <p className="text-sm sm:text-base font-sans text-white/90 font-medium leading-relaxed">
              Drop votes on top venues. Max 5 votes/day per person. Voting as <span className="text-[#FFD600] font-black underline">{userName}</span>.
            </p>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0 z-10">
            <motion.button
              onClick={() => setIsInviteOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="px-8 py-4 bg-[#2D5D4B] text-white font-sans font-extrabold text-xs sm:text-sm rounded-full shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider border-2 border-white/40 hover:bg-[#2D5D4B]/90 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Invite Squad</span>
            </motion.button>

            {!isLocked && !isExpired && (
              <motion.button
                onClick={handleLockIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="px-8 py-4 bg-[#FFD600] text-[#1E2A27] font-sans font-extrabold text-xs sm:text-sm rounded-full shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider border-2 border-white/40 hover:bg-[#FFD600]/90 transition-colors"
              >
                <Lock className="w-4 h-4 stroke-[3]" />
                <span>Lock In Winning Spot</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* 20-Min Expiry Timer & Leaderboard Banner */}
        <div className="bg-[#1E2A27] text-white p-6 sm:p-8 rounded-[36px] border-4 border-[#FFD600]/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD600] text-[#1E2A27] flex items-center justify-center shadow-xl border-2 border-white shrink-0">
              <Trophy className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-sans font-bold text-[#FFD600] uppercase tracking-widest block">
                {isExpired ? '⌛ 20-MIN ARENA EXPIRED & ARCHIVED' : isLocked ? '🏆 OFFICIAL WINNING VENUE' : '🔥 CURRENT #1 LEADERBOARD SPOT'}
              </span>
              <h3 className="font-foudre font-black text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none mt-1">
                {topVenue.name}
              </h3>
              <p className="text-xs font-sans text-white/70 font-semibold mt-1">
                {topVenue.upvotes} YES votes • {topVenue.votedBy.length} total squad members voted
              </p>
            </div>
          </div>

          {/* Live 20-Min Countdown Clock */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 text-sm font-sans font-black uppercase tracking-wider shrink-0 ${
            isExpired ? 'bg-[#C84B31] text-white border-white' : 'bg-white/10 text-white border-white/20'
          }`}>
            <Clock className="w-5 h-5 text-[#FFD600] animate-spin" style={{ animationDuration: '4s' }} />
            <span>{isExpired ? 'Room Expired' : `Room Expires in ${formattedTime}`}</span>
          </div>
        </div>

        {/* Main Grid: Venue Battle Cards & Time Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Top 3 Active Cards + Queued Pool */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-foudre font-black text-3xl sm:text-4xl uppercase text-white tracking-tight">
                TOP VENUES ({topThreeVenues.length} ACTIVE)
              </h3>
              <span className="text-xs font-sans font-bold text-[#FFD600] uppercase tracking-wider">
                Max 5 Total • Max 3 Active Panel
              </span>
            </div>

            {/* Top 3 Active Cards */}
            <div className="space-y-6">
              {topThreeVenues.map((venue, idx) => {
                const isUpvoted = userUpvotedIds.includes(venue.id);
                const isDownvoted = userDownvotedIds.includes(venue.id);
                const isAlreadyVoted = isUpvoted || isDownvoted;
                const totalVoters = venue.votedBy ? venue.votedBy.length : (venue.upvotes + venue.downvotes);
                const yesPercentage = totalVoters > 0 ? Math.round((venue.upvotes / Math.max(1, totalVoters)) * 100) : 100;

                return (
                  <motion.div
                    key={venue.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className={`bg-[#F9F1F0] text-[#2D5D4B] p-6 sm:p-8 rounded-[36px] border-4 transition-all relative overflow-hidden shadow-2xl ${
                      idx === 0
                        ? 'border-[#FFD600] ring-4 ring-[#FFD600]/30'
                        : isUpvoted
                        ? 'border-[#C84B31]'
                        : isDownvoted
                        ? 'border-[#4A154B]'
                        : 'border-white/40'
                    }`}
                  >
                    {/* Top Leader Ribbon */}
                    {idx === 0 && (
                      <div className="absolute top-0 right-0 bg-[#FFD600] text-[#1E2A27] font-foudre font-black text-xs uppercase px-6 py-1.5 rounded-bl-2xl shadow-md border-b border-l border-white/40 tracking-wider">
                        👑 #1 LEADER
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      
                      {/* Venue Image */}
                      <div className="relative w-full sm:w-52 h-44 rounded-[28px] overflow-hidden shrink-0 border-2 border-black/10 shadow-lg">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-[#1E2A27] text-white font-mono font-bold text-xs rounded-full uppercase shadow-md">
                          {venue.price}
                        </span>
                      </div>

                      {/* Venue Details */}
                      <div className="flex-1 w-full space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-sans font-extrabold text-[#C84B31] uppercase tracking-wider">
                              {venue.category}
                            </span>
                            <span className="px-3 py-1 bg-[#2D5D4B] text-white text-[10px] font-sans font-black rounded-full uppercase tracking-wider">
                              {venue.tag}
                            </span>
                          </div>

                          <h4 className="font-foudre font-black text-3xl sm:text-4xl text-[#2D5D4B] uppercase tracking-tight leading-[0.9]">
                            {venue.name}
                          </h4>
                          <p className="text-xs font-sans font-semibold text-[#2D5D4B]/80 flex items-center gap-1.5 mt-2">
                            <MapPin className="w-4 h-4 text-[#C84B31]" /> {venue.address}
                          </p>
                        </div>

                        {/* Progress Bar & Squad Voters */}
                        <div className="space-y-2 pt-2 border-t border-black/10">
                          <div className="flex items-center justify-between text-xs font-sans font-extrabold">
                            <span className="text-[#2D5D4B] flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-[#C84B31]" />
                              <span>{totalVoters} squad members voted</span>
                            </span>
                            <span className="text-[#C84B31] font-mono">{yesPercentage}% YES</span>
                          </div>

                          <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden p-0.5">
                            <div
                              className="h-full bg-[#C84B31] rounded-full transition-all duration-500"
                              style={{ width: `${yesPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Interactive YES 👍 & NO 👎 Battle Buttons */}
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="flex -space-x-2 shrink-0">
                            {venue.votedBy?.slice(0, 5).map((voter, voterIdx) => (
                              <div
                                key={voterIdx}
                                className="w-8 h-8 rounded-full bg-[#2D5D4B] text-white font-sans font-black text-xs flex items-center justify-center border-2 border-white shadow-sm"
                              >
                                {voter.substring(1, 3).toUpperCase()}
                              </div>
                            ))}
                          </div>

                          {isAlreadyVoted ? (
                            <div className="flex items-center gap-2">
                              {isUpvoted && (
                                <span className="px-5 py-3 bg-[#C84B31] text-white rounded-2xl font-sans font-extrabold text-xs uppercase flex items-center gap-2 shadow-lg border-2 border-white">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>VOTED YES ({venue.upvotes})</span>
                                </span>
                              )}
                              {isDownvoted && (
                                <span className="px-5 py-3 bg-[#4A154B] text-white rounded-2xl font-sans font-extrabold text-xs uppercase flex items-center gap-2 shadow-lg border-2 border-white">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>VOTED NO ({venue.downvotes})</span>
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <motion.button
                                onClick={() => handleVote(venue.id, 'up')}
                                disabled={isLocked || isExpired || usedDailyVotes >= MAX_DAILY_VOTES}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.93 }}
                                className="px-5 py-3 rounded-2xl font-sans font-extrabold text-xs sm:text-sm border-2 border-[#2D5D4B] shadow-lg flex items-center gap-2 cursor-pointer uppercase tracking-wider bg-[#2D5D4B] text-white hover:bg-[#2D5D4B]/90 disabled:opacity-50"
                              >
                                <ThumbsUp className="w-4 h-4 fill-white" />
                                <span>YES</span>
                                <span className="px-2 py-0.5 bg-black/20 rounded-lg font-mono font-black text-xs">
                                  {venue.upvotes}
                                </span>
                              </motion.button>

                              <motion.button
                                onClick={() => handleVote(venue.id, 'down')}
                                disabled={isLocked || isExpired || usedDailyVotes >= MAX_DAILY_VOTES}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.93 }}
                                className="px-5 py-3 rounded-2xl font-sans font-extrabold text-xs sm:text-sm border-2 border-[#2D5D4B] shadow-lg flex items-center gap-2 cursor-pointer uppercase tracking-wider bg-white text-[#2D5D4B] hover:bg-neutral-100 disabled:opacity-50"
                              >
                                <ThumbsDown className="w-4 h-4 text-[#2D5D4B]" />
                                <span>NO</span>
                                <span className="px-2 py-0.5 bg-black/10 rounded-lg font-mono font-black text-xs">
                                  {venue.downvotes}
                                </span>
                              </motion.button>
                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Queued Venues Pool (#4 & #5) */}
            {queuedVenues.length > 0 && (
              <div className="pt-4">
                <button
                  onClick={() => setShowQueuePool(!showQueuePool)}
                  className="w-full p-5 bg-[#1E2A27] text-white rounded-3xl border-2 border-[#FFD600]/30 shadow-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#FFD600] text-[#1E2A27] font-foudre font-black text-xs uppercase rounded-full">
                      ⏳ QUEUED POOL ({queuedVenues.length})
                    </span>
                    <span className="text-xs font-sans text-white/80 font-bold uppercase">
                      Unlocks when timer expires
                    </span>
                  </div>

                  {showQueuePool ? <ChevronUp className="w-5 h-5 text-[#FFD600]" /> : <ChevronDown className="w-5 h-5 text-[#FFD600]" />}
                </button>

                <AnimatePresence>
                  {showQueuePool && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 overflow-hidden"
                    >
                      {queuedVenues.map((v) => (
                        <div key={v.id} className="p-4 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-between">
                          <div>
                            <h5 className="font-foudre font-black text-xl text-[#FFD600] uppercase">{v.name}</h5>
                            <p className="text-xs font-sans text-white/70">{v.category} • {v.address}</p>
                          </div>
                          <span className="px-3 py-1 bg-white/10 text-white font-mono text-xs font-bold rounded-lg uppercase">
                            Queued (#4)
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>

          {/* Right Column: Time Slots & Map Radar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Time Slot Selection */}
            <div className="bg-[#F9F1F0] text-[#2D5D4B] p-6 sm:p-8 rounded-[36px] border-4 border-white/40 shadow-2xl space-y-5">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#C84B31]" />
                <h3 className="font-foudre font-black text-3xl uppercase text-[#2D5D4B] tracking-tight">
                  START TIME SLOT
                </h3>
              </div>
              <p className="text-xs font-sans text-[#2D5D4B]/80 font-medium leading-relaxed">
                Tap your preferred arrival time slot for tonight's squad linkup.
              </p>

              <div className="space-y-3 pt-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTime === slot.id;
                  return (
                    <motion.div
                      key={slot.id}
                      onClick={() => setSelectedTime(slot.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`p-4 rounded-2xl border-2 border-[#2D5D4B] cursor-pointer flex items-center justify-between transition-colors shadow-md ${
                        isSelected
                          ? 'bg-[#C84B31] text-white border-[#C84B31]'
                          : 'bg-white text-[#2D5D4B] hover:bg-neutral-100'
                      }`}
                    >
                      <div className="font-sans font-extrabold text-sm sm:text-base uppercase tracking-wider">
                        {slot.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-sans font-bold">
                        <span>{slot.votes} squad voted</span>
                        <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center ${isSelected ? 'bg-[#FFD600] text-[#1E2A27]' : 'bg-white'}`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Real-time Activity Card */}
            <div className="bg-[#1E2A27] text-white p-6 sm:p-8 rounded-[36px] border-4 border-white/20 shadow-2xl space-y-4">
              <h4 className="font-foudre font-black text-2xl uppercase text-[#FFD600] flex items-center gap-2 tracking-wide">
                <MessageSquare className="w-5 h-5" />
                LIVE SQUAD LOG
              </h4>

              <div className="space-y-3 text-xs font-sans">
                <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
                  <span className="font-sans font-extrabold text-[#FFD600]">{userName}:</span> Active in voting arena 🍸
                </div>
                <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
                  <span className="font-sans font-extrabold text-[#C84B31]">@sara:</span> Upvoted YES for Overstory Rooftop!
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Embedded Interactive Map Section */}
        <div id="map" className="pt-8">
          <InteractiveMap onSelectVenue={(id) => handleVote(id, 'up')} />
        </div>

        <InviteModal
          isOpen={isInviteOpen}
          pingTitle={currentPingTitle}
          pingId={currentPingId}
          onClose={() => setIsInviteOpen(false)}
        />

      </div>
    </section>
  );
};
