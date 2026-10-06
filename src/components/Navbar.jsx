import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { toggleAmbientAudio, playUiBeep } from '../utils/audioEngine';

export default function Navbar() {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    playUiBeep(1200, 0.05);
    toggleAmbientAudio((state) => {
      setIsAudioActive(state);
    });
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Mission', href: '#mission' },
    { name: 'Events', href: '#events' },
    { name: 'Venues', href: '#venues' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Our Crew', href: '#crew' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(2, 4, 9, 0.92)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(56, 189, 248, 0.15)' : 'none',
        padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
        boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.8)' : 'none'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* IIC VVITU OFFICIAL DUAL LOGOS & ASTRION BRAND */}
        <a
          href="#home"
          onClick={() => playUiBeep(980)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          {/* Dual Logo Container on clean backdrop */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            background: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            flexShrink: 0
          }}>
            <img
              src="/images/iic_logo.png"
              alt="Institution's Innovation Council Logo"
              style={{ height: '1.65rem', width: 'auto', objectFit: 'contain' }}
            />
            <span style={{ color: '#cbd5e1', fontSize: '10px', fontWeight: 300 }}>|</span>
            <img
              src="/images/vvit_logo.png"
              alt="VVIT University Logo"
              style={{ height: '1.65rem', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              className="font-orbitron"
              style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.2em', color: '#ffffff', textTransform: 'uppercase', lineHeight: 1 }}
            >
              ASTRION
            </span>
            <span
              className="font-space"
              style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--cyan-primary)', textTransform: 'uppercase', marginTop: '0.2rem' }}
            >
              2K  26
            </span>
          </div>
        </a>

        {/* CENTER NAV LINKS */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="md-flex-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => playUiBeep(1100, 0.04)}
              className="font-space"
              style={{ fontSize: '0.85rem', letterSpacing: '0.05em', color: 'var(--text-slate)', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--cyan-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-slate)'}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Ambient Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            title={isAudioActive ? "Mute Interstellar Ambience" : "Play Interstellar Ambience"}
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              border: isAudioActive ? '1px solid var(--cyan-primary)' : '1px solid rgba(100, 116, 139, 0.4)',
              background: isAudioActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              color: isAudioActive ? 'var(--cyan-primary)' : 'var(--text-slate)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {isAudioActive ? <Volume2 style={{ width: '0.9rem', height: '0.9rem' }} /> : <VolumeX style={{ width: '0.9rem', height: '0.9rem' }} />}
          </button>

          {/* Join the Crew CTA Pill */}
          <a
            href="#register"
            onClick={() => playUiBeep(1300, 0.06)}
            className="btn-pill-ghost"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.75rem' }}
          >
            <span>Join the Crew</span>
            <span>→</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-cyan)',
              color: '#ffffff',
              cursor: 'pointer'
            }}
            className="md-hide-btn"
          >
            {mobileMenuOpen ? <X style={{ width: '1.25rem', height: '1.25rem' }} /> : <Menu style={{ width: '1.25rem', height: '1.25rem' }} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030712]/98 border-b border-cyan-500/20 backdrop-blur-2xl px-6 py-6 transition-all">
          <div className="flex flex-col gap-4 font-space text-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  playUiBeep(1100, 0.04);
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-slate-200 hover:text-cyan-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => {
                playUiBeep(1300, 0.06);
                setMobileMenuOpen(false);
              }}
              className="btn-pill-cyan text-xs text-center mt-2"
            >
              Join the Crew →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
