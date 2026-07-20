import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, data.newPassword);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-surface-800 bg-surface-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Password Reset Successful!</h3>
            <p className="text-sm text-surface-400">
              Your password has been updated. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-white">Reset Password</h2>
              <p className="mt-1 text-sm text-surface-400">
                Please enter a new password for your TransitOps account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300">
                  New Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('newPassword')}
                    className="w-full rounded-lg border border-surface-800 bg-surface-950 py-3 pl-11 pr-11 text-sm text-white placeholder-surface-600 focus:border-primary-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-surface-500 hover:text-surface-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 text-xs text-danger-400">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-300">
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className="w-full rounded-lg border border-surface-800 bg-surface-950 py-3 pl-11 pr-4 text-sm text-white placeholder-surface-600 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-danger-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>

            <div className="text-center">
              <Link to="/login" className="text-xs font-medium text-surface-400 hover:text-white">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
