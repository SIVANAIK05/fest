import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
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
  ExternalLink,
  Plus,
  Trash2,
  Mail,
  Phone
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
    fullName: '',
    email: '',
    mobile: '',
    college: INSTITUTIONS_LIST[0],
    customCollege: '',
    pin: '',
    department: '',
    year: '1st Year',
    isSquad: false,
    teamName: '',
    teammates: [
      { name: '', email: '', mobile: '' }
    ],
    crewNames: '',
    selectedEvents: []
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
    const coAstronautsText = formData.isSquad
      ? (formData.teammates && formData.teammates.length > 0
        ? formData.teammates
          .filter(t => t.name && t.name.trim())
          .map(t => `${t.name.trim()}${t.mobile ? ` (${t.mobile.trim()})` : ''}`)
          .join(', ') || 'Squad Flight'
        : (formData.crewNames || 'Squad Flight'))
      : 'Solo Explorer';

    const passFormData = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      institution: formData.college === 'Other Institution / University' ? formData.customCollege : formData.college,
      studentId: formData.pin,
      department: formData.department,
      yearOfStudy: formData.year,
      teamName: formData.isSquad ? (formData.teamName || 'Squad Flight') : 'Solo Explorer',
      coAstronauts: coAstronautsText
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

  const handleTeammateChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.teammates];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teammates: updated };
    });
  };

  const handleAddTeammate = () => {
    playUiBeep(1250, 0.04);
    setFormData(prev => {
      if (prev.teammates.length >= 5) return prev;
      return {
        ...prev,
        teammates: [
          ...prev.teammates,
          { name: '', email: '', mobile: '' }
        ]
      };
    });
  };

  const handleRemoveTeammate = (index) => {
    playUiBeep(850, 0.04);
    setFormData(prev => {
      if (prev.teammates.length <= 1) return prev;
      return {
        ...prev,
        teammates: prev.teammates.filter((_, i) => i !== index)
      };
    });
  };

  const handleModeChange = (isSquadMode) => {
    playUiBeep(1200, 0.04);
    setFormData(prev => ({
      ...prev,
      isSquad: isSquadMode,
      teamName: isSquadMode && !prev.teamName ? 'Endurance Squadron' : prev.teamName,
      teammates: isSquadMode && (!prev.teammates || prev.teammates.length === 0)
        ? [
          { name: 'Murphy Cooper', email: 'murphy.cooper@vvit.net', mobile: '9876543211' },
          { name: 'Donald Brand', email: 'donald.brand@vvit.net', mobile: '9876543212' }
        ]
        : prev.teammates
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
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.selectedEvents.length === 0) {
    alert('Please select at least one event.');
    return;
  }

  try {
    const selectedMissions = MISSIONS_LIST.filter((m) =>
      formData.selectedEvents.includes(m.id)
    );

    for (const mission of selectedMissions) {
      const { error } = await supabase
        .from('registrations')
        .insert({
          event_name: mission.title,
          team_lead_roll_no: formData.pin,

          flight_mode: formData.isSquad
            ? 'Squadron / Team'
            : 'Solo Flight',

          team_lead_name: formData.fullName,
          team_lead_email: formData.email,
          team_lead_mobile: formData.mobile,

          college:
            formData.college === 'Other Institution / University'
              ? formData.customCollege
              : formData.college,

          department: formData.department,
          year_of_study: formData.year,

          team_member_email_2:
            formData.isSquad && formData.teammates[0]?.email
              ? formData.teammates[0].email
              : null,

          team_member_email_3:
            formData.isSquad && formData.teammates[1]?.email
              ? formData.teammates[1].email
              : null,

          team_member_email_4:
            formData.isSquad && formData.teammates[2]?.email
              ? formData.teammates[2].email
              : null,

          team_member_email_5:
            formData.isSquad && formData.teammates[3]?.email
              ? formData.teammates[3].email
              : null
        });

      if (error) {
        console.error('Supabase registration error:', error);
        alert('Registration failed: ' + error.message);
        return;
      }
    }

    // Generate flight pass after successful database insertion
    const randomId =
      'ASTR-26-' +
      Math.floor(1000 + Math.random() * 9000)
        .toString(16)
        .toUpperCase();

    setAstrionId(randomId);

    playSpaceBreachSound();
    setIsBreaching(true);

  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
};
  const handleBreachComplete = () => {
    setIsBreaching(false);
    setShowPassModal(true);
  };


  const handleDownload = async () => {
    playUiBeep(1400, 0.08);
    setIsDownloading(true);
    const selectedMissions = MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id));
    const coAstronautsText = formData.isSquad
      ? (formData.teammates && formData.teammates.length > 0
        ? formData.teammates
          .filter(t => t.name && t.name.trim())
          .map(t => `${t.name.trim()}${t.mobile ? ` (${t.mobile.trim()})` : ''}`)
          .join(', ') || 'Squad Flight'
        : (formData.crewNames || 'Squad Flight'))
      : 'Solo Explorer';

    const passFormData = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      institution: formData.college === 'Other Institution / University' ? (formData.customCollege || 'National University') : formData.college,
      studentId: formData.pin,
      department: formData.department,
      yearOfStudy: formData.year,
      teamName: formData.isSquad ? (formData.teamName || 'Squad Flight') : 'Solo Explorer',
      coAstronauts: coAstronautsText
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
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(8, 14, 30, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '1.75rem',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}
        >
          {/* SPACE TECH COMMAND COCKPIT BACKGROUND LAYER */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/images/spacetech_registration_bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              opacity: 0.22,
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          {/* SPACE TECH TELEMETRY HUD GRID */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '36px 36px',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          {/* SPACE TECH GRADIENT SHIELD (Ensures 100% high-contrast readability) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 15%, rgba(10, 18, 38, 0.85) 0%, rgba(2, 6, 23, 0.96) 75%)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

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
          {/* STEP 2: TEAM LEAD / ASTRONAUT CREDENTIALS                    */}
          {/* ============================================================ */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-space)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
              2. Team Lead / Lead Astronaut Details
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>

              {/* Full Name */}
              <div>
                <label className="form-field-label">Lead Astronaut / Team Lead Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="reference-input"
                  required
                />
              </div>

              {/* Lead Email */}
              <div>
                <label className="form-field-label">Lead Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="reference-input"
                  required
                />
              </div>

              {/* Lead Mobile */}
              <div>
                <label className="form-field-label">Lead Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
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
                  placeholder="Enter roll number / PIN (e.g. 22VV1A0501)"
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
                  placeholder="Enter department (e.g. CSE, AI, ECE)"
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
          {/* STEP 3: SQUAD CREDENTIALS & TEAMMATES (BELOW TEAM LEAD)      */}
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
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(251, 191, 36, 0.2)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users style={{ width: '1.1rem', height: '1.1rem', color: 'var(--amber-primary)' }} />
                  <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>
                    SQUADRON MANIFEST & TEAMMATES REGISTRATION
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--amber-primary)', background: 'rgba(251, 191, 36, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                  {formData.teammates.length} Teammates Registered
                </span>
              </div>

              <div>
                <label className="form-field-label" style={{ color: 'var(--amber-primary)' }}>Squadron / Team Name *</label>
                <input
                  type="text"
                  name="teamName"
                  placeholder="Enter team name (e.g. Nova Squadron)"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="reference-input"
                  required={formData.isSquad}
                />
              </div>

              {/* Dynamic Teammates Registration Cards */}
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '12px', fontWeight: 600, color: '#f1f5f9', letterSpacing: '0.04em' }}>
                    Teammates in Squad (Name, Email, Mobile No)
                  </div>
                  <p style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--text-slate)', margin: '0.2rem 0 0 0' }}>
                    As Team Lead, register your teammates below. Each member will receive access credentials with your team flight pass.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {formData.teammates.map((teammate, idx) => (
                    <div
                      key={idx}
                      className="animate-fadeIn"
                      style={{
                        background: 'rgba(2, 6, 23, 0.65)',
                        border: '1px solid rgba(251, 191, 36, 0.25)',
                        borderRadius: '0.85rem',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-orbitron)', fontSize: '12px', fontWeight: 700, color: 'var(--amber-primary)' }}>
                          <User style={{ width: '0.85rem', height: '0.85rem' }} />
                          <span>Teammate #{idx + 1}</span>
                        </div>
                        {formData.teammates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTeammate(idx)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              color: '#f87171',
                              borderRadius: '6px',
                              padding: '0.2rem 0.55rem',
                              fontSize: '10.5px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontFamily: 'var(--font-space)',
                              transition: 'all 0.15s ease'
                            }}
                            title="Remove this teammate"
                          >
                            <Trash2 style={{ width: '0.75rem', height: '0.75rem' }} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        {/* Teammate Name */}
                        <div>
                          <label className="form-field-label" style={{ fontSize: '10.5px' }}>Name *</label>
                          <input
                            type="text"
                            placeholder="Enter teammate name"
                            value={teammate.name}
                            onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                            className="reference-input"
                            required={formData.isSquad}
                          />
                        </div>

                        {/* Teammate Email */}
                        <div>
                          <label className="form-field-label" style={{ fontSize: '10.5px' }}>Email *</label>
                          <input
                            type="email"
                            placeholder="Enter teammate email"
                            value={teammate.email}
                            onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                            className="reference-input"
                            required={formData.isSquad}
                          />
                        </div>

                        {/* Teammate Mobile */}
                        <div>
                          <label className="form-field-label" style={{ fontSize: '10.5px' }}>Mobile No *</label>
                          <input
                            type="tel"
                            placeholder="Enter teammate mobile number"
                            value={teammate.mobile}
                            onChange={(e) => handleTeammateChange(idx, 'mobile', e.target.value)}
                            className="reference-input"
                            required={formData.isSquad}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Teammate Button */}
                  {formData.teammates.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddTeammate}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'rgba(251, 191, 36, 0.12)',
                        border: '1px dashed rgba(251, 191, 36, 0.5)',
                        color: 'var(--amber-primary)',
                        borderRadius: '0.65rem',
                        padding: '0.55rem 1rem',
                        fontSize: '11.5px',
                        fontFamily: 'var(--font-space)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s ease',
                        marginTop: '0.25rem'
                      }}
                    >
                      <Plus style={{ width: '0.85rem', height: '0.85rem' }} />
                      <span>+ Add Another Teammate ({formData.teammates.length}/5)</span>
                    </button>
                  )}
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

            {/* TECHNICAL MISSIONS */}
            <div>
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
                        <span style={{ fontSize: '9px', color: 'var(--cyan-primary)', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
                          {m.day || 'Day 1'} • Team: {m.teamSize}
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
              <span> ISSUE FLIGHT PASS</span>
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
            padding: 'clamp(0.75rem, 2vw, 1.5rem)',
            overflowY: 'auto',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={() => setShowPassModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '1000px',
              maxHeight: '94vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              fontFamily: 'var(--font-space)'
            }}
          >
            {/* MODAL TOP HUD BAR */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
                  GATEWAY CLEARANCE AUTHORIZED // FLIGHT PASS READY
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  playUiBeep(900, 0.03);
                  setShowPassModal(false);
                }}
                style={{
                  color: 'var(--text-slate)',
                  cursor: 'pointer',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '9999px',
                  padding: '0.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="Close Pass"
              >
                <X style={{ width: '1.2rem', height: '1.2rem' }} />
              </button>
            </div>

            {/* ============================================================ */}
            {/* 🎫 AUTHENTIC FLIGHT PASS TICKET (EXACT MATCH OF DOWNLOADED PASS) */}
            {/* ============================================================ */}
            <div className="flight-pass-ticket-card">

              {/* LEFT: MAIN PASS BODY */}
              <div className="flight-pass-main-body">
                <div>
                  {/* Top-Left Official Logos Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      background: '#ffffff',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                      marginBottom: '1rem'
                    }}
                  >
                    <img src="/images/iic_logo.png" alt="IIC" style={{ height: '1.45rem', width: 'auto' }} />
                    <span style={{ color: '#cbd5e1', fontSize: '13px' }}>|</span>
                    <img src="/images/vvit_logo.png" alt="VVIT" style={{ height: '1.45rem', width: 'auto' }} />
                  </div>

                  {/* Header Titles: ASTRION & Subtitle */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-orbitron)',
                        fontSize: 'clamp(1.85rem, 3.4vw, 2.45rem)',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        color: '#ffffff',
                        lineHeight: 1.1,
                        margin: 0
                      }}
                    >
                      ASTRION
                    </h3>
                    <div
                      style={{
                        fontFamily: 'var(--font-space)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#38bdf8',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginTop: '0.35rem'
                      }}
                    >
                      INNOVATE BEYOND BOUNDARIES // OFFICIAL FLIGHT PASS
                    </div>
                  </div>

                  {/* Separator Line */}
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.12)', margin: '1rem 0 1.15rem' }} />

                  {/* Telemetry Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem 1.75rem', marginBottom: '1rem' }}>
                    {/* Section 1: Lead Astronaut */}
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        LEAD ASTRONAUT / PARTICIPANT
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                        {formData.fullName || 'Commander Cooper'}
                        {formData.pin && (
                          <span style={{ color: 'var(--amber-primary)', marginLeft: '0.4rem', fontSize: '0.95rem' }}>
                            • {formData.pin}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Section 2: Institution */}
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        INSTITUTION / UNIVERSITY
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>
                        {institutionDisplayName}
                      </div>
                    </div>

                    {/* Section 3: Department & Year */}
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        DEPARTMENT & YEAR
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.2rem' }}>
                        {formData.department || 'General'} • {formData.year || '3rd Year'}
                      </div>
                    </div>

                    {/* Section 4: Squad / Crew */}
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        SQUAD / CREW CALL-SIGN
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginTop: '0.2rem' }}>
                        Squad: {formData.isSquad ? (formData.teamName || 'Endurance Squadron') : 'Solo Flight'}
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Co-Astronauts */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      CREW MEMBERS / TEAMMATES
                    </div>
                    {formData.isSquad && formData.teammates && formData.teammates.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem' }}>
                        {formData.teammates.map((t, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: '#ffffff', fontWeight: 600 }}>• {t.name || `Teammate ${idx + 1}`}</span>
                            {t.email && <span style={{ color: '#94a3b8', fontSize: '11px' }}>({t.email})</span>}
                            {t.mobile && <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontFamily: 'var(--font-space)' }}>📱 {t.mobile}</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                        Solo Explorer (None specified)
                      </div>
                    )}
                  </div>

                  {/* Section 6: Authorized Missions */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      AUTHORIZED MISSIONS (PRE-REGISTRATION CLEARANCE)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.35rem' }}>
                      {selectedMissionsList.length === 0 ? (
                        <span style={{ fontStyle: 'italic', fontSize: '11px', color: '#94a3b8' }}>
                          General Entry Pass (Spot events available at venue)
                        </span>
                      ) : (
                        <>
                          {selectedMissionsList.slice(0, 3).map((m) => (
                            <span
                              key={m.id}
                              style={{
                                background: '#0f172a',
                                border: '1px solid rgba(56, 189, 248, 0.4)',
                                color: '#38bdf8',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '6px',
                                letterSpacing: '0.04em',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              {m.title} [PRE-REG]
                            </span>
                          ))}
                          {selectedMissionsList.length > 3 && (
                            <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>
                              +{selectedMissionsList.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Verification Guarantee */}
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span>✓ VERIFIED FOR VENUE ENTRY • DATES: 23 - 24 OCT 2026 • VENUE: VVIT CAMPUS</span>
                </div>
              </div>

              {/* CENTER: PERFORATION DIVIDER WITH NOTCH CUTOUTS */}
              <div className="flight-pass-perforation">
                <div className="flight-pass-notch-top" />
                <div className="flight-pass-notch-bottom" />
              </div>

              {/* RIGHT: TEAR-OFF BOARDING STUB */}
              <div className="flight-pass-stub-body">
                {/* Stub Header */}
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    BOARDING PASS ID
                  </div>
                  <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.45rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.06em', margin: '0.2rem 0' }}>
                    {astrionId}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8', letterSpacing: '0.05em' }}>
                    SCAN AT VENUE GATEWAY
                  </div>
                </div>

                {/* Scannable High-Contrast QR Code Card */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '0.55rem',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(56, 189, 248, 0.5)',
                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)',
                    width: '160px',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}
                >
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Astrion QR Pass" style={{ width: '100%', height: '100%', display: 'block' }} />
                  ) : (
                    <div style={{ color: '#030712', fontSize: '10.5px', textAlign: 'center', fontWeight: 600 }}>Generating QR...</div>
                  )}
                </div>

                {/* Gateway Clearance Pill */}
                <div
                  style={{
                    background: 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid #34d399',
                    borderRadius: '8px',
                    padding: '0.35rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    width: '100%',
                    maxWidth: '220px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                  <span style={{ color: '#34d399', fontWeight: 800, fontSize: '10px', letterSpacing: '0.08em', fontFamily: 'var(--font-space)' }}>
                    STATUS: AUTHORIZED // IIC VVITU
                  </span>
                </div>

                {/* Barcode Graphic Decoration */}
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', height: '30px', margin: '0.35rem 0' }}>
                    {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4].map((w, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: `${w}px`,
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.38)',
                          borderRadius: '1px'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                    ISSUED BY IIC VVITU
                  </div>
                </div>

              </div>

            </div>

            {/* MODAL ACTION FOOTER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '0.4rem 0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '11px', color: 'var(--text-muted)' }}>
                <ShieldCheck style={{ width: '1rem', height: '1rem', color: '#34d399' }} />
                <span>Instant camera scan verified • Official IIC VVITU clearance pass</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: 'var(--text-slate)',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="btn-pill-cyan"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '11.5px',
                    padding: '0.65rem 1.75rem',
                    fontWeight: 800,
                    cursor: isDownloading ? 'wait' : 'pointer'
                  }}
                >
                  <Download style={{ width: '0.95rem', height: '0.95rem' }} />
                  <span>{isDownloading ? 'Generating Pass...' : isDownloaded ? 'Pass Downloaded ✓' : 'Download Pass (.PNG)'}</span>
                </button>
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
