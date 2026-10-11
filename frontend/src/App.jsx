import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MissionSection from './components/MissionSection';
import EventsSection from './components/EventsSection';
import ExploreIICSection from './components/ExploreIICSection';
import RegistrationModal from './components/RegistrationModal';
import MissionPartnersSection from './components/MissionPartnersSection';
import TheCrewSection from './components/TheCrewSection';
import Footer from './components/Footer';
import CosmicParticleField from './components/CosmicParticleField';
import InterstellarGalaxyBackground from './components/InterstellarGalaxyBackground';
import HeroSpaceshipCursor from './components/HeroSpaceshipCursor';
import PassVerificationModal from './components/PassVerificationModal';
import { startAmbientAudio } from './utils/audioEngine';

export default function App() {
  const [preselectedEventId, setPreselectedEventId] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [verifiedPass, setVerifiedPass] = useState(null);

  // Baseline history state and URL hash synchronization for back/forward navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const verifyId = urlParams.get('verify');
      if (verifyId) {
        setVerifiedPass({
          id: verifyId,
          name: urlParams.get('name') || 'Lead Astronaut',
          college: urlParams.get('college') || 'Registered Institution',
          squad: urlParams.get('squad') || 'Endurance Squadron',
          crew: urlParams.get('crew') || 'Solo Explorer',
          events: urlParams.get('events') || 'General Entry'
        });
      }

      // Establish baseline history state so initial back gesture never exits site abruptly
      if (!window.history.state) {
        window.history.replaceState({ page: 'home', hash: window.location.hash || '#home' }, '', window.location.href);
      }
    }

    const syncAppFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#register')) {
        const queryPart = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(queryPart);
        const evId = params.get('event');
        if (evId) {
          setPreselectedEventId(evId);
        }
        setIsRegisterOpen(true);
      } else {
        setIsRegisterOpen(false);
      }

      if (!hash.startsWith('#verify')) {
        setVerifiedPass(null);
      }

      // Smooth section scrolling on hash navigation back/forward (e.g. #mission, #events, #crew, #contact, #home)
      if (
        hash &&
        !hash.startsWith('#event/') &&
        !hash.startsWith('#register') &&
        !hash.startsWith('#pass') &&
        !hash.startsWith('#menu') &&
        !hash.startsWith('#verify')
      ) {
        const targetId = hash.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('popstate', syncAppFromHash);
    window.addEventListener('hashchange', syncAppFromHash);

    // Initial check on page load
    syncAppFromHash();

    return () => {
      window.removeEventListener('popstate', syncAppFromHash);
      window.removeEventListener('hashchange', syncAppFromHash);
    };
  }, []);

  const handleOpenRegister = (eventId = null) => {
    if (eventId) {
      setPreselectedEventId(eventId);
    }
    const targetHash = eventId ? `#register?event=${eventId}` : '#register';
    if (window.location.hash !== targetHash) {
      window.history.pushState({ modal: 'register', eventId }, '', targetHash);
    }
    setIsRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    if (window.location.hash.startsWith('#register')) {
      window.history.back();
    } else {
      setIsRegisterOpen(false);
    }
  };


  const handleSelectEventForRegistration = (eventId) => {
    handleOpenRegister(eventId);
  };

  const handleCloseVerification = () => {
    if (window.location.hash.startsWith('#verify')) {
      window.history.back();
    } else {
      setVerifiedPass(null);
    }
  };

  const handleLaunchStart = () => {
    setIsWarping(true);
    // Start Hans Zimmer Interstellar soundtrack on launch gesture
    startAmbientAudio();
  };

  const handleEnterAstrion = () => {
    // The spaceship has breached outer space across the 5 reference boxes, transition smoothly into Section 01
    startAmbientAudio();
    const missionSection = document.getElementById('mission');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsWarping(false);
    }, 1300);
  };

  return (
    <div className="relative min-h-screen bg-[#020409] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">

      {/* 3D COSMIC PARTICLE & STARDUST CANVAS (Floating through space, mouse gravity & warp speed) */}
      <CosmicParticleField isWarping={isWarping} />

      {/* INTERSTELLAR GALAXY BACKGROUND (Active everywhere except hero, mouse/touch gravity, cosmic shockwaves) */}
      <InterstellarGalaxyBackground />

      {/* INTERACTIVE SPACESHIP CURSOR (Active site-wide with momentum, banking, targeting HUD & particle exhaust) */}
      <HeroSpaceshipCursor />

      {/* NAVIGATION BAR WITH UNIQUE MOBILE DOCK & HOLOGRAPHIC FLIGHT DECK */}
      <Navbar
        onOpenRegister={() => handleOpenRegister()}
      />

      {/* MAIN SECTIONS ACCORDING TO REFERENCE IMAGE */}
      <main>
        {/* HERO SECTION (Astronaut + Gargantua Black Hole + ASTRION Title + Date) */}
        <Hero
          onLaunchStart={handleLaunchStart}
          onEnterAstrion={handleEnterAstrion}
        />

        {/* 01 — THE MISSION (Mission statement, 4 key metrics & orbital space station) */}
        <MissionSection />

        {/* 02 — MISSIONS (Tech & Non-Tech events with 3D planetary cards & modal briefing) */}
        <EventsSection onSelectEventForRegistration={handleSelectEventForRegistration} />

        {/* 03 — EXPLORE IIC & INNOVATION COUNCIL */}
        <ExploreIICSection onOpenRegister={() => handleOpenRegister()} />

        {/* 04 — THE CREW (Leadership commanders & core mission personnel) */}
        <TheCrewSection />

        {/* MISSION PARTNERS (Google, Infosys, TATA, Microsoft) */}
        <MissionPartnersSection />
      </main>

      {/* 05 — CONTACT MISSION CONTROL & BASE TELEMETRY */}
      <Footer />

      {/* POPUP REGISTRATION MODAL (Triggered by Join Crew & Event cards) */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        preselectedEventId={preselectedEventId}
      />

      {/* LIVE SCAN VERIFICATION MODAL (Triggered when mobile camera scans QR code) */}
      <PassVerificationModal
        pass={verifiedPass}
        onClose={handleCloseVerification}
      />

    </div>
  );
}
