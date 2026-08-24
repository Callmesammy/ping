import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const METHOD_CARDS = [
  {
    number: '01',
    category: 'MAGIC POLLS',
    subtitle: '1-Click Magic Links & Live Voting',
    bgColor: '#C84B31', // Warm Crimson
    bubbleEmoji: '🧠 ⚡ 🎯',
  },
  {
    number: '02',
    category: 'MAP RADAR',
    subtitle: 'Mapbox Spot & Venue Pins',
    bgColor: '#4A154B', // Deep Plum
    bubbleEmoji: '🎨 📸 ✨',
  },
  {
    number: '03',
    category: 'TIME SYNCH',
    subtitle: 'Consensus & Schedule Lock-In',
    bgColor: '#E89A3C', // Mustard Gold
    bubbleEmoji: '🎬 📱 🚀',
  },
  {
    number: '04',
    category: 'CHAT ENGINE',
    subtitle: 'Live Status & Activity Stream',
    bgColor: '#2D5D4B', // Sage Emerald
    bubbleEmoji: '💬 💬 🍻',
  },
  {
    number: '05',
    category: 'GROUP LOCK-IN',
    subtitle: 'Automated Reminders & Alerts',
    bgColor: '#C84B31', // Warm Crimson
    bubbleEmoji: '👑 🎉 🥂',
  },
  {
    number: '06',
    category: 'SPONTANEITY',
    subtitle: 'Zero Agendas, Pure Vibes',
    bgColor: '#1E2A27', // Deep Forest
    bubbleEmoji: '📈 ⚡ 📊',
  },
];

