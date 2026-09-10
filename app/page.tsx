import { ArrowRight, Bot, Laptop, ShieldCheck, Workflow } from 'lucide-react';
import { ContributionCard } from '@/components/site-parts';
import { posts } from '@/lib/content';

const domains = [
  { name: 'Endpoints', icon: Laptop, copy: 'Deployment and management across Windows, macOS and mobile.' },
  { name: 'Security', icon: ShieldCheck, copy: 'Identity, access and practical workplace controls.' },
  { name: 'Automation', icon: Workflow, copy: 'Workflows and tools that remove repetitive admin work.' },
  { name: 'AI & Copilot', icon: Bot, copy: 'Applied AI across Microsoft 365 and everyday work.' },
] as const;

export default function Home() {
  const selected = [posts.find((p) => p.type === 'Guide'), posts.find((p) => p.type === 'Build'), posts.find((p) => p.type === 'Insight')].filter(Boolean) as typeof posts;
  return (
    <main id="main">
      <section className="home-intro shell">
        <div className="intro-copy">
          <span className="micro-label">EndpointLog / Field manual</span>
          <h1>Guides, tools and notes for the Microsoft workplace.</h1>
          <p>Tested and documented by Jewelry Kenepa across endpoints, security, automation and AI.</p>
        </div>
        <div className="intro-actions">
          <a className="button" href="/knowledge">Browse knowledge <ArrowRight size={17} /></a>
          <a className="plain-link" href="/tools">View tools</a>
        </div>
      </section>
      <section className="domain-section shell" aria-labelledby="domains-heading">
        <div className="section-kicker"><span>01</span><h2 id="domains-heading">Browse by domain</h2></div>
        <div className="domain-grid">
          {domains.map(({ name, icon: Icon, copy }, index) => (
            <a className="domain-card" key={name} href={`/knowledge?topic=${encodeURIComponent(name)}`}>
              <div className="domain-icon"><Icon size={21} /></div><span>0{index + 1}</span><h3>{name}</h3><p>{copy}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="selected-section shell" aria-labelledby="selected-heading">
        <div className="section-heading">
          <div><span className="micro-label">Selected</span><h2 id="selected-heading">Recent contributions</h2></div>
          <a className="plain-link" href="/knowledge">View all eight <ArrowRight size={16} /></a>
        </div>
        <div className="contribution-grid">{selected.map((post) => <ContributionCard key={post.id} post={post} />)}</div>
      </section>
    </main>
  );
}
