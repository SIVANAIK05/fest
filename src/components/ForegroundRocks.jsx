import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ForegroundRocks = () => {
  const rocksRef = useRef(null);

  useEffect(() => {
    const rocksGroup = new THREE.Group();

    // Create several foreground rocks
    const rockCount = 15;

    for (let i = 0; i < rockCount; i++) {
      // Choose between icosahedron and dodecahedron for variety
      const useIcosahedron = Math.random() > 0.5;
      const radius = 5 + Math.random() * 15;
      const detail = 2;

      let geometry;
      if (useIcosahedron) {
        geometry = new THREE.IcosahedronGeometry(radius, detail);
      } else {
        geometry = new THREE.DodecahedronGeometry(radius, detail);
      }

      // Displace vertices to make irregular
      const positions = geometry.attributes.position.array;
      for (let j = 0; j < positions.length; j += 3) {
        // Add noise to each vertex
        const offset = (Math.random() - 0.5) * radius * 0.3;
        positions[j] += offset;
        positions[j + 1] += offset;
        positions[j + 2] += offset;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Create dark rocky material
      const material = new THREE.MeshStandardMaterial({
        color: 0x080808,
        roughness: 0.95,
        metalness: 0.05,
        flatShading: true
      });

      const rock = new THREE.Mesh(geometry, material);

      // Position rocks in foreground terrain area
      rock.position.x = (Math.random() - 0.5) * 300;
      rock.position.y = -20 + Math.random() * 30; // Near ground level
      rock.position.z = (Math.random() - 0.5) * 200 - 100; // Vary depth

      // Random rotation
      rock.rotation.x = Math.random() * Math.PI;
      rock.rotation.y = Math.random() * Math.PI;
      rock.rotation.z = Math.random() * Math.PI;

      // Random scale variation
      const scale = 0.8 + Math.random() * 0.4;
      rock.scale.set(scale, scale, scale);

      rocksGroup.add(rock);
    }

    rocksRef.current = rocksGroup;
    return rocksGroup;
  }, []);

  // Animation method
  const tick = () => {
    if (rocksRef.current) {
      // Very slow rotation for parallax effect
      rocksRef.current.rotation.y += 0.00002;
    }
  };

  return null; // Added to scene in parent
};

export default ForegroundRocks ;