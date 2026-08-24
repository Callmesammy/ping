import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, MessageCircle, Send, QrCode } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  pingTitle: string;
  pingId: string;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  pingTitle,
  pingId,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}/?ping=${pingId}`;
  const shareText = `🔥 Link up for "${pingTitle}"! Vote on venue & time here: ${inviteUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_self');
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
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-lg bg-[#F9F1F0] text-[#2D5D4B] p-6 sm:p-8 rounded-[36px] border-4 border-[#C84B31]/30 shadow-2xl z-10 space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/80 rounded-full border border-black/10 hover:bg-[#C84B31] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div>
            <span className="px-3.5 py-1 bg-[#C84B31] text-white font-sans font-black text-[10px] uppercase rounded-full inline-block mb-2 shadow-sm">
              SHARE MAGIC LINK
            </span>
            <h3 className="font-foudre font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#C84B31]">
              INVITE YOUR CREW 🚀
            </h3>
            <p className="text-xs font-sans text-[#2D5D4B]/80 font-medium">
              Anyone with this link can vote on place & time without registering.
            </p>
          </div>

          {/* Copy Link Input Box */}
          <div className="p-4 bg-white rounded-2xl border-2 border-[#2D5D4B]/20 shadow-sm space-y-2">
            <p className="text-[11px] font-sans font-extrabold text-[#2D5D4B]/70 uppercase tracking-wider">
              1-Click Magic Share URL
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="w-full px-3 py-2 bg-[#F9F1F0] text-[#2D5D4B] font-mono text-xs font-bold border border-black/10 rounded-xl select-all focus:outline-none"
              />
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                className={`px-4 py-2.5 rounded-xl font-sans font-extrabold text-xs border-2 border-[#2D5D4B] shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer uppercase tracking-wider ${
                  copied ? 'bg-[#2D5D4B] text-white' : 'bg-[#C84B31] text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={handleWhatsApp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="py-3 px-4 bg-[#25D366] text-white font-sans font-extrabold text-xs rounded-2xl border-2 border-white/20 shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              WhatsApp Group
            </motion.button>

            <motion.button
              onClick={handleSMS}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="py-3 px-4 bg-[#2D5D4B] text-white font-sans font-extrabold text-xs rounded-2xl border-2 border-white/20 shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              iMessage / SMS
            </motion.button>
          </div>

          {/* QR Code Scan */}
          <div className="p-4 bg-[#2D5D4B] text-white rounded-2xl border-2 border-white/20 shadow-xl flex items-center gap-4">
            <div className="w-16 h-16 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <QrCode className="w-12 h-12 text-[#2D5D4B]" />
            </div>
            <div>
              <p className="font-foudre font-black text-lg text-[#E89A3C] uppercase tracking-wide">
                QR Code Instant Scan
              </p>
              <p className="text-xs font-sans text-white/80 font-medium">
                Hold phone camera over QR code to join room instantly.
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
