import React from 'react';

export default function MissionPartnersSection() {
  const sponsors = [
    { name: 'Bread & Bites', image: '/sponsers/breadbites.jpeg' },
    { name: 'Scalez', image: '/sponsers/scalez.jpeg' },
  ];

  const partners = [
    { name: 'IIC', desc: 'Organizing Partner', image: '/sponsers/iic.png' },
    { name: 'Student Tribe', desc: 'Innovation Partner', image: '/sponsers/studenttribe.png' },
  ];

  return (
    <section id="partners" className="ast-section" style={{ borderTop: '1px solid rgba(56, 189, 248, 0.15)', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 className="ast-heading" style={{ fontSize: '1.75rem' }}>
          CO-PRESENTED BY
        </h3>
        <p className="ast-subheading">
          With the support of our sponsors
        </p>
      </div>

      <div className="sponsors-logo-row">
        {sponsors.map((sponsor) => (
          <div className="sponsor-logo-card" key={sponsor.name}>
            <img src={sponsor.image} alt={sponsor.name} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h4 className="ast-heading" style={{ fontSize: '1.1rem' }}>
          ORGANIZING & INNOVATION PARTNERS
        </h4>
      </div>

      <div className="partners-logo-row">
        {partners.map((p, idx) => (
          <div 
            key={idx}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{ width: 'min(100%, 220px)', height: '120px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--cyan-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.25rem' }}>
              {p.desc}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}
