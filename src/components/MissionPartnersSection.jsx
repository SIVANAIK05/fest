import React from 'react';
import { Award, Lightbulb, Rocket, ExternalLink, ShieldCheck } from 'lucide-react';

export default function MissionPartnersSection() {
  const partners = [
    { name: 'IEEE', desc: 'Technical Co-Sponsor' },
    { name: 'Google', desc: 'Cloud & AI Sponsor' },
    { name: 'Infosys', desc: 'Innovation Partner' },
    { name: 'TATA', desc: 'Strategic Alliance' },
    { name: 'Microsoft', desc: 'Quantum Track' }
  ];

  return (
    <section id="partners" className="ast-section" style={{ borderTop: '1px solid rgba(56, 189, 248, 0.15)', paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
      
      {/* ============================================================ */}
      {/* PROMINENT ORGANIZING COUNCIL: IIC VVITU                       */}
      {/* ============================================================ */}
      <div 
        className="iic-organizer-card"
        style={{
          borderRadius: '1.5rem',
          background: 'radial-gradient(ellipse at top left, rgba(8, 51, 68, 0.45) 0%, rgba(2, 6, 23, 0.95) 70%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.12)',
          padding: '2.25rem',
          marginBottom: '3.5rem',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background glow */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '9999px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Top row: Badge & Council Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {/* IIC & VVIT DUAL OFFICIAL LOGOS CONTAINER */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '1rem',
                  background: 'rgba(255, 255, 255, 0.98)',
                  boxShadow: '0 0 30px rgba(56, 189, 248, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5)',
                  border: '2px solid rgba(56, 189, 248, 0.6)',
                  flexShrink: 0
                }}
              >
                <img 
                  src="/images/iic_logo.png" 
                  alt="Institution's Innovation Council Logo" 
                  style={{ height: '3.6rem', width: 'auto', objectFit: 'contain' }} 
                />
                <div style={{ width: '1.5px', height: '3.2rem', background: '#e2e8f0' }} />
                <img 
                  src="/images/vvit_logo.png" 
                  alt="VVIT University Logo" 
                  style={{ height: '3.6rem', width: 'auto', objectFit: 'contain' }} 
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '10.5px', letterSpacing: '0.18em', color: 'var(--cyan-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    OFFICIAL ORGANIZING BODY
                  </span>
                </div>
                <h3 className="ast-heading" style={{ fontSize: '1.85rem', margin: '0.1rem 0' }}>
                  INSTITUTION'S INNOVATION COUNCIL
                </h3>
                <p style={{ fontFamily: 'var(--font-space)', fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>
                  VVIT UNIVERSITY (IIC VVITU)
                </p>
                <p style={{ fontFamily: 'var(--font-space)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Under the aegis of Ministry of Education (MoE) Innovation Cell, Govt. of India
                </p>
              </div>
            </div>

            {/* Quick Metrics Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', borderRadius: '9999px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '11px', fontFamily: 'var(--font-space)' }}>
                <Award style={{ width: '0.85rem', height: '0.85rem', color: '#fbbf24' }} />
                <span>4.5★ Innovation Cell</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', borderRadius: '9999px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '11px', fontFamily: 'var(--font-space)' }}>
                <Rocket style={{ width: '0.85rem', height: '0.85rem', color: '#38bdf8' }} />
                <span>Deep Tech Incubation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', borderRadius: '9999px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '11px', fontFamily: 'var(--font-space)' }}>
                <Lightbulb style={{ width: '0.85rem', height: '0.85rem', color: '#34d399' }} />
                <span>Student Ideation Hub</span>
              </div>
            </div>

          </div>

          {/* Description line */}
          <div style={{ borderTop: '1px solid rgba(56, 189, 248, 0.15)', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <p style={{ fontFamily: 'var(--font-space)', fontSize: '0.85rem', color: '#94a3b8', maxWidth: '780px', lineHeight: 1.6 }}>
              ASTRION 2026 is envisioned and orchestrated by the <strong style={{ color: '#ffffff' }}>Institution's Innovation Council (IIC VVITU)</strong> to push collegiate talent across the nation beyond earthly frontiers into autonomous robotics, interstellar AI, space cybersecurity, and creative cosmologies.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-primary)', fontSize: '11px', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
              <ShieldCheck style={{ width: '1rem', height: '1rem' }} />
              <span>Certified University Chapter</span>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* STRATEGIC ALLIANCES & SPONSORS                                */}
      {/* ============================================================ */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="ast-heading" style={{ fontSize: '1.75rem' }}>
          STRATEGIC ALLIANCES
        </h3>
        <p className="ast-subheading">
          Co-sponsored and supported by leading technology institutions.
        </p>
      </div>

      {/* MINIMALIST LOGOS GRID (matching reference image) */}
      <div className="partners-logo-row">
        {partners.map((p, idx) => (
          <div 
            key={idx}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }}
          >
            <span style={{ fontFamily: 'var(--font-space)', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '0.05em', color: '#e2e8f0', transition: 'color 0.2s ease' }}>
              {p.name}
            </span>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-space)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.2rem' }}>
              {p.desc}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}
