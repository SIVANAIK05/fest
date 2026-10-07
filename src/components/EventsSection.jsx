import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import EventModal from './EventModal';
import TiltCard from './TiltCard';
import { playUiBeep } from '../utils/audioEngine';

export const MISSIONS_LIST = [
  // TECHNICAL MISSIONS
  {
    id: "ai-odyssey",
    title: "AI ODYSSEY",
    category: "technical",
    regType: "pre-registration",
    tagline: "Explore the future of artificial intelligence.",
    description: "A technical challenge where ideas meet intelligence. Build innovative AI solutions to real-world problems and autonomous agents.",
    planetImage: "/images/planet_ai.jpg",
    teamSize: "2 - 4",
    venue: "CSE Block",
    date: "15 Nov 2026",
    time: "10:00 AM",
    closes: "12 Nov 2026",
    prizePool: "₹25,000"
  },
  {
    id: "codeverse",
    title: "CODEVERSE",
    category: "technical",
    regType: "pre-registration",
    tagline: "Build. Solve. Innovate.",
    description: "Navigate algorithmic wormholes, optimize computational pipelines, and race against the clock in our premier 24-hour hackathon.",
    planetImage: "/images/planet_codeverse.jpg",
    teamSize: "2 - 4",
    venue: "Tesseract Lab",
    date: "15 Nov 2026",
    time: "11:00 AM",
    closes: "12 Nov 2026",
    prizePool: "₹35,000"
  },
  {
    id: "cyber-war",
    title: "CYBER WAR",
    category: "technical",
    regType: "spot",
    tagline: "Defend. Attack. Survive.",
    description: "Infiltrate extraterrestrial protocols and defend base station servers in an intense Capture the Flag cybersecurity battle.",
    planetImage: "/images/planet_cyberwar.jpg",
    teamSize: "1 - 2",
    venue: "Cyber Arena",
    date: "16 Nov 2026",
    time: "01:30 PM",
    closes: "Spot Walk-in",
    prizePool: "₹20,000"
  },
  {
    id: "tech-quiz",
    title: "TECH QUIZ",
    category: "technical",
    regType: "pre-registration",
    tagline: "Test your tech universe.",
    description: "Battle through astronomical riddles, quantum computation trivia, and tech history to claim the supreme knowledge mantle.",
    planetImage: "/images/planet_techquiz.jpg",
    teamSize: "2 Players",
    venue: "Newton Amphitheatre",
    date: "16 Nov 2026",
    time: "03:00 PM",
    closes: "13 Nov 2026",
    prizePool: "₹15,000"
  },

  // NON-TECHNICAL MISSIONS
  {
    id: "esports-cup",
    title: "E-SPORTS ARENA",
    category: "non-technical",
    regType: "pre-registration",
    tagline: "Galactic Valorant & FIFA Tournament.",
    description: "Compete against premier university squads in 5v5 tactical gaming and solo console showdowns on auditorium stage projectors.",
    planetImage: "/images/planet_codeverse.jpg",
    teamSize: "5 Players / Solo",
    venue: "Main Auditorium",
    date: "15 Nov 2026",
    time: "11:00 AM",
    closes: "12 Nov 2026",
    prizePool: "₹25,000"
  },
  {
    id: "cosmic-pitch",
    title: "COSMIC PITCH",
    category: "non-technical",
    regType: "pre-registration",
    tagline: "Venture beyond planetary limits.",
    description: "Present breakthrough startup pitches in space-tech, AI SaaS, and consumer tech before a panel of venture capital angel sharks.",
    planetImage: "/images/planet_cyberwar.jpg",
    teamSize: "1 - 3",
    venue: "Executive Hall",
    date: "16 Nov 2026",
    time: "02:00 PM",
    closes: "13 Nov 2026",
    prizePool: "₹20,000"
  },
  {
    id: "beat-gravity",
    title: "BEAT GRAVITY",
    category: "non-technical",
    regType: "pre-registration",
    tagline: "Intercollegiate dance explosion.",
    description: "Defy gravitational pull with electrifying choreography, contemporary fusion, and hip-hop stage clashes under laser illumination.",
    planetImage: "/images/planet_ai.jpg",
    teamSize: "6 - 15 Dancers",
    venue: "Open Air Stadium",
    date: "16 Nov 2026",
    time: "06:00 PM",
    closes: "13 Nov 2026",
    prizePool: "₹25,000"
  },
  {
    id: "cosmic-trivia",
    title: "SCI-FI TRIVIA",
    category: "non-technical",
    regType: "spot",
    tagline: "Pop culture & interstellar lore.",
    description: "From Christopher Nolan classics and Marvel lore to NASA archives. Walk in on event day with your partner to play.",
    planetImage: "/images/planet_techquiz.jpg",
    teamSize: "2 Players",
    venue: "Central Courtyard",
    date: "15 Nov 2026",
    time: "03:30 PM",
    closes: "Spot Walk-in",
    prizePool: "₹10,000"
  }
];

