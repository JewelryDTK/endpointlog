type BrandMarkProps = { className?: string; title?: string };

export function BrandMark({ className = '', title = 'EndpointLog' }: BrandMarkProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label={title}>
      <rect width="48" height="48" rx="12" fill="#0B1F33" />
      <path d="M14 11.5v25" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M14 13h14.5M14 24h11M14 35h14.5" stroke="#38C7E8" strokeWidth="3" strokeLinecap="round" />
      <path d="M28.5 13c4.3 0 6.5 2.1 6.5 6v10c0 3.8-2.2 6-6.5 6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".72" />
      <circle cx="29.5" cy="13" r="2.7" fill="#38C7E8" stroke="#0B1F33" />
      <circle cx="26" cy="24" r="2.7" fill="#38C7E8" stroke="#0B1F33" />
      <circle cx="29.5" cy="35" r="2.7" fill="#38C7E8" stroke="#0B1F33" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="wordmark" aria-label="EndpointLog">
      <BrandMark className="wordmark-mark" title="" />
      {!compact && <span className="wordmark-type" aria-hidden="true">Endpoint<span>Log</span></span>}
    </span>
  );
}
