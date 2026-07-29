import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, Shield, Zap, Map, FileText, 
  Users, Wrench, Github,
  ArrowRight, Sparkles, CheckCircle2,
  Clock, Linkedin, Twitter, Youtube, Globe, PlayCircle, Rocket,
  MapPin, UserCheck, Banknote, BrainCircuit
} from 'lucide-react';

const STATS = [
  { value: "12k+", label: "Vehicles Managed", icon: Truck },
  { value: "2.4M", label: "Trips Completed", icon: Map },
  { value: "98%", label: "On-time Dispatch", icon: Clock },
  { value: "100%", label: "Audit Compliance", icon: Shield },
];

const FEATURES = [
  { icon: Truck, title: "Fleet Management", desc: "Track every vehicle in real-time with GPS dashboards and health monitoring.", color: "text-emerald-400 border-emerald-500/30" },
  { icon: Map, title: "Trip Planning", desc: "Optimize routes, automate dispatching, and manage multi-stop journeys.", color: "text-blue-400 border-blue-500/30" },
  { icon: Users, title: "Driver Management", desc: "Monitor compliance, track certifications, and manage driver schedules.", color: "text-blue-400 border-blue-500/30" },
  { icon: Wrench, title: "Maintenance", desc: "Automate preventive service schedules and catch issues before breakdowns.", color: "text-amber-400 border-amber-500/30" },
  { icon: Zap, title: "Fuel Tracking", desc: "Monitor consumption, track costs, and identify efficiency gains.", color: "text-emerald-400 border-emerald-500/30" },
  { icon: FileText, title: "Expense Management", desc: "Full CRUD for expenses, vendor billing, and operations budget tracking.", color: "text-blue-400 border-blue-500/30" },
  { icon: Activity, title: "AI Insights", desc: "Predictive analytics and fleet copilot powered by intelligent rules engine.", color: "text-emerald-400 border-emerald-500/30" },
  { icon: Shield, title: "Compliance", desc: "Stay compliant with automated checks and audit-ready logs.", color: "text-purple-400 border-purple-500/30" },
];

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary-500/30 font-sans relative overflow-x-hidden">
      
      {/* ── Background Effects ── */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* ── 1. Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-800/40 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between px-8 lg:px-16 h-[72px]">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-gradient-to-br from-primary-500 to-primary-400 text-white shadow-lg shadow-primary-500/20">
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>TransitOps</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-surface-300">
              <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">Features <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">Solutions <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
              <span className="hover:text-white cursor-pointer transition-colors inline-flex items-center gap-1.5">
                Pricing 
                <span className="text-[9px] bg-primary-900/50 text-primary-300 px-1.5 py-0.5 rounded-md border border-primary-700/30 font-bold tracking-wider">SOON</span>
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">Enterprise</span>
              <span className="hover:text-white cursor-pointer transition-colors">Docs</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[13px] font-semibold text-surface-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/dashboard" className="hidden sm:flex h-[36px] items-center justify-center rounded-[8px] bg-primary-500 px-5 text-[13px] font-semibold text-white hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section ── */}
      <section className="relative z-10 pt-32 lg:pt-40 pb-20 px-8 lg:px-16 max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Hero Text */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-700/30 bg-primary-950/30 px-3 py-1 mb-6">
              <span className="text-[11px] font-bold text-primary-400 tracking-wide uppercase">AI-Powered Fleet Intelligence</span>
            </div>

            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.05] mb-6" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              The intelligent operating system for{' '}
              <span className="text-primary-400">modern fleet</span>{' '}
              management.
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-surface-400 mb-10 leading-relaxed max-w-lg">
              Run trips, dispatch, maintenance, fuel, and compliance from one place — with a rules engine that explains every decision and a tamper-evident audit log.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link to="/dashboard">
                <button className="group h-[48px] px-8 rounded-lg bg-primary-500 hover:bg-primary-400 text-[14px] font-bold text-white transition-all flex items-center gap-2">
                  Launch Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="group h-[48px] px-8 rounded-lg border border-surface-700 bg-surface-900/50 hover:bg-surface-800 text-[14px] font-bold text-white transition-all flex items-center gap-2">
                  View Demo
                  <PlayCircle className="h-4 w-4 text-surface-400 group-hover:text-white transition-colors" />
                </button>
              </Link>
            </div>

            {/* Hero Section Floating Bars */}
            <div className="relative h-24 mt-4 hidden md:block">
              <motion.div 
                animate={{ y: [0, -6, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
                className="absolute left-0 top-0 px-4 py-3 rounded-[12px] bg-primary-950/40 border border-primary-700/30 backdrop-blur-md flex items-center gap-3 w-52"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mb-0.5">System Status</div>
                  <div className="text-[14px] font-bold text-white leading-none">All Systems Go</div>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 6, 0] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} 
                className="absolute left-[240px] top-8 px-4 py-3 rounded-[12px] bg-surface-900/50 border border-surface-700/50 backdrop-blur-md flex items-center gap-3 w-52"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mb-0.5">Data Sync</div>
                  <div className="text-[14px] font-bold text-white leading-none">Real-time Active</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-[16px] border border-surface-700/50 bg-[#0B1426] p-2 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent pointer-events-none" />
              <img 
                src="/images/dashboard-preview.png" 
                alt="TransitOps Dashboard" 
                className="w-full h-auto rounded-[12px] border border-surface-800"
                onError={(e) => {
                  // Fallback if image doesn't exist yet
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML += '<div class="w-full aspect-[4/3] bg-surface-900 rounded-[12px] flex items-center justify-center text-surface-500 text-sm">Dashboard Preview Image</div>';
                }}
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. Trust Bar / Stats ── */}
      <section className="relative z-10 py-16 border-y border-surface-800/40 bg-surface-950/30">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16 text-center">
          <p className="text-[11px] font-bold text-surface-500 uppercase tracking-widest mb-10">Trusted by fleets across the globe</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div 
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center justify-center gap-4 py-6 px-4 rounded-2xl bg-[#0B1426]/60 border border-surface-800/50 hover:bg-[#0B1426] transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-surface-900/80 border border-surface-700/50 flex items-center justify-center text-primary-400">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-[24px] font-bold text-white leading-none mb-1" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>{stat.value}</div>
                  <div className="text-[12px] text-surface-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Features Grid ── */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold text-primary-400 uppercase tracking-widest mb-3">Powerful Features</p>
            <h2 className="text-[32px] md:text-[40px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              Everything you need to run your fleet.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div 
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col p-6 rounded-[20px] border border-surface-800/60 bg-[#0B1426]/40 hover:bg-[#0B1426]/80 hover:border-surface-700 transition-all group"
              >
                <div className={`h-12 w-12 rounded-[12px] border flex items-center justify-center mb-5 bg-surface-900/50 ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[16px] font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[13px] text-surface-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="text-[14px] font-semibold text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1.5 group">
              Explore all features
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. Built For Today (Split Section) ── */}
      <section className="relative z-10 py-24 bg-surface-950/20">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="order-2 lg:order-1 relative">
              <p className="text-[14px] font-bold text-primary-400 uppercase tracking-widest mb-5">Why fleets love TransitOps</p>
              <h2 className="text-[44px] md:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1.05] mb-10" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                Built for today.<br/>Ready for tomorrow.
              </h2>
              
              <ul className="space-y-6 mb-16">
                {[
                  "Real-time visibility across your entire fleet",
                  "Reduce costs with data-driven decisions",
                  "Improve safety, compliance, and uptime",
                  "Scale effortlessly as your fleet grows"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-[17px] md:text-[18px] text-surface-300 font-medium">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Floating Bars to fill empty gaps */}
              <div className="relative h-56 hidden md:block">
                <motion.div 
                  animate={{ y: [0, -8, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
                  className="absolute left-0 top-0 px-5 py-4 rounded-[16px] bg-surface-900/90 border border-surface-700/50 shadow-2xl backdrop-blur-md flex items-center gap-4 w-64"
                >
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-surface-400 font-medium mb-0.5">Efficiency Gained</div>
                    <div className="text-[18px] font-bold text-white leading-none">32% Increase</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} 
                  className="absolute left-[240px] top-12 px-5 py-4 rounded-[16px] bg-primary-950/80 border border-primary-700/30 shadow-2xl backdrop-blur-md flex items-center gap-4 w-60"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-surface-400 font-medium mb-0.5">Operating Costs</div>
                    <div className="text-[18px] font-bold text-white leading-none">15% Reduced</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -6, 0] }} 
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }} 
                  className="absolute left-[90px] top-[110px] px-5 py-4 rounded-[16px] bg-surface-900/90 border border-surface-700/50 shadow-2xl backdrop-blur-md flex items-center gap-4 w-60"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-surface-400 font-medium mb-0.5">Audit Compliance</div>
                    <div className="text-[18px] font-bold text-white leading-none">100% Secure</div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative rounded-[24px] overflow-hidden border border-surface-800/50 bg-[#0B1426]/50">
                <img 
                  src="/trucks-illustration.png" 
                  alt="Modern Fleet Trucks" 
                  className="w-full h-auto object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. CTA Banner ── */}
      <section className="relative z-10 py-24 px-8 lg:px-16">
        <div className="max-w-[1700px] mx-auto">
          <div className="relative rounded-[24px] border border-primary-900/30 bg-gradient-to-br from-[#0B1426] to-[#030712] p-10 md:p-14 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative flex items-center gap-6 text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/20 shrink-0">
                <Rocket className="h-8 w-8 text-primary-400" />
              </div>
              <div>
                <h2 className="text-[28px] font-bold text-white mb-2" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                  Ready to modernize your fleet?
                </h2>
                <p className="text-[15px] text-surface-400">
                  Get started in minutes with our comprehensive platform.
                </p>
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-4 shrink-0 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto h-[48px] px-8 rounded-lg bg-primary-500 hover:bg-primary-400 text-[14px] font-bold text-white transition-all flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <button className="w-full sm:w-auto h-[48px] px-8 rounded-lg border border-surface-700 bg-surface-900/50 hover:bg-surface-800 text-[14px] font-bold text-white transition-all">
                  Talk to Sales
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-surface-400 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary-500" /> Free 14-day trial</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary-500" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary-500" /> Cancel anytime</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer className="relative z-10 border-t border-surface-800/40 bg-[#030712] py-12">
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-primary-500">
              <Truck className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>TransitOps</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[13px] text-surface-400 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>

          <div className="flex items-center gap-4 text-surface-500">
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Youtube className="h-4 w-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Globe className="h-4 w-4" /></a>
          </div>

        </div>
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16 mt-8 text-center md:text-left text-[12px] text-surface-600">
          © 2026 TransitOps. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
