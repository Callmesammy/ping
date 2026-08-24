import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Heart, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_CARDS = [
  {
    id: '01',
    title: 'DROP A PING',
    badge: 'START THE VIBE',
    bgColor: '#2D5D4B', // Sage Emerald
    description: 'No long descriptions. Just pick a topic: "Tacos?", "Rooftop?", "Arcade?", or "Coffee?".',
    image: '/pics/kobby-mendez-xBFTjrMIC0c-unsplash.jpg',
    bubbleEmoji: '📱 ⚡ 🍹',
  },
  {
    id: '02',
    title: 'INVITE CREW',
    badge: 'ONE LINK DOES IT ALL',
    bgColor: '#C84B31', // Warm Crimson
    description: 'Share a single 1-click magic link into your WhatsApp or iMessage group. Zero logins.',
    image: '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
    bubbleEmoji: '💌 🚀 🔥',
  },
  {
    id: '03',
    title: 'MAP VENUES',
    badge: 'MAPBOX POWERED',
    bgColor: '#E89A3C', // Mustard Gold
    description: 'Anyone in the ping can drop venue markers or search neighborhood spots on the live map.',
    image: '/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg',
    bubbleEmoji: '📍 🗺️ 🍷',
  },
  {
    id: '04',
    title: 'REAL TIME VOTE',
    badge: 'SPRING PHYSICS',
    bgColor: '#4A154B', // Deep Plum
    description: 'Tap place cards and time slots. Optimistic spring physics update everyone’s screen in real time.',
    image: '/pics/micaela-peduzi-ch4Fc1cGTq4-unsplash.jpg',
    bubbleEmoji: '👍 🕹️ 🍻',
  },
  {
    id: '05',
    title: 'LOCK IT IN',
    badge: 'GAME TIME',
    bgColor: '#1E2A27', // Deep Forest Charcoal
    description: 'Once top venue & time reach consensus, the ping locks automatically and sends final alerts.',
    image: '/pics/snappr-mK1ROPl7afs-unsplash.jpg',
    bubbleEmoji: '👑 🎉 🚀',
  },
];

const STAGE_COLORS = [
  '#2D5D4B', // Card 1 Sage Emerald
  '#C84B31', // Card 2 Warm Crimson
  '#E89A3C', // Card 3 Mustard Gold
  '#4A154B', // Card 4 Deep Plum
  '#1E2A27', // Card 5 Deep Forest
  '#C84B31', // Card 6 Warm Crimson Entrance
];

const STAGE_BUBBLES = ['📱 ⚡ 🍹', '💌 🚀 🔥', '📍 🗺️ 🍷', '👍 🕹️ 🍻', '👑 🎉 🚀', '🚀 ✨ 💖'];

