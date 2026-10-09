import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AlienTerrain = () => {
  const terrainRef = useRef(null);

  useEffect(() => {
    // Create a large plane for terrain
    const size = 2000;
    const segments = 256;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Rotate to be horizontal

    // Displace vertices using noise
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];

      // Use noise to create mountains and valleys
      const noise =
        Math.sin(x * 0.005) * Math.cos(z * 0.005) * 50 +
        Math.sin(x * 0.01) * Math.cos(z * 0.015) * 30 +
        Math.sin(x * 0.02) * Math.cos(z * 0.01) * 20;

      positions[i + 1] = noise; // Y axis (height)
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Create material - dark rocky
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.position.y = -50; // Slightly below origin
    terrainRef.current = terrain;

    return () => {
      if (terrain) {
        terrain.geometry.dispose();
        terrain.material.dispose();
      }
    };
  }, []);

  // Animation method
  const tick = () => {
    if (terrainRef.current) {
      // Very slow movement for parallax
      terrainRef.current.rotation.z += 0.00001;
    }
  };

  return null; // Added to scene in parent
};

export default AlienTerrain ;