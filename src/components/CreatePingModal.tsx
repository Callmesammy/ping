import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check } from 'lucide-react';
import { createPingApi } from '../lib/api';

interface CreatePingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (title: string, tag: string) => void;
}

const TAG_PRESETS = [
  { label: '🍹 Drinks & Sunset', color: 'bg-[#C84B31]' },
  { label: '🌮 Late Night Eats', color: 'bg-[#2D5D4B]' },
  { label: '🕹️ Arcade & Gaming', color: 'bg-[#E89A3C]' },
  { label: '☕ Weekend Brunch', color: 'bg-[#4A154B]' },
];

export const CreatePingModal: React.FC<CreatePingModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState(TAG_PRESETS[0].label);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSuccess(true);
    
    // Call backend API endpoint
    await createPingApi(title, selectedTag);

    setTimeout(() => {
      onCreated(title, selectedTag);
      setIsSuccess(false);
      setTitle('');
      onClose();
    }, 1200);
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 select-none pointer-events-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-lg bg-[#F9F1F0] text-[#2D5D4B] p-6 sm:p-8 rounded-[36px] border-4 border-[#C84B31]/40 shadow-2xl z-10 space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/80 rounded-full border border-black/10 hover:bg-[#C84B31] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#2D5D4B] text-white rounded-full border-2 border-white flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="font-foudre font-black text-4xl text-[#C84B31] uppercase">
                PING DROPPED! 🚀
              </h3>
              <p className="text-sm font-sans font-bold text-[#2D5D4B]">
                Broadcasting live 20-min voting arena to your squad...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <span className="px-3.5 py-1 bg-[#C84B31] text-white font-sans font-black text-[10px] uppercase rounded-full inline-block mb-2 shadow-sm">
                  START A NEW PING
                </span>
                <h3 className="font-foudre font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#C84B31]">
                  WHAT'S THE VIBE TONIGHT?
                </h3>
                <p className="text-xs font-sans text-[#2D5D4B]/80 font-medium">
                  Max 5 venues • 20 mins room timer • 5 votes/day per person limit.
                </p>
              </div>

              {/* Input: Plan Title */}
              <div>
                <label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#2D5D4B] mb-2">
                  Ping Topic / Plan Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tacos & Mezcal run at 8pm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-[#2D5D4B] font-sans font-bold border-2 border-[#2D5D4B]/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C84B31]"
                />
              </div>

              {/* Tag Selection */}
              <div>
                <label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#2D5D4B] mb-2">
                  Select Vibe Tag
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAG_PRESETS.map((tag) => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => setSelectedTag(tag.label)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-sans font-extrabold border-2 border-transparent transition-all cursor-pointer ${
                        selectedTag === tag.label
                          ? `${tag.color} text-white shadow-md scale-105 border-white`
                          : 'bg-white text-[#2D5D4B] hover:bg-neutral-100'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-[#C84B31] text-white font-foudre font-black text-xl rounded-full shadow-2xl hover:bg-[#C84B31]/90 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide border-2 border-white"
              >
                <Zap className="w-5 h-5 fill-white" />
                Launch 20-Min Voting Arena
              </motion.button>

            </form>
          )}

        </motion.div>

      </div>
    </AnimatePresence>,
    document.body
  );
};
