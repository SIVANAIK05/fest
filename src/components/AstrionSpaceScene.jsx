import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { createStarField } from './StarField';
import { createSpaceParticles } from './SpaceParticles';

/**
 * 3D Cinematic Gargantua-Style Black Hole & Hybrid Environment
 * ────────────────────────────────────────────────────────────
 */


const noiseChunk = `
  vec2 hash2(vec2 p) {
    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }
  float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x+p.y)*K1);
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0);
    vec3 n = h*h*h*h*vec3( dot(a,hash2(i+0.0)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));
    return dot(n, vec3(70.0));
  }
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for(int i=0; i<4; i++){
      f += w * noise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }
`;

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  void main() {
    vUv = uv;
    vLocalPos = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShaderDisk = `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  
  uniform float uTime;
  uniform vec3 uCameraPos;

  ${noiseChunk}

  void main() {
    // Spatial coordinates (geometry is on XZ plane)
    float r = length(vLocalPos.xz);
    float angle = atan(vLocalPos.z, vLocalPos.x);

    // Inner disk rotates faster (Keplerian dynamics)
    float speed = 1.6 / pow(max(r, 0.1), 0.85);
    float phase = angle + uTime * speed * 0.4;

    // Radius mapping (1.1 to 4.8)
    float rNorm = clamp((r - 1.1) / (4.8 - 1.1), 0.0, 1.0);
    
    // Uniform cartesian mapping for noise prevents angular stretching artifacts
    vec2 cart = vec2(cos(phase) * r, sin(phase) * r);
    vec2 noiseUV = cart * 1.5 - vec2(uTime * 0.15);
    
    // Multi-frequency plasma layers
    float plasma = fbm(noiseUV);
    float plasmaFine = fbm(noiseUV * 2.8 + uTime * 0.5);
    float turbulence = (plasma * 0.65 + plasmaFine * 0.35);

    // Profile geometry intensity fading
    float intensity = pow(1.0 - rNorm, 1.5) * (0.3 + 0.7 * turbulence);
    intensity *= smoothstep(1.1, 1.3, r);   // soft inner edge
    intensity *= smoothstep(4.8, 3.2, r);   // extremely soft outer fade

    // Ultra-bright photon ring immediately near the event horizon
    float photonRing = smoothstep(1.25, 1.1, r) * smoothstep(1.05, 1.1, r);
    intensity += photonRing * 1.5;

    // Doppler Beaming (relativistic brightness shift)
    vec3 tangent = normalize(vec3(-vWorldPos.z, 0.0, vWorldPos.x));
    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    float doppler = dot(tangent, viewDir);
    float dopplerFactor = 1.0 + 0.8 * doppler;
    intensity *= pow(max(dopplerFactor, 0.0), 2.0);

    // Cinematic deep color palette
    vec3 coreColor = mix(vec3(1.0, 0.95, 0.8), vec3(1.0, 0.65, 0.15), rNorm * 1.5);
    vec3 edgeColor = mix(vec3(1.0, 0.3, 0.05), vec3(0.4, 0.05, 0.02), rNorm);
    vec3 color = mix(coreColor, edgeColor, smoothstep(0.15, 0.7, rNorm));
    
    // Highlight hot streaks
    color = mix(color, vec3(1.0, 1.0, 0.9), smoothstep(0.5, 1.0, turbulence) * (1.0 - rNorm));

    gl_FragColor = vec4(color * intensity * 3.5, intensity * 2.5);
  }
`;

const fragmentShaderHalo = `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  uniform float uTime;

  ${noiseChunk}

  void main() {
    // Halo sits on XY plane facing camera
    float r = length(vLocalPos.xy);
    float angle = atan(vLocalPos.y, vLocalPos.x);

    // Map halo radius to accretion disk radius naturally
    float diskR = mix(1.1, 4.8, clamp((r - 1.01) / (2.2 - 1.01), 0.0, 1.0));
    
    // Halo represents the FAR side of the disk bending over the poles
    float diskAngle = angle + 3.14159265;
    
    // Match exactly the accretion disk speed
    float speed = 1.6 / pow(max(diskR, 0.1), 0.85);
    float phase = diskAngle + uTime * speed * 0.4;
    float rNorm = clamp((diskR - 1.1) / (4.8 - 1.1), 0.0, 1.0);
    
    vec2 cart = vec2(cos(phase) * diskR, sin(phase) * diskR);
    vec2 noiseUV = cart * 1.5 - vec2(uTime * 0.15);
    
    float plasma = fbm(noiseUV);
    float plasmaFine = fbm(noiseUV * 2.8 + uTime * 0.5);
    float turbulence = (plasma * 0.65 + plasmaFine * 0.35);

    float intensity = pow(1.0 - rNorm, 1.5) * (0.3 + 0.7 * turbulence);
    intensity *= smoothstep(1.02, 1.1, r);
    intensity *= smoothstep(2.2, 1.6, r);

    // Photon ring mapping for the halo (highly intense light near event horizon radius)
    float photonRing = smoothstep(1.15, 1.05, diskR) * smoothstep(1.0, 1.05, diskR);
    intensity += photonRing * 1.2;

    // Mask out the equator heavily, since the primary disk naturally covers it in 3D
    float equatorFade = smoothstep(0.15, 0.5, abs(vLocalPos.y));
    intensity *= equatorFade;

    // Fake Doppler for the far side (moves horizontally opposite)
    float doppler = -sin(angle); 
    float dopplerFactor = 1.0 + 0.8 * doppler;
    intensity *= pow(max(dopplerFactor, 0.0), 2.0);

    vec3 coreColor = mix(vec3(1.0, 0.95, 0.8), vec3(1.0, 0.65, 0.15), rNorm * 1.5);
    vec3 edgeColor = mix(vec3(1.0, 0.3, 0.05), vec3(0.4, 0.05, 0.02), rNorm);
    vec3 color = mix(coreColor, edgeColor, smoothstep(0.15, 0.7, rNorm));
    
    color = mix(color, vec3(1.0, 1.0, 0.9), smoothstep(0.5, 1.0, turbulence) * (1.0 - rNorm));

    gl_FragColor = vec4(color * intensity * 4.0, intensity * 2.8);
  }
`;

export default function BlackHole({ scrollY = 0, mousePos = { x: 0, y: 0 } }) {
  const mountRef = useRef(null);

  // Three.js References
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);
  const clockRef = useRef(null);
  const materialsRef = useRef([]);

  // Interpolation targets
  const smoothMouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(scrollY);

  useEffect(() => { scrollRef.current = scrollY; }, [scrollY]);
  useEffect(() => {
    targetMouse.current = { x: mousePos.x, y: mousePos.y };
  }, [mousePos]);

  const init = useCallback(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);

    // WebGL Renderer (Strictly transparent background)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(maxDpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Pulled WAY back (z: 11) to prevent the disk from clipping the canvas edges
    camera.position.set(0, 2.5, 11.0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 1. EVENT HORIZON: Pure black 3D sphere
    const sphereGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: true,
      depthTest: true
    });
    const blackHole = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(blackHole);

    // 2. ACCRETION DISK: 3D Ring on XZ plane
    const diskGeo = new THREE.RingGeometry(1.08, 4.8, 256, 64);
    diskGeo.rotateX(-Math.PI / 2);

    const diskMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fragmentShaderDisk,
      uniforms: {
        uTime: { value: 0 },
        uCameraPos: { value: camera.position }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Prevent self-occlusion artifacts amongst glowing plasma
      depthTest: true,   // Hide cleanly behind the front of the black sphere
      side: THREE.DoubleSide
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    scene.add(disk);
    materialsRef.current.push(diskMat);

    // 3. GRAVITATIONAL LENSING HALO ("Einstein Ring")
    // Expanding the ring slightly to properly envelop the event horizon
    const haloGeo = new THREE.RingGeometry(1.0, 2.2, 128, 32);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fragmentShaderHalo,
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      side: THREE.FrontSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    // Push directly behind the center point so it literally wraps the back of the sphere
    halo.position.set(0, 0, -0.3);
    scene.add(halo);
    materialsRef.current.push(haloMat);

    // 4. 3D STARFIELD
    const { mesh: starFieldMesh, material: starFieldMat } = createStarField(1500);
    scene.add(starFieldMesh);
    materialsRef.current.push(starFieldMat);

    // 5. 3D FOREGROUND PARTICLES (Dust)
    const { mesh: particlesMesh, material: particlesMat } = createSpaceParticles(400);
    scene.add(particlesMesh);
    materialsRef.current.push(particlesMat);

    // 6. 3D NEBULA (Ambient Environment glow)
    const nebulaGeo = new THREE.PlaneGeometry(35, 35);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x081a33, // Deep space blue/cyan base
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula.position.z = -15; // Deep behind everything
    scene.add(nebula);
    materialsRef.current.push(nebulaMat);

    // 7. AMBIENT WARM LIGHTING
    const pointLight = new THREE.PointLight(0xff7700, 2.0, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    clockRef.current = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const elapsed = clockRef.current.getElapsedTime();
      diskMat.uniforms.uTime.value = elapsed;
      haloMat.uniforms.uTime.value = elapsed;
      starFieldMat.uniforms.uTime.value = elapsed;
      particlesMat.uniforms.uTime.value = elapsed;

      // Mouse Parallax 
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * 0.05;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * 0.05;

      const baseCamY = 2.5;
      const baseCamZ = 11.0;
      const scrollZ = Math.min(scrollRef.current / 300, 2.0); // scroll brings camera slightly closer

      camera.position.x = smoothMouse.current.x * 1.5;
      camera.position.y = baseCamY + smoothMouse.current.y * 1.2;
      camera.position.z = baseCamZ - scrollZ;
      camera.lookAt(0, 0, 0);

      diskMat.uniforms.uCameraPos.value.copy(camera.position); // sync doppler to new camera pos

      // Always keep the Lensing Halo perfectly flat facing the camera for the optical illusion
      halo.lookAt(camera.position);

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const container = mountRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      if (!container || !renderer || !camera) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const isMobile = window.innerWidth < 768;
      const maxDpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);

      renderer.setPixelRatio(maxDpr);
      renderer.setSize(width, height);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    init();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      const renderer = rendererRef.current;
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      materialsRef.current.forEach(mat => mat.dispose());
      if (sceneRef.current) {
        sceneRef.current.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
        });
      }
    };
  }, [init]);

  return (
    <div
      ref={mountRef}
      className="blackhole-canvas-container"
    />
  );
}
