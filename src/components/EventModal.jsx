import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CalendarDays,
  X,
  Trophy,
  CheckCircle2,
  Sparkles,
  Target,
  Zap,
  Compass,
  Award,
  Laptop,
  Cpu
} from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export default function EventModal({ event, onClose, onRegisterEvent }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'steps' | 'rules'

  useEffect(() => {
    if (event) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [event, onClose]);

  if (!event) return null;

  return typeof document !== 'undefined' && createPortal(
    <div
      className="cosmic-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(ellipse at center, rgba(10, 16, 34, 0.78) 0%, rgba(2, 4, 10, 0.90) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          background: 'linear-gradient(180deg, rgba(8, 14, 30, 0.98) 0%, rgba(2, 6, 23, 0.99) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 75px rgba(0, 0, 0, 0.95), 0 0 40px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        className="animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP GLOW BAR */}
        <div
          style={{
            height: '3px',
            width: '100%',
            background: event.category === 'technical'
              ? 'linear-gradient(90deg, #0284c7, #38bdf8, #818cf8)'
              : 'linear-gradient(90deg, #d97706, #fbbf24, #f59e0b)'
          }}
        />

        {/* MODAL HEADER WITH HERO BANNER */}
        <div
          style={{
            position: 'relative',
            padding: '1.75rem 2rem 1.25rem',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, transparent 100%)'
          }}
        >
          {/* Top navigation row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button
              onClick={() => {
                playUiBeep(800, 0.04);
                onClose();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: 'var(--font-space)',
                fontSize: '0.8rem',
                color: 'var(--cyan-primary)',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
            >
              <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Back to Missions</span>
            </button>

            {/* Close X Button */}
            <button
              onClick={onClose}
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyan-primary)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                e.currentTarget.style.color = '#94a3b8';
              }}
              aria-label="Close Modal"
            >
              <X style={{ width: '1.1rem', height: '1.1rem' }} />
            </button>
          </div>

          {/* Title & Badges */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className="badge-tech-pill">
                  {event.category === 'technical' ? 'TECHNICAL MISSION' : 'COSMIC NON-TECH EVENT'}
                </span>
                <span className={event.regType === 'pre-registration' ? 'badge-prereg-pill' : 'badge-spot-pill'}>
                  {event.regType === 'pre-registration' ? 'PRE-REGISTRATION' : 'SPOT WALK-IN'}
                </span>
                {event.subtitle && (
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {event.subtitle}
                  </span>
                )}
              </div>

              <h2 className="ast-heading" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)', color: '#ffffff', margin: 0 }}>
                {event.title}
              </h2>
              <p className="ast-subheading" style={{ marginTop: '0.35rem', fontSize: '0.92rem', color: 'var(--cyan-primary)' }}>
                {event.tagline}
              </p>
            </div>

            {/* Prize / Reward Badge */}
            {event.prizePool && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  borderRadius: '1rem',
                  padding: '0.65rem 1.15rem',
                  textAlign: 'right',
                  boxShadow: '0 0 20px rgba(251, 191, 36, 0.1)'
                }}
              >
                {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end', color: '#fbbf24', fontSize: '11px', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
                  <Trophy style={{ width: '0.9rem', height: '0.9rem' }} />
                  <span>PRIZE POOL</span>
                </div> */}
                <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.25rem', fontWeight: 800, color: '#fef08a', marginTop: '0.15rem' }}>
                  {event.prizePool}
                </div>
              </div>
            )}
          </div>

          {/* Quick Telemetry Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              background: 'rgba(3, 7, 18, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.12)',
              borderRadius: '0.85rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                <Calendar style={{ width: '0.8rem', height: '0.8rem', color: 'var(--cyan-primary)' }} />
                <span>Schedule</span>
              </div>
              <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginTop: '0.15rem' }}>
                {event.dayNumber === 2 || event.day?.includes('24') ? 'Day 2 - 24 Oct 2026' : 'Day 1 - 23 Oct 2026'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                <Clock style={{ width: '0.8rem', height: '0.8rem', color: 'var(--cyan-primary)' }} />
                <span>Timings</span>
              </div>
              <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginTop: '0.15rem', lineHeight: 1.3 }}>
                {event.timings || event.time || '10:00 AM'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                <Users style={{ width: '0.8rem', height: '0.8rem', color: 'var(--cyan-primary)' }} />
                <span>Team Size</span>
              </div>
              <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginTop: '0.15rem' }}>
                {event.teamSize || '1 (Solo)'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                <Laptop style={{ width: '0.8rem', height: '0.8rem', color: event.laptops === 'Needed' ? '#38bdf8' : '#94a3b8' }} />
                <span>Laptops</span>
              </div>
              <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.82rem', fontWeight: 600, color: event.laptops === 'Needed' ? '#38bdf8' : '#94a3b8', marginTop: '0.15rem' }}>
                {event.laptops || 'Not Required'}
              </div>
            </div>

            {event.prototype && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                  <Zap style={{ width: '0.8rem', height: '0.8rem', color: event.prototype === 'Compulsory' ? '#fbbf24' : '#34d399' }} />
                  <span>Prototype</span>
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.82rem', fontWeight: 600, color: event.prototype === 'Compulsory' ? '#fbbf24' : '#34d399', marginTop: '0.15rem' }}>
                  {event.prototype}
                </div>
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                <MapPin style={{ width: '0.8rem', height: '0.8rem', color: 'var(--cyan-primary)' }} />
                <span>Venue</span>
              </div>
              <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginTop: '0.15rem' }}>
                {event.venue || 'Main Campus'}
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS (Intuitive & User Friendly) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 2rem',
            background: 'rgba(2, 6, 23, 0.6)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => {
              playUiBeep(1000, 0.03);
              setActiveTab('overview');
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-space)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'overview' ? 'var(--cyan-primary)' : 'transparent',
              color: activeTab === 'overview' ? '#020617' : '#94a3b8',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Compass style={{ width: '0.85rem', height: '0.85rem' }} />
            <span>Mission Concept</span>
          </button>

          <button
            onClick={() => {
              playUiBeep(1000, 0.03);
              setActiveTab('steps');
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-space)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'steps' ? 'var(--cyan-primary)' : 'transparent',
              color: activeTab === 'steps' ? '#020617' : '#94a3b8',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Zap style={{ width: '0.85rem', height: '0.85rem' }} />
            <span>{event.category === 'technical' ? 'How It Works' : 'How To Play'}</span>
          </button>

          <button
            onClick={() => {
              playUiBeep(1000, 0.03);
              setActiveTab('rules');
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-space)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'rules' ? 'var(--cyan-primary)' : 'transparent',
              color: activeTab === 'rules' ? '#020617' : '#94a3b8',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Target style={{ width: '0.85rem', height: '0.85rem' }} />
            <span>{event.judgingCriteria ? 'Judging Criteria' : 'Rules & Scoring'}</span>
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE CONTENT - HARDWARE ACCELERATED) */}
        <div
          style={{
            padding: '1.75rem 2rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            willChange: 'scroll-position',
            transform: 'translateZ(0)'
          }}
        >
          {/* TAB 1: OVERVIEW & CONCEPT */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Concept Box */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.55)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <Sparkles style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)' }} />
                  <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.92rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                    MISSION CONCEPT
                  </h4>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                  {event.concept || event.description}
                </p>
              </div>

              {/* Objective (if provided) */}
              {event.objective && (
                <div
                  style={{
                    background: 'rgba(251, 191, 36, 0.05)',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    borderRadius: '1rem',
                    padding: '1.15rem 1.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <Target style={{ width: '0.95rem', height: '0.95rem', color: '#fbbf24' }} />
                    <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', color: '#fbbf24', margin: 0, fontWeight: 700 }}>
                      MISSION OBJECTIVE
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                    {event.objective}
                  </p>
                </div>
              )}

              {/* Skills Tested */}
              {event.skillsTested && event.skillsTested.length > 0 && (
                <div>
                  <h4 style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 600 }}>
                    Skills Tested
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {event.skillsTested.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(56, 189, 248, 0.08)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          color: '#e2e8f0',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-space)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: 'var(--cyan-primary)' }} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Winner Criteria Callout */}
              {event.winnerCriteria && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    background: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '0.85rem',
                    padding: '0.85rem 1.25rem'
                  }}
                >
                  <Award style={{ width: '1.25rem', height: '1.25rem', color: '#34d399', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.8rem', color: '#34d399', fontWeight: 700, marginRight: '0.5rem' }}>
                      VICTORY CRITERIA:
                    </span>
                    <span style={{ fontSize: '0.86rem', color: '#f1f5f9' }}>
                      {event.winnerCriteria}
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: HOW IT WORKS / HOW TO PLAY */}
          {activeTab === 'steps' && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ marginBottom: '0.25rem' }}>
                <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                  {event.category === 'technical' ? 'Execution Protocol & Rounds' : 'Game Rules & Steps'}
                </h4>
                <p style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', color: 'var(--text-slate)', marginTop: '0.25rem' }}>
                  Follow these instructions to navigate through the event.
                </p>
              </div>

              {event.howItWorks && event.howItWorks.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    background: 'rgba(15, 23, 42, 0.55)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    borderRadius: '0.85rem',
                    padding: '1rem 1.25rem',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '1.85rem',
                      height: '1.85rem',
                      borderRadius: '9999px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid var(--cyan-primary)',
                      color: 'var(--cyan-primary)',
                      fontFamily: 'var(--font-orbitron)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.1rem'
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RULES, SCORING & JUDGING CRITERIA */}
          {activeTab === 'rules' && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Judging Criteria (for Technical Events like Space Speak, Astro Pitch, Tars Wars, etc.) */}
              {event.judgingCriteria && (
                <div>
                  <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.85rem', fontWeight: 700 }}>
                    Official Judging Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {event.judgingCriteria.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(15, 23, 42, 0.55)',
                          border: '1px solid rgba(56, 189, 248, 0.15)',
                          borderRadius: '0.75rem',
                          padding: '0.85rem 1.15rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 500 }}>
                            {item.label}
                          </span>
                          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.88rem', color: 'var(--cyan-primary)', fontWeight: 700 }}>
                            {item.percent}
                          </span>
                        </div>
                        {/* Progress meter bar */}
                        <div style={{ width: '100%', height: '6px', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: item.percent,
                              height: '100%',
                              background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                              borderRadius: '9999px'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scoring Tiers (for Meteor Mission) */}
              {event.scoring && (
                <div>
                  <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.85rem', fontWeight: 700 }}>
                    Target Scoring System
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {event.scoring.map((score, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: idx === 0
                            ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)'
                            : 'rgba(15, 23, 42, 0.55)',
                          border: idx === 0 ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(56, 189, 248, 0.15)',
                          borderRadius: '0.75rem',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                          {score.tier}
                        </span>
                        <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.9rem', color: idx === 0 ? '#fbbf24' : 'var(--cyan-primary)', fontWeight: 700 }}>
                          {score.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules List */}
              {event.rules && (
                <div>
                  <h4 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.85rem', fontWeight: 700 }}>
                    Event Rules & Guidelines
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {event.rules.map((rule, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          background: 'rgba(15, 23, 42, 0.4)',
                          border: '1px solid rgba(51, 65, 85, 0.4)',
                          borderRadius: '0.65rem',
                          padding: '0.75rem 1rem'
                        }}
                      >
                        <CheckCircle2 style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                        <span style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {rule}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* MODAL FOOTER (STICKY ACTION BAR) */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid rgba(56, 189, 248, 0.18)',
            background: 'rgba(3, 7, 18, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', color: 'var(--text-slate)' }}>
            Status: <span style={{ color: '#34d399', fontWeight: 600 }}>● REGISTRATIONS ACTIVE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                playUiBeep(800, 0.04);
                onClose();
              }}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'transparent',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#cbd5e1',
                fontFamily: 'var(--font-space)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)'}
            >
              Close Briefing
            </button>

            <button
              onClick={() => {
                playUiBeep(1300, 0.08);
                onRegisterEvent(event.id);
                onClose();
              }}
              className="btn-pill-cyan"
              style={{ padding: '0.65rem 1.6rem', fontSize: '0.85rem' }}
            >
              <span>{event.regType === 'pre-registration' ? 'Register For Mission' : 'Select For Pass'}</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
