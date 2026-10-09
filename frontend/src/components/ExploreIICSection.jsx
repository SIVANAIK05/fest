import React from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  ExternalLink, 
  Lightbulb,
  Award,
  Sparkles
} from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export default function ExploreIICSection({ onOpenRegister }) {
  const handleRegisterClick = () => {
    playUiBeep(1300, 0.06);
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  const handleExternalLinkClick = () => {
    playUiBeep(1150, 0.04);
  };

  return (
    <section 
      id="register" 
      className="ast-section" 
      style={{ 
        position: 'relative',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}
    >
      {/* SECTION ANCHOR HELPER FOR #explore-iic & #iic */}
      <div id="explore-iic" style={{ position: 'absolute', top: 0, left: 0 }} />
      <div id="iic" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* BACKGROUND SCI-FI RADIAL ACCENT */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(850px, 92vw)',
          height: '420px',
          background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.08) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 75%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1060px', margin: '0 auto' }}>
        
        {/* =========================================================================
            SINGLE UNIFIED CARD (TWO HALVES: IIC & WHAT IS ASTRION)
            ========================================================================= */}
        <div 
          style={{
            background: 'linear-gradient(180deg, rgba(8, 14, 32, 0.94) 0%, rgba(2, 6, 23, 0.97) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '2rem',
            padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 12px 45px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          {/* =====================================================================
              HALF 1: ABOUT IIC (Official Organizing Body)
              ===================================================================== */}
          <div>
            {/* TOP ROW: DUAL LOGOS & HEADER */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.75rem',
                marginBottom: '1.5rem'
              }}
            >
              {/* White Capsule containing Ministry of Education IIC & VVITU logos */}
              <div 
                style={{
                  background: '#ffffff',
                  borderRadius: '1.25rem',
                  padding: '0.65rem 1.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.35)',
                  flexShrink: 0
                }}
              >
                <img 
                  src="/images/iic_logo.png" 
                  alt="Ministry of Education Institution's Innovation Council"
                  style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
                />
                <div style={{ width: '1px', height: '38px', background: '#e2e8f0' }} />
                <img 
                  src="/images/vvit_logo.png" 
                  alt="VVIT University"
                  style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* Title & Affiliation Details */}
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span 
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cyan-primary)',
                      boxShadow: '0 0 10px var(--cyan-primary)',
                      display: 'inline-block'
                    }}
                  />
                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: 'var(--cyan-primary)',
                      textTransform: 'uppercase'
                    }}
                  >
                    OFFICIAL ORGANIZING BODY
                  </span>
                </div>

                <h3 
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.95rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    lineHeight: 1.2,
                    marginBottom: '0.3rem'
                  }}
                >
                  INSTITUTION'S INNOVATION COUNCIL
                </h3>

                <div 
                  style={{
                    fontFamily: 'var(--font-space)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#cbd5e1',
                    letterSpacing: '0.03em',
                    marginBottom: '0.2rem'
                  }}
                >
                  VVIT UNIVERSITY (IIC VVITU)
                </div>

                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                  Under the aegis of Ministry of Education (MoE) Innovation Cell, Govt. of India
                </p>
              </div>
            </div>

            {/* THREE PILLS ROW + EXPLORE IIC VVITU BUTTON */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(56, 189, 248, 0.28)',
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-space)',
                    fontWeight: 600
                  }}
                >
                  <Award size={15} style={{ color: '#fbbf24' }} />
                  <span>4.5★ Innovation Cell</span>
                </div>

                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(56, 189, 248, 0.28)',
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-space)',
                    fontWeight: 600
                  }}
                >
                  <Rocket size={15} style={{ color: 'var(--cyan-primary)' }} />
                  <span>Deep Tech Incubation</span>
                </div>

                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(56, 189, 248, 0.28)',
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-space)',
                    fontWeight: 600
                  }}
                >
                  <Lightbulb size={15} style={{ color: '#34d399' }} />
                  <span>Student Ideation Hub</span>
                </div>
              </div>

              {/* EXPLORE IIC VVITU DIRECT LINK */}
              <a
                href="https://iicvvitu.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '999px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: 'var(--cyan-primary)',
                  fontFamily: 'var(--font-space)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.03em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--cyan-primary)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                  e.currentTarget.style.color = 'var(--cyan-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>EXPLORE IIC VVITU</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* =====================================================================
              MIDDLE DIVIDER LINE (Matching reference image)
              ===================================================================== */}
          <div style={{ height: '1px', background: 'rgba(56, 189, 248, 0.18)', width: '100%' }} />

          {/* =====================================================================
              HALF 2: ABOUT ASTRION (What is ASTRION & Join the Crew)
              ===================================================================== */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Description & Certified Chapter Badge */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <p 
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  maxWidth: '740px',
                  margin: 0
                }}
              >
                ASTRION 2026 is envisioned and orchestrated by the <strong style={{ color: '#ffffff' }}>Institution's Innovation Council (IIC VVITU)</strong> to push collegiate talent across the nation beyond earthly frontiers into autonomous robotics, interstellar AI, space cybersecurity, and creative cosmologies.
              </p>

              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--cyan-primary)',
                  fontFamily: 'var(--font-space)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={18} />
                <span>Certified University Chapter</span>
              </div>
            </div>

            {/* ACTION ROW: REGISTER BUTTON & FESTIVAL HIGHLIGHTS */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px dashed rgba(56, 189, 248, 0.15)'
              }}
            >
              {/* Primary Register Button */}
              <button
                onClick={handleRegisterClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.85rem 1.85rem',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  color: '#020409',
                  fontFamily: 'var(--font-space)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 0 25px rgba(56, 189, 248, 0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 32px rgba(56, 189, 248, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.45)';
                }}
              >
                <Rocket size={17} />
                <span>JOIN THE CREW // REGISTER</span>
              </button>

              {/* Quick Telemetry Indicators */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#94a3b8'
                }}
              >
                
                <span>•</span>
                <span>OCT 23-24, 2026</span>
                <span>•</span>
                <span style={{ color: '#34d399' }}>VVITU CAMPUS</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
