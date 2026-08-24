import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Check, Sparkles } from 'lucide-react';
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

  return ReactDOM.createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 select-none pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-[#F9F1F0] text-[#2D5D4B] p-6 sm:p-8 rounded-[36px] border-4 border-[#C84B31]/30 shadow-2xl z-10"
        >
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 bg-white/80 rounded-full border border-black/10 hover:bg-[#C84B31] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {saved ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 bg-[#2D5D4B] text-white rounded-full border-3 border-white flex items-center justify-center mx-auto shadow-2xl">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="font-foudre font-black text-3xl uppercase text-[#C84B31]">
                HANDLE UPDATED! ✨
              </h3>
              <p className="text-xs font-sans font-bold text-[#2D5D4B]/90">
                You are now active as <span className="text-[#C84B31]">@{inputHandle}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <span className="px-3 py-1 bg-[#C84B31] text-white font-sans font-black text-[10px] uppercase rounded-full inline-block mb-2 shadow-sm">
                  1-CLICK SQUAD SESSION
                </span>
                <h3 className="font-foudre font-black text-3xl uppercase tracking-tight text-[#C84B31]">
                  YOUR PING HANDLE
                </h3>
                <p className="text-xs font-sans text-[#2D5D4B]/80 font-medium">
                  Choose your active handle & squad avatar to cast live venue votes & chat.
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-sans font-extrabold uppercase text-[#2D5D4B] mb-2">
                  Select Squad Avatar
                </label>
                <div className="flex items-center gap-3">
                  {AVATAR_OPTIONS.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="Avatar option"
                      onClick={() => setSelectedAvatar(imgUrl)}
                      className={`w-14 h-14 rounded-2xl object-cover cursor-pointer border-4 transition-transform ${
                        selectedAvatar === imgUrl
                          ? 'border-[#C84B31] scale-110 shadow-xl'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Input Handle */}
              <div>
                <label className="block text-xs font-sans font-extrabold uppercase text-[#2D5D4B] mb-2">
                  Handle Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-sans font-extrabold text-[#C84B31]">@</span>
                  <input
                    type="text"
                    required
                    value={inputHandle}
                    onChange={(e) => setInputHandle(e.target.value.replace('@', ''))}
                    placeholder="alex_vibe"
                    className="w-full pl-9 pr-4 py-3 bg-white text-[#2D5D4B] font-sans font-bold border-2 border-[#2D5D4B]/20 rounded-2xl shadow-sm focus:outline-none focus:border-[#C84B31] transition-colors"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-[#2D5D4B] text-white font-sans font-extrabold text-sm rounded-2xl shadow-xl hover:bg-[#2D5D4B]/90 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider border-2 border-white/20"
              >
                <UserCheck className="w-5 h-5" />
                <span>Save Profile & Continue</span>
              </motion.button>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