export const ExpertisesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const methodTitleRef = useRef<HTMLDivElement>(null);
  const expertiseTitleRef = useRef<HTMLDivElement>(null);
  const cardDeckRef = useRef<HTMLDivElement>(null);
  
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);
  const card6Ref = useRef<HTMLDivElement>(null);

  const [activeBubble, setActiveBubble] = useState('🧠 ⚡ 🎯');

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: '+=4800',
          invalidateOnRefresh: true,
        },
      });

      // Background Color Transition: Soft Peach Cream (#F9F1F0) -> Sage Emerald (#2D5D4B)
      tl.to(sectionRef.current, {
        backgroundColor: '#2D5D4B',
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(
        expertiseTitleRef.current,
        { opacity: 0, y: -20, duration: 0.8 },
        '<'
      )
      .fromTo(
        methodTitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '<+=0.3'
      );

      // Card Toss Animation
      const tossCards = [
        card2Ref.current,
        card3Ref.current,
        card4Ref.current,
        card5Ref.current,
        card6Ref.current,
      ];

      tossCards.forEach((card, index) => {
        if (card) {
          tl.fromTo(
            card,
            { y: 550, scale: 0.9, opacity: 0, rotate: index % 2 === 0 ? 4 : -4 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 1.2,
              ease: 'power3.out',
              onStart: () => setActiveBubble(METHOD_CARDS[index + 1].bubbleEmoji),
            },
            `+=0.2`
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="method"
      className="relative w-full h-screen bg-[#F9F1F0] text-[#2D5D4B] py-16 px-4 md:px-12 overflow-hidden flex items-center justify-center transition-colors duration-700 select-none"
    >
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 h-full">
        
        {/* Left Column */}
        <div ref={leftColRef} className="lg:col-span-4 space-y-6 relative">
          
          {/* Initial Headline */}
          <div ref={expertiseTitleRef} className="space-y-4">
            <span className="text-xs font-sans font-bold text-[#C84B31] uppercase tracking-widest block">
              PING CORE ENGINE
            </span>
            <h2 className="font-foudre font-black text-[12vw] sm:text-[8.5vw] lg:text-[5.5vw] leading-[0.78] text-[#C84B31] uppercase tracking-tighter block">
              BUILT FOR <br />
              SQUAD DECISIONS: <br />
              ZERO AGENDAS.
            </h2>
          </div>

          {/* Transitioned Headline */}
          <div ref={methodTitleRef} className="space-y-4 absolute top-0 left-0 w-full opacity-0">
            <span className="text-xs font-sans font-bold text-[#F9F1F0] uppercase tracking-widest block">
              SPONTANEOUS METHOD
            </span>
            <h2 className="font-foudre font-black text-[12vw] sm:text-[8.5vw] lg:text-[5.5vw] leading-[0.78] text-[#F9F1F0] uppercase tracking-tighter block">
              WE PREFER <br />
              SPONTANEOUS <br />
              PLANS. <br />
              ALWAYS.
            </h2>
          </div>

          {/* Speech Bubble Sticker */}
          <motion.div
            key={activeBubble}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C84B31] text-[#F9F1F0] rounded-[24px] shadow-md text-lg font-bold border border-white/40"
          >
            <span>{activeBubble}</span>
          </motion.div>
        </div>

        {/* Center Column: Card Toss Stack Deck */}
        <div ref={cardDeckRef} className="lg:col-span-4 h-[460px] sm:h-[520px] relative flex justify-center items-center">
          
          {/* Card 01 */}
          <div
            ref={card1Ref}
            style={{ backgroundColor: METHOD_CARDS[0].bgColor }}
            className="absolute inset-0 m-auto w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-[40px] shadow-2xl text-white p-8 flex flex-col justify-between cursor-pointer border-2 border-white/20 z-10"
          >
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/80 block">
                {METHOD_CARDS[0].category}
              </span>
            </div>
            <div className="my-auto text-center">
              <span className="font-foudre font-black text-[120px] sm:text-[140px] leading-none text-white block tracking-tighter drop-shadow-md">
                {METHOD_CARDS[0].number}
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs font-sans font-bold text-white/90 uppercase tracking-wider">
                {METHOD_CARDS[0].subtitle}
              </p>
            </div>
          </div>

          {/* Card 02 */}
          <div
            ref={card2Ref}
            style={{ backgroundColor: METHOD_CARDS[1].bgColor }}
            className="absolute inset-0 m-auto opacity-0 w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-[40px] shadow-2xl text-white p-8 flex flex-col justify-between cursor-pointer border-2 border-white/20 z-20"
          >
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/80 block">
                {METHOD_CARDS[1].category}
              </span>
            </div>
            <div className="my-auto text-center">
              <span className="font-foudre font-black text-[120px] sm:text-[140px] leading-none text-white block tracking-tighter drop-shadow-md">
                {METHOD_CARDS[1].number}
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs font-sans font-bold text-white/90 uppercase tracking-wider">
                {METHOD_CARDS[1].subtitle}
              </p>
            </div>
          </div>

          {/* Card 03 */}
          <div
            ref={card3Ref}
            style={{ backgroundColor: METHOD_CARDS[2].bgColor }}
            className="absolute inset-0 m-auto opacity-0 w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-[40px] shadow-2xl text-[#1E2A27] p-8 flex flex-col justify-between cursor-pointer border-2 border-white/20 z-30"
          >
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#1E2A27]/80 block">
                {METHOD_CARDS[2].category}
              </span>
            </div>
            <div className="my-auto text-center">
              <span className="font-foudre font-black text-[120px] sm:text-[140px] leading-none text-[#1E2A27] block tracking-tighter drop-shadow-md">
                {METHOD_CARDS[2].number}
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs font-sans font-bold text-[#1E2A27]/90 uppercase tracking-wider">
                {METHOD_CARDS[2].subtitle}
              </p>
            </div>
          </div>

          {/* Card 04 */}
          <div
            ref={card4Ref}
            style={{ backgroundColor: METHOD_CARDS[3].bgColor }}
            className="absolute inset-0 m-auto opacity-0 w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-[40px] shadow-2xl text-white p-8 flex flex-col justify-between cursor-pointer border-2 border-white/20 z-40"
          >
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/80 block">
                {METHOD_CARDS[3].category}
              </span>
            </div>
            <div className="my-auto text-center">
              <span className="font-foudre font-black text-[120px] sm:text-[140px] leading-none text-white block tracking-tighter drop-shadow-md">
                {METHOD_CARDS[3].number}
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs font-sans font-bold text-white/90 uppercase tracking-wider">
                {METHOD_CARDS[3].subtitle}
              </p>
            </div>
          </div>

          {/* Card 05 */}
          <div
            ref={card5Ref}
            style={{ backgroundColor: METHOD_CARDS[4].bgColor }}
            className="absolute inset-0 m-auto opacity-0 w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-[40px] shadow-2xl text-white p-8 flex flex-col justify-between cursor-pointer border-2 border-white/20 z-50"
          >
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/80 block">
                {METHOD_CARDS[4].category}
              </span>
            </div>
            <div className="my-auto text-center">
              <span className="font-foudre font-black text-[120px] sm:text-[140px] leading-none text-white block tracking-tighter drop-shadow-md">
                {METHOD_CARDS[4].number}
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs font-sans font-bold text-white/90 uppercase tracking-wider">
                {METHOD_CARDS[4].subtitle}
              </p>
            </div>
          </div>

          {/* Card 06 */}
          <div
            ref={card6Ref}
            style={{ backgroundColor: METHOD_CARDS[5].bgColor }}
            className="absolute inset-0 m-auto opacity-0 w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-[40px] shadow-2xl text-white p-8 flex flex-col justify-between cursor-pointer border-2 border-white/20 z-[60]"
          >
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/80 block">
                {METHOD_CARDS[5].category}
              </span>
            </div>
            <div className="my-auto text-center">
              <span className="font-foudre font-black text-[120px] sm:text-[140px] leading-none text-white block tracking-tighter drop-shadow-md">
                {METHOD_CARDS[5].number}
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs font-sans font-bold text-white/90 uppercase tracking-wider">
                {METHOD_CARDS[5].subtitle}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: English Process Writeup */}
        <div className="lg:col-span-4 flex flex-col justify-between h-[480px] py-2">
          
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm sm:text-base text-[#C84B31] uppercase tracking-wide">
              At Ping, every hangout follows a seamless 1-click consensus flow.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#2D5D4B]/90 leading-relaxed font-medium">
              Great nights out shouldn't take 500 messages to organize. Drop one link, let your squad vote live on venues and time slots, and lock it in automatically.
            </p>
          </div>

          {/* Feature Card */}
          <div className="mt-auto">
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-[#C84B31] text-white p-4 rounded-[28px] shadow-2xl w-full border border-white/20"
            >
              <div className="flex flex-row gap-4 items-center">
                <div className="relative w-28 h-32 rounded-[18px] overflow-hidden shrink-0">
                  <img
                    src="/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg"
                    alt="Ping Spotlight"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-1.5">
                  <div>
                    <span className="text-[10px] font-sans text-[#F9F1F0] uppercase font-bold block">
                      SPOTLIGHT VIBE
                    </span>
                    <h4 className="font-foudre font-black text-2xl text-white uppercase leading-[0.8] my-0.5">
                      OVERSTORY ROOFTOP
                    </h4>
                  </div>

                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-[#4A154B] text-white font-bold text-[9px] rounded-full inline-block">
                      Sunset Cocktails
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#E89A3C] text-[#1E2A27] font-bold text-[9px] rounded-full inline-block ml-1">
                      5 Votes Cast
                    </span>
                  </div>

                  <div className="pt-0.5">
                    <a href="#explore" className="inline-flex items-center justify-center px-4 py-1.5 bg-[#F9F1F0] text-[#C84B31] font-extrabold text-[10px] rounded-full uppercase cursor-pointer hover:bg-white transition-colors">
                      Vote Live
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};
