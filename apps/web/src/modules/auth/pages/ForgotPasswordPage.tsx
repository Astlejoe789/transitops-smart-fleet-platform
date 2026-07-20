import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-surface-800 bg-surface-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-surface-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Reset Link Sent</h3>
            <p className="text-sm text-surface-400">
              If an account exists for that email, we have sent instructions to reset your password.
            </p>
            <Link
              to="/login"
              className="block w-full rounded-lg bg-surface-800 py-3 text-center text-sm font-semibold text-white hover:bg-surface-700 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
              <p className="mt-1 text-sm text-surface-400">
                Enter your email address and we will send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="name@company.com"
                    {...register('email')}
                    className="w-full rounded-lg border border-surface-800 bg-surface-950 py-3 pl-11 pr-4 text-sm text-white placeholder-surface-600 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-danger-400">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending Request...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
