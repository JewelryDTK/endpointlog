type BrandMarkProps = { className?: string; title?: string };

export function BrandMark({ className = '', title = 'EndpointLog EL' }: BrandMarkProps) {
  return <img className={className} src="/brand-mark-original.png" alt={title} />;
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="wordmark" aria-label="EndpointLog">
      <BrandMark className="wordmark-mark" title="" />
      {!compact && <span className="wordmark-type" aria-hidden="true">Endpoint<span>Log</span></span>}
    </span>
  );
}
