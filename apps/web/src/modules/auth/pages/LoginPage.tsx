import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, Eye, EyeOff, Truck, AlertCircle } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-950 p-4 sm:p-6 lg:p-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent-600/10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-surface-800 bg-surface-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header Logo & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 shadow-lg shadow-primary-500/30">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            TransitOps
          </h2>
          <p className="mt-1 text-sm text-surface-400">
            AI-Powered Smart Fleet & Operations Platform
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-3 rounded-lg border border-danger-500/30 bg-danger-950/40 p-4 text-sm text-danger-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-danger-400" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300">
              Email Address
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="h-5 w-5 text-surface-500" />
              </div>
              <input
                type="email"
                placeholder="admin@transitops.com"
                {...register('email')}
                className={`w-full rounded-lg border bg-surface-950 py-3 pl-11 pr-4 text-sm text-white placeholder-surface-600 transition-colors focus:outline-none ${
                  errors.email
                    ? 'border-danger-500 focus:border-danger-500'
                    : 'border-surface-800 focus:border-primary-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-danger-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary-400 hover:text-primary-300"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-5 w-5 text-surface-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className={`w-full rounded-lg border bg-surface-950 py-3 pl-11 pr-11 text-sm text-white placeholder-surface-600 transition-colors focus:outline-none ${
                  errors.password
                    ? 'border-danger-500 focus:border-danger-500'
                    : 'border-surface-800 focus:border-primary-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-surface-500 hover:text-surface-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-danger-400">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 rounded border-surface-800 bg-surface-950 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remember-me" className="ml-2.5 text-sm text-surface-400">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-500 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="border-t border-surface-800 pt-5">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3">
            Quick Demo Login Fill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@transitops.com', 'Admin@123456')}
              className="rounded-md border border-surface-800 bg-surface-950 py-2 text-xs font-medium text-surface-300 transition-colors hover:border-primary-500 hover:text-white"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('fleet@transitops.com', 'Fleet@123456')}
              className="rounded-md border border-surface-800 bg-surface-950 py-2 text-xs font-medium text-surface-300 transition-colors hover:border-primary-500 hover:text-white"
            >
              Fleet Mgr
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('dispatcher@transitops.com', 'Dispatch@123456')}
              className="rounded-md border border-surface-800 bg-surface-950 py-2 text-xs font-medium text-surface-300 transition-colors hover:border-primary-500 hover:text-white"
            >
              Dispatcher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
