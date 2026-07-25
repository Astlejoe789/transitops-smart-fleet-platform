import { Outlet } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen font-sans bg-[#09090B]">
      {/* Left Column (Promotional 60%) - Hidden on small screens */}
      <div className="hidden lg:flex w-[60%] flex-col justify-between relative overflow-hidden bg-surface-950 p-12 border-r border-surface-800">
        
        {/* Background Grid & Gradient */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff2a 1px, transparent 1px), linear-gradient(to bottom, #ffffff2a 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        
        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary-500 text-white shadow-sm">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-white">
            TransitOps
          </span>
        </div>

        {/* Hero Content with Floating Cards */}
        <div className="relative z-10 flex flex-col justify-center flex-1 mt-12 pr-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[36px] font-bold tracking-tight text-white leading-tight mb-6 max-w-lg"
          >
            The operations console for modern fleets.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[16px] text-surface-400 leading-relaxed max-w-lg mb-12"
          >
            Dispatch with confidence, track every asset, and keep an auditable trail across trips, maintenance, fuel, and compliance.
          </motion.p>

          {/* Floating Cards Animation */}
          <div className="relative h-[200px] w-full max-w-lg perspective-1000">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute left-0 top-0 rounded-[16px] border border-surface-800 bg-surface-900/80 backdrop-blur p-4 shadow-xl w-[200px]"
            >
              <div className="text-[13px] text-surface-400 mb-1">Active Trips</div>
              <div className="text-[24px] font-bold text-white">1,204</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute left-[180px] top-[40px] rounded-[16px] border border-surface-800 bg-surface-900/80 backdrop-blur p-4 shadow-xl w-[200px]"
            >
              <div className="text-[13px] text-surface-400 mb-1">Fleet Revenue</div>
              <div className="text-[24px] font-bold text-success">$45.2k</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }} 
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute left-[80px] top-[120px] rounded-[16px] border border-surface-800 bg-surface-900/80 backdrop-blur p-4 shadow-xl w-[200px]"
            >
              <div className="text-[13px] text-surface-400 mb-1">Active Vehicles</div>
              <div className="text-[24px] font-bold text-white">89 / 94</div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex gap-6 text-[13px] text-surface-500">
          <span className="hover:text-surface-300 transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-surface-300 transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-surface-300 transition-colors cursor-pointer">Support</span>
        </div>
      </div>

      {/* Right Column (Form Container 40%) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-6 lg:p-12 relative bg-[#09090B]">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
