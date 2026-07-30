import { Outlet } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen font-sans bg-[#030712]">
      {/* Left Column (Promotional 60%) - Hidden on small screens */}
      <div className="hidden lg:flex w-[60%] flex-col justify-between relative overflow-hidden">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/auth-bg.png')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#030712]/90 via-[#0B1426]/70 to-[#030712]/80" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #94a3b82a 1px, transparent 1px), linear-gradient(to bottom, #94a3b82a 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary-500/8 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        
        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3.5 px-14 pt-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-600/20">
            <Truck className="h-6 w-6" />
          </div>
          <span className="text-[20px] font-bold tracking-tight text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
            TransitOps
          </span>
        </div>

        {/* Hero Content — centered text */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[34px] font-bold tracking-tight text-white leading-[1.15] mb-3 max-w-lg text-center"
            style={{ fontFamily: 'Outfit, Inter, sans-serif' }}
          >
            The operations console for modern fleets.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[15px] text-surface-300 leading-relaxed max-w-md text-center"
          >
            Dispatch with confidence, track every asset, and keep an auditable trail across trips, maintenance, fuel, and compliance.
          </motion.p>
        </div>

        {/* Floating Cards — scattered across the whole left panel */}
        {/* Top-left area */}
        <motion.div 
          animate={{ y: [0, -12, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute z-10 left-[8%] top-[18%] rounded-[16px] border border-surface-700/40 bg-surface-900/70 backdrop-blur-md px-5 py-4 shadow-xl w-[160px]"
        >
          <div className="text-[11px] text-surface-400 mb-1 font-medium">Active Trips</div>
          <div className="text-[20px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>1,204</div>
        </motion.div>

        {/* Top-right area */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.8 }}
          className="absolute z-10 right-[10%] top-[14%] rounded-[16px] border border-surface-700/40 bg-surface-900/70 backdrop-blur-md px-5 py-4 shadow-xl w-[160px]"
        >
          <div className="text-[11px] text-surface-400 mb-1 font-medium">On-time Rate</div>
          <div className="text-[20px] font-bold text-accent-400" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>98.2%</div>
        </motion.div>

        {/* Middle-left area */}
        <motion.div 
          animate={{ x: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }}
          className="absolute z-10 left-[5%] top-[52%] rounded-[16px] border border-primary-700/30 bg-primary-950/50 backdrop-blur-md px-5 py-4 shadow-xl w-[160px]"
        >
          <div className="text-[11px] text-surface-400 mb-1 font-medium">Fleet Revenue</div>
          <div className="text-[20px] font-bold text-success" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>$45.2k</div>
        </motion.div>

        {/* Middle-right area */}
        <motion.div 
          animate={{ y: [0, -10, 0], x: [0, -5, 0] }} 
          transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.3 }}
          className="absolute z-10 right-[6%] top-[48%] rounded-[16px] border border-surface-700/40 bg-surface-900/70 backdrop-blur-md px-5 py-4 shadow-xl w-[160px]"
        >
          <div className="text-[11px] text-surface-400 mb-1 font-medium">Active Vehicles</div>
          <div className="text-[20px] font-bold text-primary-400" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>89 / 94</div>
        </motion.div>

        {/* Bottom-left area */}
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
          className="absolute z-10 left-[15%] bottom-[18%] rounded-[16px] border border-surface-700/40 bg-surface-900/70 backdrop-blur-md px-5 py-4 shadow-xl w-[160px]"
        >
          <div className="text-[11px] text-surface-400 mb-1 font-medium">Fuel Saved</div>
          <div className="text-[20px] font-bold text-warning" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>12.4%</div>
        </motion.div>

        {/* Bottom-right area */}
        <motion.div 
          animate={{ y: [0, -9, 0], x: [0, 6, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.2 }}
          className="absolute z-10 right-[12%] bottom-[14%] rounded-[16px] border border-accent-500/20 bg-surface-900/70 backdrop-blur-md px-5 py-4 shadow-xl w-[160px]"
        >
          <div className="text-[11px] text-surface-400 mb-1 font-medium">Maintenance Score</div>
          <div className="text-[20px] font-bold text-accent-400" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>A+</div>
        </motion.div>

        {/* Footer */}
        <div className="relative z-10 flex gap-6 text-[13px] text-surface-500 p-12">
          <span className="hover:text-surface-300 transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-surface-300 transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-surface-300 transition-colors cursor-pointer">Support</span>
        </div>
      </div>

      {/* Right Column (Form Container 40%) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[#030712] border-l border-surface-800/30">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
