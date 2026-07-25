import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, Shield, Zap, Map, FileText, 
  Activity, Users, Wrench, BarChart, Github 
} from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: "Fleet Management", desc: "Track every vehicle in real-time." },
  { icon: Map, title: "Trip Planning", desc: "Optimize routes and dispatching." },
  { icon: Users, title: "Driver Management", desc: "Monitor compliance and hours." },
  { icon: Wrench, title: "Maintenance", desc: "Automate service schedules." },
  { icon: Zap, title: "Fuel Tracking", desc: "Monitor consumption and costs." },
  { icon: FileText, title: "Expense Management", desc: "Keep track of operations budget." },
  { icon: Shield, title: "Role Based Access", desc: "Secure platform permissions." },
  { icon: Activity, title: "AI Insights", desc: "Predictive analytics for fleets." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-primary-500/30 font-sans relative overflow-hidden">
      
      {/* 1. Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-[72px] bg-[#09090B]/80 backdrop-blur-md border-b border-surface-800">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary-500 text-white shadow-sm">
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-[16px] font-bold tracking-tight text-white">TransitOps</span>
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-surface-400">
            <span className="hover:text-white cursor-pointer transition-colors">Features</span>
            <span className="hover:text-white cursor-pointer transition-colors">Solutions</span>
            <span className="hover:text-white cursor-pointer transition-colors">Pricing <span className="ml-1 text-[10px] bg-surface-800 px-1.5 py-0.5 rounded text-white">Soon</span></span>
            <span className="hover:text-white cursor-pointer transition-colors">Docs</span>
            <span className="hover:text-white cursor-pointer transition-colors">About</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-[14px] font-semibold text-surface-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/dashboard" className="hidden sm:flex h-[36px] items-center justify-center rounded-[10px] bg-white px-4 text-[14px] font-semibold text-black hover:bg-surface-200 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* 2. Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="max-w-5xl text-[48px] md:text-[64px] font-bold tracking-tight text-white leading-[1.1] mb-6">
            The intelligent operating system for <span className="text-primary-500">modern fleet</span> management.
          </h1>
          <p className="max-w-2xl mx-auto text-[18px] text-surface-400 mb-10 leading-relaxed">
            Run trips, dispatch, maintenance, fuel, and compliance from one place — with a rules engine that explains every decision and a tamper-evident audit log.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/dashboard">
              <button className="h-[48px] px-8 rounded-[10px] bg-primary-500 hover:bg-primary-600 text-[15px] font-semibold text-white transition-all shadow-[0_0_24px_rgba(249,115,22,0.3)] hover:shadow-[0_0_32px_rgba(249,115,22,0.5)]">
                Launch Dashboard
              </button>
            </Link>
            <button className="h-[48px] px-8 rounded-[10px] bg-surface-800 hover:bg-surface-850 text-[15px] font-semibold text-white transition-colors border border-surface-700">
              View Demo
            </button>
          </div>
        </motion.div>

        {/* 5. Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full max-w-5xl mx-auto rounded-[24px] border border-surface-800 bg-surface-900/50 backdrop-blur-xl p-2 shadow-2xl"
        >
          <div className="w-full aspect-[16/9] rounded-[16px] bg-[#111113] border border-surface-800 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center"></div>
            <div className="relative z-10 flex flex-col items-center">
              <BarChart className="h-16 w-16 text-surface-700 mb-4" />
              <span className="text-surface-600 font-medium">Dashboard Interface Preview</span>
            </div>
            
            {/* Floating Elements on Preview */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -left-6 top-12 p-4 rounded-[16px] bg-surface-900 border border-surface-800 shadow-xl hidden md:block">
              <div className="text-[12px] text-surface-400">Total Revenue</div>
              <div className="text-[20px] font-bold text-success">$124,500</div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* 3. Trust Section */}
      <section className="relative z-10 py-16 border-y border-surface-800/50 bg-surface-900/20 text-center overflow-hidden">
        <p className="text-[13px] font-semibold text-surface-500 uppercase tracking-widest mb-8">Trusted Operations Engine For</p>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto px-4">
          {["Fleet Management", "AI Dispatch", "Maintenance", "Fuel", "Analytics", "Invoices", "Payments"].map((badge) => (
            <div key={badge} className="px-4 py-2 rounded-full border border-surface-800 bg-surface-900/50 text-[14px] font-medium text-surface-300">
              {badge}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[36px] font-bold text-white mb-4">Everything you need to run your fleet.</h2>
          <p className="text-[18px] text-surface-400 max-w-2xl mx-auto">A modular suite that grows with your operation — from a two-van shop to a national fleet.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-[16px] border border-surface-800 bg-surface-900/40 hover:bg-surface-800/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-[10px] bg-surface-800 flex items-center justify-center text-primary-500 mb-4">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-[16px] font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-[14px] text-surface-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Statistics */}
      <section className="relative z-10 py-24 border-y border-surface-800/50 bg-[#111113]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-surface-800">
            <div className="text-center">
              <div className="text-[40px] font-bold text-white mb-1">12k+</div>
              <div className="text-[14px] text-surface-400">Vehicles Managed</div>
            </div>
            <div className="text-center">
              <div className="text-[40px] font-bold text-white mb-1">2.4M</div>
              <div className="text-[14px] text-surface-400">Trips Completed</div>
            </div>
            <div className="text-center">
              <div className="text-[40px] font-bold text-white mb-1">98%</div>
              <div className="text-[14px] text-surface-400">On-time Dispatch</div>
            </div>
            <div className="text-center">
              <div className="text-[40px] font-bold text-white mb-1">100%</div>
              <div className="text-[14px] text-surface-400">Audit Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why TransitOps */}
      <section className="relative z-10 py-32 px-8 max-w-5xl mx-auto text-center">
        <h2 className="text-[36px] font-bold text-white mb-12">Enterprise ready from day one.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <Shield className="h-8 w-8 text-primary-500 mx-auto mb-4" />
            <h3 className="text-[18px] font-bold text-white mb-2">Secure & Compliant</h3>
            <p className="text-[14px] text-surface-400">Role-based access controls and hash-chained audit logs ensure your data is always protected.</p>
          </div>
          <div>
            <Zap className="h-8 w-8 text-primary-500 mx-auto mb-4" />
            <h3 className="text-[18px] font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-[14px] text-surface-400">Built on modern infrastructure ensuring sub-second response times for complex operations.</p>
          </div>
          <div>
            <Activity className="h-8 w-8 text-primary-500 mx-auto mb-4" />
            <h3 className="text-[18px] font-bold text-white mb-2">AI Powered</h3>
            <p className="text-[14px] text-surface-400">Predictive insights help you catch maintenance issues before they become expensive breakdowns.</p>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="relative z-10 py-12 px-8 border-t border-surface-800 bg-[#09090B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-surface-500" />
            <span className="text-[15px] font-bold text-surface-400">TransitOps</span>
          </div>
          <div className="flex gap-6 text-[14px] text-surface-500">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-surface-500 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
