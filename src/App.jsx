import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MissionSection from './components/MissionSection';
import EventsSection from './components/EventsSection';
import RegistrationSection from './components/RegistrationSection';
import EchoesSection from './components/EchoesSection';
import MissionPartnersSection from './components/MissionPartnersSection';
import TheCrewSection from './components/TheCrewSection';
import VenueSpotsSection from './components/VenueSpotsSection';
import Footer from './components/Footer';
import CosmicParticleField from './components/CosmicParticleField';
import InterstellarGalaxyBackground from './components/InterstellarGalaxyBackground';
import PassVerificationModal from './components/PassVerificationModal';
import { playWarpSound, startAmbientAudio } from './utils/audioEngine';

export default function App() {
  const [preselectedEventId, setPreselectedEventId] = useState(null);
  const [isWarping, setIsWarping] = useState(false);
  const [verifiedPass, setVerifiedPass] = useState(null);

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
    }
  }, []);

  const handleSelectEventForRegistration = (eventId) => {
    setPreselectedEventId(eventId);
    const regEl = document.getElementById('register');
    if (regEl) {
      regEl.scrollIntoView({ behavior: 'smooth' });
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


      {/* NAVIGATION BAR WITH UNIQUE MOBILE DOCK & HOLOGRAPHIC FLIGHT DECK */}
      <Navbar />

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

        {/* 03 — JOIN THE CREW (Interactive 5-step registration & Mission Accepted Cockpit Pass) */}
        <RegistrationSection preselectedEventId={preselectedEventId} />

        {/* 04 — ECHOES THROUGH TIME (Memories carousel & year selector) */}
        <EchoesSection />

        {/* MISSION PARTNERS (Google, Infosys, TATA, Microsoft) */}
        <MissionPartnersSection />

        {/* THE CREW (Circular glowing crew portraits) */}
        <TheCrewSection />

        {/* 04 — CAMPUS VENUE SPOTS (Event Locations & Matrix) */}
        <VenueSpotsSection />
      </main>

      {/* 05 — CONTACT MISSION CONTROL & BASE TELEMETRY */}
      <Footer />

      {/* LIVE SCAN VERIFICATION MODAL (Triggered when mobile camera scans QR code) */}
      <PassVerificationModal
        pass={verifiedPass}
        onClose={() => setVerifiedPass(null)}
      />

    </div>
  );
}
