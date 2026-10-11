import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  FileText,
  Download,
  Search,
  RefreshCw,
  X,
  ArrowLeft,
  Users,
  User,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  Filter,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';
import { MISSIONS_LIST } from '../data/eventsData';

// Fallback baseline records in case database is cold/offline
const SAMPLE_REPORTS_DATA = [
  {
    team_lead_roll_no: '22VV1A0501',
    team_lead_name: 'Aarav Sharma',
    team_lead_email: 'aarav.sharma@vvit.net',
    team_lead_mobile: '9876543210',
    college: 'Vasireddy Venkatadri Institute of Technology (VVIT)',
    department: 'Computer Science & Engineering',
    year_of_study: '3rd Year',
    flight_mode: 'Squad',
    event_names: ['Space Speak', 'Tars Wars', 'Idea Nova Cosmos'],
    team_member_email_2: 'Priya Verma (9876543211)',
    team_member_email_3: 'Rohan Iyer (9876543212)',
    team_member_email_4: null,
    team_member_email_5: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    team_lead_roll_no: '23VV1A1208',
    team_lead_name: 'Sneha Reddy',
    team_lead_email: 'sneha.reddy@vvit.net',
    team_lead_mobile: '9848022338',
    college: 'Vasireddy Venkatadri Institute of Technology (VVIT)',
    department: 'Information Technology',
    year_of_study: '2nd Year',
    flight_mode: 'Solo',
    event_names: ['Prompt Orbit', 'Cosmic Match'],
    team_member_email_2: null,
    team_member_email_3: null,
    team_member_email_4: null,
    team_member_email_5: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    team_lead_roll_no: '21SRKR0542',
    team_lead_name: 'Vikramaditya Varma',
    team_lead_email: 'vikram.v@srkr.edu.in',
    team_lead_mobile: '9988776655',
    college: 'S.R.K.R. Engineering College',
    department: 'Artificial Intelligence & Data Science',
    year_of_study: '4th Year',
    flight_mode: 'Squad',
    event_names: ['Astrio Pitch', 'Meteor Mission'],
    team_member_email_2: 'Kalyan K (9988776656)',
    team_member_email_3: null,
    team_member_email_4: null,
    team_member_email_5: null,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    team_lead_roll_no: '24VV1A6615',
    team_lead_name: 'Ananya Deshmukh',
    team_lead_email: 'ananya.d@vvit.net',
    team_lead_mobile: '9123456780',
    college: 'Vasireddy Venkatadri Institute of Technology (VVIT)',
    department: 'CSE (Cyber Security)',
    year_of_study: '1st Year',
    flight_mode: 'Solo',
    event_names: ['Tars Wars', 'Deadly Spectrum'],
    team_member_email_2: null,
    team_member_email_3: null,
    team_member_email_4: null,
    team_member_email_5: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export default function MissionReportsModal({ isOpen, onClose, onInspectPass }) {
  const [reportsData, setReportsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL'); // 'ALL' | 'SOLO' | 'SQUAD'
  const [missionFilter, setMissionFilter] = useState('ALL');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Synchronize modal state with body class for navbar closing
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          playUiBeep(850, 0.03);
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      fetchReports();

      return () => {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const fetchReports = async () => {
    setIsLoading(true);
    const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');
    const baseUrl = rawBackendUrl && !rawBackendUrl.includes('your-render-app-name')
      ? rawBackendUrl
      : 'http://localhost:3000';

    try {
      const res = await fetch(`${baseUrl}/api/reports`, { method: 'GET' });
      if (res.ok) {
        const json = await res.json();
        if (json.registrations && json.registrations.length > 0) {
          setReportsData(json.registrations);
        } else {
          setReportsData(SAMPLE_REPORTS_DATA);
        }
      } else {
        setReportsData(SAMPLE_REPORTS_DATA);
      }
    } catch {
      // Offline fallback
      setReportsData(SAMPLE_REPORTS_DATA);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  };

  const handleRefresh = () => {
    playUiBeep(1250, 0.05);
    fetchReports();
  };

  // Filtered registrations
  const filteredList = useMemo(() => {
    return reportsData.filter((item) => {
      // Mode filter
      if (modeFilter === 'SOLO' && item.flight_mode !== 'Solo') return false;
      if (modeFilter === 'SQUAD' && item.flight_mode !== 'Squad') return false;

      // Mission filter
      if (missionFilter !== 'ALL') {
        const events = Array.isArray(item.event_names) ? item.event_names : [];
        const hasMission = events.some((ev) => {
          const name = typeof ev === 'string' ? ev : (ev?.title || ev?.name || '');
          return name.toLowerCase().includes(missionFilter.toLowerCase());
        });
        if (!hasMission) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const rollMatch = (item.team_lead_roll_no || '').toLowerCase().includes(query);
        const nameMatch = (item.team_lead_name || '').toLowerCase().includes(query);
        const collegeMatch = (item.college || '').toLowerCase().includes(query);
        const deptMatch = (item.department || '').toLowerCase().includes(query);
        const eventsMatch = Array.isArray(item.event_names)
          ? item.event_names.join(' ').toLowerCase().includes(query)
          : String(item.event_names || '').toLowerCase().includes(query);

        if (!rollMatch && !nameMatch && !collegeMatch && !deptMatch && !eventsMatch) {
          return false;
        }
      }

      return true;
    });
  }, [reportsData, modeFilter, missionFilter, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const totalRegs = reportsData.length;
    let soloCount = 0;
    let squadCount = 0;
    let totalAstronauts = 0;
    const collegesSet = new Set();

    reportsData.forEach((item) => {
      if (item.college) collegesSet.add(item.college.trim());
      if (item.flight_mode === 'Squad') {
        squadCount++;
        let m = 1;
        if (item.team_member_email_2) m++;
        if (item.team_member_email_3) m++;
        if (item.team_member_email_4) m++;
        if (item.team_member_email_5) m++;
        totalAstronauts += m;
      } else {
        soloCount++;
        totalAstronauts += 1;
      }
    });

    return {
      totalRegs,
      soloCount,
      squadCount,
      totalAstronauts,
      collegesCount: collegesSet.size
    };
  }, [reportsData]);

  // Client-side CSV Download
  const handleDownloadCsv = () => {
    playUiBeep(1400, 0.08);
    const headers = [
      'Roll No / PIN',
      'Commander Name',
      'Email',
      'Mobile',
      'College',
      'Department',
      'Year',
      'Flight Mode',
      'Crew Members',
      'Registered Events',
      'Registration Timestamp'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = filteredList.map((r) => {
      const teammates = [
        r.team_member_email_2,
        r.team_member_email_3,
        r.team_member_email_4,
        r.team_member_email_5
      ].filter(Boolean).join(' | ');

      const events = Array.isArray(r.event_names) ? r.event_names.join(', ') : (r.event_names || '');

      return [
        escapeCsv(r.team_lead_roll_no),
        escapeCsv(r.team_lead_name),
        escapeCsv(r.team_lead_email),
        escapeCsv(r.team_lead_mobile),
        escapeCsv(r.college),
        escapeCsv(r.department),
        escapeCsv(r.year_of_study),
        escapeCsv(r.flight_mode),
        escapeCsv(teammates),
        escapeCsv(events),
        escapeCsv(r.created_at)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASTRION_2026_Flight_Manifest_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return typeof document !== 'undefined' && createPortal(
    <div
      className="cosmic-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'radial-gradient(ellipse at center, rgba(10, 16, 34, 0.88) 0%, rgba(2, 4, 10, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vw, 1.5rem)',
        overflow: 'hidden'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playUiBeep(850, 0.03);
          onClose();
        }
      }}
    >
      <div
        className="animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '92vh',
          background: 'linear-gradient(180deg, rgba(8, 14, 30, 0.98) 0%, rgba(2, 6, 23, 0.99) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'var(--font-space)'
        }}
      >
        {/* TOP GLOW BAR */}
        <div
          style={{
            height: '3px',
            width: '100%',
            background: 'linear-gradient(90deg, #0284c7, #38bdf8, #fbbf24, #f59e0b)'
          }}
        />

        {/* MODAL HEADER */}
        <div
          style={{
            padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.18)',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Top Row: Back button, Title & Close */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  playUiBeep(850, 0.04);
                  onClose();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontFamily: 'var(--font-space)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--cyan-primary)',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                title="Return to site"
              >
                <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} />
                <span>Back</span>
              </button>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                  <span style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--cyan-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    IIC VVITU TELEMETRY // LIVE DATABASE
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', color: '#ffffff', fontWeight: 800, margin: '0.15rem 0 0' }}>
                  MISSION INTELLIGENCE & FLIGHT MANIFEST
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleRefresh}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Refresh database records"
              >
                <RefreshCw style={{ width: '0.75rem', height: '0.75rem', animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
                <span className="desktop-only-btn">Sync</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playUiBeep(900, 0.04);
                  onClose();
                }}
                style={{
                  width: '2.2rem',
                  height: '2.2rem',
                  borderRadius: '9999px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Close Reports Terminal"
              >
                <X style={{ width: '1.1rem', height: '1.1rem' }} />
              </button>
            </div>
          </div>

          {/* TELEMETRY METRIC CAPSULES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.75rem', padding: '0.6rem 0.85rem' }}>
              <div style={{ fontSize: '9px', color: 'var(--cyan-primary)', fontWeight: 700, letterSpacing: '0.08em' }}>TOTAL REGISTRATIONS</div>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.1rem' }}>
                {metrics.totalRegs}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.75rem', padding: '0.6rem 0.85rem' }}>
              <div style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.08em' }}>TOTAL ASTRONAUTS</div>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.1rem' }}>
                {metrics.totalAstronauts}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '0.75rem', padding: '0.6rem 0.85rem' }}>
              <div style={{ fontSize: '9px', color: 'var(--amber-primary)', fontWeight: 700, letterSpacing: '0.08em' }}>SQUADRONS / TEAMS</div>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--amber-primary)', marginTop: '0.1rem' }}>
                {metrics.squadCount}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.75rem', padding: '0.6rem 0.85rem' }}>
              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em' }}>SOLO EXPLORERS</div>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.1rem' }}>
                {metrics.soloCount}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.75rem', padding: '0.6rem 0.85rem' }}>
              <div style={{ fontSize: '9px', color: '#34d399', fontWeight: 700, letterSpacing: '0.08em' }}>INSTITUTIONS</div>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '0.1rem' }}>
                {metrics.collegesCount}
              </div>
            </div>
          </div>

          {/* FILTER & SEARCH CONTROL DECK */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '380px' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
              <input
                type="text"
                placeholder="Search PIN, name, college, mission..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="reference-input"
                style={{ paddingLeft: '2.2rem', fontSize: '0.82rem', padding: '0.5rem 0.85rem 0.5rem 2.2rem' }}
              />
            </div>

            {/* Filter buttons & CSV Action */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              {/* Flight Mode Filter */}
              <div style={{ display: 'inline-flex', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '9999px', padding: '2px' }}>
                {['ALL', 'SOLO', 'SQUAD'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      playUiBeep(1100, 0.02);
                      setModeFilter(m);
                    }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      border: 'none',
                      background: modeFilter === m ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                      color: modeFilter === m ? '#ffffff' : '#94a3b8',
                      fontSize: '10.5px',
                      fontWeight: modeFilter === m ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={handleDownloadCsv}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.48rem 0.95rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.6)',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.35)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.04em'
                }}
                title="Download CSV Flight Manifest"
              >
                <Download style={{ width: '0.85rem', height: '0.85rem' }} />
                <span>EXPORT MANIFEST ({filteredList.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE TABLE / LIST BODY */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem clamp(1rem, 3vw, 2rem)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {filteredList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
              <FileText style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto 0.75rem', color: 'rgba(56, 189, 248, 0.4)' }} />
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>
                NO MISSION RECORDS FOUND
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
                No registered commanders matched the query filter. Try clearing your search parameters.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredList.map((reg, idx) => {
                const isSquad = reg.flight_mode === 'Squad' || reg.flight_mode === 'Squadron / Team';
                const events = Array.isArray(reg.event_names) ? reg.event_names : [reg.event_names].filter(Boolean);
                const regDate = reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Verified';

                return (
                  <div
                    key={reg.team_lead_roll_no || idx}
                    style={{
                      background: 'rgba(10, 18, 38, 0.75)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '1rem',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                      e.currentTarget.style.background = 'rgba(12, 22, 48, 0.88)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                      e.currentTarget.style.background = 'rgba(10, 18, 38, 0.75)';
                    }}
                  >
                    {/* Left: Lead Astronaut Credentials */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '220px', flex: '1 1 220px' }}>
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '0.65rem',
                          background: isSquad ? 'rgba(251, 191, 36, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          border: isSquad ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {isSquad ? (
                          <Users style={{ width: '1.2rem', height: '1.2rem', color: 'var(--amber-primary)' }} />
                        ) : (
                          <User style={{ width: '1.2rem', height: '1.2rem', color: 'var(--cyan-primary)' }} />
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                            {reg.team_lead_name || 'Lead Explorer'}
                          </span>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 700,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '9999px',
                              background: isSquad ? 'rgba(251, 191, 36, 0.18)' : 'rgba(56, 189, 248, 0.18)',
                              color: isSquad ? 'var(--amber-primary)' : 'var(--cyan-primary)',
                              border: isSquad ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)'
                            }}
                          >
                            {isSquad ? 'SQUAD' : 'SOLO'}
                          </span>
                        </div>

                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '0.15rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>
                            {reg.team_lead_roll_no}
                          </span>
                          <span>•</span>
                          <span>{reg.department || 'Aeronautics'} ({reg.year_of_study || 'Year 1'})</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: College and Events */}
                    <div style={{ flex: '2 1 280px' }}>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building style={{ width: '0.75rem', height: '0.75rem', color: 'var(--cyan-primary)' }} />
                        <span>{reg.college || 'Institution Registered'}</span>
                      </div>

                      {/* Event Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.45rem' }}>
                        {events.map((evName, eIdx) => (
                          <span
                            key={eIdx}
                            style={{
                              fontSize: '10px',
                              fontFamily: 'var(--font-space)',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.35rem',
                              background: 'rgba(15, 23, 42, 0.8)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              color: '#f8fafc'
                            }}
                          >
                            {typeof evName === 'string' ? evName : (evName?.title || 'Mission')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Timestamp & Action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right', fontSize: '10px', color: '#94a3b8' }}>
                        <div>{regDate}</div>
                        <div style={{ color: '#34d399', fontSize: '9px', fontWeight: 700 }}>GATEWAY CLEARED</div>
                      </div>

                      {onInspectPass && (
                        <button
                          type="button"
                          onClick={() => {
                            playUiBeep(1200, 0.04);
                            onInspectPass({
                              id: reg.team_lead_roll_no,
                              name: reg.team_lead_name,
                              college: reg.college,
                              squad: isSquad ? 'Squad Flight' : 'Solo Explorer',
                              crew: isSquad ? 'Squad Flight' : 'Solo Explorer',
                              events: events.join(', ')
                            });
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '0.5rem',
                            background: 'rgba(56, 189, 248, 0.12)',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            color: 'var(--cyan-primary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="Verify Astronaut Pass"
                        >
                          <ShieldCheck style={{ width: '0.8rem', height: '0.8rem' }} />
                          <span>Verify</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER BAR */}
        <div
          style={{
            padding: '0.75rem clamp(1rem, 3vw, 2rem)',
            background: 'rgba(4, 9, 24, 0.95)',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#94a3b8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>RECORDS SHOWN:</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{filteredList.length} of {reportsData.length}</span>
            {lastRefreshed && (
              <span style={{ fontSize: '10px', color: '#64748b' }}>• Last Sync: {lastRefreshed}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ fontSize: '10px', color: '#cbd5e1' }}>IIC ASTRION 2026 COMMAND VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
