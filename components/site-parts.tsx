import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { articleUrl, type Post } from '@/lib/content';
import { Wordmark } from './brand';
import { CookieSettingsButton } from './cookie-consent';

export function ContributionCard({ post, compact = false, showAuthor = false }: { post: Post; compact?: boolean; showAuthor?: boolean }) {
  return (
    <article className={'contribution-card' + (compact ? ' contribution-compact' : '')}>
      <div className="entry-main">
        <div className="entry-labels">
          <span className={`type-badge type-${post.type.toLowerCase()}`}>{post.type}</span>
          <span>{post.topics.join(' / ')}</span>
        </div>
        <h3><a href={articleUrl(post)}>{post.title}</a></h3>
        {!compact && <p>{post.summary}</p>}
        <div className="entry-meta">{showAuthor && <a className="entry-author" href="/about/"><img src="/assets/jewelry.jpg" alt="" width="30" height="30" loading="lazy" /><span>Jewelry Kenepa</span></a>}<time dateTime={new Date(`${post.date} 00:00:00 GMT`).toISOString().slice(0, 10)}>{post.date}</time><span>{post.minutes} min read</span></div>
      </div>
      <a href={articleUrl(post)} className="entry-image" aria-label={`Read ${post.title}`}>
        <img src={post.image} alt="" width="180" height="110" loading="lazy" />
      </a>
      <a className="entry-read" href={articleUrl(post)} aria-label={`Read ${post.title}`}><ArrowRight size={18} /></a>
    </article>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <a href="/" aria-label="EndpointLog home"><Wordmark variant="footer" /></a>
          <p>Practical knowledge for the Microsoft workplace.</p>
          <small>Tested, built and documented by Jewelry Kenepa.</small>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/knowledge">Knowledge</a><a href="/tools">Tools</a><a href="/about">About</a><a href="/contact">Contact</a>
        </nav>
        <div className="footer-connect">
          <span className="micro-label">Connect</span>
          <a href="https://www.linkedin.com/in/jewelrykenepa/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          <a href="/feed.xml">RSS <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="shell footer-base"><span>© 2026 EndpointLog</span><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/disclaimer">Disclaimer</a><CookieSettingsButton /></nav><span>Independent perspectives on Microsoft technology.</span></div>
    </footer>
  );
}
