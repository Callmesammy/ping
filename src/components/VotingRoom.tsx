import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ThumbsUp, ThumbsDown, Clock, Users, Share2, Flame, Lock, Radio, Trophy, Sparkles, Check, ArrowRight, MessageSquare } from 'lucide-react';
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
];

const TIME_SLOTS = [
  { id: 't1', time: '7:30 PM', votes: 6, isSelected: true },
  { id: 't2', time: '8:15 PM', votes: 2, isSelected: false },
  { id: 't3', time: '9:00 PM (Late)', votes: 1, isSelected: false },
];

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

  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch initial ping data & setup WebSockets
  useEffect(() => {
    socket.emit('join_room', currentPingId);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onVoteUpdated = (data: any) => {
      if (data.pingId === currentPingId && data.venues) {
        setVenues(
          data.venues.map((v: any) => ({
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
          data.venues.map((v: any) => ({
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
    if (isLocked) return;

    if (type === 'up') {
      const isUpvoted = userUpvotedIds.includes(venueId);
      if (isUpvoted) {
        setUserUpvotedIds((prev) => prev.filter((id) => id !== venueId));
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, upvotes: Math.max(0, v.upvotes - 1) } : v))
        );
      } else {
        setUserUpvotedIds((prev) => [...prev, venueId]);
        setUserDownvotedIds((prev) => prev.filter((id) => id !== venueId));
        setVenues((prev) =>
          prev.map((v) =>
            v.id === venueId
              ? {
                  ...v,
                  upvotes: v.upvotes + 1,
                  downvotes: userDownvotedIds.includes(venueId) ? Math.max(0, v.downvotes - 1) : v.downvotes,
                }
              : v
          )
        );
      }
    } else {
      const isDownvoted = userDownvotedIds.includes(venueId);
      if (isDownvoted) {
        setUserDownvotedIds((prev) => prev.filter((id) => id !== venueId));
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, downvotes: Math.max(0, v.downvotes - 1) } : v))
        );
      } else {
        setUserDownvotedIds((prev) => [...prev, venueId]);
        setUserUpvotedIds((prev) => prev.filter((id) => id !== venueId));
        setVenues((prev) =>
          prev.map((v) =>
            v.id === venueId
              ? {
                  ...v,
                  downvotes: v.downvotes + 1,
                  upvotes: userUpvotedIds.includes(venueId) ? Math.max(0, v.upvotes - 1) : v.upvotes,
                }
              : v
          )
        );
      }
    }

    await voteVenueApi(currentPingId, venueId, userName, type);
  };

  const handleLockIn = async () => {
    setIsLocked(true);
    await lockPingApi(currentPingId);
  };

  const sortedVenues = [...venues].sort((a, b) => (b.upvotes ?? b.votes) - (a.upvotes ?? a.votes));
  const topVenue = sortedVenues[0] || venues[0];

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="py-24 px-4 sm:px-8 bg-[#2D5D4B] text-[#F9F1F0] transition-colors duration-700 select-none overflow-hidden"
    >
      <div className="max-w-[1550px] mx-auto space-y-10">
        
        {/* Top Arena Header: Vibrant Crimson Card */}
        <div className="bg-[#C84B31] text-white p-8 sm:p-12 rounded-[40px] shadow-2xl border-4 border-white/20 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FFD600]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-3xl z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-[#FFD600] text-[#1E2A27] font-foudre font-black text-sm uppercase tracking-wider rounded-full shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C84B31] animate-ping" />
                LIVE SQUAD VOTING ARENA
              </span>

              <span className="px-3.5 py-1.5 bg-black/20 text-white font-sans font-bold text-xs rounded-full border border-white/20 flex items-center gap-2">
                <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-[#FFD600]' : 'text-white/60'}`} />
                {isConnected ? 'Real-Time Sync Active' : 'Offline Mode'}
              </span>
            </div>

            <h2 className="font-foudre font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-[0.88]">
              {currentPingTitle}
            </h2>

            <p className="text-sm sm:text-base font-sans text-white/90 font-medium leading-relaxed">
              Drop your vote on places & times below. You are voting as <span className="text-[#FFD600] font-black underline">{userName}</span>!
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

            {!isLocked && (
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

        {/* Current Leader Podium Banner */}
        <div className="bg-[#1E2A27] text-white p-6 sm:p-8 rounded-[36px] border-4 border-[#FFD600]/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD600] text-[#1E2A27] flex items-center justify-center shadow-xl border-2 border-white shrink-0">
              <Trophy className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-sans font-bold text-[#FFD600] uppercase tracking-widest block">
                {isLocked ? '🏆 OFFICIAL WINNING VENUE' : '🔥 CURRENT #1 LEADERBOARD SPOT'}
              </span>
              <h3 className="font-foudre font-black text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none mt-1">
                {topVenue.name}
              </h3>
              <p className="text-xs font-sans text-white/70 font-semibold mt-1">
                {topVenue.upvotes} YES votes • {topVenue.votedBy.length} total squad members voted
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/20 text-xs font-sans font-bold text-white shrink-0">
            <Clock className="w-4 h-4 text-[#FFD600]" />
            <span>{isLocked ? 'Ping Locked & Confirmed' : 'Voting closes in 14 mins'}</span>
          </div>
        </div>

        {/* Main Grid: Venue Battle Cards & Time Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: YES / NO Venue Cards */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-foudre font-black text-3xl sm:text-4xl uppercase text-white tracking-tight">
                VOTE ON VENUES ({venues.length})
              </h3>
              <span className="text-xs font-sans font-bold text-white/80 uppercase tracking-wider">
                Tap YES 👍 or NO 👎
              </span>
            </div>

            <div className="space-y-6">
              {venues.map((venue, idx) => {
                const isUpvoted = userUpvotedIds.includes(venue.id);
                const isDownvoted = userDownvotedIds.includes(venue.id);
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

                          <div className="flex items-center gap-3">
                            {/* YES BUTTON */}
                            <motion.button
                              onClick={() => handleVote(venue.id, 'up')}
                              disabled={isLocked}
                              whileHover={{ scale: isLocked ? 1 : 1.05 }}
                              whileTap={{ scale: isLocked ? 1 : 0.93 }}
                              className={`px-5 py-3 rounded-2xl font-sans font-extrabold text-xs sm:text-sm border-2 border-[#2D5D4B] shadow-lg flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
                                isUpvoted
                                  ? 'bg-[#C84B31] text-white border-[#C84B31]'
                                  : 'bg-[#2D5D4B] text-white hover:bg-[#2D5D4B]/90'
                              }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-white' : ''}`} />
                              <span>YES</span>
                              <span className="px-2 py-0.5 bg-black/20 rounded-lg font-mono font-black text-xs">
                                {venue.upvotes}
                              </span>
                            </motion.button>

                            {/* NO BUTTON */}
                            <motion.button
                              onClick={() => handleVote(venue.id, 'down')}
                              disabled={isLocked}
                              whileHover={{ scale: isLocked ? 1 : 1.05 }}
                              whileTap={{ scale: isLocked ? 1 : 0.93 }}
                              className={`px-5 py-3 rounded-2xl font-sans font-extrabold text-xs sm:text-sm border-2 border-[#2D5D4B] shadow-lg flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
                                isDownvoted
                                  ? 'bg-[#4A154B] text-white border-[#4A154B]'
                                  : 'bg-white text-[#2D5D4B] hover:bg-neutral-100'
                              }`}
                            >
                              <ThumbsDown className={`w-4 h-4 ${isDownvoted ? 'fill-white' : ''}`} />
                              <span>NO</span>
                              <span className="px-2 py-0.5 bg-black/10 rounded-lg font-mono font-black text-xs">
                                {venue.downvotes}
                              </span>
                            </motion.button>
                          </div>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
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
