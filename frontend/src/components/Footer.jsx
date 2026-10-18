import React, { useState } from 'react';
import { ArrowUp, Mail, Phone, Send, Radio, ShieldCheck, CheckCircle2, Bus, Clock } from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export default function Footer() {
  const [formState, setFormState] = useState({
    name: '',
    contact: '',
    category: 'Registration & Entry Pass',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const scrollToTop = () => {
    playUiBeep(1400, 0.08);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          contact: formState.contact,
          department: formState.category,
          message: formState.message
        })
      });

      if (!response.ok) {
        throw new Error("Server rejected contact request.");
      }

      playUiBeep(1200, 0.1);

      setIsSent(true);

      setTimeout(() => {
        setFormState({
          name: '',
          contact: '',
          category: 'Registration & Entry Pass',
          message: ''
        });
      }, 2000);

    } catch (error) {
      console.error('Contact submission error:', error);
      alert('Message failed. Please try again.');
    }
  };

  return (
    <footer id="contact" style={{ background: '#020409', borderTop: '1px solid rgba(56, 189, 248, 0.2)', padding: '4.5rem 1.5rem 2.5rem 1.5rem', position: 'relative' }}>

      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>

        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center' }}>
          <div className="section-index" style={{ justifyContent: 'center' }}>05 —</div>
          <h2 className="ast-heading" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '0.04em' }}>
            CONTACT MISSION CONTROL
          </h2>
          <p className="ast-subheading" style={{ maxWidth: '640px', margin: '0.5rem auto 0' }}>
            Establish direct subspace communication with the ASTRION 2026 organizing team and VVIT student coordinators.
          </p>
        </div>

        {/* DUAL CONTACT CONSOLE: TRANSMISSION FORM + MISSION CONTROL DECK */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '2rem',
            alignItems: 'stretch'
          }}
        >

          {/* ============================================================ */}
          {/* LEFT: SUBSPACE TRANSMISSION CONSOLE (INTERACTIVE FORM)       */}
          {/* ============================================================ */}
          <div
            style={{
              padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
              borderRadius: '1.5rem',
              background: 'linear-gradient(180deg, rgba(8, 14, 30, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 15px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', paddingBottom: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Radio style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)' }} />
                  <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em' }}>
                    TRANSMIT MESSAGE
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: '#34d399', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
                  ● FREQUENCY ONLINE
                </span>
              </div>

              {isSent ? (
                <div
                  style={{
                    background: 'rgba(52, 211, 153, 0.12)',
                    border: '1.5px solid #34d399',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    margin: '2rem 0'
                  }}
                  className="animate-fadeIn"
                >
                  <CheckCircle2 style={{ width: '2.5rem', height: '2.5rem', color: '#34d399', margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                    TRANSMISSION RECEIVED!
                  </h4>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', fontFamily: 'var(--font-space)', marginTop: '0.35rem' }}>
                    Your transmission has reached ASTRION Mission Control. A student coordinator will respond within 2 planetary hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSent(false)}
                    className="btn-pill-cyan"
                    style={{ fontSize: '11px', padding: '0.45rem 1.25rem', marginTop: '1.25rem' }}
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* Name Input */}
                  <div>
                    <label className="form-field-label">Your Name / Call-Sign *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Murphy Cooper"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="reference-input"
                      required
                    />
                  </div>

                  {/* Email / Phone */}
                  <div>
                    <label className="form-field-label">Communication Frequency (Email or Phone) *</label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="e.g. cooper@gmail.com / +91 98401 23456"
                      value={formState.contact}
                      onChange={handleInputChange}
                      className="reference-input"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="form-field-label">Inquiry Department *</label>
                    <select
                      name="category"
                      value={formState.category}
                      onChange={handleInputChange}
                      className="reference-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Registration & Entry Pass" style={{ background: '#020617' }}>Registration & Entry Pass</option>
                      <option value="Technical Hackathon Rules" style={{ background: '#020617' }}>Technical Hackathon Rules</option>
                      <option value="Accommodation & Travel Shuttle" style={{ background: '#020617' }}>Accommodation & Travel Shuttle</option>
                      <option value="Sponsorship & Partnership" style={{ background: '#020617' }}>Sponsorship & Partnership</option>
                      <option value="General Query" style={{ background: '#020617' }}>General Query</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="form-field-label">Message Transmission *</label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Type your message, query, or technical question..."
                      value={formState.message}
                      onChange={handleInputChange}
                      className="reference-input"
                      style={{ resize: 'vertical' }}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-pill-cyan"
                    style={{
                      padding: '0.85rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      marginTop: '0.5rem'
                    }}
                  >
                    <Send style={{ width: '0.95rem', height: '0.95rem' }} />
                    <span>Send Subspace Transmission</span>
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: MISSION CONTROL COMMAND DECK                         */}
          {/* ============================================================ */}
          <div
            style={{
              padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
              borderRadius: '1.5rem',
              background: 'linear-gradient(180deg, rgba(8, 14, 30, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 15px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', paddingBottom: '0.85rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em' }}>
                  MISSION CONTROL
                </span>
                <div style={{ background: '#ffffff', padding: '0.2rem 0.55rem', borderRadius: '0.45rem', display: 'flex', alignItems: 'center', border: '1px solid rgba(56, 189, 248, 0.5)', boxShadow: '0 0 14px rgba(56, 189, 248, 0.25)' }}>
                  <img src="/images/vvit_logo.png" alt="VVIT & IIC" style={{ height: '1.35rem', width: 'auto', objectFit: 'contain' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '11px', color: 'var(--cyan-primary)', fontFamily: 'var(--font-space)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  HOST INSTITUTION
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '1.2rem', color: '#ffffff', fontWeight: 800, marginTop: '0.35rem', lineHeight: 1.35, letterSpacing: '0.01em' }}>
                  Vasireddy Venkatadri International Technological University (VVITU)
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'var(--font-space)', marginTop: '0.35rem', lineHeight: 1.5, fontWeight: 400 }}>
                  Nambur (V), Pedakakani (M), Guntur - 522508, Andhra Pradesh, India
                </div>
              </div>

              {/* Contact Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', borderTop: '1px solid rgba(56, 189, 248, 0.18)', paddingTop: '1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-space)', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Mail style={{ width: '1.1rem', height: '1.1rem', color: 'var(--cyan-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, wordBreak: 'break-word' }}>
                    <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontFamily: 'var(--font-space)', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>OFFICIAL INBOX:</span>
                    <a href="mailto:control@astrion.org" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600, wordBreak: 'break-all', fontSize: '13.5px' }}>
                      iic.vvituniversity@gmail.com / iicvvitu@vvitu.net
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Phone style={{ width: '1.1rem', height: '1.1rem', color: 'var(--cyan-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, wordBreak: 'break-word' }}>
                    <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontFamily: 'var(--font-space)', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>COORDINATOR HOTLINES:</span>
                    <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '13.5px' }}>
                      +91 8885811784 / 9154775499 / 8639342286
                    </span>
                  </div>
                </div>
              </div>

              {/* Transportation & Free Shuttle */}
              <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '0.85rem', padding: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--amber-primary)', fontSize: '12.5px', fontWeight: 700 }}>
                  <Bus style={{ width: '1rem', height: '1rem' }} />
                  <span>Free Transit Shuttles for Outstation Teams</span>
                </div>
                <div style={{ fontSize: '12px', color: '#f1f5f9', marginTop: '0.35rem', lineHeight: '1.5', fontFamily: 'var(--font-space)' }}>
                  Complimentary campus buses operate from Guntur & Vijayawada Bus Terminal throughout 23 - 24 Oct 2026.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#34d399', fontFamily: 'var(--font-space)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <ShieldCheck style={{ width: '1rem', height: '1rem' }} />
                <span>Ministry of Education (MoE) Initiative • IIC VVITU</span>
              </div>
              <span style={{ color: 'var(--amber-primary)', fontWeight: 700 }}>Free Entry with College ID</span>
            </div>

          </div>

        </div>

        {/* BOTTOM BRANDING & COPYRIGHT */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(51, 65, 85, 0.6)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.45rem',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)'
              }}>
                <img
                  src="/images/vvit_logo.png"
                  alt="VVIT University & IIC"
                  style={{ height: '1.6rem', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <span className="font-orbitron" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.2em', color: '#ffffff', textTransform: 'uppercase' }}>
                ASTRION<span style={{ color: 'var(--cyan-primary)' }}>-2k26</span >
              </span>
            </div>
            <span style={{ color: 'rgba(56, 189, 248, 0.4)' }}>|</span>
            <span className="font-space" style={{ fontSize: '0.8rem', letterSpacing: '0.08em', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
              ORGANIZED BY INSTITUTION'S INNOVATION COUNCIL — IIC VVITU
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontFamily: 'var(--font-space)', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <span>© 2026 ASTRION Fest. All rights reserved.</span>
            <button
              type="button"
              onClick={scrollToTop}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.4rem',
                height: '2.4rem',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: 'var(--cyan-primary)',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyan-primary)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.5)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              aria-label="Scroll back to top"
              title="Back to Top"
            >
              <ArrowUp style={{ width: '1.1rem', height: '1.1rem' }} />
            </button>
          </div>

        </div>

      </div>

    </footer>
  );
}
