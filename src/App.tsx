import React, { useState } from 'react';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { AuthProvider } from './context/AuthContext';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
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

export const App: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activePingTitle, setActivePingTitle] = useState('FRIDAY NIGHT VIBE CHECK 🍸');
  const [activePingId, setActivePingId] = useState('friday-vibes');

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
        <div className="min-h-screen bg-[#F8F3F0] text-[#0A542E] selection:bg-[#00E676] selection:text-[#0A542E] font-sans">
          
          {/* Initial Zoom Preloader Overlay */}
          <Preloader />

          {/* Navigation Overlay */}
          <Navbar onOpenCreateModal={handleOpenCreateModal} />

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
