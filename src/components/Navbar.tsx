import React from 'react';
import { motion } from 'framer-motion';
import { Menu, MessageCircle, Plus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { userName, userAvatar, openAuthModal } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
      {/* Top Left: Circular Warm Crimson Menu Button */}
      <div className="pointer-events-auto flex items-center gap-3">
        <motion.button
          onClick={onOpenCreateModal}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="w-14 h-14 bg-[#C84B31] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#C84B31]/90 transition-transform"
        >
          <Menu className="w-6 h-6 stroke-[2.5]" />
        </motion.button>

        <motion.div
          onClick={openAuthModal}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-full border border-black/10 shadow-sm text-xs font-sans font-bold cursor-pointer"
        >
          <img
            src={userAvatar}
            alt="Avatar"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-[#C84B31]">{userName}</span>
        </motion.div>
      </div>

      {/* Top Right: Circular Action & Create Buttons */}
      <div className="pointer-events-auto flex items-center gap-3">
        <motion.button
          onClick={onOpenCreateModal}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="w-14 h-14 bg-[#C84B31] text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#C84B31]/90 transition-transform"
        >
          <MessageCircle className="w-6 h-6 fill-white stroke-none" />
        </motion.button>

        <motion.button
          onClick={onOpenCreateModal}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="hidden sm:flex items-center gap-2 px-5 py-3 bg-[#2D5D4B] text-white font-sans font-bold text-xs rounded-full shadow-lg uppercase cursor-pointer tracking-wider hover:bg-[#2D5D4B]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Start a Ping</span>
        </motion.button>
      </div>
    </header>
  );
};
