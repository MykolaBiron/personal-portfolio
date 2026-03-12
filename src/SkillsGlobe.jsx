import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  SiPython, 
  SiTensorflow, 
  SiPytorch, 
  SiPostgresql, 
  SiJavascript, 
  SiReact, 
  SiDocker, 
  SiGit, 
  SiPandas, 
  SiAmazonaws, 
  SiSpringboot 
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

const skillsData = [
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
  { name: 'Java', icon: FaJava, color: '#007396' },
  { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'React.js', icon: SiReact, color: '#61DAFB' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Pandas', icon: SiPandas, color: '#150458' },
  { name: 'AWS', icon: SiAmazonaws, color: '#FF9900' },
  { name: 'SpringBoot', icon: SiSpringboot, color: '#6DB33F' },
];

export default function SkillsGlobe() {
  const mountRef = useRef(null);
  const [positions, setPositions] = useState([]);
  // Fixed size or responsive sizing
  const width = 600;
  const height = 600;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
    }

    // Creating the wireframe sphere based on the screenshot, it's roughly an Icosahedron
    const geometry = new THREE.IcosahedronGeometry(3.5, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4a3a30, // a warm dark bronze/brown as in the design
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Initial sphere points (distributing items evenly on sphere surface)
    const items = skillsData.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / skillsData.length);
      const theta = Math.sqrt(skillsData.length * Math.PI) * phi;
      const r = 4.2; // radius for icons (slightly larger than sphere)
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    });

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate scene slowly
      scene.rotation.y += 0.003;
      scene.rotation.x += 0.001;

      // Project 3D coordinates to 2D
      const newPos = items.map((vec) => {
        const p = vec.clone();
        p.applyMatrix4(scene.matrixWorld);
        
        // Depth logic before projection
        const zDist = p.z; 

        p.project(camera);
        // map from normalized device coordinates to container coordinates
        return {
          x: (p.x * 0.5 + 0.5) * width,
          y: (-(p.y * 0.5) + 0.5) * height,
          z: p.z,
          zDist: zDist, // real world depth
        };
      });

      setPositions(newPos);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: `${width}px`, height: `${height}px`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        ref={mountRef} 
        style={{ 
          position: 'absolute', 
          top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none' 
        }} 
      />
      
      {/* Central icon or text (optional based on design, the user attached image shows GCP or center, let's just make it hollow inside or optional central dot) */}
      
      {positions.length > 0 && positions.map((pos, i) => {
        const ItemIcon = skillsData[i].icon;
        
        // Items fading behind the sphere
        // zDist goes from roughly -4.2 to +4.2
        const isBehind = pos.zDist < -1;
        const opacity = isBehind ? 0.3 : 1;
        // make sure front items appear on top
        const zIndex = isBehind ? 1 : 10;
        
        // Scale elements slightly based on their distance
        const scale = 1 + (pos.zDist / 12); 

        return (
          <div 
            key={i}
            style={{
              position: 'absolute',
              top: pos.y, 
              left: pos.x,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity,
              zIndex: zIndex,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'opacity 0.2s',
              pointerEvents: 'none'
            }}
          >
            <ItemIcon size={48} color={skillsData[i].color} />
            <span style={{ 
              color: '#d9e7ff', 
              fontSize: '0.85rem', 
              fontWeight: 'bold', 
              fontFamily: '"Chivo Mono", monospace',
              marginTop: '8px', 
              textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.8)' 
            }}>
              {skillsData[i].name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
