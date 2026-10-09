import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Rocket, 
  Compass, 
  Radio, 
  Calendar, 
  Users, 
  Orbit, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Disc
} from 'lucide-react';
import { toggleAmbientAudio, subscribeAudioState, playUiBeep } from '../utils/audioEngine';

export default function Navbar({ onOpenRegister }) {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const unsubscribe = subscribeAudioState((state) => {
      setIsAudioActive(state);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 35);

      // Determine active section for mobile dock indicator
      const sections = ['home', 'mission', 'events', 'register', 'gallery', 'crew', 'contact'];
      const scrollMiddle = scrollY + window.innerHeight * 0.35;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollMiddle) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    playUiBeep(1200, 0.05);
    toggleAmbientAudio((state) => {
      setIsAudioActive(state);
    });
  };

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home', icon: Orbit, num: '00' },
    { name: 'Mission', href: '#mission', id: 'mission', icon: Compass, num: '01' },
    { name: 'Events', href: '#events', id: 'events', icon: Calendar, num: '02' },
    { name: 'The Crew', href: '#crew', id: 'crew', icon: Users, num: '03' },
    { name: 'Contact', href: '#contact', id: 'contact', icon: Radio, num: '04' }
  ];

  const handleMobileNavClick = (href) => {
    playUiBeep(1150, 0.04);
    setMobileMenuOpen(false);
    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinCrew = (e) => {
    if (e) e.preventDefault();
    playUiBeep(1300, 0.06);
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. TOP HEADER (CLEAN & NON-OVERFLOWING ON ALL SCREENS)       */}
      {/* ============================================================ */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: isScrolled ? 'rgba(2, 4, 9, 0.92)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(18px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(56, 189, 248, 0.18)' : 'none',
          padding: isScrolled ? '0.65rem 0' : '1.1rem 0',
          boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.85)' : 'none'
        }}
      >
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>

          {/* IIC VVITU OFFICIAL LOGOS & BRAND */}
          <a
            href="#home"
            onClick={() => playUiBeep(980)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            {/* Dual Logo Container on clean white capsule */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.45rem',
              borderRadius: '0.45rem',
              background: '#ffffff',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              flexShrink: 0
            }}>
              <img
                src="/images/iic_logo.png"
                alt="IIC Logo"
                style={{ height: '1.45rem', width: 'auto', objectFit: 'contain' }}
              />
              <span style={{ color: '#cbd5e1', fontSize: '9px', fontWeight: 300 }}>|</span>
              <img
                src="/images/vvit_logo.png"
                alt="VVIT Logo"
                style={{ height: '1.45rem', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="font-orbitron"
                style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  lineHeight: 1
                }}
              >
                ASTRION
              </span>
              <span
                className="font-space"
                style={{
                  fontSize: '7.5px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: 'var(--cyan-primary)',
                  textTransform: 'uppercase',
                  marginTop: '0.2rem'
                }}
              >
                2K26 • VVITU
              </span>
            </div>
          </a>

          {/* CENTER DESKTOP NAV LINKS */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="md-flex-nav">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => playUiBeep(1100, 0.04)}
                className="font-space"
                style={{
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  color: activeSection === link.id ? '#ffffff' : 'var(--text-slate)',
                  fontWeight: activeSection === link.id ? 700 : 500,
                  transition: 'color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--cyan-primary)'}
                onMouseLeave={(e) => {
                  e.target.style.color = activeSection === link.id ? '#ffffff' : 'var(--text-slate)';
                }}
              >
                {link.name}
                {activeSection === link.id && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '2px',
                    borderRadius: '2px',
                    background: 'var(--cyan-primary)',
                    boxShadow: '0 0 8px var(--cyan-primary)'
                  }} />
                )}
              </a>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
            
            {/* Ambient Sound Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isAudioActive ? "Mute Interstellar Ambience" : "Play Interstellar Ambience"}
              style={{
                padding: '0.45rem',
                borderRadius: '9999px',
                border: isAudioActive ? '1px solid var(--amber-primary)' : '1px solid rgba(255, 255, 255, 0.2)',
                background: isAudioActive ? 'rgba(251, 191, 36, 0.18)' : 'rgba(15, 23, 42, 0.65)',
                color: isAudioActive ? 'var(--amber-primary)' : 'var(--text-slate)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {isAudioActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Desktop-Only "Join the Crew" Button (Opens registration modal popup) */}
            <button
              type="button"
              id="nav-join-crew-btn"
              onClick={handleJoinCrew}
              className="btn-pill-cyan desktop-only-btn"
              style={{
                padding: '0.5rem 1.15rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
              }}
            >
              <span>Join the Crew</span>
              <Rocket size={13} style={{ transform: 'rotate(45deg)' }} />
            </button>

            {/* Unique Futuristic Mobile Command Toggle (Visible only on Mobile) */}
            <button
              onClick={() => {
                playUiBeep(1200, 0.04);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '999px',
                background: mobileMenuOpen ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.85)',
                border: mobileMenuOpen ? '1px solid var(--cyan-primary)' : '1px solid rgba(56, 189, 248, 0.35)',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: mobileMenuOpen ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
              className="md-hide-btn"
              title="Open Navigation Console"
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: mobileMenuOpen ? '#fbbf24' : '#10b981',
                boxShadow: mobileMenuOpen ? '0 0 6px #fbbf24' : '0 0 6px #10b981'
              }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                {mobileMenuOpen ? 'CLOSE' : 'NAV'}
              </span>
              {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>

          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. UNIQUE FLOATING SCI-FI MOBILE DOCK (BOTTOM OF SCREEN)      */}
      {/* Visible only on mobile (<768px). Never overflows.            */}
      {/* ============================================================ */}
      <nav
        className="mobile-only-dock"
        style={{
          position: 'fixed',
          bottom: '0.85rem',
          left: '0.85rem',
          right: '0.85rem',
          zIndex: 45,
          background: 'rgba(4, 9, 24, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '999px',
          padding: '0.4rem 0.6rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(56, 189, 248, 0.18)',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '440px',
          margin: '0 auto',
          userSelect: 'none'
        }}
        aria-label="Mobile Navigation Dock"
      >
        {/* Slot 1: Home */}
        <a
          href="#home"
          onClick={() => playUiBeep(1000, 0.03)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '0.35rem 0.6rem',
            color: activeSection === 'home' ? 'var(--cyan-primary)' : '#94a3b8',
            fontSize: '0.62rem',
            fontFamily: 'var(--font-space)',
            fontWeight: activeSection === 'home' ? 800 : 500,
            textDecoration: 'none',
            borderRadius: '999px',
            background: activeSection === 'home' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Orbit size={16} />
          <span>Home</span>
        </a>

        {/* Slot 2: Mission */}
        <a
          href="#mission"
          onClick={() => playUiBeep(1050, 0.03)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '0.35rem 0.6rem',
            color: activeSection === 'mission' ? 'var(--cyan-primary)' : '#94a3b8',
            fontSize: '0.62rem',
            fontFamily: 'var(--font-space)',
            fontWeight: activeSection === 'mission' ? 800 : 500,
            textDecoration: 'none',
            borderRadius: '999px',
            background: activeSection === 'mission' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Compass size={16} />
          <span>Mission</span>
        </a>

        {/* Slot 3: CENTER PROMINENT "JOIN CREW" GLOWING CAPSULE (100% CONTAINER-BOUNDED, NO OVERFLOW) */}
        <button
          type="button"
          onClick={handleJoinCrew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.55rem 0.95rem',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            color: '#020409',
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-space)',
            letterSpacing: '0.04em',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <Rocket size={13} style={{ transform: 'rotate(45deg)' }} />
          <span>JOIN CREW</span>
        </button>

        {/* Slot 4: Events */}
        <a
          href="#events"
          onClick={() => playUiBeep(1100, 0.03)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '0.35rem 0.6rem',
            color: activeSection === 'events' ? 'var(--cyan-primary)' : '#94a3b8',
            fontSize: '0.62rem',
            fontFamily: 'var(--font-space)',
            fontWeight: activeSection === 'events' ? 800 : 500,
            textDecoration: 'none',
            borderRadius: '999px',
            background: activeSection === 'events' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={16} />
          <span>Events</span>
        </a>

        {/* Slot 5: Comms */}
        <a
          href="#contact"
          onClick={() => playUiBeep(1150, 0.03)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '0.35rem 0.6rem',
            color: activeSection === 'contact' ? 'var(--cyan-primary)' : '#94a3b8',
            fontSize: '0.62rem',
            fontFamily: 'var(--font-space)',
            fontWeight: activeSection === 'contact' ? 800 : 500,
            textDecoration: 'none',
            borderRadius: '999px',
            background: activeSection === 'contact' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Radio size={16} />
          <span>Comms</span>
        </a>
      </nav>

      {/* ============================================================ */}
      {/* 3. FULLSCREEN HOLOGRAPHIC FLIGHT DECK MOBILE OVERLAY         */}
      {/* Activated by tapping the top NAV launcher toggle             */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(2, 4, 10, 0.96)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
            animation: 'fadeIn 0.25s ease-out',
            overflowY: 'auto'
          }}
        >
          {/* Tactical Top Bar */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  ASTRION // TACTICAL FLIGHT DECK
                </div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '2px' }}>
                  COORDINATES: 16.3533° N, 80.5312° E • VVITU
                </div>
              </div>

              <button
                onClick={() => {
                  playUiBeep(1200, 0.03);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Sector Jump Links Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isCurrent = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => handleMobileNavClick(link.href)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.15rem',
                      borderRadius: '12px',
                      background: isCurrent ? 'rgba(56, 189, 248, 0.16)' : 'rgba(15, 23, 42, 0.7)',
                      border: isCurrent ? '1.5px solid var(--cyan-primary)' : '1px solid rgba(56, 189, 248, 0.15)',
                      textDecoration: 'none',
                      color: isCurrent ? '#ffffff' : '#cbd5e1',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)', fontWeight: 700 }}>
                        {link.num}
                      </span>
                      <Icon size={16} style={{ color: isCurrent ? 'var(--cyan-primary)' : '#94a3b8' }} />
                      <span style={{ fontFamily: 'var(--font-space)', fontSize: '0.9rem', fontWeight: 700 }}>
                        {link.name}
                      </span>
                    </div>

                    <ChevronRight size={15} style={{ color: '#64748b' }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom Call-To-Action: 100% Responsive "Join the Crew" Card */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(56, 189, 248, 0.2)' }}>
            
            <button
              type="button"
              onClick={handleJoinCrew}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#020409',
                fontSize: '0.88rem',
                fontWeight: 800,
                fontFamily: 'var(--font-space)',
                letterSpacing: '0.08em',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <Rocket size={16} />
              <span>JOIN THE CREW // ISSUE BOARDING PASS</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              fontSize: '0.7rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-space)'
            }}>
              <span>VVITU CAMPUS • OCT 23-24, 2026</span>
              <button
                type="button"
                onClick={handleAudioToggle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'none',
                  border: 'none',
                  color: isAudioActive ? 'var(--amber-primary)' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {isAudioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>{isAudioActive ? 'Audio ON' : 'Audio OFF'}</span>
              </button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
