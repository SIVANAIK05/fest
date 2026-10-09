import React, { useState, useEffect } from 'react';
import { Compass, Gauge, Radio, Clock, ChevronRight, ChevronLeft, Shield, Orbit } from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export default function FlightTelemetryHUD() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [activeSector, setActiveSector] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sectors = [
    { id: 'home', num: '00', name: 'EVENT HORIZON', target: '#home' },
    { id: 'mission', num: '01', name: 'MISSION COGNITION', target: '#mission' },
    { id: 'events', num: '02', name: 'EXOPLANET WORLDS', target: '#events' },
    { id: 'register', num: '03', name: 'SHUTTLE DOCKING', target: '#register' },
    { id: 'crew', num: '04', name: 'CREW MANIFEST', target: '#crew' },
    { id: 'partners', num: '05', name: 'IIC COUNCIL & ALLIANCE', target: '#partners' }
  ];

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = Date.now();
    let velocityTimeout;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = Math.abs(currentY - lastY);
      const deltaTime = Math.max(currentTime - lastTime, 16);
      
      const instantVelocity = (deltaY / deltaTime) * 15;
      setScrollVelocity(Math.min(instantVelocity, 120));

      clearTimeout(velocityTimeout);
      velocityTimeout = setTimeout(() => {
        setScrollVelocity(0);
      }, 120);

      lastY = currentY;
      lastTime = currentTime;
      setScrollY(currentY);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (currentY / maxScroll) * 100 : 0;
      setScrollProgress(progress);

      // Determine active sector based on scroll position
      const sectorElements = sectors.map(s => document.getElementById(s.id));
      const scrollMiddle = currentY + window.innerHeight * 0.35;

      for (let i = sectorElements.length - 1; i >= 0; i--) {
        const el = sectorElements[i];
        if (el && el.offsetTop <= scrollMiddle) {
          if (activeSector !== i) {
            setActiveSector(i);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(velocityTimeout);
    };
  }, [activeSector]);

  const handleSectorJump = (targetId, idx) => {
    playUiBeep(1400, 0.05);
    setActiveSector(idx);
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Interstellar calculations
  const warpVelocity = (0.15 + (scrollVelocity / 120) * 1.65).toFixed(2);
  const auTraversed = (1.2 + (scrollProgress / 100) * 8.8).toFixed(1);
  const timeDilation = (1.0 + (scrollProgress / 100) * 6.14).toFixed(2);

  return (
    <aside 
      className="flight-telemetry-hud"
      aria-label="Interstellar Flight Telemetry"
      style={{
        position: 'fixed',
        right: isCollapsed ? '0px' : '1.25rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 45,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: 'var(--font-space)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {/* COLLAPSE / EXPAND TOGGLE TAB */}
        <button
          onClick={() => {
            playUiBeep(1000, 0.03);
            setIsCollapsed(!isCollapsed);
          }}
          title={isCollapsed ? "Expand Interstellar Telemetry" : "Collapse HUD"}
          style={{
            background: 'rgba(3, 7, 21, 0.85)',
            border: '1px solid var(--border-cyan)',
            borderRight: isCollapsed ? 'none' : '1px solid var(--border-cyan)',
            borderRadius: isCollapsed ? '0.5rem 0 0 0.5rem' : '0.5rem',
            padding: '0.6rem 0.3rem',
            color: 'var(--cyan-primary)',
            backdropFilter: 'blur(12px)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          <Compass style={{ width: '0.85rem', height: '0.85rem' }} />
          <span style={{ writingMode: 'vertical-rl', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-slate)' }}>
            HUD
          </span>
          {isCollapsed ? <ChevronLeft style={{ width: '0.85rem', height: '0.85rem' }} /> : <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} />}
        </button>

        {/* EXPANDED TELEMETRY PANEL */}
        {!isCollapsed && (
          <div 
            className="hud-panel-box"
            style={{
              width: '210px',
              background: 'rgba(2, 6, 18, 0.88)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '1rem',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '1rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(56, 189, 248, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              transformOrigin: 'right center'
            }}
          >
            {/* HUD HEADER: IIC VVITU MISSION STATUS */}
            <div style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.15)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--cyan-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: scrollVelocity > 20 ? '#fbbf24' : '#34d399', boxShadow: '0 0 6px currentColor' }} />
                  IIC VVITU LIVE
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                  {Math.round(scrollProgress)}%
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '10px', color: '#ffffff', letterSpacing: '0.08em', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sectors[activeSector]?.name || 'INTERSTELLAR FLIGHT'}
              </div>
            </div>

            {/* LIVE TELEMETRY GAUGES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {/* WARP VELOCITY */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '0.5rem', padding: '0.4rem 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <Gauge style={{ width: '0.65rem', height: '0.65rem', color: 'var(--cyan-primary)' }} />
                  WARP
                </div>
                <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '12px', fontWeight: 700, color: scrollVelocity > 30 ? 'var(--amber-primary)' : 'var(--cyan-primary)', marginTop: '0.1rem' }}>
                  {warpVelocity} c
                </div>
              </div>

              {/* TIME DILATION */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '0.5rem', padding: '0.4rem 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <Clock style={{ width: '0.65rem', height: '0.65rem', color: 'var(--amber-primary)' }} />
                  DILATION
                </div>
                <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '12px', fontWeight: 700, color: '#f8fafc', marginTop: '0.1rem' }}>
                  {timeDilation}x
                </div>
              </div>
            </div>

            {/* DISTANCE TRAVERSED */}
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem', padding: '0.35rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px' }}>
              <span style={{ color: 'var(--text-muted)' }}>DISTANCE:</span>
              <span style={{ fontFamily: 'var(--font-orbitron)', color: '#38bdf8', fontWeight: 600 }}>{auTraversed} AU</span>
            </div>

            {/* SECTORS WAYPOINT NAVIGATION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '1px solid rgba(56, 189, 248, 0.12)', paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '8px', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                SECTOR WAYPOINTS
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {sectors.map((s, idx) => {
                  const isActive = activeSector === idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSectorJump(s.target, idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.3rem 0.45rem',
                        borderRadius: '0.35rem',
                        background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                        border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                        color: isActive ? '#ffffff' : 'var(--text-slate)',
                        fontSize: '9px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ 
                          width: '4px', 
                          height: '4px', 
                          borderRadius: '9999px', 
                          background: isActive ? 'var(--cyan-primary)' : 'rgba(100, 116, 139, 0.5)',
                          boxShadow: isActive ? '0 0 6px var(--cyan-primary)' : 'none'
                        }} />
                        <span style={{ fontWeight: isActive ? 700 : 400 }}>{s.num}</span>
                        <span style={{ fontSize: '8.5px', color: isActive ? 'var(--cyan-primary)' : 'inherit', maxWidth: '115px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.name}
                        </span>
                      </span>
                      {isActive && <span style={{ color: 'var(--cyan-primary)', fontSize: '8px' }}>●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FOOTER MISSION DIRECTIVE */}
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', borderTop: '1px solid rgba(56, 189, 248, 0.1)', paddingTop: '0.4rem' }}>
              <Shield style={{ width: '0.65rem', height: '0.65rem', color: '#38bdf8' }} />
              <span>DIRECTIVE: IIC VVITU</span>
            </div>

          </div>
        )}
      </div>
    </aside>
  );
}
