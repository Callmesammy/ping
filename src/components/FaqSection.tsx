import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What types of groups or events can use Ping?',
    answer: 'Ping is designed for any group of friends, colleagues, or teams wanting to coordinate outings, dinners, rooftops, arcade nights, or weekend trips with zero back-and-forth friction.',
  },
  {
    question: 'Do I need an account to vote or join a Ping?',
    answer: 'No! Anyone can join via a single 1-click magic link, vote on venues and time slots instantly as a guest, or log in to host their own Pings.',
  },
  {
    question: 'How does real-time venue voting work?',
    answer: 'Anyone in the Ping can drop venue markers or search neighborhood spots on the live interactive map. Spring physics update everyone’s screen live as votes cast.',
  },
  {
    question: 'Can I integrate Ping with WhatsApp or iMessage?',
    answer: 'Yes! Ping generates clean 1-click share links tailored for messaging apps so your group can jump straight into voting without downloading anything.',
  },
  {
    question: 'Is there any cost to create or host Pings?',
    answer: 'Ping is 100% free for all users, guests, and group hosts. No hidden fees or paywalls.',
  },
  {
    question: 'How do I lock in a venue once consensus is reached?',
    answer: 'Once top venue & time reach consensus, the host taps "Lock Ping". Automated notifications send final map directions and schedule alerts to everyone.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-[#F9F1F0] text-[#2D5D4B] py-24 px-4 md:px-12 overflow-hidden select-none border-t border-[#C84B31]/10">
      <div className="max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start z-10">
        
        {/* Left Column: Headline & Emoji Bubble */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <span className="text-xs font-sans font-bold text-[#C84B31] uppercase tracking-widest block">
            FAQ • FREQUENTLY ASKED QUESTIONS
          </span>

          <h2 className="font-foudre font-black text-[13vw] sm:text-[9vw] lg:text-[6.5vw] leading-[0.78] text-[#C84B31] uppercase tracking-tighter block">
            SMALL <br />
            QUESTIONS, <br />
            BIG <br />
            ANSWERS
          </h2>

          {/* Soft Pastel Speech Bubble Sticker */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C84B31] text-[#F9F1F0] rounded-[24px] shadow-md text-lg font-bold border border-white/40">
            <span>⛑️</span>
            <span>👏</span>
            <span>📣</span>
          </div>
        </div>

        {/* Right Column: Smooth Animated Accordion List */}
        <div className="lg:col-span-7 space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="border-b border-[#C84B31]/20 pb-4 transition-colors"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left py-2 group cursor-pointer focus:outline-none"
                >
                  <h3 className="font-foudre font-black text-2xl sm:text-3xl text-[#C84B31] group-hover:text-[#C84B31]/80 transition-colors uppercase leading-tight tracking-tight">
                    {item.question}
                  </h3>

                  {/* Circular Plus/Minus Toggle Button */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md ${
                      isOpen ? 'bg-[#2D5D4B] text-white' : 'bg-[#C84B31] text-white group-hover:bg-[#C84B31]/90'
                    }`}
                  >
                    {isOpen ? <Minus className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                  </motion.div>
                </button>

                {/* Animated Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 pb-2 text-sm sm:text-base font-sans font-medium text-[#2D5D4B]/90 leading-relaxed max-w-2xl">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
