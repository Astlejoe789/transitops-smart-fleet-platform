import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login({ email: data.email, password: data.password });
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setErrorMessage(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center"
    >
      {/* Glass Card */}
      <div className="w-full rounded-[24px] border border-surface-700/40 bg-surface-900/30 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Top Inner Glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-600/50 to-transparent" />

        <div className="flex justify-center mb-6 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-600/20">
            <Truck className="h-6 w-6" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-1 mb-8 text-center lg:text-left">
          <h2 className="text-[24px] font-bold tracking-tight text-white">Sign in</h2>
          <p className="text-[14px] text-surface-400">Access your fleet operations dashboard.</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-[10px] border border-danger/30 bg-danger/5 p-3 text-[14px] text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-danger" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-medium text-white">Email</label>
            <input
              type="email"
              placeholder="you@fleet.co"
              {...register('email')}
              className={`w-full h-[44px] rounded-[10px] border bg-[#030712] px-3 text-[16px] text-white placeholder-surface-500 transition-colors focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                errors.email
                  ? 'border-danger focus:border-danger focus:ring-danger'
                  : 'border-surface-700/50 focus:border-primary-500'
              }`}
            />
            {errors.email && (
              <p className="text-[13px] text-danger">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[14px] font-medium text-white">Password</label>
              <Link to="/forgot-password" className="text-[13px] font-medium text-surface-400 hover:text-primary-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full h-[44px] rounded-[10px] border bg-[#030712] px-3 text-[16px] text-white placeholder-surface-500 transition-colors focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                errors.password
                  ? 'border-danger focus:border-danger focus:ring-danger'
                  : 'border-surface-700/50 focus:border-primary-500'
              }`}
            />
            {errors.password && (
              <p className="text-[13px] text-danger">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-1 pb-2">
            <input
              id="remember-me"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 rounded-[4px] border-surface-700 bg-[#030712] text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="remember-me" className="ml-2.5 text-[14px] font-medium text-surface-400">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[44px] rounded-[10px] bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-[15px] font-semibold text-white transition-all disabled:opacity-50 flex justify-center items-center shadow-lg shadow-primary-600/20"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Sign in'
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-700/50"></div>
          </div>
          <div className="relative flex justify-center text-[12px] uppercase">
            <span className="bg-surface-900 px-3 text-surface-500 font-medium">or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            className="flex w-full h-[44px] items-center justify-center gap-3 rounded-[10px] border border-surface-700/50 bg-[#030712] text-[15px] font-medium text-white hover:bg-surface-850 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          
          <button
            type="button"
            className="flex w-full h-[44px] items-center justify-center gap-3 rounded-[10px] border border-surface-700/50 bg-[#030712] text-[15px] font-medium text-white hover:bg-surface-850 transition-colors"
          >
            <svg viewBox="0 0 23 23" className="h-5 w-5" aria-hidden="true">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Microsoft
          </button>
        </div>

      </div>

      {/* Demo Accounts Wrapper */}
      <div className="w-full mt-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px bg-surface-700/40 flex-1"></div>
          <span className="text-[12px] font-semibold text-surface-500 uppercase tracking-wider">Demo Credentials</span>
          <div className="h-px bg-surface-700/40 flex-1"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => handleDemoFill('admin@transitops.com', 'Admin@123456')} className="flex flex-col items-center justify-center py-2.5 px-1 rounded-[10px] border border-surface-700/40 bg-surface-900/30 hover:bg-surface-800/50 hover:border-primary-700/30 transition-all">
            <span className="text-[12px] font-semibold text-white">Admin</span>
          </button>
          <button onClick={() => handleDemoFill('fleet@transitops.com', 'Fleet@123456')} className="flex flex-col items-center justify-center py-2.5 px-1 rounded-[10px] border border-surface-700/40 bg-surface-900/30 hover:bg-surface-800/50 hover:border-primary-700/30 transition-all">
            <span className="text-[12px] font-semibold text-white">Fleet</span>
          </button>
          <button onClick={() => handleDemoFill('dispatcher@transitops.com', 'Dispatch@123456')} className="flex flex-col items-center justify-center py-2.5 px-1 rounded-[10px] border border-surface-700/40 bg-surface-900/30 hover:bg-surface-800/50 hover:border-primary-700/30 transition-all">
            <span className="text-[12px] font-semibold text-white">Dispatch</span>
          </button>
        </div>
      </div>

    </motion.div>
  );
}
