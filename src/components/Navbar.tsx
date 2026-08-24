import React from 'react';
import { motion } from 'framer-motion';
import { Menu, MessageCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PingLogoSvg } from './PingLogoSvg';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onOpenMenu: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal, onOpenMenu, onOpenChat }) => {
  const { userName, userAvatar, openAuthModal } = useAuth();

  const handleHomeRefresh = () => {
    window.location.href = '/';
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] px-6 py-4 flex items-center justify-between pointer-events-none">
      
      {/* Top Left: Menu Button + User Profile Badge */}
      <div className="pointer-events-auto flex items-center gap-3">
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-14 h-14 bg-[#C84B31] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-[#C84B31]/90 transition-transform border-2 border-white/40"
        >
          <Menu className="w-6 h-6 stroke-[2.5]" />
        </motion.button>

        <motion.div
          onClick={openAuthModal}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-full border border-black/10 shadow-md text-xs font-sans font-bold cursor-pointer"
        >
          <img
            src={userAvatar}
            alt="Avatar"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-[#C84B31]">{userName}</span>
        </motion.div>
      </div>

      {/* Middle Top: PING Brand Vector SVG Logo Badge */}
      <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-4">
        <motion.button
          type="button"
          onClick={handleHomeRefresh}
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.92 }}
          title="PING Home & Hard Refresh"
          className="px-4 py-2 bg-[#C84B31] text-white rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/60 cursor-pointer hover:bg-[#C84B31]/95 transition-transform"
        >
          <PingLogoSvg variant="icon" size={26} />
          <span className="font-foudre font-black text-xl text-white tracking-wider uppercase leading-none">
            PING
          </span>
        </motion.button>
      </div>

      {/* Top Right: Live Chat Button + Create Ping Button */}
      <div className="pointer-events-auto flex items-center gap-3">
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenChat();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="Open Squad Live Chat"
          className="w-14 h-14 bg-[#C84B31] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-[#C84B31]/90 transition-transform border-2 border-white/40"
        >
          <MessageCircle className="w-6 h-6 fill-white stroke-none" />
        </motion.button>

        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCreateModal();
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          title="Create New Ping Room"
          className="hidden sm:flex items-center gap-2 px-5 py-3 bg-[#2D5D4B] text-white font-sans font-bold text-xs rounded-full shadow-2xl uppercase cursor-pointer tracking-wider border-2 border-white/40 hover:bg-[#2D5D4B]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Ping</span>
        </motion.button>
      </div>

    </header>
  );
};
