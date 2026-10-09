import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const DistantPlanets = () => {
  const planetsRef = useRef(null);

  useEffect(() => {
    const planetsGroup = new THREE.Group();

    // Create several distant planets/moons
    const planetCount = 8;

    for (let i = 0; i < planetCount; i++) {
      // Create planet
      const radius = 2 + Math.random() * 8; // Small planets/moons
      const geometry = new THREE.SphereGeometry(radius, 32, 32);

      // Some planets have atmosphere
      const hasAtmosphere = Math.random() > 0.7;
      let material;

      if (hasAtmosphere) {
        // Atmospheric planet
        material = new THREE.ShaderMaterial({
          uniforms: {
            u_time: { value: 0 },
            u_radius: { value: radius },
            u_color: { value: new THREE.Color(0x003366) }, // Blue atmosphere
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float u_time;
            uniform float u_radius;
            uniform vec3 u_color;
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
              // Atmospheric scattering
              float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
              vec3 atmosphereColor = u_color * intensity * 0.3;

              // Base color (dark)
              vec3 baseColor = vec3(0.1, 0.1, 0.2);

              // Rim light
              float rim = pow(0.5 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
              vec3 rimColor = vec3(0.8, 0.9, 1.0) * rim * 0.5;

              gl_FragColor = vec4(baseColor + atmosphereColor + rimColor, 1.0);
            }
          `,
          transparent: true,
          depthWrite: false
        });
      } else {
        // Rocky planet/dark moon
        material = new THREE.MeshStandardMaterial({
          color: 0x0a0a0a,
          roughness: 0.9,
          metalness: 0.05
        });
      }

      const planet = new THREE.Mesh(geometry, material);

      // Position planets far away in the background
      planet.position.x = (Math.random() - 0.5) * 2000;
      planet.position.y = (Math.random() - 0.5) * 500 + 100; // Some height variation
      planet.position.z = (Math.random() - 0.5) * 1500 - 800; // Far back

      // Slow rotation
      planet.userData.rotationSpeed = (Math.random() - 0.5) * 0.002;

      planetsGroup.add(planet);
    }

    planetsRef.current = planetsGroup;
    return planetsGroup;
  }, []);

  // Animation method
  const tick = () => {
    if (planetsRef.current) {
      planetsRef.current.traverse((object) => {
        if (object.isMesh && object.userData.rotationSpeed) {
          object.rotation.y += object.userData.rotationSpeed;
          object.rotation.x += object.userData.rotationSpeed * 0.5;
        }
      });
    }
  };

  return null; // Added to scene in parent
};

export default DistantPlanets ;