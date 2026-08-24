import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Instagram, Linkedin, Share2, ArrowUpRight, MessageCircle } from 'lucide-react';

interface NavigationMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
}

const MENU_LINKS = [
  { label: 'HOME', href: '#' },
  { label: 'EXPLORE PINGS', href: '#explore' },
  { label: '5-STEP FLOW', href: '#explore' },
  { label: 'SQUAD METHOD', href: '#explore' },
  { label: 'WHY PING', href: '#explore' },
  { label: 'FAQ', href: '#explore' },
  { label: 'CONTACT', href: '#explore' },
];

export const NavigationMenuDrawer: React.FC<NavigationMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCreateModal,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] overflow-hidden select-none">
          
          {/* Blacksmith Anvil Left Slamming Panel (#2D5D4B Sage Emerald) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 w-1/2 h-full bg-[#2D5D4B] z-10 border-r-4 border-[#E89A3C]/40 shadow-2xl"
          />

          {/* Blacksmith Anvil Right Slamming Panel (#1E2A27 Deep Forest) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 w-1/2 h-full bg-[#1E2A27] z-10 border-l-4 border-[#E89A3C]/40 shadow-2xl"
          />

          {/* Center Iron Clash Lightning Divider Animation */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-[#C84B31] z-20 hidden md:block opacity-90 shadow-[0_0_40px_#C84B31]"
          />

          {/* Main Content Overlay Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="relative z-30 w-full h-full text-[#F9F1F0] p-6 sm:p-12 flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Bar: Close 'X' Button & Ping Brand Badge */}
            <div className="w-full flex items-center justify-between">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-[#C84B31] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-2 border-white/40"
              >
                <X className="w-7 h-7 stroke-[3]" />
              </motion.button>

              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <span className="font-foudre font-black text-2xl text-[#E89A3C] uppercase tracking-wider">
                  PING
                </span>
                <span className="text-xs font-sans text-white/80 font-bold uppercase">
                  NAVIGATION
                </span>
              </div>
            </div>

            {/* Main Split Grid (Matching Screenshot 100%) */}
            <div className="max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
              
              {/* Left Column: Navigation Links */}
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  {MENU_LINKS.map((link, idx) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      whileHover={{ x: 16, color: '#E89A3C' }}
                      className="font-foudre font-black text-4xl sm:text-6xl md:text-7xl text-[#F9F1F0] uppercase tracking-tight block transition-colors leading-[0.88] cursor-pointer"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                {/* Social Icons Bar */}
                <div className="pt-6 flex items-center gap-4 text-[#F9F1F0]/80">
                  <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-[#C84B31] hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-[#C84B31] hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-[#C84B31] hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Right Column: WhatsApp QR Code Card (Matching Screenshot 100%) */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full max-w-md bg-[#2D5D4B] text-white p-8 sm:p-10 rounded-[36px] border-4 border-white/20 shadow-2xl space-y-6 text-center lg:text-left"
                >
                  {/* QR Code Container */}
                  <div className="flex justify-center lg:justify-start">
                    <div className="p-4 bg-white rounded-2xl shadow-xl inline-block">
                      <QrCode className="w-24 h-24 text-[#2D5D4B]" />
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-3">
                    <h3 className="font-foudre font-black text-4xl sm:text-5xl uppercase leading-[0.8] text-[#F9F1F0] tracking-tight">
                      SHALL WE CONNECT ON WHATSAPP?
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
                      Because we prefer genuine, quick, and straightforward exchanges. Scan the QR code, send your message, and we'll reply (very quickly).
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <motion.button
                      onClick={() => {
                        onClose();
                        onOpenCreateModal();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#C84B31] text-white font-sans font-extrabold text-xs rounded-full uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:bg-[#C84B31]/90 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Chat With Ping Squad</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="w-full flex items-center justify-between text-xs font-sans text-white/60 pt-4 border-t border-white/10 uppercase">
              <span>© {new Date().getFullYear()} PING ENGINE INC</span>
              <span>SPONTANEOUS LINKUPS</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
