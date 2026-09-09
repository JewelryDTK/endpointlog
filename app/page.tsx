import { ArrowRight, Bot, Laptop, ShieldCheck, Workflow } from 'lucide-react';
import { ContributionCard } from '@/components/site-parts';
import { posts } from '@/lib/content';

const domains = [
  { name: 'Endpoints', icon: Laptop, copy: 'Deployment, management and experience across Windows, macOS and mobile.' },
  { name: 'Security', icon: ShieldCheck, copy: 'Identity, access and practical controls for a safer workplace.' },
  { name: 'Automation', icon: Workflow, copy: 'Repeatable workflows and tools that remove routine admin work.' },
  { name: 'AI & Copilot', icon: Bot, copy: 'Useful applications of AI across Microsoft 365 and daily work.' },
] as const;

export default function Home() {
  const selected = [posts.find((p) => p.type === 'Guide'), posts.find((p) => p.type === 'Build'), posts.find((p) => p.type === 'Insight')].filter(Boolean) as typeof posts;
  return (
    <main id="main">
      <section className="home-intro shell">
        <div className="intro-copy">
          <span className="micro-label">Microsoft workplace field manual</span>
          <h1>Practical knowledge for the Microsoft workplace.</h1>
          <p>Clear guides, tested builds and grounded insights for people working with endpoints, security, automation and AI.</p>
          <div className="intro-actions">
            <a className="button" href="/knowledge">Explore the knowledge base <ArrowRight size={17} /></a>
            <a className="plain-link" href="/tools">Browse practical tools</a>
          </div>
        </div>
        <aside className="author-note">
          <img src="/assets/jewelry.jpg" alt="Jewelry Kenepa" width="72" height="72" />
          <div><span className="micro-label">From the field</span><p>Tested, built and documented by <a href="/about">Jewelry Kenepa</a>.</p></div>
        </aside>
      </section>
      <section className="domain-section shell" aria-labelledby="domains-heading">
        <div className="section-kicker"><span>01</span><h2 id="domains-heading">Knowledge domains</h2></div>
        <div className="domain-grid">
          {domains.map(({ name, icon: Icon, copy }, index) => (
            <a className="domain-card" key={name} href={`/knowledge?topic=${encodeURIComponent(name)}`}>
              <div className="domain-icon"><Icon size={23} /></div><span>0{index + 1}</span><h3>{name}</h3><p>{copy}</p><strong>Explore <ArrowRight size={15} /></strong>
            </a>
          ))}
        </div>
      </section>
      <section className="selected-section shell" aria-labelledby="selected-heading">
        <div className="section-heading">
          <div><span className="micro-label">Selected contributions</span><h2 id="selected-heading">Start with something useful.</h2></div>
          <a className="plain-link" href="/knowledge">View all eight contributions <ArrowRight size={16} /></a>
        </div>
        <div className="contribution-grid">{selected.map((post) => <ContributionCard key={post.id} post={post} />)}</div>
      </section>
      <section className="principles shell">
        <div><span className="micro-label">The standard</span><h2>Useful after the tab is closed.</h2></div>
        <p>Every contribution starts with a real workplace question. The goal is material you can understand, test and apply in your own environment.</p>
      </section>
    </main>
  );
}
