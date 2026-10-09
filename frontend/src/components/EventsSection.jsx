import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  Calendar,
  Clock,
  Users,
  User,
  Laptop,
  Zap,
  MapPin,
  Trophy,
  Compass,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import EventModal from './EventModal';
import { playUiBeep } from '../utils/audioEngine';
import { MISSIONS_LIST, TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } from '../data/eventsData';

export { MISSIONS_LIST };

const formatVenue = (v) => {
  if (!v || v.toLowerCase() === 'venue') return 'Tesseract Computing Complex • 3rd Floor';
  return v;
};

const getTeamBadgeInfo = (teamSize) => {
  const str = (teamSize || '').toLowerCase();
  if (
    str.includes('2') ||
    str.includes('3') ||
    str.includes('4') ||
    str.includes('5') ||
    str.includes('team') ||
    str.includes('squad') ||
    str.includes('pair')
  ) {
    let label = 'TEAM';
    if (str.includes('pair')) label = 'PAIR';
    else if (str.includes('squad')) label = 'SQUAD';
    else if (str.includes('2 - 4')) label = 'TEAM (2-4)';
    else if (str.includes('2')) label = 'TEAM (2)';
    return { isSolo: false, label };
  }
  return { isSolo: true, label: 'SOLO' };
};

// Subcomponent for each event card with on-load stagger and scroll-reveal IntersectionObserver
function EventHudCard({
  mission,
  idx,
  onOpenDetail,
  onRegisterDirect
}) {
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const isDay2 = mission.dayNumber === 2 || (mission.day && mission.day.includes('Day 2'));
  const isPrototypeReq = mission.prototype === 'Compulsory';
  const isLaptopReq = mission.laptops === 'Needed';
  const teamBadge = getTeamBadgeInfo(mission.teamSize);
  const numericId = String(idx + 1).padStart(2, '0');
  const posterImg = mission.planetImage || mission.image || '/images/mission_station.jpg';

  // Stagger calculation based on index (cycles every 6 items for fast, smooth cadence)
  const staggerDelay = `${(idx % 6) * 75}ms`;

  return (
    <div
      ref={cardRef}
      className={`event-hud-wrapper group ${inView ? 'is-in-view' : ''}`}
      style={{
        animationDelay: staggerDelay,
        transitionDelay: staggerDelay
      }}
      onClick={() => onOpenDetail(mission)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(mission);
        }
      }}
    >
      {/* Outer Chamfered Border Chassis */}
      <div className="event-hud-outer">
        {/* Inner Card Body with Chamfered Mask */}
        <div className="event-hud-inner">

          {/* Cosmic Grid & Sector Watermark Tag */}
          <div className="event-hud-grid-overlay" />
          <div className="event-hud-watermark">{numericId}</div>

          {/* Aerospace HUD Reticle Corners */}
          <div className="event-corner-bracket" style={{ top: '8px', left: '8px', borderTop: '2px solid', borderLeft: '2px solid' }} />
          <div className="event-corner-bracket" style={{ bottom: '8px', right: '8px', borderBottom: '2px solid', borderRight: '2px solid' }} />

          {/* CARD BODY CONTENT */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            
            <div>
              {/* TOP STATUS BAR: Day & Category (Left) | SOLO / TEAM Indication (Right) */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '0.5rem', 
                  marginBottom: '0.85rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Top Left: Day & Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className={`event-day-pill ${isDay2 ? 'is-day2' : 'is-day1'}`}>
                    <Calendar style={{ width: '0.7rem', height: '0.7rem', flexShrink: 0 }} />
                    <span>{mission.day || (isDay2 ? 'Day 2 - 24' : 'Day 1 - 23')}</span>
                  </span>
                  
                  <span className="event-category-pill">
                    {mission.category === 'technical' ? 'TECH' : 'GAME'}
                  </span>
                </div>

                {/* Top Right: TEAM or SOLO Indication */}
                <div className={`event-team-pill ${teamBadge.isSolo ? 'is-solo' : 'is-team'}`}>
                  <span className="event-team-dot" />
                  {teamBadge.isSolo ? (
                    <>
                      <User style={{ width: '0.75rem', height: '0.75rem', flexShrink: 0 }} />
                      <span>{teamBadge.label}</span>
                    </>
                  ) : (
                    <>
                      <Users style={{ width: '0.75rem', height: '0.75rem', flexShrink: 0 }} />
                      <span>{teamBadge.label}</span>
                    </>
                  )}
                </div>
              </div>

              {/* EVENT POSTER BANNER */}
              <div className="event-poster-container">
                <img
                  src={posterImg}
                  alt={mission.title}
                  className="event-poster-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/mission_station.jpg';
                  }}
                />
                
                {/* Poster Vignette & Scanline Gradient */}
                <div className="event-poster-gradient" />

                {/* Floating Telemetry Chips on Poster Bottom */}
                <div className="event-poster-badges-bottom">
                  {isPrototypeReq ? (
                    <span className="poster-badge-alert">
                      <Zap style={{ width: '0.65rem', height: '0.65rem' }} />
                      <span>PROTOTYPE REQ</span>
                    </span>
                  ) : isLaptopReq ? (
                    <span className="poster-badge-info">
                      <Laptop style={{ width: '0.65rem', height: '0.65rem' }} />
                      <span>LAPTOP REQ</span>
                    </span>
                  ) : (
                    <span className={`poster-badge-reg ${mission.regType === 'pre-registration' ? 'is-prereg' : 'is-spot'}`}>
                      {mission.regType === 'pre-registration' ? 'PRE-REG' : 'SPOT WALK-IN'}
                    </span>
                  )}

                  <span className="poster-badge-size">
                    {mission.teamSize}
                  </span>
                </div>
              </div>

              {/* TITLE & SUBTITLE */}
              <div style={{ marginTop: '0.2rem', marginBottom: '0.35rem' }}>
                <h3 className="event-hud-title">
                  {mission.title}
                </h3>
                {mission.subtitle && (
                  <p className="event-hud-subtitle">
                    {mission.subtitle}
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <p className="event-hud-description" title={mission.description}>
                {mission.description}
              </p>

              {/* VENUE BOX (Styled like the present venue card layout) */}
              <div className="event-hud-venue-box">
                <div className="event-venue-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin className="event-venue-icon" />
                    <span className="event-venue-label">FACILITY / VENUE</span>
                  </div>
                  <span className="event-venue-status-chip">
                    <span className="event-venue-pulse-dot" />
                    <span>{mission.timings || mission.time || 'ACTIVE ARENA'}</span>
                  </span>
                </div>
                <div className="event-venue-name" title={formatVenue(mission.venue)}>
                  {formatVenue(mission.venue)}
                </div>
              </div>
            </div>

            {/* CARD BOTTOM ACTION FOOTER: Telemetry + EXPLORE BUTTON + Direct Register */}
            <div className="event-hud-footer">
              {/* Left Telemetry (Prize pool or schedule entry) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {mission.prizePool ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24' }}>
                    <Trophy style={{ width: '0.85rem', height: '0.85rem', color: '#fbbf24', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {mission.prizePool}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
                    <Clock style={{ width: '0.85rem', height: '0.85rem', color: '#38bdf8', flexShrink: 0 }} />
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {mission.time || '10:15 AM'}
                    </span>
                  </div>
                )}
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                  {mission.regType === 'pre-registration' ? 'FREE ENTRY PASS' : 'OPEN SPOT ENTRY'}
                </span>
              </div>

              {/* Right: EXPLORE BUTTON & REGISTER CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <button
                  type="button"
                  className="event-hud-explore-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetail(mission);
                  }}
                  title={`Explore full briefing for ${mission.title}`}
                >
                  <span>Explore</span>
                  <Compass style={{ width: '0.85rem', height: '0.85rem' }} />
                </button>

                <button
                  type="button"
                  className="event-hud-register-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playUiBeep(1250, 0.05);
                    onRegisterDirect(mission.id);
                  }}
                  title={`Register directly for ${mission.title}`}
                >
                  <span>Register</span>
                  <ArrowRight style={{ width: '0.75rem', height: '0.75rem' }} />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default function EventsSection({ onSelectEventForRegistration }) {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'technical' | 'non-technical'
  const [activeDay, setActiveDay] = useState('all'); // 'all' | 'Day 1' | 'Day 2'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Reset pagination count when category, day, or search query changes
  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory, activeDay, searchQuery]);

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

  // Slice displayed missions based on visibleCount to avoid overwhelming clumsy list
  const displayedMissions = useMemo(() => {
    return filteredMissions.slice(0, visibleCount);
  }, [filteredMissions, visibleCount]);

  const hasMore = visibleCount < filteredMissions.length;
  const remainingCount = filteredMissions.length - visibleCount;
  const isExpanded = visibleCount >= filteredMissions.length && filteredMissions.length > 6;

  const handleViewMore = () => {
    playUiBeep(1200, 0.04);
    setVisibleCount((prev) => Math.min(prev + 6, filteredMissions.length));
  };

  const handleViewAll = () => {
    playUiBeep(1350, 0.05);
    setVisibleCount(filteredMissions.length);
  };

  const handleCollapse = () => {
    playUiBeep(950, 0.04);
    setVisibleCount(6);
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenDetail = (mission) => {
    playUiBeep(1100, 0.04);
    setActiveModalEvent(mission);
  };

  const handleRegisterDirect = (eventId) => {
    if (onSelectEventForRegistration) {
      onSelectEventForRegistration(eventId);
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
        {displayedMissions.map((mission, idx) => (
          <EventHudCard
            key={mission.id}
            mission={mission}
            idx={idx}
            onOpenDetail={handleOpenDetail}
            onRegisterDirect={handleRegisterDirect}
          />
        ))}
      </div>

      {/* PROGRESSIVE VIEW MORE / DISCLOSURE CONTROL (PREVENTS CLUMSY WALL OF CARDS) */}
      {filteredMissions.length > 6 && (
        <div className="missions-pagination-wrapper">
          {/* Telemetry Progress Status */}
          <div className="missions-telemetry-status">
            <div className="missions-telemetry-text">
              <span className="missions-telemetry-dot" />
              <span>
                DISPLAYING <strong style={{ color: '#38bdf8' }}>{Math.min(visibleCount, filteredMissions.length)}</strong> OF <strong style={{ color: '#ffffff' }}>{filteredMissions.length}</strong> MISSIONS
              </span>
            </div>

            {/* Micro Cyan Progress Gauge */}
            <div className="missions-telemetry-gauge">
              <div
                className="missions-telemetry-fill"
                style={{
                  width: `${Math.min(100, Math.round((Math.min(visibleCount, filteredMissions.length) / filteredMissions.length) * 100))}%`
                }}
              />
            </div>
          </div>

          {/* Action Button Deck */}
          <div className="missions-pagination-actions">
            {hasMore ? (
              <>
                <button
                  type="button"
                  onClick={handleViewMore}
                  className="missions-load-more-btn"
                  title="Reveal next sector missions"
                >
                  <Layers style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)' }} />
                  <span>VIEW MORE MISSIONS (+{Math.min(6, remainingCount)})</span>
                  <ChevronDown className="animate-bounce" style={{ width: '1.1rem', height: '1.1rem' }} />
                </button>

                {remainingCount > 6 && (
                  <button
                    type="button"
                    onClick={handleViewAll}
                    className="missions-view-all-btn"
                    title="Expand all missions at once"
                  >
                    <span>VIEW ALL ({filteredMissions.length})</span>
                  </button>
                )}
              </>
            ) : isExpanded ? (
              <button
                type="button"
                onClick={handleCollapse}
                className="missions-collapse-btn"
                title="Collapse list to initial 6 missions"
              >
                <ChevronUp style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
                <span>SHOW LESS (COLLAPSE TO 6)</span>
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* DETAILED MODAL VIEW */}
      <EventModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        onRegisterEvent={handleRegisterDirect}
      />

    </section>
  );
}
