export function Footer() {
  return (
    <footer className="flex h-12 w-full items-center justify-between border-t border-surface-200 dark:border-surface-800 bg-white/60 dark:bg-surface-900/60 px-4 sm:px-6 text-[11px] text-surface-400 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
        <span className="font-semibold text-surface-700 dark:text-surface-300">TransitOps Platform</span>
        <span>• Version 0.1.0 (Production Build)</span>
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <a href="#status" className="hover:text-surface-900 dark:hover:text-white transition-colors">
          System Status: All Operational
        </a>
        <a href="#privacy" className="hover:text-surface-900 dark:hover:text-white transition-colors">
          Privacy Policy
        </a>
        <a href="#support" className="hover:text-surface-900 dark:hover:text-white transition-colors">
          Support
        </a>
      </div>
    </footer>
  );
}
