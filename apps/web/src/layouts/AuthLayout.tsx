import { Outlet, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Grid } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { useGLTF } from '@react-three/drei';

/* ─────────────────────────────────────────────────────────
   3-D Brand Truck loaded from GLB
───────────────────────────────────────────────────────── */
function TruckModel({ dark }: { dark: boolean }) {
  const { scene } = useGLTF('/truck.glb');
  const brandColor = dark ? '#004a85' : '#0066B3';

  // Apply brand color to the truck body meshes
  useEffect(() => {
    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const name = mesh.name.toLowerCase();
        
        // Avoid coloring wheels and glass so they retain their original look
        if (!name.includes('wheel') && !name.includes('tire') && !name.includes('glass')) {
          if (mat && mat.color) {
            mat.color = new THREE.Color(brandColor);
          }
        }
      }
    });
  }, [scene, brandColor]);

  return (
    <group position={[0, -0.6, 0]} rotation={[0, -0.5, 0]}>
      <primitive object={scene} scale={1.8} />
    </group>
  );
}

useGLTF.preload('/truck.glb');

/* ─────────────────────────────────────────────────────────
   Full 3D Scene
───────────────────────────────────────────────────────── */
function Scene({ dark }: { dark: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.65 : 1.5} color="#d0e8ff" />
      <directionalLight position={[8, 12, 6]} intensity={dark ? 2.0 : 3.5} color="#ffffff" castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-6, 4, -4]} intensity={dark ? 0.55 : 1.2} color="#aaccff" />
      <pointLight position={[0, 6, 0]} intensity={0.5} color="#4488ff" />
      <pointLight position={[0, -0.3, 0]} intensity={1.0} color="#0066B3" distance={9} />

      <Grid
        position={[0, -0.53, 0]}
        args={[30, 30]}
        cellSize={0.8}
        cellThickness={0.4}
        cellColor={dark ? "#1a3a6a" : "#cce0f5"}
        sectionSize={4}
        sectionThickness={0.8}
        sectionColor={dark ? "#0066B3" : "#88b3d9"}
        fadeDistance={18}
        fadeStrength={2.5}
        infiniteGrid
      />

      <Float speed={0.8} rotationIntensity={0.06} floatIntensity={0.3}>
        <TruckModel dark={dark} />
      </Float>

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={5}
        maxDistance={18}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.52}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   AuthLayout — main export
───────────────────────────────────────────────────────── */
export function AuthLayout() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const dark = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false;

  const leftBg = dark 
    ? 'linear-gradient(135deg, #060e1a 0%, #0a1628 50%, #060e1a 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)';
  const rightBg = dark ? '#0b1120' : '#ffffff';
  const rightBorder = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,102,179,0.08)';
  const brandText = dark ? '#ffffff' : '#003d80';
  const taglineText = dark ? '#ffffff' : '#003d80';
  const taglineSub = dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,50,120,0.6)';
  const linkColor = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,50,120,0.5)';
  const linkHover = dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,50,120,0.9)';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Outfit', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ══ LEFT PANEL — 3D Truck Viewer ═══════════════════ */}
      <div
        style={{
          width: '60%',
          position: 'relative',
          overflow: 'hidden',
          background: leftBg,
          flexShrink: 0,
        }}
        className="auth-left-panel"
      >
        {/* 3D Canvas fills the entire left panel */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Canvas
            camera={{ position: [8, 3.5, 6], fov: 42 }}
            shadows
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
            }}
          >
            <Suspense fallback={null}>
              <Scene dark={dark} />
            </Suspense>
          </Canvas>
        </div>

        {/* Centre radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 55%, rgba(0,102,179,0.14) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 2 }} />

        {/* Branding Overlay */}
        <div style={{ position: 'absolute', top: 40, left: 48, zIndex: 3 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0066B3 0%, #003d80 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,102,179,0.25)'
            }}>
              <Truck size={24} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: brandText, letterSpacing: '-0.03em' }}>
              TransitOps
            </span>
          </Link>
        </div>

        <div style={{ position: 'absolute', bottom: 48, left: 48, zIndex: 3, maxWidth: 500 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: taglineText, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Command Your Fleet <br/>With Precision
            </h2>
            <p style={{ fontSize: '1.1rem', color: taglineSub, lineHeight: 1.6, fontWeight: 400 }}>
              The enterprise-grade platform for real-time monitoring, intelligent maintenance, and global logistics orchestration.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Auth Forms ═══════════════════════ */}
      <div style={{
        width: '40%',
        background: rightBg,
        borderLeft: rightBorder,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%' }}>
          <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem'
        }}>
          <div style={{ color: linkColor, fontWeight: 500 }}>
            © 2026 TransitOps Enterprise
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: linkColor, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = linkHover} onMouseOut={e => e.currentTarget.style.color = linkColor}>Support</a>
            <a href="#" style={{ color: linkColor, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = linkHover} onMouseOut={e => e.currentTarget.style.color = linkColor}>Privacy</a>
            <a href="#" style={{ color: linkColor, textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = linkHover} onMouseOut={e => e.currentTarget.style.color = linkColor}>Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
