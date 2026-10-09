import React from 'react';

export default function MissionPartnersSection() {
  const partners = [
    { name: 'Google', desc: 'Cloud & AI Sponsor' },
    { name: 'Infosys', desc: 'Innovation Partner' },
    { name: 'TATA', desc: 'Strategic Alliance' },
    { name: 'Microsoft', desc: 'Quantum Track' }
  ];

  return (
    <section id="partners" className="ast-section" style={{ borderTop: '1px solid rgba(56, 189, 248, 0.15)', paddingTop: '4rem', paddingBottom: '4rem' }}>

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
