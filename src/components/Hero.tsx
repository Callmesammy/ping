import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenCreateModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCreateModal }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pingHeaderRef = useRef<HTMLHeadingElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const centerCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const slide3Ref = useRef<HTMLDivElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);
  const featureCardRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      gsap.set([centerCardRef.current, slide2Ref.current, slide3Ref.current], {
        transformPerspective: 1200,
        transformOrigin: 'left center',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=2800',
          invalidateOnRefresh: true,
        },
      });

      // --- PHASE 1: Scroll starts -> Side cards tuck behind center, background turns Warm Crimson (#C84B31) ---
      tl.to([leftCardRef.current, rightCardRef.current], {
        x: 0,
        rotate: 0,
        opacity: 0,
        scale: 0.85,
        duration: 1,
        ease: 'power2.inOut',
      })
      .to(
        sectionRef.current,
        {
          backgroundColor: '#C84B31',
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '<'
      )
      .to(
        pingHeaderRef.current,
        {
          y: -180,
          opacity: 0.15,
          color: '#F9F1F0',
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '<'
      )
      .to(
        subHeadingRef.current,
        {
          y: -50,
          scale: 1.05,
          color: '#F9F1F0',
          duration: 1,
        },
        '<'
      );

      // --- PHASE 2: 3D PAPER FLIP (Slide 2 card flips in) ---
      tl.to(centerCardRef.current, {
        rotateY: -90,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      })
      .fromTo(
        slide2Ref.current,
        { rotateY: 95, x: 120, opacity: 0 },
        { rotateY: 0, x: 0, opacity: 1, duration: 1.3, ease: 'power2.out' },
        '<+=0.1'
      );

      // --- PHASE 3: 3D PAPER FLIP 2 (Background turns Sage Emerald #2D5D4B, text turns Mustard Gold #E89A3C) ---
      tl.to(
        sectionRef.current,
        {
          backgroundColor: '#2D5D4B',
          duration: 1.2,
          ease: 'power2.inOut',
        }
      )
      .to(
        subHeadingRef.current,
        {
          color: '#E89A3C',
          duration: 1,
        },
        '<'
      )
      .to(
        slide2Ref.current,
        {
          rotateY: -90,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        },
        '<'
      )
      .fromTo(
        slide3Ref.current,
        { rotateY: 95, x: 120, opacity: 0 },
        { rotateY: 0, x: 0, opacity: 1, duration: 1.3, ease: 'power2.out' },
        '<+=0.1'
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F9F1F0] text-[#2D5D4B] pt-14 pb-4 px-4 md:px-10 overflow-hidden flex flex-col justify-between transition-colors duration-700"
    >
      <div className="max-w-[1500px] mx-auto w-full relative z-10 flex-1 flex flex-col justify-between h-full">
        
        {/* Giant Ultra-Condensed Header Text ('PING') */}
        <div className="w-full text-center relative z-0 select-none pt-1">
          <h1
            ref={pingHeaderRef}
            className="font-foudre font-black text-[30vw] sm:text-[25vw] md:text-[22vw] leading-[0.7] text-[#C84B31] block uppercase tracking-[0.08em] scale-x-[1.18] origin-center transition-colors duration-700"
          >
            PING
          </h1>
        </div>

        {/* Center Card Container Stack */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative z-20 flex items-center justify-center -mt-28 sm:-mt-40 md:-mt-52 mb-2"
          style={{ perspective: '1200px' }}
        >
          <div className="relative w-full max-w-4xl h-[240px] sm:h-[300px] md:h-[350px] flex items-center justify-center">
            
            {/* Card 1: Left Photo */}
            <div
              ref={leftCardRef}
              style={{
                transform: isHovered
                  ? 'translate3d(140px, 0, 0) rotate(0deg) scale(0.92)'
                  : 'translate3d(0, 0, 0) rotate(-6deg)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
              }}
              className="absolute left-1 sm:left-6 md:left-12 z-10 w-[180px] sm:w-[240px] md:w-[280px] h-[230px] sm:h-[290px] md:h-[330px] bg-white rounded-[32px] shadow-2xl overflow-hidden cursor-pointer border-2 border-white/40"
            >
              <img
                src="/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg"
                alt="Brunch & Coffee"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 px-3 py-2 bg-[#F9F1F0] text-[#2D5D4B] font-sans font-bold text-xs rounded-[20px] shadow-md flex items-center gap-1.5 border border-white/60">
                <span className="text-sm">🖥️</span>
                <span className="text-sm">⚡</span>
                <span className="text-sm">🎧</span>
              </div>
            </div>

            {/* Card 1: Center Hero Photo */}
            <div
              ref={centerCardRef}
              className="relative z-20 w-[200px] sm:w-[260px] md:w-[300px] h-[260px] sm:h-[320px] md:h-[370px] bg-white rounded-[36px] shadow-2xl overflow-hidden cursor-pointer border-2 border-white/40"
            >
              <img
                src="/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg"
                alt="Social Crew"
                className="w-full h-full object-cover"
              />
              
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 px-3.5 py-1.5 bg-[#F9F1F0] rounded-[20px] shadow-md flex items-center justify-center border border-white/60"
              >
                <Zap className="w-4 h-4 text-[#C84B31] fill-[#C84B31]" />
              </motion.div>
            </div>

            {/* Card 1: Right Photo */}
            <div
              ref={rightCardRef}
              style={{
                transform: isHovered
                  ? 'translate3d(-140px, 0, 0) rotate(0deg) scale(0.92)'
                  : 'translate3d(0, 0, 0) rotate(6deg)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
              }}
              className="absolute right-1 sm:right-6 md:right-12 z-10 w-[180px] sm:w-[240px] md:w-[280px] h-[230px] sm:h-[290px] md:h-[330px] bg-white rounded-[32px] shadow-2xl overflow-hidden cursor-pointer border-2 border-white/40"
            >
              <img
                src="/pics/kobby-mendez-xBFTjrMIC0c-unsplash.jpg"
                alt="Nightlife & Drinks"
                className="w-full h-full object-cover"
              />
            </div>

            {/* --- SLIDE 2 CARD --- */}
            <div
              ref={slide2Ref}
              className="absolute inset-0 m-auto opacity-0 z-30 w-[210px] sm:w-[270px] md:w-[310px] h-[270px] sm:h-[330px] md:h-[380px] bg-white rounded-[36px] shadow-2xl overflow-hidden cursor-pointer pointer-events-auto border-2 border-white/40"
            >
              <img
                src="/pics/micaela-peduzi-ch4Fc1cGTq4-unsplash.jpg"
                alt="Arcade Night"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 p-3.5 bg-white/95 backdrop-blur-md rounded-[20px] border border-black/10 shadow-lg text-[#2D5D4B]">
                <span className="text-[10px] font-sans font-bold text-[#C84B31] uppercase tracking-wider block">
                  STAGE 02 • RETRO VIBES
                </span>
                <p className="font-foudre font-black text-xl uppercase leading-none mt-0.5">
                  ARCADE & PINBALL NIGHT
                </p>
              </div>
            </div>

            {/* --- SLIDE 3 CARD --- */}
            <div
              ref={slide3Ref}
              className="absolute inset-0 m-auto opacity-0 z-40 w-[210px] sm:w-[270px] md:w-[310px] h-[270px] sm:h-[330px] md:h-[380px] bg-white rounded-[36px] shadow-2xl overflow-hidden cursor-pointer pointer-events-auto border-2 border-white/40"
            >
              <img
                src="/pics/brands-people-en-u6xqnbsg-unsplash.jpg"
                alt="Tacos & Tequila"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 p-3.5 bg-[#1E2A27] text-white rounded-[20px] border border-white/20 shadow-lg">
                <span className="text-[10px] font-sans font-bold text-[#E89A3C] uppercase tracking-wider block">
                  STAGE 03 • LATE NIGHT
                </span>
                <p className="font-foudre font-black text-xl uppercase leading-none mt-0.5">
                  BIRRIA TACOS & MEZCAL
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Split Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end z-20 relative -mt-32 sm:-mt-44 md:-mt-56 pb-2">
          
          {/* Bottom-Left Subheading */}
          <div ref={subHeadingRef} className="lg:col-span-6 space-y-0.5 transition-colors duration-500">
            <span className="text-xs font-sans font-semibold opacity-80 tracking-wider uppercase block mb-0.5">
              Spontaneous linkup engine
            </span>
            <h2 className="font-foudre font-black text-[13vw] sm:text-[9.5vw] lg:text-[7.5vw] leading-[0.76] text-[#C84B31] uppercase tracking-tighter block transition-colors">
              SPONTANEITY <br />
              SQUAD CLUB
            </h2>
          </div>

          {/* Bottom-Right Feature Card */}
          <div className="lg:col-span-6 flex justify-end">
            <motion.div
              ref={featureCardRef}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 18 }}
              className="bg-[#2D5D4B] text-white p-3.5 sm:p-4 rounded-[28px] shadow-2xl max-w-md w-full border border-white/20 transition-colors duration-500"
            >
              <div className="flex flex-row gap-4 items-center">
                
                <div className="relative w-28 sm:w-32 h-32 sm:h-36 rounded-[18px] overflow-hidden shrink-0">
                  <img
                    src="/pics/tan-tony-Xek1XGQi-Ps-unsplash.jpg"
                    alt="Featured Spot"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-1.5">
                  <div>
                    <span className="text-[10px] font-sans font-medium text-white/80 tracking-wider uppercase block">
                      FEATURED SPOT OF THE MONTH
                    </span>
                    <h3 className="font-foudre font-black text-2xl sm:text-3xl text-white uppercase leading-[0.8] my-0.5">
                      OVERSTORY ROOFTOP
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <span className="px-3 py-0.5 bg-[#F9F1F0] text-[#2D5D4B] font-sans font-bold text-[10px] rounded-full inline-block">
                      Sunset Cocktails
                    </span>
                    <span className="px-3 py-0.5 bg-[#F9F1F0] text-[#2D5D4B] font-sans font-bold text-[10px] rounded-full inline-block ml-1">
                      1-Click Polls
                    </span>
                    <span className="px-3 py-0.5 bg-[#F9F1F0] text-[#2D5D4B] font-sans font-bold text-[10px] rounded-full inline-block">
                      Real-Time Map
                    </span>
                  </div>

                  <div className="pt-0.5">
                    <motion.a
                      href="#explore"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-5 py-2 bg-[#C84B31] text-white font-sans font-bold text-xs rounded-full uppercase cursor-pointer hover:bg-[#C84B31]/90 transition-colors shadow-sm"
                    >
                      <span>Explore Ping</span>
                    </motion.a>
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
