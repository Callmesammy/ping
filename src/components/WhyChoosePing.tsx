import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  },
  {
    id: '02',
    icon: ThumbsUp,
    title: '100% GUEST FRIENDLY',
    description: 'Nobody is forced to download apps or create accounts to vote. Your friends tap once and cast their vote in seconds.',
  },
  {
    id: '03',
    icon: Zap,
    title: 'REAL-TIME MAP RADAR',
    description: 'Drop pins on nearby rooftop lounges, taco spots, or arcade bars. Everyone sees top venues updated live with spring physics.',
  },
  {
    id: '04',
    icon: Smile,
    title: 'AUTOMATED LOCK-IN & ALERTS',
    description: 'Once top venue & time reach consensus, Ping locks automatically and sends final map directions to everyone in the group.',
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

      gsap.set(cards, {
        transformPerspective: 1200,
        transformOrigin: 'center bottom',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=4200',
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, idx) => {
        if (card) {
          tl.fromTo(
            card,
            { y: 550, rotateX: 65, opacity: 0, scale: 0.85 },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: 'power3.out',
            },
            idx === 0 ? '+=0.2' : '+=0.3'
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-ping"
      className="relative w-full h-screen bg-[#4A154B] text-white py-16 overflow-hidden flex flex-col justify-between transition-colors select-none"
    >
      {/* Top Banner Tag */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 w-full flex items-center justify-between z-20">
        <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#E89A3C]">
          WHY SQUADS CHOOSE PING • 4 PILLARS
        </span>
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-white/80">
          Scroll down to flip cards →
        </span>
      </div>

      {/* Giant Center Background Headline */}
      <div className="absolute inset-0 m-auto flex flex-col items-center justify-center z-0 pointer-events-none px-4">
        <h2 className="font-foudre font-black text-[18vw] sm:text-[14vw] lg:text-[11.5vw] leading-[0.76] text-[#F9F1F0]/15 uppercase tracking-tighter text-center">
          WHY <br />
          SQUADS <br />
          CHOOSE PING
        </h2>
      </div>

      {/* 3D Flip Cards Grid Container */}
      <div className="w-full my-auto z-10 max-w-[1500px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-items-center">
          {WHY_CARDS.map((card, idx) => {
            const IconComponent = card.icon;
            const refMap = [card1Ref, card2Ref, card3Ref, card4Ref];
            const cardBgs = ['bg-[#C84B31] text-white', 'bg-[#2D5D4B] text-white', 'bg-[#E89A3C] text-[#1E2A27]', 'bg-[#F9F1F0] text-[#C84B31]'];

            return (
              <div
                key={card.id}
                ref={refMap[idx]}
                className={`relative w-full max-w-[320px] sm:max-w-[340px] h-[440px] sm:h-[490px] ${cardBgs[idx]} rounded-[36px] p-7 shadow-2xl flex flex-col justify-between border-2 border-white/20 cursor-pointer group`}
              >
                {/* Top Icon */}
                <div className="w-14 h-14 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center border border-current group-hover:scale-110 transition-transform">
                  <IconComponent className="w-7 h-7 stroke-[2]" />
                </div>

                {/* Center Title & Description */}
                <div className="space-y-3 my-auto">
                  <h3 className="font-foudre font-black text-3xl sm:text-4xl uppercase leading-[0.8] tracking-tight">
                    {card.title}
                  </h3>

                  <p className="text-xs font-sans font-medium leading-relaxed opacity-90">
                    {card.description}
                  </p>
                </div>

                {/* Card Number Badge */}
                <div className="pt-2 flex items-center justify-between border-t border-current/20">
                  <span className="font-mono font-bold text-xs opacity-80">
                    {card.id} / 04
                  </span>
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider">
                    PING SPEED
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
