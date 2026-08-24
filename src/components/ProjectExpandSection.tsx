import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ProjectExpandSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const expandCardRef = useRef<HTMLDivElement>(null);
  const initialTextRef = useRef<HTMLDivElement>(null);
  const frenchTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Pinned ScrollTrigger Expand & Zoom Timeline
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !expandCardRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: '+=2500',
          invalidateOnRefresh: true,
        },
      });

      // Step 1: Initial card text fades out
      tl.to(initialTextRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
      })

      // Step 2: Center card zooms and expands to fill 100% of full viewport canvas
      .to(
        expandCardRef.current,
        {
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          scale: 1,
          duration: 1.5,
          ease: 'power2.inOut',
        },
        '<'
      )

      // Step 3: Reveal giant French typography in white ultra-condensed font
      .fromTo(
        frenchTextRef.current,
        { scale: 0.85, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '<+=0.4'
      )

      // Step 4: Continue scrolling -> French text moves up into exit
      .to(frenchTextRef.current, {
        y: -180,
        opacity: 0.8,
        duration: 1,
        ease: 'none',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F294B8] text-white overflow-hidden flex items-center justify-center select-none"
    >
      {/* Expanding Magenta Card Container (Matching agencefoudre.com 'PLUS DE PROJETS ?') */}
      <div
        ref={expandCardRef}
        className="relative w-[340px] sm:w-[440px] h-[480px] sm:h-[560px] bg-[#D8518A] rounded-[40px] shadow-2xl flex items-center justify-center p-8 overflow-hidden z-20 transition-all"
      >
        
        {/* Initial Content (Before Zoom) */}
        <div
          ref={initialTextRef}
          className="flex flex-col items-center justify-between h-full w-full py-4 text-center z-10"
        >
          <div className="my-auto">
            <h2 className="font-foudre font-black text-6xl sm:text-7xl text-white uppercase leading-[0.78] tracking-tight">
              PLUS DE <br />
              PROJETS <br />
              ?
            </h2>
          </div>

          {/* Explorer Pill Button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="px-8 py-3 bg-[#F294B8] text-white font-sans font-bold text-sm rounded-full uppercase tracking-wider shadow-md hover:bg-[#F294B8]/90 transition-colors cursor-pointer"
          >
            Explorer
          </motion.button>
        </div>

        {/* Revealed French Typography Layer (Revealed during Zoom Expand) */}
        <div
          ref={frenchTextRef}
          className="absolute inset-0 m-auto flex flex-col items-center justify-center p-6 text-center opacity-0 pointer-events-none z-20"
        >
          <h2 className="font-foudre font-black text-[13vw] sm:text-[9.5vw] lg:text-[8vw] leading-[0.76] text-white uppercase tracking-tighter max-w-6xl">
            C'EST L'IMPACT DE <br />
            VOTRE SINCÉRITÉ <br />
            C'EST VISER JUSTE
          </h2>
        </div>

      </div>

      {/* Bottom Corner Tag */}
      <div className="absolute bottom-8 left-8 text-xs font-sans font-bold text-white/70 uppercase tracking-widest z-30">
        PROJETS
      </div>
    </section>
  );
};
