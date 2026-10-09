import React, { useState, useRef, useEffect } from 'react';
import { playUiBeep } from '../utils/audioEngine';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export default function TheCrewSection() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const shiftRemainingRef = useRef(0);

  const crewMembers = [
    {//1
      name: 'Jessy',
      role: 'President',
     
      img: '/Crew/jessy2.png',
    },
    {//2
      name: 'Aparna',
      role: 'Vice - President',
      
      img: '/Crew/aparna.jpeg',
    },
    {//3
      name: 'Bhaeru Nadh',
      role: 'Secretary',
      
      img: '/Crew/image.png',
    },
    {//4
      name: 'Rohit',
      role: 'PR - Commander',
    
      img: '/Crew/Rohi2t.jpeg',
    },
    {//5
      name: 'Harini ',
      role: 'Web - Commander',
   
      img: '/Crew/image copy.png',
    },

    {//6
      name: 'Chaitanya',
      role: 'Events',
     
      img: '/Crew/chaitanya.jpeg',
    },
    {//7
      name: 'Saran',
      role: 'Events - Commander  ',
    
      img: '/Crew/saran.png',
    },
    {//8
      name: 'Sudheerkumar',
      role: 'R & V - Commander  ',
    
      img: '/Crew/sudheer.png',
    },


    {//9
      name: 'Mahesh',
      role: 'SMD- Commander ',
      
      img: '/Crew/Mahesh.png',
    },
    {//10
      name: 'Srujana',
      role: ' ',
      
      img: '/Crew/Srujana.jpeg',
    },

    {//11
      name: 'Siva Naik',
      
      img: '/Crew/naik.png',
    },
  ];

  // Duplicate list to achieve a seamless, continuous infinite wrap
  const displayItems = [...crewMembers, ...crewMembers];

  // Silky continuous auto-scroll loop with additive smooth shift (NEVER STOPS AUTOSCROLL)
  useEffect(() => {
    let animationFrameId;
    let lastTimestamp = performance.now();
    const baseSpeed = 40; // Constant smooth speed (pixels / sec)

    const animateScroll = (currentTimestamp) => {
      const delta = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = currentTimestamp;

      const container = scrollRef.current;
      if (container && !isPaused && !isDragging.current) {
        // Continuous base autoscroll drift
        let frameMove = baseSpeed * delta;

        // Smooth additive shift when clicking Next / Previous without stopping autoscroll
        if (shiftRemainingRef.current !== 0) {
          const shiftFraction = Math.min(9 * delta, 0.25);
          const shiftStep = shiftRemainingRef.current * shiftFraction;
          frameMove += shiftStep;
          shiftRemainingRef.current -= shiftStep;

          if (Math.abs(shiftRemainingRef.current) < 1) {
            frameMove += shiftRemainingRef.current;
            shiftRemainingRef.current = 0;
          }
        }

        container.scrollLeft += frameMove;

        // Wrap seamlessly at midpoint
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // Click Next or Previous: smoothly moves to the next/prev card WITHOUT stopping autoscroll!
  const handleSmoothStep = (direction) => {
    playUiBeep(direction === 'left' ? 850 : 1200, 0.04);
    const container = scrollRef.current;
    if (!container) return;

    // Compute exact single-card stride
    const firstCard = container.querySelector('.echo-crew-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 280;
    const gap = window.innerWidth < 640 ? 16 : 24;
    const stride = cardWidth + gap;

    // Add to shift buffer (autoscroll continues running concurrently)
    if (direction === 'left') {
      shiftRemainingRef.current -= stride;
    } else {
      shiftRemainingRef.current += stride;
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.35;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <section id="crew" className="ast-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Backwards-compatibility anchor for #gallery links */}
      <div id="gallery" style={{ position: 'absolute', top: 0, left: 0 }} />

      {/* SECTION HEADER WITH CONTROLS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div className="section-index">04 —</div>
          <h2 className="ast-heading">
            THE CREW OF ASTRION'26
          </h2>
          <p className="ast-subheading">
            The visionary minds and commanders steering the ASTRION mission.
          </p>
        </div>

        {/* CONTROLS (Pause/Resume & Header Quick-Arrows) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Pause / Resume Button */}
          <button
            onClick={() => {
              playUiBeep(1000, 0.03);
              setIsPaused((prev) => !prev);
            }}
            className="echoes-control-btn"
            title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            aria-label="Toggle auto scroll"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              {isPaused ? 'RESUME' : 'AUTO-SCROLL'}
            </span>
          </button>

          {/* Quick Header Left Arrow */}
          <button
            onClick={() => handleSmoothStep('left')}
            className="echoes-arrow-btn"
            title="Previous crew member"
            aria-label="Previous crew member"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Quick Header Right Arrow */}
          <button
            onClick={() => handleSmoothStep('right')}
            className="echoes-arrow-btn"
            title="Next crew member"
            aria-label="Next crew member"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* SINGLE ROW AUTO-ANIMATED HORIZONTAL REEL */}
      <div className="echoes-carousel-viewport">
        {/* Soft Cosmic Edge Fade Masks */}
        <div className="echoes-edge-mask echoes-edge-left" />
        <div className="echoes-edge-mask echoes-edge-right" />

        {/* Floating Side Left Arrow */}
        <button
          onClick={() => handleSmoothStep('left')}
          className="echoes-floating-nav-btn echoes-nav-prev"
          aria-label="Previous Crew Member"
          title="Previous Crew"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Floating Side Right Arrow */}
        <button
          onClick={() => handleSmoothStep('right')}
          className="echoes-floating-nav-btn echoes-nav-next"
          aria-label="Next Crew Member"
          title="Next Crew"
        >
          <ChevronRight size={24} />
        </button>

        {/* Horizontal Track with Smooth Continuous Motion */}
        <div
          ref={scrollRef}
          className="echoes-horizontal-track"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            handleMouseUpOrLeave();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
        >
          {displayItems.map((member, idx) => (
            <div
              key={`${member.name}-${idx}`}
              className="echo-crew-card"
              onClick={() => playUiBeep(1100 + (idx % 10) * 40, 0.03)}
            >
              {/* Card Photo */}
              <div className="echo-crew-photo-container">
                <img
                  src={member.img}
                  alt={`${member.name} - ${member.role}`}
                  className="echo-crew-photo"
                  loading="lazy"
                />
              </div>

              {/* Bottom Holographic Info Overlay */}
              <div className="echo-crew-bottom-info">
                <div className="echo-crew-name">
                  {member.name}
                </div>
                <div className="echo-crew-role">
                  <span>{member.role}</span>
                </div>
                <div className="echo-crew-telemetry-tag">
                  ASTRION COMMAND // CREW DISPATCH
                </div>
              </div>

              {/* Tech border corner accents */}
              <div className="echo-card-corner echo-corner-tl" />
              <div className="echo-card-corner echo-corner-br" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
