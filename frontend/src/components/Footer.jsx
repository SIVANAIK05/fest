import React, { useState } from 'react';
import { ArrowUp, MapPin, Mail, Phone, Send, Radio, ShieldCheck, CheckCircle2, Bus, Clock } from 'lucide-react';
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch'
          }}
        >

          {/* ============================================================ */}
          {/* LEFT: SUBSPACE TRANSMISSION CONSOLE (INTERACTIVE FORM)       */}
          {/* ============================================================ */}
          <div
            style={{
              padding: '2.25rem',
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
          {/* RIGHT: MISSION CONTROL COMMAND DECK & LOCATION TELEMETRY    */}
          {/* ============================================================ */}
          <div
            style={{
              padding: '2.25rem',
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
                  <MapPin style={{ width: '1rem', height: '1rem', color: 'var(--amber-primary)' }} />
                  <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em' }}>
                    MISSION CONTROL BASE
                  </span>
                </div>
                <div style={{ background: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <img src="/images/iic_logo.png" alt="IIC" style={{ height: '1.1rem', width: 'auto' }} />
                  <span style={{ color: '#cbd5e1', fontSize: '9px' }}>|</span>
                  <img src="/images/vvit_logo.png" alt="VVIT" style={{ height: '1.1rem', width: 'auto' }} />
                </div>
              </div>

              {/* Host Institution */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  HOST INSTITUTION & VENUE
                </div>
                <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.05rem', color: '#ffffff', fontWeight: 800, marginTop: '0.2rem' }}>
                  Vasireddy Venkatadri International Technological University (VVITU)
                </div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', fontFamily: 'var(--font-space)', marginTop: '0.25rem' }}>
                  Nambur (V), Pedakakani (M), Guntur - 522508, Andhra Pradesh, India
                </div>
              </div>

              {/* Contact Lines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(56, 189, 248, 0.12)', paddingTop: '1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-space)', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Mail style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)', flexShrink: 0 }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'block' }}>OFFICIAL INBOX:</span>
                    <a href="mailto:control@astrion.org" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>
                      iic.vvituniversity@gmail.com / iicvvitu@vvitu.net
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Phone style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)', flexShrink: 0 }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'block' }}>  COORDINATOR HOTLINES:</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>
                      +91  8885811784 / 9154775499 / 8639342286
                    </span>
                  </div>
                </div>
              </div>

              {/* Transportation & Free Shuttle */}
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '0.75rem', padding: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-primary)', fontSize: '11px', fontWeight: 700 }}>
                  <Bus style={{ width: '0.9rem', height: '0.9rem' }} />
                  <span>Free Transit Shuttles for Outstation Teams</span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '0.25rem', lineHeight: '1.4' }}>
                  Complimentary campus  buses operate  from Guntur  & Vijayawada Bus Terminal throughout 23 - 24 Oct 2026.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#34d399', fontFamily: 'var(--font-space)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck style={{ width: '0.9rem', height: '0.9rem' }} />
                <span>Ministry of Education (MoE) Initiative • IIC VVITU</span>
              </div>
              <span style={{ color: 'var(--amber-primary)', fontWeight: 600 }}>Free Entry with College ID</span>
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
                gap: '0.4rem',
                background: '#ffffff',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.4rem',
                border: '1px solid rgba(56, 189, 248, 0.4)'
              }}>
                <img
                  src="/images/iic_logo.png"
                  alt="IIC Logo"
                  style={{ height: '1.6rem', width: 'auto' }}
                />
                <span style={{ color: '#cbd5e1', fontSize: '10px' }}>|</span>
                <img
                  src="/images/vvit_logo.png"
                  alt="VVIT Logo"
                  style={{ height: '1.6rem', width: 'auto' }}
                />
              </div>
              <span className="font-orbitron" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.2em', color: '#ffffff', textTransform: 'uppercase' }}>
                ASTRION<span style={{ color: 'var(--cyan-primary)' }}>-2k26</span >
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span className="font-space" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--text-slate)', textTransform: 'uppercase' }}>
              ORGANIZED BY INSTITUTION'S INNOVATION COUNCIL —  IIC VVITU
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--font-space)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>© 2026 ASTRION Fest. All rights reserved.</span>
            <button
              onClick={scrollToTop}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-slate)', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              <span>Back to Top</span>
              <ArrowUp style={{ width: '0.9rem', height: '0.9rem' }} />
            </button>
          </div>

        </div>

      </div>

    </footer>
  );
}
