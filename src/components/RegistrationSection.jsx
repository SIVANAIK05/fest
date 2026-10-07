import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Check, 
  Download, 
  Sparkles, 
  Users, 
  User, 
  QrCode, 
  X,
  FileCheck,
  Rocket,
  ShieldCheck,
  Cpu,
  Gamepad2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { INSTITUTIONS_LIST } from '../data/eventsData';
import { MISSIONS_LIST } from './EventsSection';
import { playUiBeep, playWarpSound, playSpaceBreachSound } from '../utils/audioEngine';
import { 
  buildQrPayload, 
  generateQrCodeDataUrl, 
  downloadAstrionPassImage 
} from '../utils/passGenerator';
import SpaceBreachOverlay from './SpaceBreachOverlay';

export default function RegistrationSection({ preselectedEventId }) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Cooper Brand',
    college: INSTITUTIONS_LIST[0],
    customCollege: '',
    pin: '21VV1A0589',
    department: 'Computer Science & AI',
    year: '3rd Year',
    isSquad: false,
    teamName: '',
    crewNames: '',
    selectedEvents: ['ai-odyssey', 'codeverse']
  });

  const [astrionId, setAstrionId] = useState('ASTR-26-8F42');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [isBreaching, setIsBreaching] = useState(false);

  // Prevent background scrolling while Pass Modal is open so content never displays over the pass
  useEffect(() => {
    if (showPassModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showPassModal]);


  useEffect(() => {
    if (preselectedEventId) {
      setFormData(prev => ({
        ...prev,
        selectedEvents: prev.selectedEvents.includes(preselectedEventId) 
          ? prev.selectedEvents 
          : [...prev.selectedEvents, preselectedEventId]
      }));
    }
  }, [preselectedEventId]);

  // Generate QR Code payload
  useEffect(() => {
    const selectedMissions = MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id));
    const passFormData = {
      fullName: formData.fullName,
      institution: formData.college === 'Other Institution / University' ? formData.customCollege : formData.college,
      studentId: formData.pin,
      department: formData.department,
      yearOfStudy: formData.year,
      teamName: formData.isSquad ? (formData.teamName || 'Squad Flight') : 'Solo Explorer',
      coAstronauts: formData.isSquad ? (formData.crewNames || 'None') : 'Solo Explorer'
    };
    const payload = buildQrPayload({ astrionId, formData: passFormData, selectedMissions, format: 'url' });
    generateQrCodeDataUrl(payload).then(url => {
      if (url) setQrDataUrl(url);
    });
  }, [astrionId, formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModeChange = (isSquadMode) => {
    playUiBeep(1200, 0.04);
    setFormData(prev => ({
      ...prev,
      isSquad: isSquadMode,
      teamName: isSquadMode && !prev.teamName ? 'Endurance Squadron' : prev.teamName,
      crewNames: isSquadMode && !prev.crewNames ? 'Murphy Cooper (21VV1A0590), Donald Brand (21VV1A0591)' : prev.crewNames
    }));
  };

  const handleEventToggle = (id) => {
    playUiBeep(1100, 0.03);
    setFormData(prev => {
      const exists = prev.selectedEvents.includes(id);
      return {
        ...prev,
        selectedEvents: exists 
          ? prev.selectedEvents.filter(x => x !== id)
          : [...prev.selectedEvents, id]
      };
    });
  };

  // SUBMIT HANDLER: Trigger Space Breach & Hyperspace Crash Sequence!
  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate new unique Pass ID
    const randomId = 'ASTR-26-' + Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    setAstrionId(randomId);

    // Play space breach sound (acceleration rumble + klaxon + sonic crash boom)
    playSpaceBreachSound();

    // Trigger full-screen cockpit crash / wormhole breach animation
    setIsBreaching(true);
  };

  const handleBreachComplete = () => {
    setIsBreaching(false);
    setShowPassModal(true);
  };


  const handleDownload = async () => {
    playUiBeep(1400, 0.08);
    setIsDownloading(true);
    const selectedMissions = MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id));
    const passFormData = {
      fullName: formData.fullName,
      institution: formData.college === 'Other Institution / University' ? (formData.customCollege || 'National University') : formData.college,
      studentId: formData.pin,
      department: formData.department,
      yearOfStudy: formData.year,
      teamName: formData.isSquad ? (formData.teamName || 'Squad Flight') : 'Solo Explorer',
      coAstronauts: formData.isSquad ? (formData.crewNames || 'None') : 'Solo Explorer'
    };
    try {
      await downloadAstrionPassImage({
        astrionId,
        formData: passFormData,
        selectedMissions,
        qrDataUrl
      });
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (err) {
      console.error('Pass download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedMissionsList = MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id));
  const technicalMissions = MISSIONS_LIST.filter(m => m.category === 'technical');
  const nonTechnicalMissions = MISSIONS_LIST.filter(m => m.category !== 'technical');

  const institutionDisplayName = formData.college === 'Other Institution / University'
    ? (formData.customCollege || 'Other College')
    : formData.college;

  return (
    <section id="register" className="ast-section" style={{ position: 'relative' }}>
      
      {/* SECTION HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="section-index" style={{ justifyContent: 'center' }}>03 —</div>
        <h2 className="ast-heading" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '0.04em' }}>
          CREW REGISTRATION TERMINAL
        </h2>
        <p className="ast-subheading" style={{ maxWidth: '640px', margin: '0.5rem auto 0' }}>
          Secure your interstellar clearance pass. Complete your details below to generate your authentic entry badge with embedded venue access QR code.
        </p>
      </div>

      {/* CENTERED, SPACIOUS FLIGHT TERMINAL CARD */}
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        
        <form 
          onSubmit={handleSubmit}
          style={{
            background: 'linear-gradient(180deg, rgba(8, 14, 30, 0.92) 0%, rgba(2, 6, 23, 0.96) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '1.75rem',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}
        >
          
          {/* TERMINAL TOP STATUS BAR */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(56, 189, 248, 0.18)',
              paddingBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
              <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '13px', color: '#ffffff', fontWeight: 700, letterSpacing: '0.08em' }}>
                TERMINAL CONSOLE // FAST CLEARANCE
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.3rem 0.75rem', borderRadius: '9999px' }}>
              <ShieldCheck style={{ width: '0.9rem', height: '0.9rem', color: '#38bdf8' }} />
              <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                IIC VVITU VERIFIED
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STEP 1: PARTICIPATION MODE (SOLO vs SQUAD)                   */}
          {/* ============================================================ */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-space)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
              1. Choose Expedition Flight Mode
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              
              {/* Solo Button */}
              <button
                type="button"
                onClick={() => handleModeChange(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '1rem',
                  background: !formData.isSquad 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(8, 14, 30, 0.85) 100%)' 
                    : 'rgba(15, 23, 42, 0.6)',
                  border: !formData.isSquad 
                    ? '1.5px solid rgba(255, 255, 255, 0.85)' 
                    : '1px solid rgba(51, 65, 85, 0.6)',
                  boxShadow: !formData.isSquad ? '0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: !formData.isSquad ? 'rgba(255, 255, 255, 0.15)' : 'rgba(30, 41, 59, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User style={{ width: '1.4rem', height: '1.4rem', color: !formData.isSquad ? '#ffffff' : 'var(--text-slate)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    Solo Astronaut
                  </div>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--text-slate)', marginTop: '0.15rem' }}>
                    Individual participant entry pass
                  </div>
                </div>
                {!formData.isSquad && <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', color: '#ffffff' }} />}
              </button>

              {/* Squad Button */}
              <button
                type="button"
                onClick={() => handleModeChange(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '1rem',
                  background: formData.isSquad 
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.16) 0%, rgba(8, 14, 30, 0.8) 100%)' 
                    : 'rgba(15, 23, 42, 0.6)',
                  border: formData.isSquad 
                    ? '1.5px solid var(--amber-primary)' 
                    : '1px solid rgba(51, 65, 85, 0.6)',
                  boxShadow: formData.isSquad ? '0 0 20px rgba(251, 191, 36, 0.25)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: formData.isSquad ? 'rgba(251, 191, 36, 0.25)' : 'rgba(30, 41, 59, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Users style={{ width: '1.4rem', height: '1.4rem', color: formData.isSquad ? 'var(--amber-primary)' : 'var(--text-slate)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    Squadron / Team
                  </div>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--text-slate)', marginTop: '0.15rem' }}>
                    Multiple crew members with call-sign
                  </div>
                </div>
                {formData.isSquad && <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', color: 'var(--amber-primary)' }} />}
              </button>

            </div>
          </div>

          {/* ============================================================ */}
          {/* STEP 2: ASTRONAUT CREDENTIALS                                */}
          {/* ============================================================ */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-space)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
              2. Astronaut Personal Details
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              
              {/* Full Name */}
              <div>
                <label className="form-field-label">Lead Astronaut Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Cooper Brand"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="reference-input"
                  required
                />
              </div>

              {/* Student PIN */}
              <div>
                <label className="form-field-label">Student PIN / Roll No *</label>
                <input
                  type="text"
                  name="pin"
                  placeholder="e.g. 21VV1A0589"
                  value={formData.pin}
                  onChange={handleInputChange}
                  className="reference-input"
                  required
                />
              </div>

              {/* College Dropdown */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-field-label">College / University *</label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="reference-input"
                  style={{ cursor: 'pointer' }}
                >
                  {INSTITUTIONS_LIST.map((inst, idx) => (
                    <option key={idx} value={inst} style={{ background: '#020617', color: '#ffffff' }}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom College Input if 'Other' selected */}
              {formData.college === 'Other Institution / University' && (
                <div style={{ gridColumn: '1 / -1' }} className="animate-fadeIn">
                  <label className="form-field-label" style={{ color: 'var(--amber-primary)' }}>Enter College Name *</label>
                  <input
                    type="text"
                    name="customCollege"
                    placeholder="Type your college or university name"
                    value={formData.customCollege}
                    onChange={handleInputChange}
                    className="reference-input"
                    required
                  />
                </div>
              )}

              {/* Department */}
              <div>
                <label className="form-field-label">Department / Branch *</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. CSE / AI / ECE"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="reference-input"
                  required
                />
              </div>

              {/* Year of Study */}
              <div>
                <label className="form-field-label">Year of Study *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="reference-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="1st Year" style={{ background: '#020617' }}>1st Year</option>
                  <option value="2nd Year" style={{ background: '#020617' }}>2nd Year</option>
                  <option value="3rd Year" style={{ background: '#020617' }}>3rd Year</option>
                  <option value="4th Year" style={{ background: '#020617' }}>4th Year</option>
                  <option value="PG / Research Scholar" style={{ background: '#020617' }}>PG / Research Scholar</option>
                </select>
              </div>

            </div>
          </div>

          {/* ============================================================ */}
          {/* STEP 3: SQUAD CREDENTIALS (IF SQUAD MODE ACTIVE)             */}
          {/* ============================================================ */}
          {formData.isSquad && (
            <div 
              className="animate-fadeIn"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1.5px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(251, 191, 36, 0.2)', paddingBottom: '0.65rem' }}>
                <Users style={{ width: '1.1rem', height: '1.1rem', color: 'var(--amber-primary)' }} />
                <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>
                  SQUADRON MANIFEST & CREW MEMBERS
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-field-label" style={{ color: 'var(--amber-primary)' }}>Squadron / Team Name *</label>
                  <input
                    type="text"
                    name="teamName"
                    placeholder="e.g. Endurance Squadron"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="reference-input"
                    required={formData.isSquad}
                  />
                </div>

                <div>
                  <label className="form-field-label" style={{ color: '#cbd5e1' }}>Crew Members (Names & PINs) *</label>
                  <input
                    type="text"
                    name="crewNames"
                    placeholder="e.g. Murphy (21VV1A0590), Donald (21VV1A0591)"
                    value={formData.crewNames}
                    onChange={handleInputChange}
                    className="reference-input"
                    required={formData.isSquad}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: EVENTS SELECTION (CATEGORIZED, SPACIOUS CHIPS)       */}
          {/* ============================================================ */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ fontFamily: 'var(--font-space)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 600 }}>
                3. Select Events / Missions ({formData.selectedEvents.length} Selected)
              </label>

              <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--cyan-primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                {formData.selectedEvents.length} Authorized
              </span>
            </div>

            {/* CATEGORY A: TECHNICAL MISSIONS */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem', color: '#93c5fd', fontSize: '12px', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
                <Cpu style={{ width: '0.9rem', height: '0.9rem', color: 'var(--cyan-primary)' }} />
                <span>Technical Missions</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {technicalMissions.map((m) => {
                  const isSelected = formData.selectedEvents.includes(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => handleEventToggle(m.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '0.85rem',
                        background: isSelected 
                          ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)' 
                          : 'rgba(15, 23, 42, 0.65)',
                        border: isSelected 
                          ? '1.5px solid var(--cyan-primary)' 
                          : '1px solid rgba(51, 65, 85, 0.5)',
                        boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                          {m.title}
                        </span>
                        {isSelected && <Check style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)' }} />}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-slate)', fontFamily: 'var(--font-space)' }}>
                          Team: {m.teamSize}
                        </span>
                        <span style={{ fontSize: '9px', padding: '0.15rem 0.45rem', borderRadius: '4px', background: m.regType === 'pre-registration' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(52, 211, 153, 0.2)', color: m.regType === 'pre-registration' ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                          {m.regType === 'pre-registration' ? 'PRE-REG' : 'SPOT'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CATEGORY B: NON-TECHNICAL & GAMING MISSIONS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem', color: 'var(--amber-primary)', fontSize: '12px', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
                <Gamepad2 style={{ width: '0.9rem', height: '0.9rem', color: 'var(--amber-primary)' }} />
                <span>Creative, Non-Tech & Gaming Missions</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {nonTechnicalMissions.map((m) => {
                  const isSelected = formData.selectedEvents.includes(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => handleEventToggle(m.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: '0.85rem',
                        background: isSelected 
                          ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)' 
                          : 'rgba(15, 23, 42, 0.65)',
                        border: isSelected 
                          ? '1.5px solid var(--amber-primary)' 
                          : '1px solid rgba(51, 65, 85, 0.5)',
                        boxShadow: isSelected ? '0 0 15px rgba(251, 191, 36, 0.25)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                          {m.title}
                        </span>
                        {isSelected && <Check style={{ width: '1rem', height: '1rem', color: 'var(--amber-primary)' }} />}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-slate)', fontFamily: 'var(--font-space)' }}>
                          Team: {m.teamSize}
                        </span>
                        <span style={{ fontSize: '9px', padding: '0.15rem 0.45rem', borderRadius: '4px', background: m.regType === 'pre-registration' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(52, 211, 153, 0.2)', color: m.regType === 'pre-registration' ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                          {m.regType === 'pre-registration' ? 'PRE-REG' : 'SPOT'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* STEP 5: PRIMARY SUBMIT ACTION                                */}
          {/* ============================================================ */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(56, 189, 248, 0.18)' }}>
            <button
              type="submit"
              className="btn-pill-cyan"
              style={{
                width: '100%',
                padding: '1.15rem',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                borderRadius: '1rem',
                letterSpacing: '0.12em'
              }}
            >
              <Rocket style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>CONFIRM REGISTRATION & ISSUE FLIGHT PASS</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.85rem', color: 'var(--text-slate)', fontSize: '11px', fontFamily: 'var(--font-space)' }}>
              <ShieldCheck style={{ width: '0.9rem', height: '0.9rem', color: '#34d399' }} />
              <span>Instant QR clearance badge & download popup generated upon confirmation</span>
            </div>
          </div>

        </form>

      </div>

      {/* ============================================================ */}
      {/* 🚀 CREW ENTRY PASS POPUP MODAL (SHOWS ON FORM SUBMISSION)    */}
      {/* ============================================================ */}
      {showPassModal && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(2, 4, 9, 0.94)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 2.5vw, 1.75rem)',
            overflowY: 'auto',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={() => setShowPassModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              overflowY: 'auto',
              position: 'relative',
              borderRadius: '1.75rem',
              border: '2px solid rgba(255, 255, 255, 0.65)',
              boxShadow: '0 25px 90px rgba(0, 0, 0, 0.95), 0 0 45px rgba(245, 158, 11, 0.3)',
              fontFamily: 'var(--font-space)'
            }}
          >
            {/* Background Image: Shuttle Stargazer & Crew Officer */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url("/images/crew_shuttle_delivery.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 35%',
                filter: 'brightness(0.48) contrast(1.15)',
                zIndex: 0
              }}
            />

            {/* Dark Sci-Fi Aerospace Glass Overlay */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.93) 0%, rgba(3, 7, 21, 0.85) 55%, rgba(8, 20, 45, 0.93) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: 1
              }}
            />

            {/* Pass Content Layer */}
            <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(1.5rem, 3vw, 2.25rem)' }}>

              {/* Modal Close Button */}
              <button
                onClick={() => {
                  playUiBeep(900, 0.03);
                  setShowPassModal(false);
                }}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  color: 'var(--text-slate)',
                  cursor: 'pointer',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '9999px',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.2s ease'
                }}
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>

              {/* Modal Header: Official Logos & Gateway Clearance */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.18)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.25rem 0.65rem', borderRadius: '0.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                  <img src="/images/iic_logo.png" alt="IIC" style={{ height: '1.4rem', width: 'auto' }} />
                  <span style={{ color: '#cbd5e1', fontSize: '11px' }}>|</span>
                  <img src="/images/vvit_logo.png" alt="VVIT" style={{ height: '1.4rem', width: 'auto' }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '9.5px', letterSpacing: '0.15em', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                    GATEWAY CLEARANCE AUTHORIZED
                  </span>
                  <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '13px', color: '#ffffff', fontWeight: 800 }}>
                    ASTRION 2026 // FLIGHT PASS
                  </span>
                </div>
              </div>

              {/* PASS CONTENT BODY */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center', background: 'rgba(8, 14, 30, 0.75)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                      BOARDING PASS ID
                    </div>
                    <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.65rem', color: '#ffffff', fontWeight: 900, letterSpacing: '0.04em' }}>
                      {astrionId}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      LEAD ASTRONAUT & PIN
                    </div>
                    <div style={{ fontSize: '15.5px', color: '#ffffff', fontWeight: 700 }}>
                      {formData.fullName} • <span style={{ color: 'var(--amber-primary)' }}>{formData.pin}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      INSTITUTION / DEPARTMENT
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#e2e8f0' }}>
                      {institutionDisplayName} ({formData.department} - {formData.year})
                    </div>
                  </div>

                  {formData.isSquad && (
                    <div style={{ background: 'rgba(2, 6, 23, 0.85)', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                      <div style={{ fontSize: '11.5px', color: 'var(--amber-primary)', fontWeight: 700 }}>
                        Squad: {formData.teamName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '0.15rem' }}>
                        Crew: {formData.crewNames}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      AUTHORIZED MISSIONS
                    </div>
                    <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>
                      {selectedMissionsList.map(m => m.title).join(', ') || 'General Entry'}
                    </div>
                  </div>
                </div>

                {/* REAL SCANNABLE QR CODE IN POPUP */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div 
                    style={{
                      width: '8.5rem',
                      height: '8.5rem',
                      background: '#ffffff',
                      padding: '0.45rem',
                      borderRadius: '0.85rem',
                      boxShadow: '0 0 30px rgba(255, 255, 255, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    {qrDataUrl && <img src={qrDataUrl} alt="Scan QR Code" style={{ width: '100%', height: '100%' }} />}
                  </div>
                  <span style={{ fontSize: '9.5px', color: '#34d399', fontWeight: 700, letterSpacing: '0.08em' }}>
                    SCAN WITH ANY PHONE CAMERA
                  </span>
                </div>

              </div>

              {/* MODAL FOOTER BUTTONS */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <ShieldCheck style={{ width: '1rem', height: '1rem', color: '#34d399' }} />
                  <span>Issued by IIC VVITU • Venue Entry Approved</span>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="btn-pill-cyan"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.45rem', 
                      fontSize: '11.5px', 
                      padding: '0.65rem 1.6rem',
                      fontWeight: 700,
                      cursor: isDownloading ? 'wait' : 'pointer'
                    }}
                  >
                    <Download style={{ width: '0.9rem', height: '0.9rem' }} />
                    <span>{isDownloading ? 'Generating Pass...' : isDownloaded ? 'Pass Downloaded ✓' : 'Download Pass (.PNG)'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* 💥 HYPERSPACE SPACE BREACH & COCKPIT CRASH ANIMATION */}
      <SpaceBreachOverlay 
        isActive={isBreaching} 
        onComplete={handleBreachComplete} 
      />

    </section>
  );
}
