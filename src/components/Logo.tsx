export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lunara-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7B3CB" />
          <stop offset="55%" stopColor="#E55D8E" />
          <stop offset="100%" stopColor="#9B7FD4" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="url(#lunara-mark)" />
      <path
        d="M20 8.5c4.6 6.2 7.4 9.6 7.4 13.4a7.4 7.4 0 1 1-14.8 0c0-3.8 2.8-7.2 7.4-13.4z"
        fill="#FFF"
        fillOpacity="0.94"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9" />
      <span className="font-display text-xl font-semibold text-plum-900">Lunara</span>
    </span>
  );
}
