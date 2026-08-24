import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ThumbsUp, Clock, Users, Share2, Sparkles, Check, Flame, MessageSquare, Lock, Radio } from 'lucide-react';
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
  votedBy: string[];
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
    votes: 5,
    votedBy: ['@alex_vibe', '@sara', '@marcus', '@elena', '@jordan'],
    image: '/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg',
    tag: 'LEADER',
    price: '$$$',
  },
  {
    id: 'v2',
    name: 'Tacos & Mezcal Social',
    category: 'Late Night Tacos & Birria',
    address: '88 Mercado Way',
    votes: 4,
    votedBy: ['@sam', '@dave', '@maya', '@lisa'],
    image: '/pics/brands-people-en-u6xqnbsg-unsplash.jpg',
    tag: 'HOT',
    price: '$$',
  },
  {
    id: 'v3',
    name: 'Neon Arcade & Underground Bar',
    category: 'Pinball, Draft Beer & Retro Gaming',
    address: '404 Cyber Lane',
    votes: 3,
    votedBy: ['@leo', '@chloe', '@zack'],
    image: '/pics/micaela-peduzi-ch4Fc1cGTq4-unsplash.jpg',
    tag: 'VIBES',
    price: '$',
  },
];

const TIME_SLOTS = [
  { id: 't1', time: '7:30 PM', votes: 4, isSelected: true },
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
  const [userVotedIds, setUserVotedIds] = useState<string[]>(['v1']);
  const [selectedTime, setSelectedTime] = useState<string>('t1');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerCardRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Entrance & Color Transition
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        sectionRef.current,
        { backgroundColor: '#F9F1F0' },
        { backgroundColor: '#2D5D4B', duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(
        headerCardRef.current,
        { opacity: 0, scale: 0.92, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '<+=0.1'
      )
      .fromTo(
        leftColRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '<+=0.2'
      )
      .fromTo(
        rightColRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '<'
      )
      .fromTo(
        mapContainerRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '<+=0.2'
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
            votes: v.votes,
            votedBy: v.votedBy || [],
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
            votes: v.votes,
            votedBy: v.votedBy || [],
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

  const handleToggleVote = async (venueId: string) => {
    if (isLocked) return;

    const isVoted = userVotedIds.includes(venueId);

    if (isVoted) {
      setUserVotedIds((prev) => prev.filter((id) => id !== venueId));
      setVenues((prev) =>
        prev.map((v) => (v.id === venueId ? { ...v, votes: Math.max(0, v.votes - 1) } : v))
      );
    } else {
      setUserVotedIds((prev) => [...prev, venueId]);
      setVenues((prev) =>
        prev.map((v) => (v.id === venueId ? { ...v, votes: v.votes + 1 } : v))
      );
    }

    await voteVenueApi(currentPingId, venueId, userName);
  };

  const handleLockIn = async () => {
    setIsLocked(true);
    await lockPingApi(currentPingId);
  };

  const topVenue = [...venues].sort((a, b) => b.votes - a.votes)[0] || venues[0];

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="py-24 px-4 sm:px-8 bg-[#2D5D4B] text-white transition-colors duration-700 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Live Room Header */}
        <div
          ref={headerCardRef}
          className="bg-[#1E2A27] text-white p-6 md:p-10 rounded-3xl border-4 border-white/20 shadow-2xl mb-12 relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-[#E89A3C] text-[#1E2A27] font-heading font-black text-xs uppercase rounded-full border border-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E2A27] animate-ping"></span>
                  LIVE VOTING ROOM
                </span>

                <span className="px-3 py-1 bg-white/10 text-white font-heading font-bold text-xs rounded-full border border-white/20 flex items-center gap-1.5">
                  <Radio className={`w-3 h-3 ${isConnected ? 'text-[#E89A3C]' : 'text-[#C84B31]'}`} />
                  {isConnected ? 'Real-Time Sync Active' : 'Offline Mode'}
                </span>
              </div>

              <h2 className="font-foudre font-black text-4xl md:text-6xl uppercase tracking-tight text-white mb-2 leading-none">
                {currentPingTitle}
              </h2>
              <p className="text-sm md:text-base font-sans text-white/80 max-w-2xl font-medium">
                Vote on your preferred venue & time. Voting as <span className="text-[#E89A3C] font-bold">{userName}</span>!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <motion.button
                onClick={() => setIsInviteOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="px-5 py-3 bg-[#C84B31] text-white font-sans font-bold text-sm border-2 border-white rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <Share2 className="w-4 h-4" />
                <span>Invite Crew</span>
              </motion.button>

              {!isLocked && (
                <motion.button
                  onClick={handleLockIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  className="px-5 py-3 bg-[#E89A3C] text-[#1E2A27] font-sans font-bold text-sm border-2 border-white rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Lock className="w-4 h-4 stroke-[3]" />
                  Lock It In Now
                </motion.button>
              )}
            </div>
          </div>

          {/* Live Leaderboard Alert Banner */}
          <div className="mt-8 pt-6 border-t-2 border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#C84B31] text-white rounded-xl border border-white/30 shadow-md">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <p className="text-xs font-sans font-semibold text-white/60 uppercase tracking-widest">
                  {isLocked ? 'OFFICIAL WINNING VENUE' : 'CURRENT LEADER'}
                </p>
                <p className="font-foudre font-black text-xl text-[#E89A3C] tracking-wide">
                  {topVenue.name} ({topVenue.votes} votes)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-sans font-bold text-white/90 bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
              <Clock className="w-4 h-4 text-[#E89A3C]" />
              <span>{isLocked ? 'Ping Locked & Confirmed!' : 'Voting closes in 14 mins'}</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Venue Voting Cards */}
          <div ref={leftColRef} className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-foudre font-black text-3xl uppercase text-white tracking-tight">
                SUGGESTED VENUES ({venues.length})
              </h3>
              <span className="text-xs font-sans font-bold text-white/80 uppercase tracking-wider">
                Real-time websocket voting
              </span>
            </div>

            <div className="space-y-6">
              {venues.map((venue) => {
                const hasVoted = userVotedIds.includes(venue.id);

                return (
                  <motion.div
                    key={venue.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-[#F9F1F0] text-[#2D5D4B] p-5 md:p-6 rounded-3xl border-2 border-white/40 transition-all relative overflow-hidden shadow-2xl ${
                      hasVoted ? 'ring-4 ring-[#E89A3C] bg-[#E89A3C]/10' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      
                      <div className="relative w-full sm:w-48 h-40 rounded-2xl overflow-hidden shrink-0 border-2 border-black/10 shadow-md">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#1E2A27] text-white font-mono font-bold text-[10px] rounded-md uppercase">
                          {venue.price}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-sans font-extrabold text-[#C84B31] uppercase tracking-wider">
                              {venue.category}
                            </span>
                            <span className="px-2.5 py-0.5 bg-[#E89A3C] text-[#1E2A27] text-[10px] font-sans font-black rounded-full uppercase">
                              {venue.tag}
                            </span>
                          </div>

                          <h4 className="font-foudre font-black text-2xl md:text-3xl text-[#2D5D4B] uppercase tracking-tight leading-none">
                            {venue.name}
                          </h4>
                          <p className="text-xs font-sans font-semibold text-[#2D5D4B]/80 flex items-center gap-1 mt-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#2D5D4B]" /> {venue.address}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-3 border-t border-black/10">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {venue.votedBy.map((voter, idx) => (
                                <div
                                  key={idx}
                                  className="w-7 h-7 rounded-full bg-[#2D5D4B] text-white font-sans font-black text-[10px] flex items-center justify-center border border-white"
                                >
                                  {voter.substring(1, 3).toUpperCase()}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs font-sans font-bold text-[#2D5D4B]">
                              {venue.votes} votes
                            </span>
                          </div>

                          <motion.button
                            onClick={() => handleToggleVote(venue.id)}
                            disabled={isLocked}
                            whileHover={{ scale: isLocked ? 1 : 1.06 }}
                            whileTap={{ scale: isLocked ? 1 : 0.92 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            className={`px-5 py-2.5 rounded-2xl font-sans font-extrabold text-xs border-2 border-[#2D5D4B] shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
                              hasVoted
                                ? 'bg-[#C84B31] text-white'
                                : 'bg-[#2D5D4B] text-white hover:bg-[#2D5D4B]/90'
                            }`}
                          >
                            <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-white' : ''}`} />
                            <span>{hasVoted ? 'Voted!' : 'Vote Venue'}</span>
                            
                            <motion.span
                              key={venue.votes}
                              initial={{ scale: 1.5, color: '#C84B31' }}
                              animate={{ scale: 1, color: '#FFFFFF' }}
                              className="ml-1 px-2 py-0.5 bg-black/10 rounded-lg text-xs font-mono font-bold"
                            >
                              {venue.votes}
                            </motion.span>
                          </motion.button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div ref={rightColRef} className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#F9F1F0] text-[#2D5D4B] p-6 rounded-3xl border-2 border-white/40 shadow-2xl space-y-4">
              <h3 className="font-foudre font-black text-2xl uppercase text-[#2D5D4B] flex items-center gap-2 tracking-tight">
                <Clock className="w-5 h-5 text-[#C84B31]" />
                SELECT TIME SLOT
              </h3>
              <p className="text-xs font-sans text-[#2D5D4B]/80 font-medium">
                Cast your vote for the start time that fits your schedule tonight.
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
                      className={`p-4 rounded-2xl border-2 border-[#2D5D4B] cursor-pointer flex items-center justify-between transition-colors shadow-sm ${
                        isSelected
                          ? 'bg-[#C84B31] text-white'
                          : 'bg-white text-[#2D5D4B] hover:bg-neutral-100'
                      }`}
                    >
                      <div className="font-sans font-extrabold text-sm uppercase">
                        {slot.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-sans font-bold">
                        <span>{slot.votes} voted</span>
                        <div className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center ${isSelected ? 'bg-[#2D5D4B] text-white' : 'bg-white'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1E2A27] text-white p-6 rounded-3xl border-2 border-white/20 shadow-2xl space-y-4">
              <h4 className="font-foudre font-black text-xl uppercase text-[#E89A3C] flex items-center gap-2 tracking-wide">
                <MessageSquare className="w-5 h-5" />
                REAL-TIME ACTIVITY
              </h4>

              <div className="space-y-3 text-xs font-sans">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <span className="font-sans font-extrabold text-[#C84B31]">{userName}:</span> Active in room 🍸
                </div>
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <span className="font-sans font-extrabold text-[#E89A3C]">@sara:</span> 7:30 PM slot looks ideal!
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Embedded Interactive Map Section */}
        <div ref={mapContainerRef} id="map" className="pt-12">
          <InteractiveMap onSelectVenue={handleToggleVote} />
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
