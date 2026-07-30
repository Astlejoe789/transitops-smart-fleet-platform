import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Bell, Lock, LineChart, Wrench } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-full flex-1 bg-[#030712] overflow-hidden rounded-tl-2xl py-12">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-900/20 rounded-full border-dashed pointer-events-none opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute left-[15%] top-[40%] animate-pulse duration-3000 hidden md:block">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-900/40 border border-primary-900/50 backdrop-blur-md">
          <LineChart className="w-8 h-8 text-primary-500" />
        </div>
      </div>
      <div className="absolute right-[15%] top-[40%] animate-pulse duration-3000 delay-1000 hidden md:block">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-900/40 border border-primary-900/50 backdrop-blur-md">
          <Wrench className="w-8 h-8 text-primary-500" />
        </div>
      </div>

      {/* Main Illustration */}
      <div className="relative z-10 mb-8 max-w-lg w-full px-8 flex justify-center">
        <img 
          src="/truck-illustration.png" 
          alt="3D Truck" 
          className="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.1))' }}
        />
        {/* Glow under the truck */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 max-w-[300px] h-4 bg-primary-500/20 blur-xl rounded-full" />
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[80%] max-w-[320px] h-[20px] border border-primary-500/30 rounded-[100%] opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-4 mt-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-950/50 border border-primary-900/50 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-[11px] font-bold tracking-wider text-primary-400 uppercase">
            Feature Coming Soon
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Module Unavailable
        </h1>
        
        {/* Subtitle */}
        <p className="text-[15px] text-surface-400 leading-relaxed mb-10 max-w-md">
          We&apos;re building something powerful to help you manage your fleet operations — all in one place. This page is currently not available.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg border border-surface-700/60 bg-[#0B1426]/80 text-sm font-semibold text-white hover:bg-surface-800 transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary-600 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Notify Me
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-surface-500 text-xs mt-auto">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure. Reliable. Built for modern fleets.</span>
        </div>

      </div>
    </div>
  );
}
