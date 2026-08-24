import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Sparkles } from 'lucide-react';
import { socket } from '../lib/socket';
import { sendChatMessageApi, fetchPing } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  pingId: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface LiveChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pingTitle: string;
  pingId: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    pingId: 'friday-vibes',
    sender: '@sara',
    avatar: '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg',
    text: '7:30 PM slot looks ideal! Let’s meet at Overstory 🍸',
    timestamp: '14:20',
  },
  {
    id: 'm2',
    pingId: 'friday-vibes',
    sender: '@alex_vibe',
    avatar: '/pics/luthfi-alfarizi-0piYmLeSgTQ-unsplash.jpg',
    text: 'Locked in my vote for Overstory Rooftop! 🔥',
    timestamp: '14:22',
  },
];

export const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({
  isOpen,
  onClose,
  pingTitle,
  pingId,
}) => {
  const { userName, userAvatar } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    socket.emit('join_room', pingId);

    const onMessageReceived = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on('chat_message_received', onMessageReceived);

    fetchPing(pingId).then((data) => {
      if (data && data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      }
    });

    return () => {
      socket.off('chat_message_received', onMessageReceived);
    };
  }, [isOpen, pingId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const msgText = inputText.trim();
    setInputText('');

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      pingId,
      sender: userName,
      avatar: userAvatar,
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, tempMessage]);

    socket.emit('send_message', {
      pingId,
      sender: userName,
      avatar: userAvatar,
      text: msgText,
    });

    await sendChatMessageApi(pingId, userName, userAvatar, msgText);
  };

  const handleSendEmoji = (emoji: string) => {
    setInputText((prev) => prev + ' ' + emoji);
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-md flex justify-end overflow-hidden select-none pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full bg-[#1E2A27] text-[#F9F1F0] border-l-4 border-white/20 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 bg-[#2D5D4B] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#C84B31] text-white rounded-2xl shadow-md">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold text-[#E89A3C] uppercase tracking-widest block">
                    LIVE SQUAD CHAT
                  </span>
                  <h3 className="font-foudre font-black text-2xl uppercase tracking-tight text-white leading-none">
                    {pingTitle}
                  </h3>
                </div>
              </div>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#C84B31] transition-colors"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </motion.button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender === userName;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-8 h-8 rounded-full border border-white/30 object-cover shrink-0"
                    />

                    <div className={`max-w-[75%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      <span className="text-[10px] font-sans font-bold text-white/60 uppercase block">
                        {msg.sender} • {msg.timestamp}
                      </span>

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm font-sans font-medium leading-relaxed shadow-md ${
                          isMe
                            ? 'bg-[#C84B31] text-white rounded-br-none'
                            : 'bg-[#2D5D4B] text-white rounded-bl-none border border-white/10'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Emoji Reaction Bar */}
            <div className="px-6 py-2 bg-black/20 flex items-center gap-2 overflow-x-auto border-t border-white/10">
              {['🍸', '🔥', '🌮', '🍻', '🚀', '💯', '🥳'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSendEmoji(emoji)}
                  className="px-3 py-1 bg-white/10 hover:bg-[#C84B31] text-sm rounded-full transition-colors cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#2D5D4B] border-t border-white/10 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to your squad..."
                className="flex-1 bg-white/10 text-white placeholder-white/50 text-xs sm:text-sm font-sans px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:border-[#E89A3C] transition-colors"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-[#C84B31] text-white rounded-2xl shadow-lg cursor-pointer hover:bg-[#C84B31]/90 transition-colors"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