export default function EventsSection({ onSelectEventForRegistration }) {
  const [activeCategory, setActiveCategory] = useState('technical'); // 'technical' | 'non-technical'
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const displayedMissions = MISSIONS_LIST.filter(
    (item) => item.category === activeCategory
  );

  const handleOpenDetail = (mission) => {
    playUiBeep(1100, 0.04);
    setActiveModalEvent(mission);
  };

  const handleRegisterDirect = (eventId) => {
    playUiBeep(1300, 0.06);
    if (onSelectEventForRegistration) {
      onSelectEventForRegistration(eventId);
    }
    const regSection = document.getElementById('register');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="events" className="ast-section">

      {/* SECTION HEADER (matching reference image) */}
      <div className="missions-top-bar">
        <div>
          <div className="section-index">02 —</div>
          <h2 className="ast-heading">
            MISSIONS
          </h2>
          <p className="ast-subheading">
            Explore. Compete. Create. Beyond Boundaries.
          </p>
        </div>

        {/* Right side navigation text and arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.75rem', color: 'var(--text-slate)', lineHeight: 1.4 }}>
            Each event is a new world.<br />Choose your mission.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                playUiBeep(900);
                setActiveCategory(activeCategory === 'technical' ? 'non-technical' : 'technical');
              }}
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '9999px',
                background: '#0f172a',
                border: '1px solid var(--border-cyan)',
                color: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            </button>
            <button
              onClick={() => {
                playUiBeep(900);
                setActiveCategory(activeCategory === 'technical' ? 'non-technical' : 'technical');
              }}
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '9999px',
                background: '#0f172a',
                border: '1px solid var(--border-cyan)',
                color: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS (matching reference image) */}
      <div className="missions-filter-tabs">
        <button
          onClick={() => {
            playUiBeep(1000);
            setActiveCategory('technical');
          }}
          className={activeCategory === 'technical' ? 'btn-pill-cyan' : 'btn-pill-ghost'}
        >
          Technical Missions
        </button>

        <button
          onClick={() => {
            playUiBeep(1000);
            setActiveCategory('non-technical');
          }}
          className={activeCategory === 'non-technical' ? 'btn-pill-cyan' : 'btn-pill-ghost'}
        >
          Non-Technical Missions
        </button>
      </div>

      {/* CARDS GRID WITH ANIMATED TAB SWITCH TRANSITION & 3D PARALLAX TILT */}
      <div
        key={activeCategory}
        className="missions-cards-grid animate-fadeIn"
      >
        {displayedMissions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => handleOpenDetail(mission)}
            className="event-planet-card"
          >
            {/* Circular Planet Sphere Graphic (matching reference image) */}
            <div className="planet-sphere-glow">
              <img
                src={mission.planetImage}
                alt={mission.title}
              />
            </div>

            {/* Title & Badges */}
            <div>
              <h3 className="event-card-title">
                {mission.title}
              </h3>

              <div className="badges-row">
                <span className="badge-tech-pill">
                  {mission.category === 'technical' ? 'TECHNICAL' : 'NON-TECH'}
                </span>
                <span className={mission.regType === 'pre-registration' ? 'badge-prereg-pill' : 'badge-spot-pill'}>
                  {mission.regType === 'pre-registration' ? 'PRE-REGISTRATION' : 'SPOT EVENT'}
                </span>
              </div>

              <p className="event-card-desc">
                {mission.tagline}
              </p>
            </div>

            {/* Bottom Row with Arrow Button */}
            <div className="event-card-bottom">
              <span className="event-venue-tag">
                {mission.venue}
              </span>
              <div className="event-arrow-btn">
                <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* MODAL VIEW MATCHING THE REFERENCE IMAGE SUBPANEL */}
      <EventModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        onRegisterEvent={handleRegisterDirect}
      />

    </section>
  );
}
