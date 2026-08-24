import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const METHOD_CARDS = [
  {
    number: '01',
    category: 'STRATÉGIE',
    subtitle: 'Analyse et positionnement',
    bgColor: '#D8518A', // Magenta
    bubbleEmoji: '🧠 ⚡ 🎯',
  },
  {
    number: '02',
    category: 'DIRECTION ARTISTIQUE',
    subtitle: 'Charte graphique et moodboard',
    bgColor: '#0A542E', // Deep Green
    bubbleEmoji: '🎨 📸 ✨',
  },
  {
    number: '03',
    category: 'CRÉATION DE CONTENU',
    subtitle: 'Vidéos, shooting & réels',
    bgColor: '#F04C7E', // Vibrant Pink
    bubbleEmoji: '🎬 📱 🚀',
  },
  {
    number: '04',
    category: 'COMMUNITY MANAGEMENT',
    subtitle: 'Animation et modération H24',
    bgColor: '#257CBA', // Electric Blue
    bubbleEmoji: '💬 💬 🍻',
  },
  {
    number: '05',
    category: 'INFLUENCE & EVENTS',
    subtitle: 'Casting créateurs et soirées VIP',
    bgColor: '#E59C00', // Mustard Yellow
    bubbleEmoji: '👑 🎉 🥂',
  },
  {
    number: '06',
    category: 'GROWTH & TARGETING',
    subtitle: 'Sponsorisation et analytics',
    bgColor: '#FF6B4A', // Bright Coral
    bubbleEmoji: '📈 ⚡ 📊',
  },
];

export const MethodoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const verticalReelRef = useRef<HTMLDivElement>(null);
  const [activeBubble, setActiveBubble] = useState('🧠 ⚡ 🎯');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reel = verticalReelRef.current;
      const section = sectionRef.current;
      if (!reel || !section) return;

      const totalReelHeight = reel.scrollHeight - 500;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=3800',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(5, Math.floor(self.progress * 6));
            setActiveBubble(METHOD_CARDS[step].bubbleEmoji);
          },
        },
      });

      // Vertical reel scroll from bottom up
      tl.to(reel, {
        y: -totalReelHeight,
        ease: 'none',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#FCEEE9] text-[#0A542E] py-16 px-4 md:px-12 overflow-hidden flex items-center justify-center select-none"
    >
      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 h-full">
        
        {/* Left Column: Fixed Headline & Emoji Bubble */}
        <div className="lg:col-span-4 space-y-6">
          <span className="text-xs font-sans font-bold text-[#F04C7E] uppercase tracking-widest block">
            MÉTHODO & PROCESS
          </span>

          <h2 className="font-foudre font-black text-[12vw] sm:text-[8.5vw] lg:text-[5.5vw] leading-[0.78] text-[#F04C7E] uppercase tracking-tighter block">
            NOUS <br />
            PRÉFÉRERONS <br />
            CET ORDRE. <br />
            TOUJOURS.
          </h2>

          {/* Soft Pastel Speech Bubble Sticker */}
          <motion.div
            key={activeBubble}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#0A542E] rounded-[24px] shadow-md text-lg font-bold border border-[#F04C7E]/20"
          >
            <span>{activeBubble}</span>
          </motion.div>
        </div>

        {/* Center Column: Vertical Reel of Numbered Cards 01 to 06 Scrolling Up */}
        <div className="lg:col-span-4 h-[550px] sm:h-[620px] overflow-hidden relative flex justify-center">
          <div
            ref={verticalReelRef}
            className="flex flex-col gap-8 items-center pt-8 w-full"
          >
            {METHOD_CARDS.map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                style={{ backgroundColor: card.bgColor }}
                className="w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-[40px] shadow-2xl shrink-0 text-white p-8 flex flex-col justify-between cursor-pointer border-2 border-white/20 relative"
              >
                {/* Header Category Title */}
                <div>
                  <span className="text-xs font-sans font-bold uppercase tracking-widest text-white/80 block">
                    {card.category}
                  </span>
                </div>

                {/* Giant Center Number */}
                <div className="my-auto text-center">
                  <span className="font-foudre font-black text-[130px] sm:text-[150px] leading-none text-white block tracking-tighter drop-shadow-md">
                    {card.number}
                  </span>
                </div>

                {/* Subtitle Footer */}
                <div className="text-center">
                  <p className="text-xs font-sans font-bold text-white/90 uppercase tracking-wider">
                    {card.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Writeup & Dark Olive Case Card */}
        <div className="lg:col-span-4 flex flex-col justify-between h-[520px] py-4">
          
          {/* Top Writeup Box */}
          <div className="space-y-3">
            <h3 className="font-sans font-bold text-sm sm:text-base text-[#F04C7E] uppercase tracking-wide">
              Chez Ping, chaque projet suit un process clair et structuré.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#0A542E]/80 leading-relaxed font-medium">
              Parce qu'une communication efficace ne s'improvise pas, nous avons créé une méthode étape par étape pour garantir consensus, réactivité et succès.
            </p>
          </div>

          {/* Bottom Dark Olive Case Card (Matching agencefoudre.com right side) */}
          <div className="mt-auto">
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-[#2C311F] text-white p-4 rounded-[28px] shadow-xl w-full"
            >
              <div className="flex flex-row gap-4 items-center">
                <div className="relative w-28 h-32 rounded-[18px] overflow-hidden shrink-0">
                  <img
                    src="/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg"
                    alt="Case du mois"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-1.5">
                  <div>
                    <span className="text-[10px] font-sans text-white/60 uppercase block">
                      Case du mois
                    </span>
                    <h4 className="font-foudre font-black text-2xl text-white uppercase leading-[0.8] my-0.5">
                      LE SAC DU BERGER
                    </h4>
                  </div>

                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-[#FCEEE9] text-[#0A542E] font-bold text-[9px] rounded-full inline-block">
                      Création de contenu
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#FCEEE9] text-[#0A542E] font-bold text-[9px] rounded-full inline-block ml-1">
                      Stratégie
                    </span>
                  </div>

                  <div className="pt-0.5">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 bg-[#F04C7E] text-white font-bold text-[10px] rounded-full uppercase cursor-pointer hover:bg-[#F04C7E]/90 transition-colors">
                      Voir le case
                    </span>
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
