import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-surface-950 p-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-surface-800 bg-surface-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-500/10 text-danger-400 border border-danger-500/20">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">403 — Access Denied</h1>
        <p className="mt-2 text-sm text-surface-400">
          You do not have the required permissions or role to view this page. Please contact your company administrator if you believe this is an error.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-lg border border-surface-800 bg-surface-950 px-4 py-2.5 text-sm font-semibold text-surface-300 hover:bg-surface-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-primary-500 transition-colors"
          >
            <Home className="h-4 w-4" /> Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
