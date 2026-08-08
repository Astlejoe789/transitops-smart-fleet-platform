import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
  Truck, Menu, X, ChevronDown, ArrowRight,
  MapPin, Shield, Zap, Wrench, Activity,
  BarChart3, CheckCircle2, Phone, Mail, Globe,
  Linkedin, Twitter, Youtube,
  Sun, Moon, Monitor, Check,
  Star, Quote,
} from 'lucide-react';

const NAV_LINKS = ['Platform', 'Solutions', 'Insights', 'About Us'];

const NAV_MENU_CONTENT: Record<string, { title: string, desc: string }[]> = {
  Platform: [
    { title: 'Fleet Management', desc: 'Track and manage your entire fleet in real-time.' },
    { title: 'Trip Planning', desc: 'AI-driven routing and dispatch operations.' },
    { title: 'Maintenance', desc: 'Predictive servicing and repair logs.' },
  ],
  Solutions: [
    { title: 'Public Transit', desc: 'For municipal bus and rail operators.' },
    { title: 'Logistics', desc: 'Freight and last-mile delivery fleets.' },
    { title: 'Enterprise', desc: 'Corporate shuttle and employee transport.' },
  ],
  Insights: [
    { title: 'Analytics Dashboard', desc: 'Custom reports on fuel, costs, and time.' },
    { title: 'Compliance', desc: 'Automated audit logs and safety scores.' },
  ],
  'About Us': [
    { title: 'Our Story', desc: 'Learn why we built TransitOps.' },
    { title: 'Careers', desc: 'Join our growing global team.' },
    { title: 'Contact', desc: 'Get in touch with our sales and support.' },
  ]
};

const STATS = [
  { value: '12,000+', label: 'Vehicles Managed' },
  { value: '2.4 Million', label: 'Trips Completed' },
  { value: '98%', label: 'On-time Dispatch Rate' },
  { value: '100%', label: 'Audit Compliance' },
];

const PILLARS = [
  {
    icon: MapPin,
    title: 'Real-Time Fleet Tracking',
    body: 'Monitor every vehicle across your network with live GPS dashboards, geo-fencing alerts, and health telemetry. Full visibility, zero blind spots.',
  },
  {
    icon: Activity,
    title: 'AI-Driven Route Intelligence',
    body: 'Our rules engine analyses traffic, fuel consumption, and driver availability to generate optimal routes — and explains every decision in plain language.',
  },
  {
    icon: Wrench,
    title: 'Predictive Maintenance',
    body: 'Automate preventive service schedules using vehicle health data. Catch issues before they become breakdowns and keep your fleet running at peak efficiency.',
  },
  {
    icon: Zap,
    title: 'Fuel & Cost Management',
    body: 'Track consumption at the vehicle and trip level, identify inefficiencies, and reduce fuel expenditure with data-backed decisions.',
  },
  {
    icon: Shield,
    title: 'Compliance & Safety',
    body: 'Stay ahead of regulations with automated compliance checks, driver certification tracking, and tamper-evident audit logs for every operation.',
  },
  {
    icon: BarChart3,
    title: 'Financial Insights',
    body: 'Manage vendor billing, operational budgets, and expense reporting from a single dashboard. Integrated with your existing ERP workflows.',
  },
];

const OUTCOMES = [
  { number: '40%', detail: 'reduction in fuel costs reported within the first year of deployment' },
  { number: '3×', detail: 'improvement in maintenance planning efficiency through predictive scheduling' },
  { number: '60%', detail: 'faster incident response enabled by real-time alerts and automated workflows' },
];

