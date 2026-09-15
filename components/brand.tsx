type BrandMarkProps = { className?: string; title?: string; variant?: 'color' | 'footer' };

export function BrandMark({ className = '', title = 'EndpointLog', variant = 'color' }: BrandMarkProps) {
  const src = variant === 'footer' ? '/endpointlog-wordmark-mono.png' : '/endpointlog-wordmark-color.png';
  return <img className={className} src={src} alt={title} />;
}

export function Wordmark({ variant = 'color' }: { variant?: 'color' | 'footer' }) {
  return (
    <span className="wordmark" aria-label="EndpointLog">
      <BrandMark className="wordmark-mark" title="" variant={variant} />
    </span>
  );
}