export const JourneyScroller: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const topBannerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  
  const card6PortalRef = useRef<HTMLDivElement>(null);
  const card6BoxRef = useRef<HTMLDivElement>(null);
  const initialCardTextRef = useRef<HTMLDivElement>(null);
  
  const englishText1Ref = useRef<HTMLDivElement>(null);
  const pingEmblemRef = useRef<HTMLDivElement>(null);
  const lavenderCanvasRef = useRef<HTMLDivElement>(null);
  const englishText2Ref = useRef<HTMLDivElement>(null);

  const [activeColor, setActiveColor] = useState('#2D5D4B');
  const [activeBubble, setActiveBubble] = useState('📱 ⚡ 🍹');
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 280);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: '+=5600',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.65) {
              const step = Math.min(4, Math.floor((self.progress / 0.65) * 5));
              setActiveColor(STAGE_COLORS[step]);
              setActiveBubble(STAGE_BUBBLES[step]);
            } else {
              setActiveColor('#C84B31');
              setActiveBubble('🚀 ✨ 💖');
            }
          },
        },
      });

      // 1. Lenis smooth horizontal track scroll to Card 5
      tl.to(track, {
        x: getScrollAmount,
        ease: 'none',
        duration: 3.5,
      });

      // 2. Card 6 Takeover Portal
      tl.to([leftColumnRef.current, topBannerRef.current], { opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.6')
        .to(
          card6PortalRef.current,
          {
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.6,
            ease: 'power2.inOut',
          },
          '<'
        )
        .to(initialCardTextRef.current, { opacity: 0, scale: 0.8, duration: 0.4 }, '<+=0.3')
        .to(
          card6BoxRef.current,
          {
            width: '100vw',
            height: '100vh',
            borderRadius: '0px',
            backgroundColor: '#C84B31',
            duration: 1.2,
            ease: 'power2.inOut',
          },
          '<'
        )
        .fromTo(
          englishText1Ref.current,
          { opacity: 0, scale: 0.85, y: 35 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' },
          '<+=0.4'
        );

      // 3. CONTINUATION ON SCROLL: PING Brand Emblem Expansion
      tl.to(englishText1Ref.current, { opacity: 0, scale: 0.85, duration: 0.6 }, '+=0.6')
        .fromTo(
          pingEmblemRef.current,
          { scale: 0.3, opacity: 0, y: -180 },
          { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
          '<+=0.1'
        )
        .to(pingEmblemRef.current, {
          scale: 14,
          duration: 1.6,
          ease: 'power2.inOut',
        })
        .to(
          lavenderCanvasRef.current,
          {
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.8,
          },
          '<+=0.6'
        )

        // 4. Reveal Second English Headline on Peach Cream (#F9F1F0)
        .fromTo(
          englishText2Ref.current,
          { opacity: 0, scale: 0.85, y: 35 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' },
          '<+=0.3'
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="flow"
      style={{ backgroundColor: activeColor }}
      className="relative text-white py-12 overflow-hidden h-screen flex flex-col justify-between transition-colors duration-700 select-none"
    >
      {/* CARD 6 FULL-SCREEN PORTAL OVERLAY */}
      <div
        ref={card6PortalRef}
        className="fixed inset-0 w-screen h-screen bg-[#C84B31] z-50 opacity-0 pointer-events-none flex items-center justify-center p-4 transition-colors"
      >
        {/* Soft Peach Cream Canvas Overlay */}
        <div
          ref={lavenderCanvasRef}
          className="fixed inset-0 w-screen h-screen bg-[#F9F1F0] text-[#C84B31] z-40 opacity-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center"
        >
          <div
            ref={englishText2Ref}
            className="flex flex-col items-center justify-center text-center w-full max-w-6xl"
          >
            <h2 className="font-foudre font-black text-[14vw] sm:text-[11vw] lg:text-[8.5vw] leading-[0.76] text-[#C84B31] uppercase tracking-tighter">
              LINKUP FAST. <br />
              VOTE LIVE. <br />
              NO DRAMA.
            </h2>
          </div>
        </div>

        {/* Brand PING Emblem Expansion Graphic */}
        <div
          ref={pingEmblemRef}
          className="absolute inset-0 m-auto z-30 pointer-events-none flex flex-col items-center justify-center opacity-0"
        >
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#F9F1F0] text-[#C84B31] flex flex-col items-center justify-center shadow-2xl p-6 border-4 border-white">
            <span className="font-foudre font-black text-6xl sm:text-7xl uppercase leading-none tracking-tight">
              PING
            </span>
            <div className="w-12 h-12 rounded-full bg-[#2D5D4B] text-[#F9F1F0] flex items-center justify-center mt-2 shadow-inner">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Centered Warm Crimson Box expanding to 100vw x 100vh */}
        <div
          ref={card6BoxRef}
          className="relative w-[340px] sm:w-[420px] h-[480px] sm:h-[540px] bg-[#C84B31] rounded-[40px] shadow-2xl flex items-center justify-center p-8 overflow-hidden z-10 transition-all border-2 border-white/20"
        >
          <div
            ref={initialCardTextRef}
            className="flex flex-col items-center justify-between h-full w-full py-4 text-center z-10"
          >
            <div className="my-auto">
              <h2 className="font-foudre font-black text-6xl sm:text-7xl text-white uppercase leading-[0.78] tracking-tight">
                MORE <br />
                PINGS <br />
                ?
              </h2>
            </div>

            <button className="px-8 py-3 bg-[#F9F1F0] text-[#C84B31] font-sans font-extrabold text-sm rounded-full uppercase tracking-wider shadow-md hover:bg-white transition-colors cursor-pointer">
              EXPLORE ALL
            </button>
          </div>

          {/* First English Headline */}
          <div
            ref={englishText1Ref}
            className="absolute inset-0 m-auto flex flex-col items-center justify-center p-6 text-center opacity-0 pointer-events-none z-20 w-full h-full"
          >
            <h2 className="font-foudre font-black text-[12vw] sm:text-[9.5vw] lg:text-[7.5vw] leading-[0.76] text-white uppercase tracking-tighter max-w-7xl">
              SPONTANEITY IS <br />
              THE HEART OF <br />
              EVERY GREAT NIGHT OUT
            </h2>
          </div>
        </div>
      </div>

      {/* Top Banner Tag */}
      <div ref={topBannerRef} className="max-w-7xl mx-auto px-4 md:px-12 w-full flex items-center justify-between z-20 transition-opacity">
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/80">
          PROJETS & FLOW • 5 STEPS
        </span>
        
        <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-white">
          <span>Scroll down to advance cards</span>
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {/* Main Split Grid Layout */}
      <div className="w-full my-auto py-2">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative">
          
          {/* Left Fixed Content Column */}
          <div ref={leftColumnRef} className="lg:w-[36%] shrink-0 space-y-6 z-20 transition-opacity">
            <motion.div
              key={activeBubble}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9F1F0] text-[#2D5D4B] rounded-[24px] shadow-lg text-lg font-bold border border-white/60"
            >
              <span>{activeBubble}</span>
            </motion.div>

            <h2 className="font-foudre font-black text-[13vw] sm:text-[9vw] lg:text-[6.5vw] leading-[0.78] text-white uppercase tracking-tighter">
              FROM IDEA <br />
              TO LINKUP <br />
              IN 5 STEPS
            </h2>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-3">
                <img
                  src="/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/pics/luthfi-alfarizi-0piYmLeSgTQ-unsplash.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <div className="w-10 h-10 rounded-full bg-[#C84B31] text-white font-sans font-black text-xs flex items-center justify-center border-2 border-white">
                  +5
                </div>
              </div>
              <span className="text-xs font-sans font-bold text-white/90">
                Pings active in your city
              </span>
            </div>
          </div>

          {/* Right Horizontal Track Container */}
          <div className="lg:w-[64%] w-full overflow-hidden z-10">
            <div
              ref={trackRef}
              className="flex gap-6 sm:gap-8 px-2 w-max items-center"
            >
              {/* Cards 1 to 5 */}
              {JOURNEY_CARDS.map((card) => (
                <motion.div
                  key={card.id}
                  onMouseEnter={() => {
                    setActiveColor(card.bgColor);
                    setActiveBubble(card.bubbleEmoji);
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="relative w-[300px] sm:w-[350px] md:w-[390px] h-[450px] sm:h-[510px] rounded-[36px] overflow-hidden shadow-2xl shrink-0 cursor-pointer border-2 border-white/20 group"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-6 left-6 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 font-mono font-bold text-xs text-white">
                    {card.id}
                  </div>

                  <div className="absolute top-14 left-6 right-6">
                    <h3 className="font-foudre font-black text-5xl sm:text-6xl text-white uppercase leading-[0.78] tracking-tight drop-shadow-md">
                      {card.title}
                    </h3>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
                    <div className="space-y-2">
                      <span className="px-3.5 py-1 bg-[#F9F1F0] text-[#2D5D4B] font-sans font-bold text-xs rounded-full inline-block shadow-sm">
                        {card.badge}
                      </span>
                      <p className="text-xs font-sans text-white/90 font-medium max-w-[230px] line-clamp-2">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        className="w-9 h-9 bg-[#C84B31] text-white rounded-full flex items-center justify-center shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => toggleLike(card.id, e)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md cursor-pointer transition-colors border ${
                          likedCards[card.id]
                            ? 'bg-[#C84B31] text-white border-white'
                            : 'bg-white/85 text-[#C84B31] border-white/60 hover:bg-white'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            likedCards[card.id] ? 'fill-white stroke-white scale-110' : 'fill-[#C84B31] stroke-[#C84B31]'
                          }`}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
