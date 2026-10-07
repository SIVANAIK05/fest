import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Users, 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Footprints
} from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

import { VENUE_SPOTS_DATA } from '../data/venuesData';
export { VENUE_SPOTS_DATA };



export default function VenueSpotsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState(VENUE_SPOTS_DATA[0]);
  const [expandedSpots, setExpandedSpots] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const filteredSpots = activeFilter === 'all'
    ? VENUE_SPOTS_DATA
    : VENUE_SPOTS_DATA.filter(s => s.category === activeFilter);

  const handleFilterClick = (cat) => {
    playUiBeep(1100, 0.03);
    setActiveFilter(cat);
  };

  const handleSpotSelect = (spot) => {
    playUiBeep(1300, 0.04);
    setSelectedSpot(spot);
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    playUiBeep(950, 0.03);
    setExpandedSpots(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyCoords = (spot, e) => {
    e.stopPropagation();
    playUiBeep(1400, 0.04);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(spot.coords);
    }
    setCopiedId(spot.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };


  return (
    <section id="venues" className="ast-section" style={{ position: 'relative' }}>

      {/* SECTION HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="section-index" style={{ justifyContent: 'center' }}>
          04 — CAMPUS NAVIGATION MATRIX
        </div>
        <h2 
          className="ast-heading" 
          style={{ 
            fontFamily: 'var(--font-space)', 
            fontSize: 'clamp(2rem, 3.8vw, 3rem)', 
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}
        >
          EVENT SPOTS & VENUES
        </h2>
        <p 
          className="ast-subheading" 
          style={{ 
            maxWidth: '680px', 
            margin: '0.65rem auto 0',
            fontFamily: 'var(--font-space)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: '#94a3b8'
          }}
        >
          Precision navigation waypoints across VVIT University. Locate competitive arenas, hackathon computing bays, and concert stages with live capacity telemetry.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.6rem', 
          flexWrap: 'wrap', 
          marginBottom: '2.75rem' 
        }}
      >
        {[
          { id: 'all', label: 'All Venues', count: '6' },
          { id: 'tech', label: 'Technical Labs', count: '3' },
          { id: 'stage', label: 'Stages & Halls', count: '2' },
          { id: 'gaming', label: 'Gaming Arena', count: '1' }
        ].map(f => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFilterClick(f.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.2rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-space)',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                background: isActive 
                  ? '#ffffff' 
                  : 'rgba(8, 14, 30, 0.75)',
                color: isActive ? '#020409' : '#cbd5e1',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.35)' : 'none',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <span>{f.label}</span>
              <span 
                style={{ 
                  fontSize: '9.5px', 
                  padding: '0.1rem 0.45rem', 
                  borderRadius: '9999px', 
                  background: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#020409' : '#94a3b8',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800
                }}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VENUE CARDS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.75rem',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        {filteredSpots.map(spot => {
          const isSelected = selectedSpot.id === spot.id;
          const isExpanded = !!expandedSpots[spot.id];
          const isCopied = copiedId === spot.id;

          return (
            <div
              key={spot.id}
              className="venue-hud-wrapper"
              onClick={() => handleSpotSelect(spot)}
            >
              {/* Outer Chamfered Border Chassis */}
              <div 
                className={`venue-hud-outer ${isSelected ? 'is-active' : ''}`}
              >
                {/* Inner Card Body with Chamfered Mask */}
                <div className="venue-hud-inner">
                  
                  {/* Subtle Cosmic Grid & Watermark Numeric Tag */}
                  <div className="venue-hud-grid-overlay" />
                  <div className="venue-hud-watermark">{spot.numericId}</div>

                  {/* Top Reticle Corner Markers */}
                  <div className="venue-corner-bracket" style={{ top: '8px', left: '8px', borderTop: '2px solid', borderLeft: '2px solid' }} />
                  <div className="venue-corner-bracket" style={{ bottom: '8px', right: '8px', borderBottom: '2px solid', borderRight: '2px solid' }} />

                  {/* CARD CONTENT */}
                  <div style={{ position: 'relative', zIndex: 2 }}>

                    {/* TOP STATUS BAR: Category & Live Beacon */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <span 
                        style={{ 
                          fontSize: '10px', 
                          fontFamily: 'var(--font-space)', 
                          fontWeight: 700, 
                          letterSpacing: '0.1em', 
                          textTransform: 'uppercase', 
                          color: 'var(--cyan-primary)' 
                        }}
                      >
                        {spot.categoryName}
                      </span>

                      {/* Pulsing Live Beacon Pill */}
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.4rem', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '9999px', 
                          background: 'rgba(6, 182, 212, 0.12)', 
                          border: '1px solid rgba(56, 189, 248, 0.35)' 
                        }}
                      >
                        <span style={{ position: 'relative', width: '6px', height: '6px', display: 'inline-block' }}>
                          <span 
                            style={{ 
                              position: 'absolute', 
                              inset: 0, 
                              borderRadius: '50%', 
                              background: 'var(--cyan-primary)', 
                              animation: 'radarBeaconPulse 1.8s infinite' 
                            }} 
                          />
                          <span 
                            style={{ 
                              position: 'absolute', 
                              inset: 0, 
                              borderRadius: '50%', 
                              background: 'var(--cyan-primary)' 
                            }} 
                          />
                        </span>
                        <span 
                          style={{ 
                            fontSize: '9px', 
                            fontFamily: 'var(--font-mono)', 
                            fontWeight: 700, 
                            color: 'var(--cyan-primary)', 
                            letterSpacing: '0.06em' 
                          }}
                        >
                          {spot.status}
                        </span>
                      </div>
                    </div>

                    {/* VENUE TITLE (Clean, high-legibility Interstellar HUD typography) */}
                    <h3 
                      style={{ 
                        fontFamily: 'var(--font-space)', 
                        fontSize: '1.22rem', 
                        fontWeight: 700, 
                        letterSpacing: '0.03em', 
                        color: '#ffffff', 
                        lineHeight: 1.25,
                        margin: '0.25rem 0 0.4rem',
                        textTransform: 'uppercase'
                      }}
                    >
                      {spot.name}
                    </h3>

                    {/* BUILDING & FLOOR LOCATION */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.4rem', 
                        color: '#94a3b8', 
                        fontSize: '11.5px', 
                        fontFamily: 'var(--font-space)', 
                        fontWeight: 500,
                        marginBottom: '1rem' 
                      }}
                    >
                      <MapPin style={{ width: '0.9rem', height: '0.9rem', color: 'var(--amber-primary)', flexShrink: 0 }} />
                      <span>{spot.building}</span>
                    </div>

                    {/* HOSTED MISSIONS & EVENTS (Made Highly Visible) */}
                    <div 
                      style={{ 
                        background: 'rgba(15, 23, 42, 0.65)', 
                        borderRadius: '0.75rem', 
                        padding: '0.75rem', 
                        border: '1px solid rgba(56, 189, 248, 0.15)',
                        marginBottom: '0.85rem'
                      }}
                    >
                      <div 
                        style={{ 
                          fontSize: '8.5px', 
                          fontFamily: 'var(--font-mono)', 
                          color: 'var(--cyan-primary)', 
                          letterSpacing: '0.14em', 
                          fontWeight: 700, 
                          marginBottom: '0.45rem',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Zap style={{ width: '0.7rem', height: '0.7rem', color: 'var(--amber-primary)' }} />
                        <span>HOSTED MISSIONS & ARENAS</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {spot.events.map((ev, i) => (
                          <span
                            key={i}
                            className="venue-mission-chip"
                            style={{
                              fontSize: '10.5px',
                              fontFamily: 'var(--font-space)',
                              fontWeight: 700,
                              letterSpacing: '0.02em',
                              padding: '0.28rem 0.65rem',
                              borderRadius: '0.45rem',
                              background: 'rgba(56, 189, 248, 0.12)',
                              color: '#e0f2fe',
                              border: '1px solid rgba(56, 189, 248, 0.35)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--cyan-primary)' }} />
                            <span>{ev}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* QUICK FACILITY FEATURE CHIPS (Clean, minimal, scannable) */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      {spot.chips.map((chip, idx) => (
                        <span
                          key={idx}
                          className="venue-highlight-chip"
                          style={{
                            fontSize: '9.5px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            background: 'rgba(30, 41, 59, 0.6)',
                            color: '#94a3b8',
                            border: '1px solid rgba(148, 163, 184, 0.18)'
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* EXPANDABLE TELEMETRY DETAILS DRAWER */}
                    <div 
                      className="venue-specs-drawer" 
                      style={{ 
                        maxHeight: isExpanded ? '180px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                        marginTop: isExpanded ? '0.75rem' : '0px'
                      }}
                    >
                      <div 
                        style={{ 
                          padding: '0.75rem', 
                          borderRadius: '0.5rem', 
                          background: 'rgba(2, 6, 23, 0.85)', 
                          border: '1px dashed rgba(56, 189, 248, 0.3)',
                          fontSize: '11px',
                          color: '#cbd5e1',
                          lineHeight: '1.5',
                          fontFamily: 'var(--font-space)'
                        }}
                      >
                        <div style={{ marginBottom: '0.4rem', color: '#f8fafc' }}>
                          <strong style={{ color: 'var(--cyan-primary)' }}>FACILITY SPECS: </strong>
                          {spot.specs}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-primary)', fontSize: '10.5px' }}>
                          <Footprints style={{ width: '0.75rem', height: '0.75rem', flexShrink: 0 }} />
                          <span><strong>ACCESS: </strong>{spot.transitGate}</span>
                        </div>
                      </div>
                    </div>

                    {/* TOGGLE EXPAND BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(spot.id, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--cyan-primary)',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        padding: '0.25rem 0',
                        cursor: 'pointer',
                        marginTop: '0.25rem'
                      }}
                    >
                      <span>{isExpanded ? 'COLLAPSE TELEMETRY' : 'VIEW SPECS & TRANSIT'}</span>
                      <ChevronDown 
                        style={{ 
                          width: '0.75rem', 
                          height: '0.75rem', 
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }} 
                      />
                    </button>

                  </div>

                  {/* CARD FOOTER: Capacity & Interactive GPS Coords */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '1.25rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(56, 189, 248, 0.14)',
                      fontSize: '11px',
                      color: 'var(--text-slate)',
                      fontFamily: 'var(--font-mono)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users style={{ width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{spot.capacity}</span>
                    </div>

                    {/* Interactive Copy Coordinates Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyCoords(spot, e)}
                      title="Click to copy GPS coordinates"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: isCopied ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                        border: isCopied ? '1px solid var(--cyan-primary)' : '1px solid rgba(56, 189, 248, 0.2)',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '0.4rem',
                        color: isCopied ? 'var(--cyan-primary)' : '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '9.5px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isCopied ? (
                        <>
                          <Check style={{ width: '0.75rem', height: '0.75rem', color: 'var(--cyan-primary)' }} />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Navigation style={{ width: '0.75rem', height: '0.75rem', color: 'var(--cyan-primary)' }} />
                          <span>{spot.coords}</span>
                          <Copy style={{ width: '0.65rem', height: '0.65rem', opacity: 0.6 }} />
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED WAYPOINT SPOTLIGHT / RAPID TRANSIT HUD */}
      <div
        style={{
          maxWidth: '980px',
          margin: '3rem auto 0',
          background: 'linear-gradient(135deg, rgba(8, 18, 42, 0.9) 0%, rgba(3, 8, 22, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '1.25rem',
          padding: '1.4rem 1.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '280px', flex: '1 1 300px' }}>
          <div 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '0.75rem', 
              background: 'rgba(56, 189, 248, 0.15)', 
              border: '1px solid var(--cyan-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
            }}
          >
            <Compass style={{ width: '1.4rem', height: '1.4rem', color: 'var(--cyan-primary)' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--cyan-primary)', letterSpacing: '0.12em', fontWeight: 700 }}>
                CAMPUS SPOT // {selectedSpot.name.toUpperCase()}
              </span>
              <span style={{ fontSize: '9px', padding: '0.1rem 0.45rem', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cyan-primary)', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}>
                {selectedSpot.status}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-space)', fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
              {selectedSpot.name}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-space)', marginTop: '0.2rem' }}>
              <strong style={{ color: '#e2e8f0' }}>{selectedSpot.building}</strong> • Transit route: <span style={{ color: 'var(--amber-primary)' }}>{selectedSpot.transitGate}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="#events"
            onClick={() => playUiBeep(1200, 0.04)}
            className="btn-pill-ghost"
            style={{ 
              fontSize: '11px', 
              padding: '0.55rem 1.15rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              textDecoration: 'none' 
            }}
          >
            <Zap style={{ width: '0.85rem', height: '0.85rem', color: 'var(--amber-primary)' }} />
            <span>View Events at this Spot</span>
          </a>

          <a
            href="#register"
            onClick={() => playUiBeep(1400, 0.04)}
            className="btn-pill-cyan"
            style={{ 
              fontSize: '11px', 
              padding: '0.55rem 1.25rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              textDecoration: 'none' 
            }}
          >
            <span>Get Venue Boarding Pass</span>
            <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
          </a>
        </div>
      </div>

    </section>
  );
}
