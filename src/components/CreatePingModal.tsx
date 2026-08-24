import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check } from 'lucide-react';
import { createPingApi } from '../lib/api';

interface CreatePingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (title: string, tag: string) => void;
}

const TAG_PRESETS = [
  { label: '🍹 Drinks & Sunset', color: 'bg-[#FF4D8D]' },
  { label: '🌮 Late Night Eats', color: 'bg-[#00E676]' },
  { label: '🕹️ Arcade & Gaming', color: 'bg-[#FF6B4A]' },
  { label: '☕ Weekend Brunch', color: 'bg-[#181E1B]' },
];

export const CreatePingModal: React.FC<CreatePingModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState(TAG_PRESETS[0].label);
  const [isSuccess, setIsSuccess] = useState(false);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0F3822]/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg bg-[#F4F1EA] p-6 sm:p-8 rounded-3xl border-4 border-[#0F3822] shadow-brutal-lg z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-white rounded-xl border-2 border-black shadow-brutal hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-5 h-5 text-[#0F3822]" />
            </button>

            {isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#00E676] rounded-full border-3 border-black flex items-center justify-center mx-auto shadow-brutal animate-bounce">
                  <Check className="w-8 h-8 text-[#0F3822] stroke-[3]" />
                </div>
                <h3 className="font-display font-black text-3xl text-[#0F3822] uppercase">
                  PING DROPPED! 🚀
                </h3>
                <p className="text-sm font-sans font-bold text-[#0F3822]/80">
                  Broadcasting live websocket room to your group chat...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <span className="px-3 py-1 bg-[#FF4D8D] text-white font-heading font-black text-xs uppercase rounded-full border border-black inline-block mb-2">
                    START A NEW PING
                  </span>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tight text-[#0F3822]">
                    WHAT'S THE VIBE TONIGHT?
                  </h3>
                  <p className="text-xs font-sans text-[#0F3822]/70">
                    No agendas or long threads. Name it, pick a tag, and send the link.
                  </p>
                </div>

                {/* Input: Plan Title */}
                <div>
                  <label className="block text-xs font-heading font-extrabold uppercase text-[#0F3822] mb-2">
                    Ping Topic / Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tacos & Mezcal run at 8pm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-[#0F3822] font-sans font-bold border-3 border-[#0F3822] rounded-2xl shadow-brutal focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                  />
                </div>

                {/* Tag Selection */}
                <div>
                  <label className="block text-xs font-heading font-extrabold uppercase text-[#0F3822] mb-2">
                    Select Vibe Tag
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAG_PRESETS.map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => setSelectedTag(tag.label)}
                        className={`px-3 py-2 rounded-xl text-xs font-heading font-extrabold border-2 border-black transition-transform cursor-pointer ${
                          selectedTag === tag.label
                            ? `${tag.color} text-white shadow-brutal scale-105`
                            : 'bg-white text-[#0F3822] hover:bg-neutral-100'
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
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-full py-4 bg-[#00E676] text-[#0F3822] font-display font-black text-lg border-3 border-[#0F3822] rounded-2xl shadow-brutal hover:bg-[#00E676]/90 cursor-pointer flex items-center justify-center gap-2 uppercase"
                >
                  <Zap className="w-5 h-5 fill-[#0F3822]" />
                  Launch Ping & Share
                </motion.button>

              </form>
            )}

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
