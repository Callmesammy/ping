import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Sparkles, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AVATAR_OPTIONS = [
  '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
  '/pics/luthfi-alfarizi-0piYmLeSgTQ-unsplash.jpg',
  '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
  '/pics/luthfi-alfarizi-xRMK0ea-Of4-unsplash.jpg',
];

export const AuthModal: React.FC = () => {
  const { userName, userAvatar, isAuthModalOpen, setUserName, setUserAvatar, closeAuthModal } = useAuth();
  const [inputHandle, setInputHandle] = useState(userName.replace('@', ''));
  const [selectedAvatar, setSelectedAvatar] = useState(userAvatar);
  const [saved, setSaved] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputHandle.trim()) return;

    setUserName(inputHandle.trim());
    setUserAvatar(selectedAvatar);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
      closeAuthModal();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-[#0F3822]/85 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-[#F4F1EA] p-6 sm:p-8 rounded-3xl border-4 border-[#0F3822] shadow-brutal-lg z-10"
        >
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 bg-white rounded-xl border-2 border-black shadow-brutal hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5 text-[#0F3822]" />
          </button>

          {saved ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 bg-[#00E676] rounded-full border-3 border-black flex items-center justify-center mx-auto shadow-brutal">
                <Check className="w-8 h-8 text-[#0F3822] stroke-[3]" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase text-[#0F3822]">
                HANDLE UPDATED! ✨
              </h3>
              <p className="text-xs font-sans font-bold text-[#0F3822]/80">
                You are now signed in as <span className="text-[#FF4D8D]">@{inputHandle}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <span className="px-3 py-1 bg-[#00E676] text-[#0F3822] font-heading font-black text-xs uppercase rounded-full border border-black inline-block mb-2">
                  TOKENLESS AUTH SESSION
                </span>
                <h3 className="font-display font-black text-3xl uppercase tracking-tight text-[#0F3822]">
                  YOUR SOCIAL HANDLE
                </h3>
                <p className="text-xs font-sans text-[#0F3822]/70">
                  No passwords required. Choose your handle & avatar to cast real-time votes.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-heading font-extrabold uppercase text-[#0F3822] mb-2">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3">
                  {AVATAR_OPTIONS.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="Avatar option"
                      onClick={() => setSelectedAvatar(imgUrl)}
                      className={`w-14 h-14 rounded-2xl object-cover cursor-pointer border-3 transition-transform ${
                        selectedAvatar === imgUrl
                          ? 'border-[#00E676] scale-110 shadow-brutal-pulse'
                          : 'border-[#0F3822] opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Input Handle */}
              <div>
                <label className="block text-xs font-heading font-extrabold uppercase text-[#0F3822] mb-2">
                  Handle Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-heading font-extrabold text-[#FF4D8D]">@</span>
                  <input
                    type="text"
                    required
                    value={inputHandle}
                    onChange={(e) => setInputHandle(e.target.value.replace('@', ''))}
                    placeholder="alex_vibe"
                    className="w-full pl-9 pr-4 py-3 bg-white text-[#0F3822] font-sans font-bold border-3 border-[#0F3822] rounded-2xl shadow-brutal focus:outline-none focus:ring-2 focus:ring-[#00E676]"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-[#00E676] text-[#0F3822] font-display font-black text-lg border-3 border-[#0F3822] rounded-2xl shadow-brutal hover:bg-[#00E676]/90 cursor-pointer flex items-center justify-center gap-2 uppercase"
              >
                <UserCheck className="w-5 h-5" />
                Save Session & Continue
              </motion.button>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
