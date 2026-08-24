import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Share2, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenQuiz?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuiz }) => {
  return (
    <footer id="contact" className="bg-[#F9F1F0] text-[#2D5D4B] pt-20 pb-8 px-4 sm:px-12 relative overflow-hidden select-none border-t border-[#C84B31]/10">
      <div className="max-w-[1600px] mx-auto w-full space-y-12">
        
        {/* Top Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20 relative">
          
          {/* Left Column: Crew Group Photo */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full max-w-xl h-[340px] sm:h-[420px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white z-20"
            >
              <img
                src="/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg"
                alt="Ping Squad"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Right Column: Warm Crimson Tilted Contact Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="w-full max-w-lg bg-[#C84B31] text-white p-8 sm:p-12 rounded-[40px] shadow-2xl transform -rotate-3 border-2 border-white/20 space-y-6 z-20"
            >
              <span className="text-xs font-sans font-bold text-[#F9F1F0] uppercase tracking-widest block">
                CREATE A ROOM
              </span>

              <h2 className="font-foudre font-black text-5xl sm:text-6xl text-white uppercase leading-[0.78] tracking-tight">
                READY TO <br />
                START A PING?
              </h2>

              <p className="font-sans font-medium text-sm sm:text-base text-white/90 leading-relaxed">
                Create a live room in 10 seconds, share the 1-click magic link with your squad, and lock in tonight's vibe.
              </p>

              <div className="pt-2">
                <button
                  onClick={onOpenQuiz}
                  className="px-8 py-3.5 bg-[#F9F1F0] text-[#C84B31] font-sans font-extrabold text-xs rounded-full uppercase tracking-wider shadow-md hover:bg-white transition-colors cursor-pointer"
                >
                  Create A Ping Room
                </button>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Giant Sage Emerald PING Typography ('#2D5D4B') */}
        <div className="relative z-10 w-full overflow-hidden -mt-12 sm:-mt-20 py-2">
          <h1 className="font-foudre font-black text-[25vw] leading-[0.72] tracking-tighter text-[#2D5D4B] uppercase select-none text-center opacity-95 hover:scale-[1.01] transition-transform duration-500">
            PING
          </h1>
        </div>

        {/* Bottom Navigation & Legal Bar */}
        <div className="z-20 relative pt-4 border-t border-[#2D5D4B]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans font-bold text-[#2D5D4B]">
          
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} PING ENGINE, INC. ALL RIGHTS RESERVED.</span>
            
            <div className="flex items-center gap-3 ml-2">
              <a href="#" className="hover:text-[#C84B31] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#C84B31] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#C84B31] transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#2D5D4B]/70 uppercase tracking-wider text-[11px]">
            <a href="#" className="hover:text-[#C84B31] transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-[#C84B31] transition-colors">
              TERMS OF SERVICE
            </a>
            <a href="#" className="hover:text-[#C84B31] transition-colors">
              PING ENGINE INC
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};
