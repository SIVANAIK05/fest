import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SpaceDust = () => {
  const dustRef = useRef(null);

  useEffect(() => {
    // Create multiple layers of dust for depth
    const dustGroup = new THREE.Group();

    // Create 3 layers: near, medium, far
    const layers = [
      { count: 150, sizeRange: [0.5, 2], zRange: [-200, 200], speed: 0.0005 },
      { count: 300, sizeRange: [0.2, 0.8], zRange: [-500, 500], speed: 0.0003 },
      { count: 500, sizeRange: [0.1, 0.4], zRange: [-1000, 1000], speed: 0.0001 }
    ];

    layers.forEach((layer, layerIndex) => {
      const { count, sizeRange, zRange, speed } = layer;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 2000; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600 + 100; // y (some height)
        positions[i * 3 + 2] = (Math.random() - 0.5) * (zRange[1] - zRange[0]) + zRange[0]; // z

        // Size
        sizes[i] = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];

        // Color (mostly white with slight variations)
        const colorChoice = Math.random();
        if (colorChoice < 0.8) {
          // White
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.9) {
          // Blue-white
          colors[i * 3] = 0.8;
          colors[i * 3 + 1] = 0.9;
          colors[i * 3 + 2] = 1;
        } else {
          // Cyan
          colors[i * 3] = 0.6;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 0.9;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

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

      const dustLayer = new THREE.Points(geometry, material);
      dustLayer.userData = { speed };
      dustGroup.add(dustLayer);
    });

    dustRef.current = dustGroup;

    return () => {
      if (dustGroup) {
        dustGroup.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) object.material.dispose();
        });
      }
    };
  }, []);

  // Animation method
  const tick = () => {
    if (dustRef.current) {
      dustRef.current.traverse((object) => {
        if (object.userData && object.userData.speed) {
          // Slow drift for parallax
          object.rotation.y += object.userData.speed;
          object.rotation.x += object.userData.speed * 0.5;
        }
      });
    }
  };

  return null; // Added to scene in parent
};

export default SpaceDust ;