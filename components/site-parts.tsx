import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { articleUrl, type Post } from '@/lib/content';
import { Wordmark } from './brand';

export function ContributionCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <article className={'contribution-card' + (compact ? ' contribution-compact' : '')}>
      <a href={articleUrl(post)} className="card-image" aria-label={`Read ${post.title}`}>
        <img src={post.image} alt="" width="720" height="405" />
        <span className={`type-badge type-${post.type.toLowerCase()}`}>{post.type}</span>
      </a>
      <div className="card-body">
        <div className="card-topics">{post.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
        <h3><a href={articleUrl(post)}>{post.title}</a></h3>
        {!compact && <p>{post.summary}</p>}
        <div className="card-footer">
          <span>{post.date} · {post.minutes} min</span>
          <a href={articleUrl(post)} aria-label={`Read ${post.title}`}>Read <ArrowRight size={16} /></a>
        </div>
      </div>
    </article>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <a href="/" aria-label="EndpointLog home"><Wordmark /></a>
          <p>Practical knowledge for the Microsoft workplace.</p>
          <small>Tested, built and documented by Jewelry Kenepa.</small>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/knowledge">Knowledge</a><a href="/tools">Tools</a><a href="/about">About</a><a href="/contact">Contact</a>
        </nav>
        <div className="footer-connect">
          <span className="micro-label">Connect</span>
          <a href="https://www.linkedin.com/in/jewelrykenepa/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          <a href="https://workswithai.online/feed/" target="_blank" rel="noopener noreferrer">RSS <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="shell footer-base"><span>© 2026 EndpointLog</span><span>Independent perspectives on Microsoft technology.</span></div>
    </footer>
  );
}
