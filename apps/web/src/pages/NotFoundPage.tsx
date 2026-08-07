import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Bell, Lock, Map } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        
        {/* Icon & Badge */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border shadow-sm">
            <Map className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold tracking-wider uppercase">
            Coming Soon
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Module in Development
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          We're building something powerful to help you visualize and manage your fleet operations on a live map. This module will be available in an upcoming release.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto h-10 px-5 rounded-md border border-input bg-card text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 w-full sm:w-auto h-10 px-5 rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <Bell className="w-4 h-4" />
            Notify Me
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure. Reliable. Built for modern fleets.</span>
        </div>

      </div>
    </div>
  );
}
