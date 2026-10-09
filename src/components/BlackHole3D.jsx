import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BlackHole3D = () => {
  const blackHoleGroupRef = useRef(null);
  const tickRef = useRef(null);

  useEffect(() => {
    const group = new THREE.Group();
    group.position.set(0, 100, -500);

    // Event Horizon
    const horizonGeometry = new THREE.SphereGeometry(50, 32, 32);
    const horizonMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    group.add(eventHorizon);

    // Accretion Disk
    const createAccretionDisk = () => {
      const segments = 64;
      const rings = 32;
      const innerRadius = 60;
      const outerRadius = 180;
      const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, rings);
      geometry.rotateX(-Math.PI / 2);

      // Create noise texture for plasma
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_innerRadius: { value: innerRadius },
          u_outerRadius: { value: outerRadius },
          u_texture: { value: texture },
          u_rotationSpeedInner: { value: 0.002 },
          u_rotationSpeedOuter: { value: 0.0005 },
          u_dopplerAmount: { value: 0.3 },
          u_lensingAmount: { value: 0.2 },
          u_photonRingThreshold: { value: 0.95 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normal;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float u_time;
          uniform float u_innerRadius;
          uniform float u_outerRadius;
          uniform sampler2D u_texture;
          uniform float u_rotationSpeedInner;
          uniform float u_rotationSpeedOuter;
          uniform float u_dopplerAmount;
          uniform float u_lensingAmount;
          uniform float u_photonRingThreshold;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            vec2 centeredUv = vUv * 2.0 - 1.0;
            float radius = length(centeredUv) * (u_outerRadius - u_innerRadius) + u_innerRadius;
            float angle = atan(centeredUv.y, centeredUv.x);

            float rotationMix = smoothstep(u_innerRadius, u_outerRadius, radius);
            float rotationSpeed = mix(u_rotationSpeedOuter, u_rotationSpeedInner, rotationMix);
            angle += u_time * rotationSpeed;

            float lensingFactor = u_lensingAmount * (u_outerRadius - radius) / (u_outerRadius - u_innerRadius);
            angle += sin(angle * 3.0 + u_time * 0.5) * lensingFactor;

            vec2 distortedUv = vec2(
              cos(angle) * (radius - u_innerRadius) / (u_outerRadius - u_innerRadius),
              sin(angle) * (radius - u_innerRadius) / (u_outerRadius - u_innerRadius)
            );

            vec4 noise = texture2D(u_texture, distortedUv);

            vec3 plasmaColor = mix(
              vec3(0.4, 0.1, 0.0),
              vec3(1.0, 0.8, 0.2),
              noise.r
            );

            float doppler = cos(angle - u_time * 0.1) * 0.5 + 0.5;
            plasmaColor *= mix(vec3(1.0), vec3(1.3, 1.1, 0.9), doppler * u_dopplerAmount);

            float photonRing = smoothstep(u_photonRingThreshold - 0.02, u_photonRingThreshold + 0.02, radius / u_outerRadius);
            plasmaColor += vec3(1.0, 0.9, 0.6) * photonRing * 0.8;

            plasmaColor += noise.g * 0.2;

            float alpha = smoothstep(u_innerRadius - 5.0, u_innerRadius, radius) *
                         smoothstep(u_outerRadius, u_outerRadius + 5.0, radius);
            alpha *= 0.8;

            gl_FragColor = vec4(plasmaColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const disk = new THREE.Mesh(geometry, material);
      disk.rotation.x = Math.PI / 2 - 0.3;
      disk.rotation.z = Math.PI * 0.2;
      return disk;
    };

    const accretionDisk = createAccretionDisk();
    group.add(accretionDisk);

    // Photon Ring
    const createPhotonRing = () => {
      const radius = 120;
      const geometry = new THREE.RingGeometry(radius - 2, radius + 2, 64);
      geometry.rotateX(-Math.PI / 2);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_glowColor: { value: new THREE.Color(0xffcc66) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float u_time;
          uniform vec3 u_glowColor;
          varying vec2 vUv;
          void main() {
            float distance = length(vUv * 2.0 - 1.0);
            float glow = smoothstep(0.45, 0.5, distance);
            glow = sin(u_time * 2.0) * 0.5 + 0.5;
            gl_FragColor = vec4(u_glowColor * glow, 0.8);
          }
        `,
        transparent: true,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2 - 0.3;
      ring.rotation.z = Math.PI * 0.2;
      return ring;
    };

    const photonRing = createPhotonRing();
    group.add(photonRing);

    // Orbiting Particles
    const createParticleSystem = () => {
      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const radius = 100 + Math.random() * 150;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 20;

        positions[i * 3] = radius * Math.cos(angle);
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = radius * Math.sin(angle);

        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;

        sizes[i] = Math.random() * 2 + 1;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( 100.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float intensity = length(gl_PointCoord - vec2(0.5));
            if (intensity > 0.5) discard;
            gl_FragColor = vec4(vColor, 1.0);
          }
        `,
        transparent: true,
      });

      const particles = new THREE.Points(geometry, material);
      particles.userData = { rotationSpeed: 0.0003 };
      return particles;
    };

    const particleSystem = createParticleSystem();
    group.add(particleSystem);

    // Point Light for illumination
    const pointLight = new THREE.PointLight(0xff6600, 2, 1000, 2);
    pointLight.position.set(0, 100, -500);
    group.add(pointLight);

    // Assign group ref
    blackHoleGroupRef.current = group;

    // Define tick function
    const tick = () => {
      if (accretionDisk && accretionDisk.material && accretionDisk.material.uniforms) {
        accretionDisk.material.uniforms.u_time.value += 0.016;
      }
      if (photonRing && photonRing.material && photonRing.material.uniforms) {
        photonRing.material.uniforms.u_time.value += 0.016;
      }
      if (particleSystem) {
        particleSystem.rotation.y += particleSystem.userData.rotationSpeed;
        particleSystem.rotation.x += particleSystem.userData.rotationSpeed * 0.5;
      }
    };

    tickRef.current = tick;

    // Return cleanup function
    return () => {
      if (group) {
        group.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(m => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // We don't render anything directly; the group is added to the scene by the parent.
  return null;
};

export default BlackHole3D ;