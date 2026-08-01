import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, Shield, Zap, Map, FileText, 
  Users, Wrench, Activity,
  ArrowRight, CheckCircle2,
  Clock, Linkedin, Twitter, Youtube, Globe, PlayCircle, Rocket
} from 'lucide-react';
import HeroScene from '../components/landing/HeroScene';

const STATS = [
  { value: "12k+", label: "Vehicles Managed", icon: Truck },
  { value: "2.4M", label: "Trips Completed", icon: Map },
  { value: "98%", label: "On-time Dispatch", icon: Clock },
  { value: "100%", label: "Audit Compliance", icon: Shield },
];

const FEATURES = [
  { icon: Truck, title: "Fleet Management", desc: "Track every vehicle in real-time with GPS dashboards and health monitoring.", color: "text-emerald-400 border-emerald-500/30", bg: "bg-emerald-500/10" },
  { icon: Map, title: "Trip Planning", desc: "Optimize routes, automate dispatching, and manage multi-stop journeys.", color: "text-blue-400 border-blue-500/30", bg: "bg-blue-500/10" },
  { icon: Users, title: "Driver Management", desc: "Monitor compliance, track certifications, and manage driver schedules.", color: "text-blue-400 border-blue-500/30", bg: "bg-blue-500/10" },
  { icon: Wrench, title: "Maintenance", desc: "Automate preventive service schedules and catch issues before breakdowns.", color: "text-amber-400 border-amber-500/30", bg: "bg-amber-500/10" },
  { icon: Zap, title: "Fuel Tracking", desc: "Monitor consumption, track costs, and identify efficiency gains.", color: "text-emerald-400 border-emerald-500/30", bg: "bg-emerald-500/10" },
  { icon: FileText, title: "Expense Management", desc: "Full CRUD for expenses, vendor billing, and operations budget tracking.", color: "text-blue-400 border-blue-500/30", bg: "bg-blue-500/10" },
  { icon: Activity, title: "AI Insights", desc: "Predictive analytics and fleet copilot powered by intelligent rules engine.", color: "text-emerald-400 border-emerald-500/30", bg: "bg-emerald-500/10" },
  { icon: Shield, title: "Compliance", desc: "Stay compliant with automated checks and audit-ready logs.", color: "text-purple-400 border-purple-500/30", bg: "bg-purple-500/10" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary-500/30 font-sans relative overflow-x-hidden">
      
      {/* ── Background Effects & 3D Scene ── */}
      <div className="absolute top-0 left-0 right-0 h-[110vh] z-0 overflow-hidden">
        <HeroScene />
        {/* Gradient fade into the rest of the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712] pointer-events-none" />
      </div>
      
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ── 1. Navigation ── */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030712]/40 backdrop-blur-2xl"
      >
        <div className="max-w-[1700px] mx-auto flex items-center justify-between px-8 lg:px-16 h-[72px]">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-gradient-to-br from-primary-500 to-primary-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-transform group-hover:scale-105">
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>TransitOps</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-surface-300">
              <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">Features <svg className="w-3 h-3 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">Solutions <svg className="w-3 h-3 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              <span className="hover:text-white cursor-pointer transition-colors inline-flex items-center gap-2">
                Pricing 
                <span className="text-[9px] bg-primary-500/10 text-primary-300 px-1.5 py-0.5 rounded border border-primary-500/20 font-bold tracking-wider">SOON</span>
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">Enterprise</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[13px] font-semibold text-surface-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/dashboard" className="hidden sm:flex h-[38px] items-center justify-center rounded-[8px] bg-white px-5 text-[13px] font-bold text-[#030712] hover:bg-surface-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── 2. Hero Section ── */}
      <section className="relative z-10 pt-40 lg:pt-52 pb-32 px-8 lg:px-16 max-w-[1700px] mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 2xl:col-span-5"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-primary-500/30 bg-primary-500/10 backdrop-blur-md px-3.5 py-1.5 mb-8 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-[11px] font-bold text-primary-300 tracking-widest uppercase">AI-Powered Fleet Intelligence</span>
            </motion.div>

            <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.05] mb-6" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              The intelligent OS for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">modern fleet</span>{' '}
              management.
            </h1>
            
            <p className="text-[17px] md:text-[19px] text-surface-300 mb-10 leading-relaxed max-w-lg font-medium">
              Run trips, dispatch, maintenance, fuel, and compliance from one place — with a rules engine that explains every decision and a tamper-evident audit log.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <button className="w-full group h-[52px] px-8 rounded-xl bg-gradient-to-b from-primary-400 to-primary-600 hover:from-primary-300 hover:to-primary-500 text-[14px] font-bold text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)] shadow-primary-500/30 border border-primary-400/20 hover:scale-[1.02]">
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <button className="w-full group h-[52px] px-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-[14px] font-bold text-white transition-all flex items-center justify-center gap-2 hover:scale-[1.02]">
                  View Demo
                  <PlayCircle className="h-4 w-4 text-surface-400 group-hover:text-white transition-colors" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image Space (Now occupied by 3D Scene) */}
          <div className="hidden lg:block lg:col-span-6 2xl:col-span-7 h-full relative pointer-events-none">
            {/* The 3D scene renders behind this, providing a cinematic right-side composition */}
          </div>

        </div>
      </section>

      {/* ── 3. Trust Bar / Stats ── */}
      <section className="relative z-10 py-20 border-y border-white/5 bg-[#030712]/60 backdrop-blur-xl">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16 text-center">
          <p className="text-[11px] font-bold text-surface-500 uppercase tracking-widest mb-12">Trusted by enterprises across the globe</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div 
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="flex items-center justify-center gap-5 py-6 px-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary-400 shadow-inner">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="text-[28px] font-extrabold text-white leading-none mb-1.5" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>{stat.value}</div>
                  <div className="text-[13px] font-medium text-surface-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Features Grid ── */}
      <section id="features" className="relative z-10 py-32 bg-[#030712]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 blur-[150px] pointer-events-none" />
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16 relative">
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-6"
            >
              <span className="text-[11px] font-bold text-surface-300 tracking-widest uppercase">Powerful Features</span>
            </motion.div>
            <h2 className="text-[36px] md:text-[48px] font-extrabold text-white tracking-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              Everything you need to run your fleet.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div 
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="flex flex-col p-8 rounded-[24px] border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all group shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_-8px_rgba(14,165,233,0.15)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-bl-full pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
                
                <div className={`h-12 w-12 rounded-[14px] border flex items-center justify-center mb-6 backdrop-blur-md ${feature.bg} ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[14px] text-surface-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Built For Today (Split Section) ── */}
      <section className="relative z-10 py-32 bg-surface-950/20 border-t border-white/5">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
              className="order-2 lg:order-1 relative"
            >
              <p className="text-[12px] font-bold text-primary-400 uppercase tracking-widest mb-4">Why fleets love TransitOps</p>
              <h2 className="text-[44px] md:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1.05] mb-10 tracking-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                Built for today.<br/>
                <span className="text-surface-500">Ready for tomorrow.</span>
              </h2>
              
              <ul className="space-y-6 mb-12">
                {[
                  "Real-time visibility across your entire fleet",
                  "Reduce costs with AI data-driven decisions",
                  "Improve safety, compliance, and uptime",
                  "Scale effortlessly as your logistics grow"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.1 }} viewport={{ once: true }}
                    className="flex items-center gap-4 text-[16px] md:text-[18px] text-surface-300 font-medium"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.02] shadow-[0_0_40px_rgba(0,0,0,0.5)] p-2 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                <img 
                  src="/trucks-illustration.png" 
                  alt="Modern Fleet Trucks" 
                  className="w-full h-auto rounded-[24px] object-cover opacity-90 border border-white/5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML += '<div class="w-full aspect-video bg-surface-900 rounded-[24px] flex items-center justify-center text-surface-500">Data Visualization Layer</div>';
                  }}
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 6. CTA Banner ── */}
      <section className="relative z-10 py-32 px-8 lg:px-16 bg-[#030712]">
        <div className="max-w-[1700px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="relative rounded-[32px] border border-primary-500/20 bg-gradient-to-br from-primary-950/40 to-surface-950/50 p-12 md:p-20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 backdrop-blur-2xl shadow-[0_0_50px_rgba(14,165,233,0.1)]"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500/15 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative flex items-center gap-8 text-left z-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/30 shrink-0 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                <Rocket className="h-10 w-10 text-primary-400" />
              </div>
              <div>
                <h2 className="text-[32px] md:text-[40px] font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                  Ready to modernize your fleet?
                </h2>
                <p className="text-[17px] text-surface-300 font-medium">
                  Get started in minutes with our comprehensive platform.
                </p>
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-5 shrink-0 w-full md:w-auto z-10">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-[52px] px-8 rounded-xl bg-white text-[14px] font-bold text-[#030712] hover:bg-surface-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02]">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <button className="w-full sm:w-auto h-[52px] px-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-[14px] font-bold text-white transition-all hover:scale-[1.02]">
                  Talk to Sales
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] text-surface-400 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free 14-day trial</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> No credit card</span>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer className="relative z-10 border-t border-white/5 bg-[#030712] py-16">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary-500">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="text-[17px] font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>TransitOps</span>
          </div>

          <div className="flex flex-wrap justify-center gap-10 text-[14px] text-surface-400 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>

          <div className="flex items-center gap-5 text-surface-500">
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transform"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transform"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transform"><Youtube className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transform"><Globe className="h-5 w-5" /></a>
          </div>

        </div>
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16 mt-12 text-center md:text-left text-[13px] text-surface-600 font-medium">
          © 2026 TransitOps. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
