export function Footer() {
  return (
    <footer className="flex h-12 w-full items-center justify-between border-t border-surface-800 bg-surface-975/60 px-8 text-[length:var(--text-caption)] text-surface-500 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-surface-400">© 2026 TransitOps</span>
      </div>

      <div className="hidden sm:flex items-center gap-6">
        <a href="#status" className="hover:text-white transition-colors">
          System Status: All Operational
        </a>
        <a href="#privacy" className="hover:text-white transition-colors">
          Privacy Policy
        </a>
        <a href="#support" className="hover:text-white transition-colors">
          Support
        </a>
      </div>
    </footer>
  );
}

