import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

const StarField = forwardRef((props, ref) => {
  const pointsRef = useRef(null);

  useEffect(() => {
    // Create starfield geometry
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      // Size (0.5 to 3)
      sizes[i] = Math.random() * 2.5 + 0.5;

      // Color (white, blue-white, cyan)
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
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
          gl_PointSize = size * ( 300.0 / -mvPosition.z );
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

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;

    return () => {
      if (points) {
        points.geometry.dispose();
        points.material.dispose();
      }
    };
  }, []);

  // Animation method for twinkling
  const tick = () => {
    if (pointsRef.current && pointsRef.current.geometry) {
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        // Very subtle movement for parallax effect
        positions[i] += (Math.random() - 0.5) * 0.01;
        positions[i + 1] += (Math.random() - 0.5) * 0.01;
        positions[i + 2] += (Math.random() - 0.5) * 0.01;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  };

  useImperativeHandle(ref, () => ({
    object: pointsRef.current,
    tick: tick
  }));

  return null;
});

export default StarField ;