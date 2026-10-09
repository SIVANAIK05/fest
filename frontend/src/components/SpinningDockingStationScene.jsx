import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Zap, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { 
  playUiBeep, 
  playHydraulicDockSound, 
  playRcsThrusterPulse, 
  playRotationSyncTone 
} from '../utils/audioEngine';

/**
 * PHOTOREALISTIC TOROIDAL SPINNING SPACE STATION & BLUE PLANET ORBIT
 * 
 * Recreated precisely from the user's reference:
 * - Massive Toroidal Habitat Wheel with multi-deck segmented ring hull
 * - Hundreds of illuminated panoramic observation windows (warm gold & cyan glow)
 * - 4 Heavy Pressurized Tubular Spokes with reinforcement collar rings
 * - Multi-tiered Central Command Hub with observation cupola & axial antenna mast
 * - Solar array panels & radiator fins mounted along the outer rim
 * - Approaching Shuttle Spacecraft flying in formation below with glowing rocket plumes
 * - Breathtaking Blue Earth / Habitable Exoplanet with atmospheric Rayleigh scattering limb & cloud cyclones
 * - Milky Way galactic starfield in deep space
 * - Smooth scroll-driven spin physics accelerating to 67 RPM with inertial dampening
 * - Active everywhere EXCEPT Hero (Hero remains 100% clean and isolated)
 */
