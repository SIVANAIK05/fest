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

  // Baseline history state and URL query/hash synchronization for verification and navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Helper to extract verified pass payload from any URLSearchParams instance
    const extractPassFromParams = (params) => {
      const verifyId = params.get('verify') || params.get('id');
      if (!verifyId) return null;

      return {
        id: verifyId,
        name: params.get('name') || 'Lead Astronaut',
        roll: params.get('roll') || params.get('pin') || params.get('rollNo') || '',
        dept: params.get('dept') || params.get('department') || '',
        year: params.get('year') || params.get('yearOfStudy') || '',
        college: params.get('college') || params.get('institution') || 'Registered Institution',
        squad: params.get('squad') || params.get('team') || 'Solo Flight',
        crew: params.get('crew') || params.get('members') || 'Solo Explorer',
        events: params.get('events') || params.get('missions') || 'General Entry',
        email: params.get('email') || '',
        mobile: params.get('mobile') || ''
      };
    };

    // Helper to parse pass from either window.location.search or window.location.hash
    const parseVerificationFromUrl = () => {
      // 1. First priority: search query parameters (from phone QR scan)
      const searchParams = new URLSearchParams(window.location.search);
      const passFromSearch = extractPassFromParams(searchParams);
      if (passFromSearch) return passFromSearch;

      // 2. Second priority: hash query parameters (from internal modal navigation or links)
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const hashQuery = hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        const passFromHash = extractPassFromParams(hashParams);
        if (passFromHash) return passFromHash;
      }

      return null;
    };

    // On initial page load: check if a pass was scanned via QR
    const initialPass = parseVerificationFromUrl();
    if (initialPass) {
      setVerifiedPass(initialPass);
      // Synchronize hash to #verify without losing back navigation
      if (!window.location.hash.startsWith('#verify')) {
        const queryStr = window.location.search
          ? window.location.search.replace(/^\?/, '')
          : `verify=${encodeURIComponent(initialPass.id)}`;
        window.history.replaceState({ modal: 'verify', pass: initialPass }, '', `${window.location.pathname}#verify?${queryStr}`);
      }
    } else {
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

      // Check if verify is active in hash OR search
      const currentPass = parseVerificationFromUrl();
      if (hash.startsWith('#verify') || currentPass) {
        if (currentPass) {
          setVerifiedPass(currentPass);
        }
      } else {
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
    setVerifiedPass(null);
    if (window.location.hash.startsWith('#verify')) {
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      if (url.searchParams.has('verify') || url.searchParams.has('id')) {
        url.searchParams.delete('verify');
        url.searchParams.delete('id');
        url.searchParams.delete('name');
        url.searchParams.delete('college');
        url.searchParams.delete('squad');
        url.searchParams.delete('crew');
        url.searchParams.delete('events');
        url.searchParams.delete('roll');
        url.searchParams.delete('dept');
        url.searchParams.delete('year');
        window.history.replaceState({ page: 'home' }, '', url.pathname + (url.hash && !url.hash.startsWith('#verify') ? url.hash : '#home'));
      }
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
