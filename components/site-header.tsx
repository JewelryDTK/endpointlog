'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wordmark } from './brand';

const links = [['Home', '/'], ['Knowledge', '/knowledge'], ['Tools', '/tools'], ['About', '/about'], ['Contact', '/contact']] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/knowledge' && (pathname.startsWith('/article/') || pathname === '/blog')) return true;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand-link" aria-label="EndpointLog home"><Wordmark /></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span /><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}>{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
