import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Laptop, ThumbsUp, Zap, Smile } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WHY_CARDS = [
  {
    id: '01',
    icon: Laptop,
    title: 'NO MORE 500-MSG DEBATES',
    description: 'Skip endless texting back-and-forth. Drop one link into WhatsApp or iMessage and let the live voting engine do the work.',
    bg: 'bg-[#C84B31] text-white',
  },
  {
    id: '02',
    icon: ThumbsUp,
    title: '100% GUEST FRIENDLY',
    description: 'Nobody is forced to download apps or create accounts to vote. Your friends tap once and cast their vote in seconds.',
    bg: 'bg-[#2D5D4B] text-white',
  },
  {
    id: '03',
    icon: Zap,
    title: 'REAL-TIME MAP RADAR',
    description: 'Drop pins on nearby rooftop lounges, taco spots, or arcade bars. Everyone sees top venues updated live with spring physics.',
    bg: 'bg-[#E89A3C] text-[#1E2A27]',
  },
  {
    id: '04',
    icon: Smile,
    title: 'AUTOMATED LOCK-IN & ALERTS',
    description: 'Once top venue & time reach consensus, Ping locks automatically and sends final map directions to everyone in the group.',
    bg: 'bg-[#F9F1F0] text-[#C84B31]',
  },
];

export const WhyChoosePing: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: '+=3400',
          invalidateOnRefresh: true,
        },
      });

      // Card 01 flips up & away to reveal Card 02
      if (card1Ref.current) {
        tl.to(card1Ref.current, {
          y: -650,
          rotate: -14,
          scale: 0.9,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        });
      }

      // Card 02 flips up & away to reveal Card 03
      if (card2Ref.current) {
        tl.to(card2Ref.current, {
          y: -650,
          rotate: 14,
          scale: 0.9,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        }, '+=0.4');
      }

      // Card 03 flips up & away to reveal Card 04
      if (card3Ref.current) {
        tl.to(card3Ref.current, {
          y: -650,
          rotate: -10,
          scale: 0.9,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        }, '+=0.4');
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-ping"
      className="relative w-full h-screen bg-[#4A154B] text-white pt-32 pb-12 lg:py-16 px-4 sm:px-8 overflow-hidden flex flex-col justify-between transition-colors select-none"
    >
      {/* Top Banner Tag with Clear Mobile Navbar Clearance */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-20 pt-4 sm:pt-0">
        <span className="px-4 py-1.5 bg-[#E89A3C] text-[#1E2A27] font-foudre font-black text-xs uppercase tracking-wider rounded-full shadow-md">
          WHY SQUADS CHOOSE PING • 4 PILLARS
        </span>
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-white/80 hidden sm:inline-block">
          Scroll down to toss cards →
        </span>
      </div>

      {/* Giant Center Background Headline */}
      <div className="absolute inset-0 m-auto flex flex-col items-center justify-center z-0 pointer-events-none px-4 pt-24 sm:pt-0">
        <h2 className="font-foudre font-black text-[16vw] sm:text-[14vw] lg:text-[11.5vw] leading-[0.76] text-[#F9F1F0]/15 uppercase tracking-tighter text-center">
          WHY <br />
          SQUADS <br />
          CHOOSE PING
        </h2>
      </div>

      {/* Card Toss Deck Container */}
      <div className="w-full my-auto z-10 max-w-[1500px] mx-auto px-2 sm:px-8">
        
        {/* Mobile / Tablet / Desktop Unified Card Stack Deck */}
        <div className="relative w-[285px] sm:w-[340px] h-[385px] sm:h-[480px] mx-auto my-auto flex justify-center items-center">
          
          {/* Card 04 (Bottom Layer z-10) */}
          <div
            ref={card4Ref}
            className={`absolute inset-0 m-auto w-[280px] sm:w-[340px] h-[375px] sm:h-[480px] ${WHY_CARDS[3].bg} rounded-[36px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between border-4 border-white/30 cursor-pointer z-10`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center border border-current">
              <Smile className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2 sm:space-y-3 my-auto">
              <h3 className="font-foudre font-black text-2xl sm:text-4xl uppercase leading-[0.88] tracking-tight">
                {WHY_CARDS[3].title}
              </h3>
              <p className="text-[11px] sm:text-xs font-sans font-medium leading-relaxed opacity-95">
                {WHY_CARDS[3].description}
              </p>
            </div>

            <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-current/20">
              <span className="font-mono font-black text-xs sm:text-sm opacity-90">
                04 / 04
              </span>
              <span className="text-[10px] font-sans font-black uppercase tracking-widest">
                PING SPEED
              </span>
            </div>
          </div>

          {/* Card 03 (Layer z-20) */}
          <div
            ref={card3Ref}
            className={`absolute inset-0 m-auto w-[280px] sm:w-[340px] h-[375px] sm:h-[480px] ${WHY_CARDS[2].bg} rounded-[36px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between border-4 border-white/30 cursor-pointer z-20`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center border border-current">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2 sm:space-y-3 my-auto">
              <h3 className="font-foudre font-black text-2xl sm:text-4xl uppercase leading-[0.88] tracking-tight">
                {WHY_CARDS[2].title}
              </h3>
              <p className="text-[11px] sm:text-xs font-sans font-medium leading-relaxed opacity-95">
                {WHY_CARDS[2].description}
              </p>
            </div>

            <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-current/20">
              <span className="font-mono font-black text-xs sm:text-sm opacity-90">
                03 / 04
              </span>
              <span className="text-[10px] font-sans font-black uppercase tracking-widest">
                PING SPEED
              </span>
            </div>
          </div>

          {/* Card 02 (Layer z-30) */}
          <div
            ref={card2Ref}
            className={`absolute inset-0 m-auto w-[280px] sm:w-[340px] h-[375px] sm:h-[480px] ${WHY_CARDS[1].bg} rounded-[36px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between border-4 border-white/30 cursor-pointer z-30`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center border border-current">
              <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2 sm:space-y-3 my-auto">
              <h3 className="font-foudre font-black text-2xl sm:text-4xl uppercase leading-[0.88] tracking-tight">
                {WHY_CARDS[1].title}
              </h3>
              <p className="text-[11px] sm:text-xs font-sans font-medium leading-relaxed opacity-95">
                {WHY_CARDS[1].description}
              </p>
            </div>

            <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-current/20">
              <span className="font-mono font-black text-xs sm:text-sm opacity-90">
                02 / 04
              </span>
              <span className="text-[10px] font-sans font-black uppercase tracking-widest">
                PING SPEED
              </span>
            </div>
          </div>

          {/* Card 01 (Top Layer z-40) */}
          <div
            ref={card1Ref}
            className={`absolute inset-0 m-auto w-[280px] sm:w-[340px] h-[375px] sm:h-[480px] ${WHY_CARDS[0].bg} rounded-[36px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between border-4 border-white/30 cursor-pointer z-40`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center border border-current">
              <Laptop className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2 sm:space-y-3 my-auto">
              <h3 className="font-foudre font-black text-2xl sm:text-4xl uppercase leading-[0.88] tracking-tight">
                {WHY_CARDS[0].title}
              </h3>
              <p className="text-[11px] sm:text-xs font-sans font-medium leading-relaxed opacity-95">
                {WHY_CARDS[0].description}
              </p>
            </div>

            <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-current/20">
              <span className="font-mono font-black text-xs sm:text-sm opacity-90">
                01 / 04
              </span>
              <span className="text-[10px] font-sans font-black uppercase tracking-widest">
                PING SPEED
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