export default function SpinningDockingStationScene() {
  const mountRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // HUD Telemetry State
  const [rpm, setRpm] = useState(67);
  const [dockingDistance, setDockingDistance] = useState(120);
  const [syncPercentage, setSyncPercentage] = useState(96);
  const [dockStatus, setDockStatus] = useState('APPROACH'); // 'APPROACH' | 'ALIGNING' | 'MATCHED' | 'LOCKED'
  const [cameraMode, setCameraMode] = useState('orbitView'); // 'orbitView' | 'shuttleCam' | 'ringCloseUp' | 'hubCam'
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isRcsFiring, setIsRcsFiring] = useState(false);
  const [tarsLog, setTarsLog] = useState('ORBITAL INSERTION CONFIRMED. TOROIDAL STATION SPIN RATE: 67 RPM.');

  // Animation & Physics Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const stationTiltedGroupRef = useRef(null);
  const spinningWheelRef = useRef(null);
  const shuttleRef = useRef(null);
  const planetRef = useRef(null);
  const cloudsRef = useRef(null);
  const thrusterFlamesRef = useRef([]);

  // Scroll Tracker
  const scrollTracker = useRef({
    currentY: 0,
    velocity: 0,
    progress: 0,
    heroBottom: 800,
    lastFrameTime: 0
  });

  const dynamics = useRef({
    wheelAngle: 0,
    wheelAngularVelocity: 0.016, // Base cruise spin (~24 RPM)
    targetAngularVelocity: 0.016,
    shuttleDistance: 110,
    targetShuttleDistance: 110,
    rcsTimer: 0,
    autopilotBoost: 0,
    cameraTargetPos: new THREE.Vector3(0, 4, 52),
    cameraTargetLookAt: new THREE.Vector3(12, 10, -8),
    isDockLocked: false
  });

  // -------------------------------------------------------------
  // 1. PROCEDURAL HIGH-RES TEXTURES
  // -------------------------------------------------------------

  // A. Toroidal Ring Hull Texture (Rows of glowing observation windows & panel seams)
  const createToroidHullTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base titanium white / ceramic alloy
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, 2048, 512);

    // Darker structural composite banding
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 2048, 45);
    ctx.fillRect(0, 467, 2048, 45);

    // Module bulkhead joints
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.lineWidth = 4;
    for (let x = 0; x < 2048; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();

      // Mechanical latch accents
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 6, 60, 12, 24);
      ctx.fillRect(x - 6, 428, 12, 24);
    }

    // 4 Continuous Rows of Panoramic Observation Windows (Glowing amber & cool daylight white)
    const windowRows = [120, 180, 290, 350];
    windowRows.forEach((yPos, rowIdx) => {
      for (let x = 16; x < 2048; x += 28) {
        if ((x + rowIdx * 10) % 96 === 0) continue; // Structural pillar gap

        const isAmber = (x + rowIdx * 14) % 3 === 0;
        ctx.fillStyle = isAmber ? '#fef08a' : '#38bdf8';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, yPos, 18, 18);

        // Window frame
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, yPos, 18, 18);
      }
    });
    ctx.shadowBlur = 0;

    // Station Name & Registry Stencils
    for (let s = 0; s < 4; s++) {
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('ASTRION ORBITAL // HABITAT RING-0' + (s + 1), s * 512 + 80, 245);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // B. Photorealistic Blue Planet & Atmosphere Clouds Texture
  const createPlanetTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep ocean blue base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#0b1938');
    oceanGrad.addColorStop(0.5, '#0c4a6e');
    oceanGrad.addColorStop(1, '#071630');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Continents & landmasses (Natural green, ochre & brown terrain)
    ctx.fillStyle = '#1e3a2b';
    for (let c = 0; c < 12; c++) {
      const cx = (c * 170) % 2048;
      const cy = 200 + (c * 65) % 600;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 140 + (c * 20), 80 + (c * 15), c * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Mountain ridges
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(cx + 20, cy - 10, 60, 30, c * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e3a2b';
    }

    // Swirling Cloud Cyclones & Storm Formations (Translucent white)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let s = 0; s < 25; s++) {
      const sx = (s * 85) % 2048;
      const sy = 120 + (s * 42) % 800;
      ctx.beginPath();
      ctx.arc(sx, sy, 70 + (s % 5) * 25, 0, Math.PI * 1.6);
      ctx.lineWidth = 35 + (s % 4) * 12;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + (s % 3) * 0.2})`;
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // C. Photovoltaic Solar Array Texture
  const createSolarTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#05122e';
    ctx.fillRect(0, 0, 256, 512);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.6;
    for (let y = 0; y < 512; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    }
    for (let x = 0; x < 256; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
    }

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(64, 0); ctx.lineTo(64, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(192, 0); ctx.lineTo(192, 512); ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // -------------------------------------------------------------
  // 2. THREE.JS SCENE ASSEMBLY
  // -------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // A. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 3000);
    camera.position.set(0, 4, 52);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // B. Lighting (Sunlight hitting Earth & station with deep space contrast)
    const ambientLight = new THREE.AmbientLight(0x0f1c30, 1.4);
    scene.add(ambientLight);

    // Key Sunlight (Blinding sun beam from top left, matching user reference image)
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.8);
    sunLight.position.set(-100, 70, 40);
    scene.add(sunLight);

    // Earth Albedo Light (Warm cyan-blue bounce light reflecting off the planet onto the station underside)
    const earthAlbedo = new THREE.DirectionalLight(0x38bdf8, 2.2);
    earthAlbedo.position.set(-40, -60, -20);
    scene.add(earthAlbedo);

    // C. Deep Cosmic Starfield & Milky Way Cluster
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 2200;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 1400;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 1000;
      starPositions[i3 + 2] = -250 - Math.random() * 800;

      const isWarm = Math.random() > 0.6;
      starColors[i3] = isWarm ? 1.0 : 0.75;
      starColors[i3 + 1] = isWarm ? 0.9 : 0.85;
      starColors[i3 + 2] = isWarm ? 0.7 : 1.0;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.88
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // -------------------------------------------------------------
    // D. PHOTOREALISTIC BLUE EARTH / EXOPLANET (Positioned lower-left)
    // -------------------------------------------------------------
    const planetGroup = new THREE.Group();
    // Positioned below and to the left, exactly matching the reference curvature
    planetGroup.position.set(-62, -58, -48);
    planetGroup.rotation.z = 0.28;
    planetGroup.rotation.x = 0.35;
    planetRef.current = planetGroup;

    const planetTex = createPlanetTexture();

    // Planet Surface Sphere
    const planetGeo = new THREE.SphereGeometry(72, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTex,
      roughness: 0.7,
      metalness: 0.1
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Atmospheric Rayleigh Scattering Glow Shell
    const atmoGeo = new THREE.SphereGeometry(74.2, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    planetGroup.add(atmoMesh);

    scene.add(planetGroup);

    // -------------------------------------------------------------
    // E. THE TOROIDAL SPINNING SPACE STATION (UPPER RIGHT)
    // -------------------------------------------------------------
    // Station Orientation Group (Tilted to match the exact reference image angle)
    const stationTiltedGroup = new THREE.Group();
    stationTiltedGroup.position.set(14, 10, -6);
    stationTiltedGroup.rotation.set(0.56, -0.42, 0.32);
    stationTiltedGroupRef.current = stationTiltedGroup;
    scene.add(stationTiltedGroup);

    // Inner Spinning Wheel Group (Rotates cleanly around its normal Z-axis)
    const spinningWheel = new THREE.Group();
    spinningWheelRef.current = spinningWheel;
    stationTiltedGroup.add(spinningWheel);

    const toroidTex = createToroidHullTexture();
    const solarTex = createSolarTexture();

    const ringRadius = 22.5; // Large authentic diameter

    // Materials
    const hullMat = new THREE.MeshStandardMaterial({
      map: toroidTex,
      roughness: 0.35,
      metalness: 0.55
    });

    const darkAlloyMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      roughness: 0.25,
      metalness: 0.85
    });

    const steelTrussMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.2,
      metalness: 0.9
    });

    const solarMat = new THREE.MeshStandardMaterial({
      map: solarTex,
      roughness: 0.2,
      metalness: 0.75,
      side: THREE.DoubleSide
    });

    // 1. PRIMARY MULTI-DECK TOROIDAL HABITAT RING
    const mainTorusGeo = new THREE.TorusGeometry(ringRadius, 2.8, 24, 72);
    const mainTorusMesh = new THREE.Mesh(mainTorusGeo, hullMat);
    spinningWheel.add(mainTorusMesh);

    // Outer Perimeter Stabilization Collar
    const outerRailGeo = new THREE.TorusGeometry(ringRadius + 2.8, 0.45, 16, 72);
    const outerRailMesh = new THREE.Mesh(outerRailGeo, darkAlloyMat);
    spinningWheel.add(outerRailMesh);

    // Inner Perimeter Access Rail
    const innerRailGeo = new THREE.TorusGeometry(ringRadius - 2.8, 0.45, 16, 72);
    const innerRailMesh = new THREE.Mesh(innerRailGeo, darkAlloyMat);
    spinningWheel.add(innerRailMesh);

    // 2. SOLAR ARRAY WINGS & RADIATOR MODULES ALONG THE OUTER RIM
    const numSolarPanels = 16;
    for (let p = 0; p < numSolarPanels; p++) {
      const pAngle = (p / numSolarPanels) * Math.PI * 2;
      const panelGroup = new THREE.Group();
      panelGroup.position.set(
        Math.cos(pAngle) * (ringRadius + 3.6),
        Math.sin(pAngle) * (ringRadius + 3.6),
        0
      );
      panelGroup.rotation.z = pAngle + Math.PI / 2;

      // Solar photovoltaic wing
      const wingGeo = new THREE.BoxGeometry(0.12, 1.8, 4.4);
      const wingMesh = new THREE.Mesh(wingGeo, solarMat);
      panelGroup.add(wingMesh);

      // Support strut
      const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
      const strutMesh = new THREE.Mesh(strutGeo, steelTrussMat);
      strutMesh.position.set(0, -1.0, 0);
      panelGroup.add(strutMesh);

      spinningWheel.add(panelGroup);
    }

    // 3. 4 HEAVY PRESSURIZED TUBULAR SPOKES
    for (let s = 0; s < 4; s++) {
      const spokeAngle = (s / 4) * Math.PI * 2;
      const spokeGroup = new THREE.Group();
      spokeGroup.rotation.z = spokeAngle;

      // Main Pressurized Tubular Crew Transit Highway
      const spokeGeo = new THREE.CylinderGeometry(1.25, 1.25, ringRadius * 0.94, 24);
      const spokeMesh = new THREE.Mesh(spokeGeo, hullMat);
      spokeMesh.position.set(0, ringRadius * 0.47, 0);
      spokeGroup.add(spokeMesh);

      // Reinforcement Ring Collars along spoke (every 4 units)
      for (let r = 4; r < ringRadius * 0.9; r += 4.5) {
        const collarGeo = new THREE.TorusGeometry(1.45, 0.22, 12, 24);
        const collarMesh = new THREE.Mesh(collarGeo, darkAlloyMat);
        collarMesh.position.set(0, r, 0);
        collarMesh.rotation.x = Math.PI / 2;
        spokeGroup.add(collarMesh);
      }

      // Triangular Truss Braces connecting spoke to inner rim
      [-1, 1].forEach((dir) => {
        const braceGeo = new THREE.CylinderGeometry(0.25, 0.25, 6.2, 8);
        const brace = new THREE.Mesh(braceGeo, steelTrussMat);
        brace.position.set(dir * 2.2, ringRadius * 0.88, 0);
        brace.rotation.z = dir * (Math.PI / 5);
        spokeGroup.add(brace);
      });

      spinningWheel.add(spokeGroup);
    }

    // 4. MULTI-TIER CENTRAL COMMAND HUB & DOCKING AXLE
    const hubGroup = new THREE.Group();

    // Central Cylindrical Core
    const hubCoreGeo = new THREE.CylinderGeometry(4.2, 4.6, 7.8, 32);
    const hubCore = new THREE.Mesh(hubCoreGeo, darkAlloyMat);
    hubCore.rotation.x = Math.PI / 2;
    hubGroup.add(hubCore);

    // Forward Observation Cupola (Multi-window dome)
    const cupolaGeo = new THREE.SphereGeometry(3.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cupola = new THREE.Mesh(cupolaGeo, hullMat);
    cupola.position.z = 3.9;
    cupola.rotation.x = Math.PI / 2;
    hubGroup.add(cupola);

    // Axial Docking Port & Magnetic Capture Ring
    const dockRingGeo = new THREE.TorusGeometry(2.2, 0.45, 16, 32);
    const dockRing = new THREE.Mesh(dockRingGeo, steelTrussMat);
    dockRing.position.z = 5.2;
    hubGroup.add(dockRing);

    // Axial Communication Antenna Spire
    const spireGeo = new THREE.CylinderGeometry(0.12, 0.35, 7.5, 12);
    const spire = new THREE.Mesh(spireGeo, steelTrussMat);
    spire.position.z = 8.5;
    spire.rotation.x = Math.PI / 2;
    hubGroup.add(spire);

    // Cross Dipole Antenna Arrays
    for (let a = 0; a < 4; a++) {
      const aAngle = (a / 4) * Math.PI * 2;
      const dipoleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
      const dipole = new THREE.Mesh(dipoleGeo, steelTrussMat);
      dipole.position.set(Math.cos(aAngle) * 1.5, Math.sin(aAngle) * 1.5, 9.2);
      dipole.rotation.z = aAngle;
      hubGroup.add(dipole);
    }

    spinningWheel.add(hubGroup);

    // -------------------------------------------------------------
    // F. SLEEK SHUTTLE SPACECRAFT (Flying below the station in formation)
    // -------------------------------------------------------------
    const shuttleGroup = new THREE.Group();
    shuttleRef.current = shuttleGroup;
    // Positioned below the station in the orbital approach lane (matching user reference image)
    shuttleGroup.position.set(10, -4, 18);
    shuttleGroup.rotation.set(0.48, -0.35, 0.28);
    scene.add(shuttleGroup);

    // Aerodynamic Lifting-Body Hull
    const shuttleHullGeo = new THREE.ConeGeometry(2.4, 7.8, 4);
    const shuttleHull = new THREE.Mesh(shuttleHullGeo, hullMat);
    shuttleHull.rotation.x = Math.PI / 2;
    shuttleHull.rotation.y = Math.PI / 4;
    shuttleHull.scale.set(1.4, 0.42, 1);
    shuttleGroup.add(shuttleHull);

    // Cockpit Window Canopy (Dark reflective glass)
    const canopyGeo = new THREE.BoxGeometry(1.2, 0.5, 1.8);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.05, metalness: 0.95 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.42, 0.8);
    canopy.rotation.x = -Math.PI / 7;
    shuttleGroup.add(canopy);

    // Twin Rocket Engines with Glowing Exhaust Cones
    const flames = [];
    [-0.8, 0.8].forEach((ex) => {
      const nozzleGeo = new THREE.CylinderGeometry(0.35, 0.55, 1.0, 16);
      const nozzle = new THREE.Mesh(nozzleGeo, darkAlloyMat);
      nozzle.position.set(ex, 0, 4.1);
      nozzle.rotation.x = Math.PI / 2;
      shuttleGroup.add(nozzle);

      // Glowing Rocket Exhaust Cone (Blinding incandescent white/orange flame)
      const flameGeo = new THREE.ConeGeometry(0.4, 2.4, 16);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(ex, 0, 5.4);
      flame.rotation.x = -Math.PI / 2;
      shuttleGroup.add(flame);
      flames.push(flame);
    });
    thrusterFlamesRef.current = flames;

    // -------------------------------------------------------------
    // G. RESIZE HANDLER
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------
    // H. 60FPS PHYSICS & RENDER LOOP
    // -------------------------------------------------------------
    let animId;

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);

      const d = dynamics.current;
      const s = scrollTracker.current;

      // Slow orbital drift of Earth clouds & planet
      if (planetRef.current) {
        planetRef.current.rotation.y += 0.0003;
      }

      // Check visibility gate (Hero is 100% untouched)
      const isPastHero = s.currentY > s.heroBottom * 0.45;
      if (!isPastHero) {
        return;
      }

      // Rotation dynamics: Base cruise + on-scroll speed boost (up to 67 RPM)
      const scrollBoost = Math.min(s.velocity * 0.0045, 0.055);
      const targetSpeed = 0.016 + scrollBoost + d.autopilotBoost;

      d.wheelAngularVelocity += (targetSpeed - d.wheelAngularVelocity) * 0.08;
      d.wheelAngle += d.wheelAngularVelocity;

      // Rotate the Toroidal Wheel around its central axis!
      if (spinningWheelRef.current) {
        spinningWheelRef.current.rotation.z = d.wheelAngle;
      }

      // Animate Shuttle Rocket Flame Flicker
      thrusterFlamesRef.current.forEach((flame, idx) => {
        const flicker = 1 + Math.sin(timestamp * 0.08 + idx) * 0.22;
        flame.scale.set(flicker, 1 + Math.random() * 0.3, flicker);
      });

      // Shuttle relative position closes in as user scrolls through sections
      if (shuttleRef.current) {
        const targetDist = Math.max(18 - s.progress * 14, 4.5);
        d.shuttleDistance += (targetDist - d.shuttleDistance) * 0.06;
        shuttleRef.current.position.z = d.shuttleDistance;
      }

      // Camera Modes
      if (cameraRef.current) {
        const cam = cameraRef.current;
        let destPos = d.cameraTargetPos;
        let destLook = d.cameraTargetLookAt;

        if (cameraMode === 'orbitView') {
          // BREATHTAKING ORBITAL ANGLE (Matching User Reference Image)
          // Station in upper right, blue Earth below, shuttle flying in formation
          const camZ = 50 + s.progress * 15;
          const camY = 4 + Math.sin(s.progress * 2) * 5;
          destPos.set(-2, camY, camZ);
          destLook.set(8, 6, -6);
        } else if (cameraMode === 'shuttleCam') {
          // Flying right behind the shuttle looking up at the rotating station
          if (shuttleRef.current) {
            destPos.set(
              shuttleRef.current.position.x - 3,
              shuttleRef.current.position.y - 1.5,
              shuttleRef.current.position.z + 12
            );
            destLook.set(14, 10, -6);
          }
        } else if (cameraMode === 'ringCloseUp') {
          // Close-up view along the rotating window promenade
          destPos.set(16, 12, 18);
          destLook.set(14, 10, -6);
        } else if (cameraMode === 'hubCam') {
          // Axial docking alignment view looking straight into the hub
          destPos.set(14, 10, 22);
          destLook.set(14, 10, -6);
        }

        cam.position.lerp(destPos, 0.06);
        cam.lookAt(destLook);
      }

      // Telemetry Calculations
      const calculatedRpm = Math.round(d.wheelAngularVelocity * 60 * 60 / (Math.PI * 2));
      const distVal = Math.max(Math.round(d.shuttleDistance * 6), 0);
      const syncVal = Math.min(Math.round(88 + s.progress * 12), 100);

      setRpm(calculatedRpm);
      setDockingDistance(distVal);
      setSyncPercentage(syncVal);

      if (distVal <= 32 && syncVal >= 99) {
        if (!d.isDockLocked) {
          d.isDockLocked = true;
          setDockStatus('LOCKED');
          playHydraulicDockSound();
          setTarsLog('ORBITAL SYNCHRONIZATION LOCKED. CLAMP INTEGRITY AT 100%.');
        }
      } else if (syncVal >= 96) {
        setDockStatus('MATCHED');
      } else if (syncVal >= 88) {
        setDockStatus('ALIGNING');
      } else {
        setDockStatus('APPROACH');
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      toroidTex.dispose();
      planetTex.dispose();
      solarTex.dispose();
    };
  }, [
    createToroidHullTexture, 
    createPlanetTexture, 
    createSolarTexture, 
    cameraMode
  ]);

  // -------------------------------------------------------------
  // 3. SCROLL & HERO SEPARATION
  // -------------------------------------------------------------
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();
    let velocityTimeout;

    const handleScroll = () => {
      const heroEl = document.getElementById('home');
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
      scrollTracker.current.heroBottom = heroHeight;

      const currentScrollY = window.scrollY;
      const now = performance.now();
      const deltaY = Math.abs(currentScrollY - lastScrollY);
      const deltaTime = Math.max(now - lastTimestamp, 16);

      const instantVel = (deltaY / deltaTime) * 14;
      scrollTracker.current.velocity = Math.min(instantVel, 28);
      scrollTracker.current.currentY = currentScrollY;

      clearTimeout(velocityTimeout);
      velocityTimeout = setTimeout(() => {
        scrollTracker.current.velocity = 0;
      }, 100);

      lastScrollY = currentScrollY;
      lastTimestamp = now;

      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight - heroHeight, 1);
      const scrollPastHero = Math.max(currentScrollY - heroHeight * 0.45, 0);
      const progress = Math.min(Math.max(scrollPastHero / maxScroll, 0), 1);
      scrollTracker.current.progress = progress;

      // Visibility Gate: Hero section is 100% untouched
      if (currentScrollY > heroHeight * 0.45) {
        setIsVisible(true);
        const fadeProgress = Math.min((currentScrollY - heroHeight * 0.45) / 250, 1);
        setOpacity(fadeProgress);
      } else {
        setOpacity(0);
        setIsVisible(false);
      }

      // Guidance Updates based on scroll depth
      if (progress < 0.25) {
        setTarsLog('ORBITAL INSERTION OVER BLUE EXOPLANET. TOROID SPIN: 67 RPM.');
      } else if (progress < 0.55) {
        setTarsLog('SHUTTLE FLIGHT IN FORMATION. SYNCHRONIZING WITH TOROID ROTATION.');
      } else if (progress < 0.85) {
        setTarsLog('APPROACH VECTOR SECURE. ROTATIONAL VELOCITY MATCHED AT 67 RPM.');
      } else {
        setTarsLog('STATION RENDEZVOUS COMPLETE. AIRLOCK READY FOR CREW TRANSFER.');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(velocityTimeout);
    };
  }, []);

  // -------------------------------------------------------------
  // 4. USER ACTIONS (THRUSTERS, 67 RPM MATCH, CAMERA ANGLES)
  // -------------------------------------------------------------
  const handleFireRcs = () => {
    playUiBeep(1400, 0.04);
    playRcsThrusterPulse();
    setIsRcsFiring(true);
    dynamics.current.wheelAngularVelocity += 0.018; // Instant spin boost
    setTimeout(() => setIsRcsFiring(false), 500);
  };

  const handleAutopilotMatch = () => {
    playRotationSyncTone();
    dynamics.current.autopilotBoost = 0.026; // Accelerates to 67 RPM
    setTarsLog('AUTOPILOT: 67 RPM SYNCHRONIZED ROTATION ENGAGED.');
    setTimeout(() => {
      dynamics.current.autopilotBoost = 0;
    }, 4500);
  };

  const handleCameraChange = (mode) => {
    playUiBeep(1100, 0.05);
    setCameraMode(mode);
  };

  const toggleCinemaMode = () => {
    playUiBeep(980, 0.05);
    setIsCinemaMode(!isCinemaMode);
  };

  return (
    <>
      {/* 3D WEBGL VIEWPORT (Behind text content) */}
      <div
        id="spinning-docking-scene"
        ref={mountRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: opacity,
          transition: 'opacity 0.5s ease-out',
          display: isVisible || opacity > 0 ? 'block' : 'none',
          overflow: 'hidden'
        }}
        aria-hidden="true"
      />

      {/* Focus Cinema Mode Overlay */}
      {isCinemaMode && (
        <div
          onClick={toggleCinemaMode}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 8,
            background: 'rgba(2, 4, 9, 0.75)',
            backdropFilter: 'blur(3px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          title="Click to exit cinema focus mode"
        />
      )}

      {/* INTERACTIVE TELEMETRY COCKPIT HUD */}
      {isVisible && opacity > 0.15 && (
        <aside
          className="docking-hud-container"
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            right: '1.25rem',
            zIndex: 42,
            maxWidth: isHudCollapsed ? '215px' : '370px',
            width: 'calc(100vw - 2.5rem)',
            background: 'rgba(4, 9, 24, 0.92)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '16px',
            boxShadow: '0 8px 35px rgba(0, 0, 0, 0.85), 0 0 22px rgba(56, 189, 248, 0.18)',
            color: '#f8fafc',
            fontFamily: 'var(--font-space)',
            padding: isHudCollapsed ? '0.75rem 1rem' : '1.1rem 1.25rem',
            pointerEvents: 'auto',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            userSelect: 'none'
          }}
        >
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isHudCollapsed ? '0' : '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: dockStatus === 'LOCKED' ? '#10b981' : '#38bdf8',
                boxShadow: dockStatus === 'LOCKED' ? '0 0 10px #10b981' : '0 0 10px #38bdf8',
                animation: 'pulse 1.8s infinite'
              }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', color: '#e2e8f0' }}>
                ORBITAL TOROID // 67 RPM
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={toggleCinemaMode}
                className="hud-icon-btn"
                title={isCinemaMode ? "Exit Cinema View" : "Focus Docking Scene"}
                style={{
                  background: isCinemaMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: isCinemaMode ? '#38bdf8' : '#94a3b8',
                  borderRadius: '6px',
                  padding: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isCinemaMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>

              <button
                onClick={() => {
                  playUiBeep(1200, 0.03);
                  setIsHudCollapsed(!isHudCollapsed);
                }}
                className="hud-icon-btn"
                title={isHudCollapsed ? "Expand Telemetry" : "Collapse HUD"}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isHudCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>

          {/* Collapsed State Minimal Summary */}
          {isHudCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>
                {rpm} RPM
              </span>
              <span style={{ color: '#94a3b8' }}>
                {dockingDistance}m RANGE
              </span>
              <span style={{
                color: dockStatus === 'LOCKED' ? '#10b981' : '#fbbf24',
                fontWeight: 700
              }}>
                {dockStatus}
              </span>
            </div>
          )}

          {/* Expanded Full Readout */}
          {!isHudCollapsed && (
            <div>
              {/* Telemetry Metrics Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                marginBottom: '0.85rem'
              }}>
                <div style={{
                  background: 'rgba(2, 6, 23, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.22)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.4rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '0.08em' }}>SPIN RATE</div>
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: rpm >= 60 ? '#fbbf24' : '#38bdf8',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {rpm} <span style={{ fontSize: '0.65rem' }}>RPM</span>
                  </div>
                  <div style={{ fontSize: '0.58rem', color: '#64748b' }}>SCROLL DRIVEN</div>
                </div>

                <div style={{
                  background: 'rgba(2, 6, 23, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.22)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.4rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '0.08em' }}>RANGE</div>
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: dockingDistance < 40 ? '#10b981' : '#f8fafc',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {dockingDistance} <span style={{ fontSize: '0.65rem' }}>M</span>
                  </div>
                  <div style={{ fontSize: '0.58rem', color: '#64748b' }}>FORMATION</div>
                </div>

                <div style={{
                  background: 'rgba(2, 6, 23, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.22)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.4rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', letterSpacing: '0.08em' }}>ROTATION SYNC</div>
                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: syncPercentage >= 98 ? '#10b981' : '#38bdf8',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {syncPercentage}%
                  </div>
                  <div style={{ fontSize: '0.58rem', color: dockStatus === 'LOCKED' ? '#10b981' : '#fbbf24', fontWeight: 700 }}>
                    {dockStatus}
                  </div>
                </div>
              </div>

              {/* Progress Alignment Bar */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#94a3b8', marginBottom: '3px' }}>
                  <span>ORBITAL VECTOR ALIGNMENT</span>
                  <span style={{ color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>{syncPercentage}% MATCH</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '5px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${syncPercentage}%`,
                    height: '100%',
                    background: syncPercentage >= 98
                      ? 'linear-gradient(90deg, #38bdf8, #10b981)'
                      : 'linear-gradient(90deg, #38bdf8, #fbbf24)',
                    transition: 'width 0.2s ease',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                  }} />
                </div>
              </div>

              {/* Camera Angle Selector */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginBottom: '4px', letterSpacing: '0.08em' }}>
                  ORBITAL SENSORS (CAMERA VIEWS)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem' }}>
                  {[
                    { id: 'orbitView', label: 'Orbit View' },
                    { id: 'shuttleCam', label: 'Shuttle Cam' },
                    { id: 'ringCloseUp', label: 'Ring Promenade' },
                    { id: 'hubCam', label: 'Hub Dock' }
                  ].map((cam) => (
                    <button
                      key={cam.id}
                      onClick={() => handleCameraChange(cam.id)}
                      style={{
                        padding: '0.4rem 0.2rem',
                        fontSize: '0.62rem',
                        fontWeight: cameraMode === cam.id ? 700 : 500,
                        background: cameraMode === cam.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: cameraMode === cam.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: cameraMode === cam.id ? '#ffffff' : '#94a3b8',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Flight Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <button
                  onClick={handleFireRcs}
                  className="hud-action-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: isRcsFiring ? 'rgba(56, 189, 248, 0.45)' : 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(56, 189, 248, 0.55)',
                    color: '#38bdf8',
                    padding: '0.55rem 0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    boxShadow: isRcsFiring ? '0 0 18px rgba(56, 189, 248, 0.6)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Zap size={13} />
                  <span>FIRE RCS JETS</span>
                </button>

                <button
                  onClick={handleAutopilotMatch}
                  className="hud-action-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.55)',
                    color: '#fbbf24',
                    padding: '0.55rem 0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RotateCw size={13} />
                  <span>MATCH 67 RPM</span>
                </button>
              </div>

              {/* Guidance Telemetry */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.5rem 0.65rem',
                fontSize: '0.64rem',
                color: '#94a3b8',
                lineHeight: 1.35,
                fontFamily: 'var(--font-mono)'
              }}>
                <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>TELEMETRY: </span>
                <span>{tarsLog}</span>
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
