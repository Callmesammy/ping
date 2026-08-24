import React, { useState, useEffect } from 'react';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { AuthProvider } from './context/AuthContext';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { NavigationMenuDrawer } from './components/NavigationMenuDrawer';
import { LiveChatDrawer } from './components/LiveChatDrawer';
import { Hero } from './components/Hero';
import { JourneyScroller } from './components/JourneyScroller';
import { ExpertisesSection } from './components/ExpertisesSection';
import { WhyChoosePing } from './components/WhyChoosePing';
import { FaqSection } from './components/FaqSection';
import { VotingRoom } from './components/VotingRoom';
import { Footer } from './components/Footer';
import { CreatePingModal } from './components/CreatePingModal';
import { AuthModal } from './components/AuthModal';
import { InviteModal } from './components/InviteModal';
import { fetchPing } from './lib/api';

export const App: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [activePingTitle, setActivePingTitle] = useState('FRIDAY NIGHT VIBE CHECK 🍸');
  const [activePingId, setActivePingId] = useState('friday-vibes');
  const [isSharedLink, setIsSharedLink] = useState(false);

  // Parse 1-Click Magic Link URL parameter (?ping=slug)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedSlug = params.get('ping');

    if (sharedSlug) {
      setIsSharedLink(true);
      setActivePingId(sharedSlug);
      fetchPing(sharedSlug).then((data) => {
        if (data && data.title) {
          setActivePingTitle(data.title);
        }
      });
    }
  }, []);

  const handlePreloaderComplete = () => {
    const params = new URLSearchParams(window.location.search);
    const hasPing = params.get('ping');
    const hasHash = window.location.hash === '#explore';

    if (hasPing || hasHash || isSharedLink) {
      setTimeout(() => {
        const target = document.getElementById('explore');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handlePingCreated = (title: string, tag: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `ping-${Date.now()}`;
    
    setActivePingTitle(title.toUpperCase());
    setActivePingId(slug);

    setIsInviteModalOpen(true);

    const target = document.getElementById('explore');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      <SmoothScrollProvider>
        <div className="min-h-screen bg-[#F8F3F0] text-[#0A542E] selection:bg-[#00E676] selection:text-[#0A542E] font-sans relative">
          
          {/* Initial Zoom Preloader Overlay */}
          <Preloader onComplete={handlePreloaderComplete} />

          {/* Fixed Navigation Bar */}
          <Navbar
            onOpenCreateModal={handleOpenCreateModal}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenChat={() => setIsChatOpen(true)}
          />

          {/* Blacksmith Iron Clash Navigation Drawer */}
          <NavigationMenuDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onOpenCreateModal={handleOpenCreateModal}
          />

          {/* Live Squad Room Chat Drawer */}
          <LiveChatDrawer
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            pingTitle={activePingTitle}
            pingId={activePingId}
          />

          {/* Hero Section with Pinned Card Transitions */}
          <Hero onOpenCreateModal={handleOpenCreateModal} />

          {/* Pinned 6-Card Horizontal Track with PING Emblem Expansion */}
          <JourneyScroller />

          {/* Unified Pinned Expertises & Card Toss Methodo Section */}
          <ExpertisesSection />

          {/* Magenta Why Choose Ping Section with Pinned Horizontal Green Cards */}
          <WhyChoosePing />

          {/* Smooth Animated FAQ Section */}
          <FaqSection />

          {/* Interactive Voting Room & Live Vector Map */}
          <VotingRoom currentPingTitle={activePingTitle} currentPingId={activePingId} />

          {/* Footer with Quiz Option */}
          <Footer onOpenQuiz={handleOpenCreateModal} />

          {/* Modals & Session Drawer */}
          <CreatePingModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onCreated={handlePingCreated}
          />

          <InviteModal
            isOpen={isInviteModalOpen}
            pingTitle={activePingTitle}
            pingId={activePingId}
            onClose={() => setIsInviteModalOpen(false)}
          />

          <AuthModal />

        </div>
      </SmoothScrollProvider>
    </AuthProvider>
  );
};

export default App;
