import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Users, UserCheck, Radio, Bot } from 'lucide-react';
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
  isAi?: boolean;
}

interface LiveChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pingTitle: string;
  pingId: string;
}

const SQUAD_PEERS = [
  { handle: '@sara', name: 'Sara Chen', avatar: '/pics/26pigeons-6-W0p0fbrT0-unsplash.jpg', status: 'Online 🟢' },
  { handle: '@marcus', name: 'Marcus Vance', avatar: '/pics/luthfi-alfarizi-0piYmLeSgTQ-unsplash.jpg', status: 'Online 🟢' },
  { handle: '@elena', name: 'Elena Rostova', avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg', status: 'In Voting ⚡' },
  { handle: '🤖 @PingAI', name: 'Ping AI Curator', avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg', status: 'AI Active 🤖' },
];

const AI_ACTION_CHIPS = [
  { label: '🤖 Recommend Rooftop', query: 'Recommend the top rooftop venue for tonight' },
  { label: '⏰ Best Time Slot', query: 'What is the best time slot for squad consensus?' },
  { label: '📊 Summarize Votes', query: 'Summarize the current live venue votes' },
  { label: '🍸 Drink Specials', query: 'What are tonight’s cocktail specials?' },
];

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
    sender: '@marcus',
    avatar: '/pics/luthfi-alfarizi-0piYmLeSgTQ-unsplash.jpg',
    text: 'Locked in my vote for Overstory Rooftop! 🔥',
    timestamp: '14:22',
  },
  {
    id: 'm3',
    pingId: 'friday-vibes',
    sender: '🤖 @PingAI',
    avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
    text: '🤖 AI Curator: Overstory Rooftop Lounge has 5 active votes! Sunset starts at 7:42 PM 🌅',
    timestamp: '14:23',
    isAi: true,
  },
];

