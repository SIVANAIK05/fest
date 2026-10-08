import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
  Laptop, 
  Zap, 
  MapPin,
  Trophy
} from 'lucide-react';
import TiltCard from './TiltCard';
import EventModal from './EventModal';
import { playUiBeep } from '../utils/audioEngine';
import { MISSIONS_LIST, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } from '../data/eventsData';

export { MISSIONS_LIST };

export default function EventsSection({ onSelectEventForRegistration }) {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'technical' | 'non-technical'
  const [activeDay, setActiveDay] = useState('all'); // 'all' | 'Day 1' | 'Day 2'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  // Filter Missions by Category, Day, and Search
  const filteredMissions = useMemo(() => {
    return MISSIONS_LIST.filter((mission) => {
      // Category match
      const matchCategory =
        activeCategory === 'all' ||
        mission.category === activeCategory;

      // Day match
      const matchDay =
        activeDay === 'all' ||
        mission.day === activeDay ||
        (activeDay === 'Day 1' && (mission.day?.includes('Day 1') || mission.dayNumber === 1)) ||
        (activeDay === 'Day 2' && (mission.day?.includes('Day 2') || mission.dayNumber === 2));

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        mission.title.toLowerCase().includes(query) ||
        (mission.subtitle && mission.subtitle.toLowerCase().includes(query)) ||
        mission.tagline.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query) ||
        (mission.timings && mission.timings.toLowerCase().includes(query)) ||
        (mission.skillsTested && mission.skillsTested.some(s => s.toLowerCase().includes(query)));

      return matchCategory && matchDay && matchSearch;
    });
  }, [activeCategory, activeDay, searchQuery]);

  const handleOpenDetail = (mission) => {
    playUiBeep(1100, 0.04);
    setActiveModalEvent(mission);
  };

  const handleRegisterDirect = (eventId) => {
    if (onSelectEventForRegistration) {
      onSelectEventForRegistration(eventId);
    }
    const regSection = document.getElementById('register');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="events" className="ast-section" style={{ position: 'relative' }}>

      {/* SECTION HEADER */}
      <div className="missions-top-bar">
        <div>
          <div className="section-index">02 — MISSIONS & ARENAS</div>
          <h2 className="ast-heading">
            MISSIONS & ARENAS
          </h2>
          <p className="ast-subheading">
            6 Technical Tournaments across Day 1 & Day 2 • 10 Cosmic Games
          </p>
        </div>

        {/* Right side navigation text and arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.75rem', color: 'var(--text-slate)', lineHeight: 1.4 }}>
            Explore planetary missions.<br />Tap any card for complete briefing.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                playUiBeep(900);
                setActiveDay(prev => prev === 'all' ? 'Day 2' : prev === 'Day 2' ? 'Day 1' : 'all');
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
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-label="Previous day"
            >
              <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            </button>
            <button
              onClick={() => {
                playUiBeep(900);
                setActiveDay(prev => prev === 'all' ? 'Day 1' : prev === 'Day 1' ? 'Day 2' : 'all');
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
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-label="Next day"
            >
              <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        </div>
      </div>

      {/* STREAMLINED FILTER & SEARCH CONTROLS */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2.25rem'
        }}
      >
        {/* Row 1: Day Timeline Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-space)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Timeline:
          </span>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                playUiBeep(1000);
                setActiveDay('all');
              }}
              className={activeDay === 'all' ? 'btn-pill-cyan' : 'btn-pill-ghost'}
              style={{ fontSize: '0.78rem', padding: '0.3rem 0.85rem' }}
            >
              All Days (23 - 24 Oct)
            </button>

            <button
              onClick={() => {
                playUiBeep(1000);
                setActiveDay('Day 1');
              }}
              style={{
                fontSize: '0.78rem',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                border: activeDay === 'Day 1' ? '1.5px solid var(--cyan-primary)' : '1px solid rgba(56, 189, 248, 0.25)',
                background: activeDay === 'Day 1' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: activeDay === 'Day 1' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: 'var(--font-space)',
                boxShadow: activeDay === 'Day 1' ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Calendar style={{ width: '0.75rem', height: '0.75rem', color: 'var(--cyan-primary)' }} />
              <span>Day 1 - 23 Oct</span>
            </button>

            <button
              onClick={() => {
                playUiBeep(1000);
                setActiveDay('Day 2');
              }}
              style={{
                fontSize: '0.78rem',
                padding: '0.3rem 0.85rem',
                borderRadius: '9999px',
                border: activeDay === 'Day 2' ? '1.5px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.25)',
                background: activeDay === 'Day 2' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: activeDay === 'Day 2' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: 'var(--font-space)',
                boxShadow: activeDay === 'Day 2' ? '0 0 12px rgba(168, 85, 247, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Calendar style={{ width: '0.75rem', height: '0.75rem', color: '#c084fc' }} />
              <span>Day 2 - 24 Oct</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Tabs + Clean Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Category Tabs */}
          <div className="missions-filter-tabs" style={{ margin: 0 }}>
            <button
              onClick={() => {
                playUiBeep(1000);
                setActiveCategory('all');
              }}
              className={activeCategory === 'all' ? 'btn-pill-cyan' : 'btn-pill-ghost'}
              style={{ fontSize: '0.8rem' }}
            >
              All Arenas ({MISSIONS_LIST.length})
            </button>

            <button
              onClick={() => {
                playUiBeep(1000);
                setActiveCategory('technical');
              }}
              className={activeCategory === 'technical' ? 'btn-pill-cyan' : 'btn-pill-ghost'}
              style={{ fontSize: '0.8rem' }}
            >
              Technical ({TECHNICAL_EVENTS.length})
            </button>

            <button
              onClick={() => {
                playUiBeep(1000);
                setActiveCategory('non-technical');
              }}
              className={activeCategory === 'non-technical' ? 'btn-pill-cyan' : 'btn-pill-ghost'}
              style={{ fontSize: '0.8rem' }}
            >
              Cosmic Games ({NON_TECHNICAL_EVENTS.length})
            </button>
          </div>

          {/* Quick Search */}
          <div
            style={{
              position: 'relative',
              minWidth: '240px',
              maxWidth: '340px',
              flex: '1 1 auto'
            }}
          >
            <Search
              style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '0.9rem',
                height: '0.9rem',
                color: 'var(--cyan-primary)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search missions, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(8, 14, 30, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '9999px',
                padding: '0.5rem 1rem 0.5rem 2.4rem',
                color: '#ffffff',
                fontFamily: 'var(--font-space)',
                fontSize: '0.8rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(12px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--cyan-primary)';
                e.target.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: '0.2rem'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NO MATCH STATE */}
      {filteredMissions.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            background: 'rgba(8, 14, 30, 0.5)',
            border: '1px dashed rgba(56, 189, 248, 0.3)',
            borderRadius: '1.5rem',
            margin: '2rem 0'
          }}
        >
          <Sparkles style={{ width: '2rem', height: '2rem', color: 'var(--cyan-primary)', margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            No Matching Missions Found
          </h3>
          <p style={{ fontFamily: 'var(--font-space)', fontSize: '0.85rem', color: 'var(--text-slate)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
            Try resetting your search query or day filter to browse all technical competitions and games.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setActiveDay('all');
            }}
            className="btn-pill-cyan"
            style={{ fontSize: '0.8rem' }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* MINIMAL & ATTRACTIVE CARDS GRID */}
      <div
        key={`${activeCategory}-${activeDay}-${searchQuery}`}
        className="missions-cards-grid animate-fadeIn"
      >
        {filteredMissions.map((mission) => {
          const isDay2 = mission.dayNumber === 2 || (mission.day && mission.day.includes('Day 2'));
          const isPrototypeReq = mission.prototype === 'Compulsory';
          const isLaptopReq = mission.laptops === 'Needed';

          return (
            <TiltCard
              key={mission.id}
              maxTilt={3}
              scale={1.01}
              onClick={() => handleOpenDetail(mission)}
              className="event-planet-card group"
            >
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  justifyContent: 'space-between',
                  gap: '0.85rem'
                }}
              >
                <div>
                  {/* Top Minimal Badges Bar */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      gap: '0.35rem', 
                      flexWrap: 'wrap',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {/* Day Pill */}
                      <span
                        style={{
                          fontFamily: 'var(--font-space)',
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          background: isDay2 ? 'rgba(168, 85, 247, 0.16)' : 'rgba(56, 189, 248, 0.16)',
                          color: isDay2 ? '#c084fc' : '#38bdf8',
                          border: isDay2 ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)',
                          textTransform: 'uppercase'
                        }}
                      >
                        {mission.day || (isDay2 ? 'Day 2 - 24' : 'Day 1 - 23')}
                      </span>

                      {/* Category Pill */}
                      <span className="badge-tech-pill" style={{ padding: '0.2rem 0.55rem', fontSize: '8.5px' }}>
                        {mission.category === 'technical' ? 'TECH' : 'GAME'}
                      </span>
                    </div>

                    {/* Requirement Chip (Minimal & High Priority) */}
                    {isPrototypeReq ? (
                      <span
                        style={{
                          fontFamily: 'var(--font-space)',
                          fontSize: '8.5px',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          background: 'rgba(245, 158, 11, 0.16)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Zap style={{ width: '0.65rem', height: '0.65rem' }} />
                        <span>Prototype Req</span>
                      </span>
                    ) : isLaptopReq ? (
                      <span
                        style={{
                          fontFamily: 'var(--font-space)',
                          fontSize: '8.5px',
                          fontWeight: 600,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          background: 'rgba(56, 189, 248, 0.12)',
                          color: '#93c5fd',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Laptop style={{ width: '0.65rem', height: '0.65rem' }} />
                        <span>Laptop Req</span>
                      </span>
                    ) : (
                      <span className={mission.regType === 'pre-registration' ? 'badge-prereg-pill' : 'badge-spot-pill'} style={{ padding: '0.2rem 0.55rem', fontSize: '8.5px' }}>
                        {mission.regType === 'pre-registration' ? 'PRE-REG' : 'SPOT'}
                      </span>
                    )}
                  </div>

                  {/* Circular Planet Sphere Graphic */}
                  <div className="planet-sphere-glow" style={{ width: '105px', height: '105px', margin: '0.35rem auto 1rem auto' }}>
                    <div className="planet-orbital-ring-3d" style={{ width: '135px', height: '135px' }} />
                    <div className="planet-shadow-crescent" />
                    <img
                      src={mission.planetImage}
                      alt={mission.title}
                      loading="lazy"
                    />
                  </div>

                  {/* Event Title */}
                  <h3 
                    className="event-card-title" 
                    style={{ 
                      fontSize: '1.15rem', 
                      marginBottom: '0.2rem', 
                      marginTop: '0.25rem',
                      textAlign: 'left'
                    }}
                  >
                    {mission.title}
                  </h3>

                  {/* Subtitle / Punchline */}
                  {mission.subtitle && (
                    <div 
                      style={{ 
                        fontFamily: 'var(--font-space)', 
                        fontSize: '11px', 
                        color: 'var(--cyan-primary)', 
                        marginBottom: '0.55rem', 
                        fontWeight: 600,
                        letterSpacing: '0.03em'
                      }}
                    >
                      {mission.subtitle}
                    </div>
                  )}

                  {/* Description (Clean, concise) */}
                  <p 
                    className="event-card-desc" 
                    style={{ 
                      fontSize: '0.79rem', 
                      lineHeight: 1.5, 
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={mission.description}
                  >
                    {mission.description}
                  </p>

                  {/* Minimal Meta Row (Timings & Team Size) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      background: 'rgba(3, 7, 18, 0.55)',
                      borderRadius: '0.65rem',
                      border: '1px solid rgba(56, 189, 248, 0.08)',
                      fontSize: '10px',
                      color: '#cbd5e1',
                      fontFamily: 'var(--font-space)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden' }}>
                      <Clock style={{ width: '0.75rem', height: '0.75rem', color: 'var(--cyan-primary)', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#e2e8f0', fontWeight: 500 }}>
                        {mission.timings || mission.time}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                      <Users style={{ width: '0.75rem', height: '0.75rem', color: 'var(--cyan-primary)' }} />
                      <span>{mission.teamSize}</span>
                    </div>
                  </div>

                </div>

                {/* Minimal Footer: Venue, Prize & Sleek Explore Button */}
                <div 
                  className="event-card-bottom" 
                  style={{ 
                    paddingTop: '0.65rem', 
                    borderTop: '1px solid rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ maxWidth: '75%' }}>
                    <span 
                      style={{ 
                        display: 'block', 
                        fontSize: '9.5px', 
                        color: 'var(--text-muted)', 
                        fontFamily: 'var(--font-space)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      📍 {mission.venue}
                    </span>
                    <span style={{ fontFamily: 'var(--font-space)', fontSize: '9px', color: '#38bdf8', fontWeight: 600 }}>
                      Prize: {mission.prizePool}
                    </span>
                  </div>

                  <div 
                    className="event-arrow-btn" 
                    title="View Briefing"
                    style={{ width: '1.85rem', height: '1.85rem', flexShrink: 0 }}
                  >
                    <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
                  </div>
                </div>

              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* DETAILED MODAL VIEW */}
      <EventModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        onRegisterEvent={handleRegisterDirect}
      />

    </section>
  );
}
