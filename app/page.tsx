import { ArrowRight } from 'lucide-react';
import { ContributionCard } from '@/components/site-parts';
import { posts } from '@/lib/content';
import { websiteSchema } from '@/lib/seo';

const domains = [
  { name: 'Endpoints', copy: 'Deployment and management across Windows, macOS and mobile.' },
  { name: 'Security', copy: 'Identity, access and practical workplace controls.' },
  { name: 'Automation', copy: 'Workflows and tools that remove repetitive admin work.' },
  { name: 'AI & Copilot', copy: 'Applied AI across Microsoft 365 and everyday work.' },
] as const;

export default function Home() {
  const selected = [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 8);
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <h1 className="sr-only">EndpointLog — practical Microsoft workplace knowledge</h1>
      <section className="domain-section shell" aria-labelledby="domains-heading">
        <div className="section-kicker"><h2 id="domains-heading">Browse by domain</h2></div>
        <div className="domain-grid">
          {domains.map(({ name, copy }) => (
            <a className="domain-card" key={name} href={`/knowledge?topic=${encodeURIComponent(name)}`}>
              <h3>{name}</h3><p>{copy}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="selected-section" aria-labelledby="selected-heading">
        <div className="shell">
          <div className="section-heading">
            <div><h2 id="selected-heading">Recent contributions</h2></div>
            <a className="plain-link" href="/knowledge">View all articles <ArrowRight size={16} /></a>
          </div>
          <div className="contribution-grid contribution-stack">
            {selected.map((post) => <ContributionCard key={post.id} post={post} showAuthor />)}
          </div>
          <div className="home-more"><a className="button" href="/knowledge/">Explore all knowledge <ArrowRight size={17} /></a></div>
        </div>
      </section>
    </main>
  );
}
