import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Nebula = () => {
  const nebulaRef = useRef(null);

  useEffect(() => {
    // Create nebula using multiple layered planes with noise textures
    const nebulaGroup = new THREE.Group();

    // Create several nebula clouds
    for (let i = 0; i < 8; i++) {
      const size = 200 + Math.random() * 300;
      const geometry = new THREE.PlaneGeometry(size, size, 32, 32);

      // Create noise-based texture for nebula
      const texture = createNebulaTexture();

      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_texture: { value: texture },
          u_color1: { value: new THREE.Color(0x000810) }, // deep navy
          u_color2: { value: new THREE.Color(0x001a33) }, // dark cyan
          u_color3: { value: new THREE.Color(0x00332a) }, // teal
          u_color4: { value: new THREE.Color(0x1a0033) }, // subtle purple
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
          uniform sampler2D u_texture;
          uniform vec3 u_color1;
          uniform vec3 u_color2;
          uniform vec3 u_color3;
          uniform vec3 u_color4;
          varying vec2 vUv;

          void main() {
            // Sample noise texture
            float noise = texture2D(u_texture, vUv).r;

            // Add time-based animation
            float animatedNoise = noise + sin(vUv.x * 10.0 + u_time * 0.1) * 0.1;
            animatedNoise += sin(vUv.y * 8.0 + u_time * 0.15) * 0.1;

            // Color blending based on noise
            vec3 color = mix(u_color1, u_color2, animatedNoise);
            color = mix(color, u_color3, animatedNoise * 0.7);
            color = mix(color, u_color4, animatedNoise * 0.3);

            // Add some variation
            float variation = sin(vUv.x * 50.0 + u_time) * sin(vUv.y * 50.0 + u_time * 1.3) * 0.2;
            color += variation;

            // Alpha based on noise for transparency
            float alpha = smoothstep(0.3, 0.8, animatedNoise);

            gl_FragColor = vec4(color, alpha * 0.6);
          }
        `,
        transparent: true,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      // Position nebula in background
      mesh.position.x = (Math.random() - 0.5) * 1000;
      mesh.position.y = (Math.random() - 0.5) * 500 + 200; // Higher up
      mesh.position.z = (Math.random() - 0.5) * 800 - 400; // Further back
      mesh.rotation.x = Math.random() * Math.PI * 0.5;
      mesh.rotation.y = Math.random() * Math.PI * 0.5;
      mesh.rotation.z = Math.random() * Math.PI * 0.5;

      nebulaGroup.add(mesh);
    }

    nebulaRef.current = nebulaGroup;
    return nebulaGroup;

    // Function to create procedural noise texture
    function createNebulaTexture() {
      const size = 256;
      const data = new Uint8Array(4 * size * size);

      // Generate Perlin-like noise
      for (let i = 0; i < size * size; i++) {
        const x = (i % size) / size;
        const y = Math.floor(i / size) / size;

        // Simple noise function
        let noise = 0;
        noise += Math.sin(x * 10.0 + y * 5.0) * 0.5;
        noise += Math.sin(x * 20.0 - y * 10.0) * 0.3;
        noise += Math.sin(x * 5.0 + y * 20.0) * 0.2;
        noise = (noise + 1.0) / 2.0; // Normalize to 0-1

        const brightness = Math.floor(noise * 255);
        const offset = i * 4;
        data[offset] = brightness;     // R
        data[offset + 1] = brightness; // G
        data[offset + 2] = brightness; // B
        data[offset + 3] = 255;        // A
      }

      const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
      texture.needsUpdate = true;
      return texture;
    }
  }, []);

  // Animation method
  const tick = () => {
    if (nebulaRef.current) {
      // Slow rotation of nebula group
      nebulaRef.current.rotation.y += 0.0005;
      nebulaRef.current.rotation.x += 0.0002;
    }
  };

  return null; // The actual nebula is added to scene in parent component
};

export default Nebula ;