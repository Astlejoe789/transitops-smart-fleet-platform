import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#030712] p-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-surface-800/40 bg-[#0B1426]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger border border-danger/20">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">403 — Access Denied</h1>
        <p className="mt-2 text-sm text-surface-400">
          You do not have the required permissions or role to view this page. Please contact your company administrator if you believe this is an error.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-lg border border-surface-700/40 bg-surface-900/50 px-4 py-2.5 text-sm font-semibold text-surface-300 hover:bg-surface-800/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 hover:from-primary-500 hover:to-primary-400 transition-all"
          >
            <Home className="h-4 w-4" /> Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
