import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Float, Grid, QuadraticBezierLine, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Generate some random hubs representing warehouses or cities
const HUBS: [number, number, number][] = [
  [-5, 0, -3],
  [4, 0, -5],
  [-3, 0, 4],
  [5, 0, 3],
  [0, 0, 0], // Central Command
  [-1, 0, -6],
  [6, 0, -1],
];

// Generate routes between hubs (connecting indices)
const ROUTES = [
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [5, 4],
  [6, 4],
  [0, 2],
  [1, 3],
  [5, 0],
  [6, 1],
];

export default function CommandCenterScene() {
  const groupRef = useRef<THREE.Group>(null);
  const routesRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const materials = useMemo(() => {
    return {
      node: new THREE.MeshStandardMaterial({ color: '#0ea5e9', emissive: '#0ea5e9', emissiveIntensity: 2, toneMapped: false }),
      ring: new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
      centralNode: new THREE.MeshStandardMaterial({ color: '#f97316', emissive: '#f97316', emissiveIntensity: 2, toneMapped: false }),
      centralRing: new THREE.MeshBasicMaterial({ color: '#fb923c', transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
    }
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Cinematic slow rotation
      groupRef.current.rotation.y += delta * 0.01;
      
      // Mouse parallax
      const targetX = (pointer.x * Math.PI) / 30;
      const targetY = (pointer.y * Math.PI) / 30;
      
      groupRef.current.rotation.x += 0.05 * (targetY - groupRef.current.rotation.x);
      groupRef.current.rotation.z += 0.05 * (-targetX - groupRef.current.rotation.z);
    }

    if (routesRef.current) {
      // Animate dash offset for all routes to simulate traffic
      routesRef.current.children.forEach((route: any) => {
        if (route.material && route.material.dashOffset !== undefined) {
          // Negative offset moves dashes forward
          route.material.dashOffset -= delta * 0.8;
        }
      });
    }
    
    // Slow camera floating
    state.camera.position.y = 3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 11]} fov={45} />
      
      <color attach="background" args={['#030712']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      
      {/* Cyan Rim Light */}
      <spotLight position={[-10, 5, -5]} intensity={80} color="#06b6d4" distance={50} angle={0.5} penumbra={1} />
      {/* TransitOps Orange Fill Light */}
      <pointLight position={[5, -5, 5]} intensity={40} color="#f97316" distance={30} />
      
      <Environment preset="city" />

      <group ref={groupRef} position={[0, -1.5, 0]}>
        
        {/* Digital Grid representing Global Map */}
        <Grid 
          infiniteGrid 
          fadeDistance={40} 
          sectionColor="#1e293b" 
          cellColor="#0f172a" 
          sectionSize={2}
          cellSize={0.5}
          position={[0, -0.01, 0]} 
        />

        {/* AI Data Nodes */}
        {HUBS.map((pos, i) => {
          const isCentral = i === 4;
          return (
            <group key={i} position={new THREE.Vector3(...pos)}>
              <Sphere args={[isCentral ? 0.15 : 0.08, 16, 16]} material={isCentral ? materials.centralNode : materials.node} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <ringGeometry args={[isCentral ? 0.25 : 0.15, isCentral ? 0.3 : 0.2, 32]} />
                <primitive object={isCentral ? materials.centralRing : materials.ring} attach="material" />
              </mesh>
            </group>
          );
        })}

        {/* Glowing Route Lines */}
        <group ref={routesRef}>
          {ROUTES.map(([startIdx, endIdx], i) => {
            const start = new THREE.Vector3(...HUBS[startIdx]);
            const end = new THREE.Vector3(...HUBS[endIdx]);
            const mid = start.clone().lerp(end, 0.5);
            const distance = start.distanceTo(end);
            mid.y += distance * 0.2; // Arc height proportional to distance

            return (
              <QuadraticBezierLine
                key={i}
                start={start}
                end={end}
                mid={mid}
                color={endIdx === 4 || startIdx === 4 ? "#f97316" : "#0ea5e9"}
                lineWidth={1.5}
                dashed={true}
                dashScale={distance * 2}
                dashSize={0.5}
                dashOffset={Math.random() * 10} // Random initial offset
                transparent
                opacity={0.6}
              />
            );
          })}
        </group>

        {/* Dashboard Preview Overlay (Floating UI) */}
        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5} position={[3, 2.5, -2]}>
          <Html 
            transform 
            distanceFactor={6}
            position={[0, 0, 0]}
            rotation={[0, -0.2, 0]}
            className="pointer-events-none select-none"
          >
            <div className="w-[340px] bg-[#0B1426]/80 backdrop-blur-xl border border-surface-700/50 rounded-2xl p-5 shadow-2xl shadow-primary-500/10 text-white">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] text-surface-400 font-semibold uppercase tracking-wider">AI Copilot</div>
                    <div className="text-lg font-bold text-white leading-tight">Optimizing</div>
                  </div>
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-bold text-emerald-400 tracking-wide">
                  99.8% EFFICIENCY
                </div>
              </div>
              
              <div className="space-y-2.5">
                {[
                  { id: 'TRK-8042', route: 'NY → LA', status: 'On Route', color: 'emerald', progress: '65%' },
                  { id: 'TRK-8043', route: 'CHI → MIA', status: 'Charging', color: 'amber', progress: '12%' },
                  { id: 'TRK-8044', route: 'SEA → AUS', status: 'Dispatched', color: 'blue', progress: '0%' }
                ].map((trk, i) => {
                  const getBadgeColor = (c: string) => {
                    if (c === 'emerald') return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
                    if (c === 'amber') return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]';
                    return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]';
                  };
                  const getProgressColor = (c: string) => {
                    if (c === 'emerald') return 'bg-emerald-500';
                    if (c === 'amber') return 'bg-amber-500';
                    return 'bg-blue-500';
                  };
                  
                  return (
                    <div key={i} className="bg-surface-800/40 rounded-xl p-3 flex flex-col gap-2 border border-surface-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getBadgeColor(trk.color)}`} />
                          <div className="text-[12px] font-medium text-white">{trk.id}</div>
                        </div>
                        <div className="text-[11px] text-surface-400">{trk.route}</div>
                      </div>
                      <div className="w-full bg-surface-900 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${getProgressColor(trk.color)}`} style={{ width: trk.progress }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Html>
        </Float>
        
        {/* Additional Floating Data Node */}
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1} position={[-4, 3, 0]}>
          <Html 
            transform 
            distanceFactor={5}
            position={[0, 0, 0]}
            rotation={[0, 0.2, 0]}
            className="pointer-events-none select-none"
          >
             <div className="px-4 py-2 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-full text-blue-300 text-[11px] font-bold tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/10">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
               LIVE TRACKING
             </div>
          </Html>
        </Float>

      </group>
    </>
  );
}