const SOLUTIONS = [
  {
    tag: 'Public Transit',
    title: 'Municipal Bus & Rail Operators',
    body: 'From route planning to passenger capacity analytics, TransitOps gives public transport authorities the tools to deliver reliable, data-driven service across the city.',
  },
  {
    tag: 'Logistics',
    title: 'Freight & Last-Mile Delivery',
    body: 'Manage large commercial truck fleets with automated dispatching, proof-of-delivery workflows, and end-to-end supply chain visibility from first mile to last.',
  },
  {
    tag: 'Enterprise',
    title: 'Corporate Shuttle & Employee Transport',
    body: 'Design efficient shuttle routes, track utilisation in real time, and deliver a seamless experience for employees — all managed from one operations console.',
  },
];

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Platform: [
    { label: 'Fleet Management', href: '#platform' },
    { label: 'Trip Planning', href: '#solutions' },
    { label: 'Driver Management', href: '#platform' },
    { label: 'Maintenance', href: '#platform' },
    { label: 'Fuel Tracking', href: '#platform' },
    { label: 'Compliance', href: '#platform' },
  ],
  Company: [
    { label: 'About TransitOps', href: '#about' },
    { label: 'Leadership', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press Room', href: '#' },
    { label: 'Partners', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Case Studies', href: '#testimonials' },
    { label: 'Blog', href: '#' },
    { label: 'Webinars', href: '#' },
  ],
  Support: [
    { label: 'Help Centre', href: '#' },
    { label: 'Contact Sales', href: '#contact' },
    { label: 'System Status', href: '#' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Cookie Settings', href: '#' },
  { label: 'Sitemap', href: '#' },
];


const CLIENT_LOGOS = [
  { name: 'MetroBus', abbr: 'MB', color: '#1a56db' },
  { name: 'CargoLink', abbr: 'CL', color: '#0e9f6e' },
  { name: 'UrbanMove', abbr: 'UM', color: '#d61f69' },
  { name: 'SwiftFreight', abbr: 'SF', color: '#7e3af2' },
  { name: 'CityTransit', abbr: 'CT', color: '#ff5a1f' },
  { name: 'LogiXpress', abbr: 'LX', color: '#0694a2' },
];

const TESTIMONIALS = [
  {
    quote: 'TransitOps cut our fuel costs by 38% in the first six months. The real-time dashboards alone replaced three separate tools we were paying for.',
    name: 'Rajesh Nair',
    role: 'VP of Fleet Operations',
    company: 'MetroBus Authority',
    initials: 'RN',
    color: '#1a56db',
  },
  {
    quote: 'The predictive maintenance alerts have been a game changer. We went from reactive repairs to planned servicing — breakdown incidents dropped by 52%.',
    name: 'Priya Menon',
    role: 'Head of Logistics',
    company: 'CargoLink India',
    initials: 'PM',
    color: '#0e9f6e',
  },
  {
    quote: 'Compliance used to be our biggest headache. TransitOps automated the entire audit trail and we passed our last government inspection with zero findings.',
    name: 'Mohammed Al-Rashid',
    role: 'Director of Transport',
    company: 'UrbanMove Gulf',
    initials: 'MR',
    color: '#7e3af2',
  },
];

/* ─── Animations ────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const } }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};

/* ─── Sub-components ────────────────────────────────────── */
const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark',  label: 'Dark',  icon: Moon },
  { value: 'system',label: 'System',icon: Monitor },
] as const;

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const ActiveIcon = isDark ? Moon : Sun;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle theme"
        title="Change theme"
        style={{
          width: '38px', height: '38px',
          borderRadius: '8px',
          border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}`,
          background: isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb',
          color: isDark ? '#e2e8f0' : '#374151',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.12)' : '#e8f2fb'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#0066B3'; (e.currentTarget as HTMLButtonElement).style.color = '#0066B3'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb'; (e.currentTarget as HTMLButtonElement).style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#e2e8f0' : '#374151'; }}
      >
        <motion.div key={resolvedTheme} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <ActiveIcon size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              minWidth: '150px',
              background: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
              borderRadius: '10px',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              zIndex: 200,
            }}
          >
            <div style={{ padding: '6px' }}>
              {THEME_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => { setTheme(opt.value); setOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 12px', borderRadius: '6px', border: 'none',
                      background: isActive ? (isDark ? 'rgba(0,102,179,0.2)' : '#EBF4FF') : 'transparent',
                      color: isActive ? '#0066B3' : (isDark ? '#cbd5e1' : '#374151'),
                      cursor: 'pointer', fontSize: '13px', fontWeight: isActive ? 600 : 400,
                      textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <Icon size={14} />
                    {opt.label}
                    {isActive && <Check size={12} style={{ marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0066B3', background: '#E8F2FB', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px' }}>
      {children}
    </span>
  );
}

function BlueDivider() {
  return <div style={{ width: '48px', height: '4px', background: '#0066B3', borderRadius: '2px', margin: '16px 0 24px' }} />;
}

function NavItem({ title, dark }: { title: string, dark: boolean }) {
  const [hovered, setHovered] = useState(false);
  const textNav = dark ? '#cbd5e1' : '#374151';
  const menuBg = dark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const borderCol = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const shadow = dark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.08)';

  return (
    <div 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '68px' }}
    >
      <span style={{ fontSize: '14px', fontWeight: 500, color: hovered ? '#0066B3' : textNav, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}>
        {title} <ChevronDown size={13} style={{ transform: hovered ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
              width: '320px', background: menuBg, border: `1px solid ${borderCol}`,
              borderRadius: '12px', padding: '16px', boxShadow: shadow,
              display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 200,
              backdropFilter: 'blur(12px)'
            }}
          >
            {NAV_MENU_CONTENT[title].map(item => (
              <Link to="/login" key={item.title} style={{ padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: dark ? '#f1f5f9' : '#111827' }}>{item.title}</span>
                <span style={{ fontSize: '13px', color: dark ? '#94a3b8' : '#6b7280' }}>{item.desc}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === 'dark';

  // Semantic colour helpers that flip with theme
  const bg       = dark ? '#0b1120' : '#ffffff';
  const bgAlt    = dark ? '#111827' : '#f8fafc';
  const textPrimary  = dark ? '#f1f5f9' : '#0a0a0a';
  const textMuted    = dark ? '#94a3b8' : '#6b7280';
  const textBody     = dark ? '#cbd5e1' : '#4b5563';
  const textNav      = dark ? '#cbd5e1' : '#374151';
  const borderColor  = dark ? '#1e293b' : '#e5e7eb';
  const navBg        = dark ? 'rgba(11,17,32,0.95)' : '#ffffff';
  const cardBg       = dark ? '#131e30' : '#ffffff';
  const cardHoverBg  = dark ? '#1a2840' : '#f0f7ff';
  const pillIconBg   = dark ? '#1e3a5f' : '#e8f2fb';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', 'Outfit', ui-sans-serif, system-ui, sans-serif", color: textPrimary, background: bg, overflowX: 'hidden', transition: 'background 0.3s, color 0.3s' }}>

      {/* ═══════════════════════════════════════════════════════
          1. NAVIGATION
      ═══════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: dark ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid ${borderColor}` : '1px solid transparent',
          boxShadow: scrolled ? (dark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)') : 'none',
          transition: 'box-shadow 0.3s, border-color 0.3s, background 0.3s',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', background: '#0066B3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: textPrimary, letterSpacing: '-0.02em', fontFamily: 'Outfit, Inter, sans-serif' }}>TransitOps</span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hide-mobile">
            {NAV_LINKS.map(link => (
              <NavItem key={link} title={link} dark={dark} />
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <Link to="/login" style={{ fontSize: '14px', fontWeight: 500, color: textNav, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0066B3'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = textNav}
            >
              Sign In
            </Link>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ height: '40px', padding: '0 22px', background: '#0066B3', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#004f8c'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#0066B3'}
              >
                Get Started
              </button>
            </Link>
            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: textNav }} className="show-mobile">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: navBg, borderTop: `1px solid ${borderColor}`, padding: '16px 32px 24px' }}>
            {NAV_LINKS.map(link => (
              <div key={link} style={{ padding: '12px 0', fontSize: '15px', fontWeight: 500, color: textNav, borderBottom: `1px solid ${borderColor}`, cursor: 'pointer' }}>{link}</div>
            ))}
            <Link to="/dashboard" style={{ display: 'block', marginTop: '16px', textDecoration: 'none' }}>
              <button style={{ width: '100%', height: '44px', background: '#0066B3', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Get Started</button>
            </Link>
          </div>
        )}
      </motion.header>

      {/* ═══════════════════════════════════════════════════════
          2. HERO BANNER
      ═══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/hero-fleet-banner.png"
            alt="Fleet on highway"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Dark overlay gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(0,28,60,0.88) 0%, rgba(0,50,100,0.70) 50%, rgba(0,20,45,0.55) 100%)' }} />
        </div>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '120px 32px 80px', width: '100%' }}>
          <motion.div initial="hidden" animate="visible" style={{ maxWidth: '680px' }}>
            <motion.div variants={fadeUp} custom={0}>
              <Tag>Smart Fleet Management Platform</Tag>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}
              style={{ fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '24px', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Driving the Future of<br />Transport Operations
            </motion.h1>

            <motion.p variants={fadeUp} custom={2}
              style={{ fontSize: '18px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px', fontWeight: 400 }}>
              TransitOps is an AI-powered operations platform that gives transport companies real-time visibility, intelligent automation, and full compliance — from the first mile to the last.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{ height: '52px', padding: '0 32px', background: '#0066B3', color: '#fff', borderRadius: '6px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#004f8c'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0066B3'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
                >
                  Explore the Platform <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{ height: '52px', padding: '0 32px', background: 'transparent', color: '#fff', borderRadius: '6px', fontSize: '15px', fontWeight: 600, border: '2px solid rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  Watch Demo
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
            <path d="M0 60L1440 60L1440 20C1200 55 960 65 720 45C480 25 240 10 0 40L0 60Z" fill={bg} />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. IMPACT STATS BAR
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: bgAlt, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, padding: '56px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, marginBottom: '48px' }}>
            Trusted by transport operators across South Asia, Southeast Asia &amp; the Middle East
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0' }}>
            {STATS.map((stat, i) => (
              <motion.div key={stat.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                style={{ textAlign: 'center', padding: '24px 16px', borderRight: i < STATS.length - 1 ? `1px solid ${borderColor}` : 'none' }}
              >
                <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, color: '#0066B3', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: 'Outfit, Inter, sans-serif', marginBottom: '10px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', color: textMuted, fontWeight: 500 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3b. TRUSTED-BY CLIENT LOGOS
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: bg, padding: '56px 32px', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: textMuted, marginBottom: '40px' }}
          >
            Trusted by leading fleet operators worldwide
          </motion.p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            {CLIENT_LOGOS.map((logo, i) => (
              <motion.div key={logo.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: `1.5px solid ${borderColor}`,
                  background: dark ? 'rgba(255,255,255,0.03)' : '#fafafa',
                  transition: 'all 0.25s',
                  cursor: 'default',
                }}
                whileHover={{ scale: 1.04, boxShadow: '0 4px 20px rgba(0,102,179,0.12)' }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: logo.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em',
                  flexShrink: 0,
                }}>
                  {logo.abbr}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. MISSION STATEMENT — TWO COLUMN
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 32px', background: bg }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Tag>Our Mission</Tag>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: textPrimary, lineHeight: 1.15, letterSpacing: '-0.02em', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Making every transport operation smarter, safer, and more sustainable
            </h2>
            <BlueDivider />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <p style={{ fontSize: '16px', color: textBody, lineHeight: 1.8, marginBottom: '20px' }}>
              The transport and logistics sector is one of the world's largest industries — and one of its most underdigitised. Millions of vehicles operate daily on fragmented, paper-based, or siloed systems, leading to lost revenue, safety gaps, and environmental inefficiency.
            </p>
            <p style={{ fontSize: '16px', color: textBody, lineHeight: 1.8, marginBottom: '32px' }}>
              TransitOps was built to change that. By bringing AI, real-time telemetry, and enterprise-grade compliance tools into a single, accessible platform, we help fleet operators of all sizes modernise their operations without the complexity of traditional enterprise software.
            </p>
            <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#0066B3', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = '10px'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = '6px'}
            >
              Learn more about our platform <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. FULL-WIDTH IMAGE — OPERATIONS CENTER
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: bgAlt, padding: '0 32px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <img
              src="/ops-control-center.png"
              alt="TransitOps Operations Control Centre"
              style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '12px', display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. PLATFORM PILLARS — TEXT FORMAT (no cards)
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 32px', background: bgAlt }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Tag>Platform Capabilities</Tag>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: textPrimary, letterSpacing: '-0.02em', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Everything your fleet needs. One platform.
            </h2>
            <BlueDivider />
            <p style={{ maxWidth: '580px', margin: '0 auto', fontSize: '16px', color: textMuted, lineHeight: 1.7 }}>
              From live tracking to financial reporting, every capability in TransitOps is designed to reduce manual work, increase visibility, and improve the decisions your team makes every day.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              const row = Math.floor(i / 3);
              const col = i % 3;
              return (
                <motion.div key={pillar.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i % 3}
                  style={{
                    padding: '40px 36px',
                    borderRight: col < 2 ? `1px solid ${borderColor}` : 'none',
                    borderBottom: row < 1 ? `1px solid ${borderColor}` : 'none',
                    background: cardBg,
                    transition: 'background 0.25s',
                  }}
                  whileHover={{ background: cardHoverBg } as any}
                >
                  <div style={{ width: '48px', height: '48px', background: pillIconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Icon size={22} color="#0066B3" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, marginBottom: '12px', lineHeight: 1.3 }}>{pillar.title}</h3>
                  <p style={{ fontSize: '14px', color: textMuted, lineHeight: 1.75 }}>{pillar.body}</p>
                  <div style={{ marginTop: '20px', fontSize: '13px', fontWeight: 600, color: '#0066B3', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    Explore <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. BLUE HIGHLIGHT QUOTE STRIP
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: '#0066B3', padding: '72px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 700, color: '#ffffff', lineHeight: 1.5, fontFamily: 'Outfit, Inter, sans-serif', marginBottom: '24px' }}>
              "The future of transport is not about more vehicles — it's about smarter operations. TransitOps gives fleet managers the intelligence to do more with what they already have."
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              TransitOps Platform Vision
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          8. IMPACT OUTCOMES — TEXT BLOCKS
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 32px', background: bg }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ marginBottom: '64px' }}>
            <Tag>Measured Impact</Tag>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: textPrimary, letterSpacing: '-0.02em', fontFamily: 'Outfit, Inter, sans-serif', maxWidth: '560px' }}>
              Real results from real fleet operators
            </h2>
            <BlueDivider />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
            {OUTCOMES.map((o, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div style={{ fontSize: 'clamp(52px, 6vw, 72px)', fontWeight: 800, color: '#0066B3', lineHeight: 1, fontFamily: 'Outfit, Inter, sans-serif', marginBottom: '16px' }}>
                  {o.number}
                </div>
                <div style={{ width: '40px', height: '3px', background: '#0066B3', marginBottom: '16px', borderRadius: '2px' }} />
                <p style={{ fontSize: '15px', color: textBody, lineHeight: 1.7 }}>{o.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          8b. CUSTOMER TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 32px', background: bgAlt }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Tag>Customer Stories</Tag>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: textPrimary, letterSpacing: '-0.02em', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Operators who trust TransitOps
            </h2>
            <BlueDivider />
            <p style={{ maxWidth: '520px', margin: '0 auto', fontSize: '16px', color: textMuted, lineHeight: 1.7 }}>
              Hear from the fleet managers, logistics directors, and transport authorities already transforming their operations.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                style={{
                  background: cardBg,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex', flexDirection: 'column', gap: '24px',
                  position: 'relative',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
                whileHover={{ y: -4, boxShadow: dark ? '0 16px 48px rgba(0,0,0,0.5)' : '0 16px 48px rgba(0,102,179,0.1)' } as any}
              >
                {/* Quote icon */}
                <div style={{
                  position: 'absolute', top: '28px', right: '28px',
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: `${t.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Quote size={16} color={t.color} />
                </div>

                {/* Star rating */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                {/* Quote text */}
                <p style={{ fontSize: '15px', color: textBody, lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>
                  "{t.quote}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${borderColor}` }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: t.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>{t.role} &middot; {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          9. SPLIT SECTION — IMAGE LEFT, TEXT RIGHT
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 32px', background: bgAlt }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <img
              src="/fleet-maintenance-yard.png"
              alt="Fleet Maintenance Facility"
              style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <Tag>Maintenance Intelligence</Tag>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, color: textPrimary, lineHeight: 1.2, letterSpacing: '-0.02em', fontFamily: 'Outfit, Inter, sans-serif', marginBottom: '20px' }}>
              Keep every vehicle road-ready, every day
            </h2>
            <BlueDivider />
            <p style={{ fontSize: '15px', color: textBody, lineHeight: 1.8, marginBottom: '16px' }}>
              Unplanned breakdowns are one of the largest hidden costs in any fleet. TransitOps connects vehicle diagnostics, service history, and usage patterns to generate intelligent maintenance schedules before problems occur.
            </p>
            <p style={{ fontSize: '15px', color: textBody, lineHeight: 1.8, marginBottom: '32px' }}>
              Service teams receive automated work orders, technicians log repairs against structured checklists, and operators get complete visibility into the health of every vehicle in their network — at a glance.
            </p>
            {[
              'Automated service reminders by mileage and time',
              'Digital inspection checklists and sign-offs',
              'Vendor management and parts cost tracking',
              'Full maintenance history per vehicle',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <CheckCircle2 size={16} color="#0066B3" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: textNav, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          10. SOLUTIONS BY INDUSTRY
      ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 32px', background: bg }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ marginBottom: '64px' }}>
            <Tag>Industry Solutions</Tag>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: textPrimary, letterSpacing: '-0.02em', fontFamily: 'Outfit, Inter, sans-serif' }}>
              Built for every type of fleet
            </h2>
            <BlueDivider />
            <p style={{ maxWidth: '540px', fontSize: '16px', color: textMuted, lineHeight: 1.7 }}>
              Whether you operate a city bus network, a long-haul freight fleet, or a corporate shuttle service, TransitOps adapts to your workflows and scale.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0', borderTop: `1px solid ${borderColor}` }}>
            {SOLUTIONS.map((sol, i) => (
              <motion.div key={sol.tag}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                style={{ padding: '40px 36px', borderBottom: `1px solid ${borderColor}`, borderRight: i < SOLUTIONS.length - 1 ? `1px solid ${borderColor}` : 'none', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0066B3', marginBottom: '16px', display: 'block' }}>{sol.tag}</span>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, marginBottom: '14px', lineHeight: 1.3 }}>{sol.title}</h3>
                <p style={{ fontSize: '14px', color: textMuted, lineHeight: 1.75 }}>{sol.body}</p>
                <div style={{ marginTop: '24px', fontSize: '13px', fontWeight: 600, color: '#0066B3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Read more <ArrowRight size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          11. BLUE CTA BANNER
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #00264d 0%, #0066B3 60%, #0099e6 100%)', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ flex: '1', minWidth: '280px' }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, fontFamily: 'Outfit, Inter, sans-serif', marginBottom: '14px' }}>
              Ready to modernise your fleet operations?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
              Join hundreds of transport operators already running smarter with TransitOps. Start your free 14-day trial — no credit card required.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ height: '52px', padding: '0 32px', background: '#ffffff', color: '#0066B3', borderRadius: '6px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'none'}
              >
                Start Free Trial
              </button>
            </Link>
            <button style={{ height: '52px', padding: '0 32px', background: 'transparent', color: '#ffffff', borderRadius: '6px', fontSize: '15px', fontWeight: 600, border: '2px solid rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.6)'}
            >
              Contact Sales
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          12. CONTACT BAR
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: bgAlt, borderTop: `1px solid ${borderColor}`, padding: '32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: textNav }}>
              <Phone size={16} color="#0066B3" />
              <span>+91-1800-TransitOps</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: textNav }}>
              <Mail size={16} color="#0066B3" />
              <span>enterprise@transitops.io</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: textNav }}>
              <Globe size={16} color="#0066B3" />
              <span>Serving 18 countries across Asia, ME &amp; Africa</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[Linkedin, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" style={{ width: '36px', height: '36px', background: pillIconBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0066B3', transition: 'background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0066B3'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = pillIconBg; (e.currentTarget as HTMLElement).style.color = '#0066B3'; }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          13. FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer style={{ background: dark ? '#060d1a' : '#f8fafc', color: textMuted, padding: '64px 32px 32px', borderTop: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Top: Logo + columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px repeat(4, 1fr)', gap: '48px', marginBottom: '64px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: '#0066B3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={18} color="#fff" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: textPrimary, fontFamily: 'Outfit, Inter, sans-serif' }}>TransitOps</span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: textMuted }}>
                AI-powered fleet &amp; transport operations platform for the modern enterprise.
              </p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: textPrimary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>{heading}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {links.map(link => (
                    <li key={link.label} style={{ marginBottom: '10px' }}>
                      <a href={link.href} style={{ fontSize: '13px', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0066B3'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = textMuted}
                      >{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '28px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '13px', color: textMuted }}>© 2026 TransitOps Technologies Pvt. Ltd. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {LEGAL_LINKS.map(link => (
                <a key={link.label} href={link.href} style={{ fontSize: '12px', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0066B3'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = textMuted}
                >{link.label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
