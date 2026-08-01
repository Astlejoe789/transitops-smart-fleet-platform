import { Suspense, lazy, useState, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

// Lazy load the 3D scene to ensure it doesn't block initial page render
const CommandCenterScene = lazy(() => import('./CommandCenterScene'));

class WebGLErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("WebGL Context Lost or Render Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function HeroScene() {
  // Start with a max DPR of 1.5 for performance, downgrade to 1 if framerate drops
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <WebGLErrorBoundary 
        fallback={
          <div className="absolute inset-0 bg-[#030712] flex items-center justify-center text-surface-500 text-[13px] font-medium border-t border-surface-800">
            {/* Fallback for devices that completely fail to initialize WebGL */}
            <div className="flex items-center gap-3 bg-surface-900/50 px-4 py-2 rounded-lg border border-surface-800">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Interactive 3D Experience Unavailable
            </div>
          </div>
        }
      >
        <Suspense 
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[#030712]">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(14,165,233,0.3)]" />
            </div>
          }
        >
          <Canvas 
            shadows 
            dpr={dpr} 
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            // We attach events to the document body or root so parallax works even if UI overlays the canvas
            eventSource={typeof document !== 'undefined' ? document.getElementById('root') || document.body : undefined}
            eventPrefix="client"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <PerformanceMonitor onDecline={() => setDpr(1)} />
            <CommandCenterScene />
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>
    </div>
  );
}
