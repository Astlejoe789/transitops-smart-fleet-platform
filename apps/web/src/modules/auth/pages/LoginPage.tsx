import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* ── tiny design tokens ──────────────────────────────── */
const blue    = '#0066B3';
const blueDark= '#004d87';
const error   = '#dc2626';

const inputStyle = (hasError: boolean, focused: boolean, dark: boolean): React.CSSProperties => {
  const borderCol = dark ? '#1e293b' : '#e2e8f0';
  const textCol = dark ? '#f1f5f9' : '#0a0a0a';
  const bgCol = dark ? '#131e30' : '#f9fafc';
  return {
    width: '100%',
    height: '46px',
    padding: '0 14px',
    fontSize: '15px',
    color: textCol,
    background: bgCol,
    border: `1.5px solid ${hasError ? error : focused ? blue : borderCol}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.3s',
    boxShadow: focused ? `0 0 0 3px ${hasError ? 'rgba(220,38,38,0.1)' : 'rgba(0,102,179,0.1)'}` : 'none',
    fontFamily: 'Inter, Outfit, sans-serif',
    boxSizing: 'border-box' as const,
  };
};

/* ── Demo credentials ─────────────────────────────────── */
const DEMOS = [
  { role: 'Fleet Mgr', email: 'fleet@transitops.com',      pass: 'Fleet@123456',    color: '#0066B3' },
  { role: 'Dispatch',  email: 'dispatcher@transitops.com', pass: 'Dispatch@123456', color: '#10B981' },
  { role: 'Driver',    email: 'driver@transitops.com',     pass: 'Driver@123456',   color: '#F59E0B' },
  { role: 'Safety',    email: 'safety@transitops.com',     pass: 'Safety@123456',   color: '#EF4444' },
  { role: 'Finance',   email: 'finance@transitops.com',    pass: 'Finance@123456',  color: '#8B5CF6' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage]     = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [showPassword, setShowPassword]     = useState(false);
  const [emailFocused, setEmailFocused]     = useState(false);
  const [passFocused, setPassFocused]       = useState(false);

  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const dark = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false;

  const textPrimary = dark ? '#f1f5f9' : '#0a0a0a';
  const textMuted = dark ? '#94a3b8' : '#64748b';
  const borderCol = dark ? '#1e293b' : '#e2e8f0';
  const ssoBg = dark ? '#1e293b' : '#fff';
  const demoBg = dark ? '#131e30' : '#f9fafc';

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login({ email: data.email, password: data.password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setErrorMessage(null);
    handleSubmit(onSubmit)();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '4px', height: '22px', background: blue, borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: blue, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fleet Operations Platform</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: textPrimary, letterSpacing: '-0.03em', fontFamily: 'Outfit, Inter, sans-serif', marginBottom: '8px', lineHeight: 1.15 }}>
          Sign in to your account
        </h1>
        <p style={{ fontSize: '14px', color: textMuted, lineHeight: 1.6 }}>
          Access your fleet dashboard, trips, and operations console.
        </p>
      </div>

      {/* ── Error banner ─────────────────────────────────── */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', background: 'rgba(220,38,38,0.05)', border: '1.5px solid rgba(220,38,38,0.2)', borderRadius: '10px' }}
          >
            <AlertCircle size={16} color={error} style={{ marginTop: '1px', flexShrink: 0 }} />
            <p style={{ fontSize: '14px', color: error, lineHeight: 1.5 }}>{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Login form ───────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: textPrimary, marginBottom: '7px' }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            {...register('email')}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={inputStyle(!!errors.email, emailFocused, dark)}
          />
          {errors.email && (
            <p style={{ fontSize: '12px', color: error, marginTop: '5px' }}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>Password</label>
            <Link to="/forgot-password" style={{ fontSize: '12px', color: blue, textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = blueDark)}
              onMouseLeave={e => (e.currentTarget.style.color = blue)}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              style={{ ...inputStyle(!!errors.password, passFocused, dark), paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: textMuted, display: 'flex', alignItems: 'center' }}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: '12px', color: error, marginTop: '5px' }}>{errors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            id="remember-me"
            type="checkbox"
            {...register('rememberMe')}
            style={{ width: '16px', height: '16px', accentColor: blue, cursor: 'pointer' }}
          />
          <label htmlFor="remember-me" style={{ fontSize: '13px', color: textMuted, cursor: 'pointer', userSelect: 'none' }}>
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%', height: '48px',
            background: isSubmitting ? '#4d99d4' : blue,
            color: '#fff', fontSize: '15px', fontWeight: 700,
            border: 'none', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s, box-shadow 0.2s',
            boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(0,102,179,0.35)',
            fontFamily: 'Outfit, Inter, sans-serif',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = blueDark; }}
          onMouseLeave={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = blue; }}
        >
          {isSubmitting ? (
            <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <>Sign in <ArrowRight size={16} /></>
          )}
        </motion.button>
      </form>

      {/* ── Divider ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
        <div style={{ flex: 1, height: '1px', background: borderCol }} />
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>or continue with</span>
        <div style={{ flex: 1, height: '1px', background: borderCol }} />
      </div>

      {/* ── SSO Buttons ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
        {/* Google */}
        <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '44px', border: `1.5px solid ${borderCol}`, background: ssoBg, borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: textPrimary, transition: 'border-color 0.2s, box-shadow 0.2s, background 0.3s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = borderCol; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        {/* Microsoft */}
        <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '44px', border: `1.5px solid ${borderCol}`, background: ssoBg, borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: textPrimary, transition: 'border-color 0.2s, box-shadow 0.2s, background 0.3s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = borderCol; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
          <svg viewBox="0 0 23 23" width="18" height="18">
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
          Microsoft
        </button>
      </div>

      {/* ── Demo credential cards ────────────────────────── */}
      <div style={{ borderTop: `1px solid ${borderCol}`, paddingTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', textAlign: 'center' }}>
          Quick demo access
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
          {DEMOS.map(demo => (
            <motion.button
              key={demo.role}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => fillDemo(demo.email, demo.pass)}
              style={{
                padding: '10px 8px',
                border: `1.5px solid ${borderCol}`,
                borderRadius: '10px',
                background: demoBg,
                cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = demo.color; (e.currentTarget as HTMLElement).style.background = `${demo.color}15`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = borderCol; (e.currentTarget as HTMLElement).style.background = demoBg; }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: demo.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>{demo.role[0]}</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>{demo.role}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Spinner keyframe ─────────────────────────────── */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}