export const LiveChatDrawer: React.FC<LiveChatDrawerProps> = ({
  isOpen,
  onClose,
  pingTitle,
  pingId,
}) => {
  const { userName, userAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState<'group' | 'dm'>('group');
  const [activePeer, setActivePeer] = useState(SQUAD_PEERS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [dmMessages, setDmMessages] = useState<Record<string, ChatMessage[]>>({
    '@sara': [
      {
        id: 'dm1',
        pingId,
        sender: '@sara',
        avatar: SQUAD_PEERS[0].avatar,
        text: 'Hey! Are you heading to the rooftop early?',
        timestamp: '14:15',
      },
    ],
    '🤖 @PingAI': [
      {
        id: 'dm-ai',
        pingId,
        sender: '🤖 @PingAI',
        avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
        text: '🤖 Hi! I am your AI Ping Squad Curator. Ask me for spot recommendations, time slots, or venue directions!',
        timestamp: '14:16',
        isAi: true,
      },
    ],
  });

  const [inputText, setInputText] = useState('');
  const [activeSender, setActiveSender] = useState(userName);
  const [isTyping, setIsTyping] = useState(false);
  const [typingPeerName, setTypingPeerName] = useState('🤖 @PingAI');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    socket.emit('join_room', pingId);

    const onMessageReceived = (msg: ChatMessage) => {
      setIsTyping(false);
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
  }, [messages, dmMessages, isTyping]);

  const handleSendMessage = async (textToSend?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalMsg = textToSend || inputText;
    if (!finalMsg.trim()) return;

    setInputText('');
    setIsTyping(true);
    const peerName = activeTab === 'group' ? '🤖 @PingAI' : activePeer.handle;
    setTypingPeerName(peerName);

    const currentAvatar = activeSender === userName ? userAvatar : (SQUAD_PEERS.find((p) => p.handle === activeSender)?.avatar || userAvatar);

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      pingId,
      sender: activeSender,
      avatar: currentAvatar,
      text: finalMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (activeTab === 'group') {
      setMessages((prev) => [...prev, userMessage]);
      socket.emit('send_message', userMessage);
      await sendChatMessageApi(pingId, activeSender, currentAvatar, finalMsg.trim());

      // Safety Reset typing indicator after 500ms and trigger local AI reply if offline
      setTimeout(() => {
        setIsTyping(false);
        const lower = finalMsg.toLowerCase();
        let aiReplyText = "🤖 AI Squad Insight: Overstory Rooftop Lounge leading with 5 votes! Meet up at 7:30 PM 🍸";
        
        if (lower.includes('where') || lower.includes('rooftop') || lower.includes('recommend')) {
          aiReplyText = "🤖 AI Spot Curator: Overstory Rooftop Lounge (4.9★) has 5 active votes! High vibe sunset cocktails & live DJ starting 7:30 PM.";
        } else if (lower.includes('time') || lower.includes('when')) {
          aiReplyText = "⏰ AI Consensus Alert: 7:30 PM has 4 squad votes. 85% of your squad is free tonight!";
        }

        const localAiMsg: ChatMessage = {
          id: `m-ai-local-${Date.now()}`,
          pingId,
          sender: '🤖 @PingAI',
          avatar: '/pics/ashe-walker-KfWZ5t3tJNQ-unsplash.jpg',
          text: aiReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true,
        };

        setMessages((prev) => {
          if (prev.some((m) => m.id === localAiMsg.id || (m.isAi && m.text === localAiMsg.text))) return prev;
          return [...prev, localAiMsg];
        });
      }, 500);
    } else {
      setDmMessages((prev) => ({
        ...prev,
        [activePeer.handle]: [...(prev[activePeer.handle] || []), userMessage],
      }));

      // Instant DM AI / Peer Reply in 400ms
      setTimeout(() => {
        setIsTyping(false);
        const replyText =
          activePeer.handle === '🤖 @PingAI'
            ? `🤖 AI Assistant: Overstory Rooftop Lounge has 5 active votes! Cocktail pairings highlighted.`
            : `I'm on my way! Meet you at the bar in 15 mins 🍸`;

        const dmReply: ChatMessage = {
          id: `dm-reply-${Date.now()}`,
          pingId,
          sender: activePeer.handle,
          avatar: activePeer.avatar,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: activePeer.handle === '🤖 @PingAI',
        };

        setDmMessages((prev) => ({
          ...prev,
          [activePeer.handle]: [...(prev[activePeer.handle] || []), dmReply],
        }));
      }, 400);
    }
  };

  const handleSendEmoji = (emoji: string) => {
    setInputText((prev) => prev + ' ' + emoji);
  };

  const currentChatList = activeTab === 'group' ? messages : (dmMessages[activePeer.handle] || []);

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
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl h-full bg-[#1E2A27] text-[#F9F1F0] border-l-4 border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-[#2D5D4B] border-b border-white/10 space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#C84B31] text-white rounded-2xl shadow-md flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-[#E89A3C] uppercase tracking-widest flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-[#E89A3C] animate-pulse" />
                      INSTANT AI & SQUAD MESSAGING
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

              {/* Chat Tabs */}
              <div className="flex items-center gap-2 p-1 bg-black/20 rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab('group')}
                  className={`flex-1 py-2 rounded-xl text-xs font-sans font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'group'
                      ? 'bg-[#C84B31] text-white shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Group Chat & AI</span>
                </button>

                <button
                  onClick={() => setActiveTab('dm')}
                  className={`flex-1 py-2 rounded-xl text-xs font-sans font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'dm'
                      ? 'bg-[#C84B31] text-white shadow-md'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Direct DMs</span>
                </button>
              </div>

              {/* DM Peer Selector Bar */}
              {activeTab === 'dm' && (
                <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1" data-lenis-prevent="true">
                  {SQUAD_PEERS.map((peer) => (
                    <button
                      key={peer.handle}
                      onClick={() => setActivePeer(peer)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-sans font-bold transition-all shrink-0 cursor-pointer ${
                        activePeer.handle === peer.handle
                          ? 'bg-[#E89A3C] text-[#1E2A27] border-white shadow-md'
                          : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <img src={peer.avatar} alt={peer.name} className="w-4 h-4 rounded-full object-cover" />
                      <span>{peer.handle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Persona Switcher Bar */}
            <div className="px-6 py-2 bg-black/30 flex items-center justify-between border-b border-white/10 text-[11px] font-sans shrink-0">
              <span className="text-white/60 font-bold uppercase">Active Sender:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSender(userName)}
                  className={`px-2.5 py-0.5 rounded-full font-bold uppercase transition-colors cursor-pointer ${
                    activeSender === userName ? 'bg-[#C84B31] text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {userName} (You)
                </button>
                {SQUAD_PEERS.slice(0, 2).map((peer) => (
                  <button
                    key={peer.handle}
                    onClick={() => setActiveSender(peer.handle)}
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase transition-colors cursor-pointer ${
                      activeSender === peer.handle ? 'bg-[#E89A3C] text-[#1E2A27]' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {peer.handle}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Stream Container (With data-lenis-prevent and touch/wheel propagation handlers) */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-1 p-6 overflow-y-auto min-h-0 space-y-4 select-text overscroll-contain"
            >
              {currentChatList.map((msg) => {
                const isMe = msg.sender === activeSender;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-8.5 h-8.5 rounded-full border-2 border-white/30 object-cover shrink-0 shadow-md"
                    />

                    <div className={`max-w-[80%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      <span className="text-[10px] font-sans font-bold text-white/60 uppercase block">
                        {msg.sender} • {msg.timestamp}
                      </span>

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm font-sans font-medium leading-relaxed shadow-md ${
                          msg.isAi
                            ? 'bg-[#E89A3C] text-[#1E2A27] font-bold border-2 border-white/40 rounded-bl-none'
                            : isMe
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

              {/* Instant Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs font-sans text-[#E89A3C] font-bold pt-2"
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#E89A3C] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#E89A3C] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#E89A3C] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span>{typingPeerName} is generating a response...</span>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* 1-Tap AI Prompt Action Chips */}
            <div className="px-6 py-2 bg-black/25 flex items-center gap-2 overflow-x-auto border-t border-white/10 shrink-0" data-lenis-prevent="true">
              {AI_ACTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSendMessage(chip.query)}
                  className="px-3 py-1 bg-white/10 hover:bg-[#E89A3C] hover:text-[#1E2A27] text-xs font-sans font-bold rounded-full transition-all shrink-0 cursor-pointer border border-white/20"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Quick Emoji Reaction Bar */}
            <div className="px-6 py-2 bg-black/20 flex items-center gap-2 overflow-x-auto border-t border-white/10 shrink-0" data-lenis-prevent="true">
              {['🍸', '🔥', '🌮', '🍻', '🚀', '💯', '🥳', '📍'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSendEmoji(emoji)}
                  className="px-3 py-1 bg-white/10 hover:bg-[#C84B31] text-sm rounded-full transition-colors cursor-pointer shrink-0"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => handleSendMessage(undefined, e)} className="p-4 bg-[#2D5D4B] border-t border-white/10 flex items-center gap-3 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTab === 'group'
                    ? `Ask @PingAI or message squad as ${activeSender}...`
                    : `Message ${activePeer.handle} directly...`
                }
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
