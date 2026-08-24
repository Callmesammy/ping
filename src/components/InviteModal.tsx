import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, MessageCircle, Send, QrCode, Sparkles, Share2 } from 'lucide-react';

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0F3822]/85 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-lg bg-[#F4F1EA] p-6 sm:p-8 rounded-3xl border-4 border-[#0F3822] shadow-brutal-lg z-10 space-y-6"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white rounded-xl border-2 border-black shadow-brutal hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5 text-[#0F3822]" />
          </button>

          <div>
            <span className="px-3 py-1 bg-[#FF4D8D] text-white font-heading font-black text-xs uppercase rounded-full border border-black inline-block mb-2">
              SHARE MAGIC LINK
            </span>
            <h3 className="font-display font-black text-3xl uppercase tracking-tight text-[#0F3822]">
              INVITE YOUR CREW 🚀
            </h3>
            <p className="text-xs font-sans text-[#0F3822]/80">
              Anyone with this link can vote on place & time without registering.
            </p>
          </div>

          {/* Copy Link Input Box */}
          <div className="p-4 bg-white rounded-2xl border-3 border-[#0F3822] shadow-brutal space-y-2">
            <p className="text-[11px] font-heading font-extrabold text-[#0F3822]/70 uppercase">
              1-Click Magic Share URL
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="w-full px-3 py-2 bg-[#F4F1EA] text-[#0F3822] font-mono text-xs font-bold border-2 border-black rounded-xl select-all focus:outline-none"
              />
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                className={`px-4 py-2.5 rounded-xl font-heading font-extrabold text-xs border-2 border-black shadow-brutal flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copied ? 'bg-[#00E676] text-[#0F3822]' : 'bg-[#FF4D8D] text-white'
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
              className="py-3 px-4 bg-[#25D366] text-white font-heading font-extrabold text-xs rounded-2xl border-3 border-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              WhatsApp Group
            </motion.button>

            <motion.button
              onClick={handleSMS}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="py-3 px-4 bg-[#181E1B] text-[#00E676] font-heading font-extrabold text-xs rounded-2xl border-3 border-black shadow-brutal flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Send className="w-4 h-4" />
              iMessage / SMS
            </motion.button>
          </div>

          {/* QR Code Demo Visual */}
          <div className="p-4 bg-[#0F3822] text-[#F4F1EA] rounded-2xl border-3 border-black shadow-brutal flex items-center gap-4">
            <div className="w-16 h-16 bg-white p-2 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-[#0F3822]" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-sm text-[#00E676]">
                QR Code Instant Scan
              </p>
              <p className="text-xs font-sans text-white/70">
                Hold phone camera over QR code to join room instantly.
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
