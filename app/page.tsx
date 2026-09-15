import { ArrowRight } from 'lucide-react';
import { ContributionCard } from '@/components/site-parts';
import { posts } from '@/lib/content';

const domains = [
  { name: 'Endpoints', copy: 'Deployment and management across Windows, macOS and mobile.' },
  { name: 'Security', copy: 'Identity, access and practical workplace controls.' },
  { name: 'Automation', copy: 'Workflows and tools that remove repetitive admin work.' },
  { name: 'AI & Copilot', copy: 'Applied AI across Microsoft 365 and everyday work.' },
] as const;

export default function Home() {
  const selected = [posts.find((p) => p.type === 'Guide'), posts.find((p) => p.type === 'Build'), posts.find((p) => p.type === 'Insight')].filter(Boolean) as typeof posts;
  return (
    <main id="main">
      <section className="domain-section shell" aria-labelledby="domains-heading">
        <div className="section-kicker"><span>01</span><h2 id="domains-heading">Browse by domain</h2></div>
        <div className="domain-grid">
          {domains.map(({ name, copy }, index) => (
            <a className="domain-card" key={name} href={`/knowledge?topic=${encodeURIComponent(name)}`}>
              <span>0{index + 1}</span><h3>{name}</h3><p>{copy}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="selected-section" aria-labelledby="selected-heading">
        <div className="shell">
          <div className="section-heading">
            <div><span className="micro-label">Selected</span><h2 id="selected-heading">Recent contributions</h2></div>
            <a className="plain-link" href="/knowledge">View all articles <ArrowRight size={16} /></a>
          </div>
          <div className="contribution-grid contribution-featured-layout">
            {selected.map((post, index) => <ContributionCard key={post.id} post={post} featured={index === 0} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
