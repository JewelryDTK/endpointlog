import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ContributionCard } from '@/components/site-parts';
import { posts } from '@/lib/content';
import { authorSchema, pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('About Jewelry Kenepa', 'About Jewelry Kenepa and the practical Microsoft workplace knowledge documented on EndpointLog.', '/about/');
const focusAreas = [
  { name: 'Microsoft Intune', topic: 'Endpoints' },
  { name: 'Identity & security', topic: 'Security' },
  { name: 'PowerShell & Graph', topic: 'Automation' },
  { name: 'Microsoft 365 Copilot', topic: 'AI & Copilot' },
] as const;
export default function About() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />
      <header className="about-hero shell">
        <div>
          <span className="micro-label">About / Jewelry Kenepa</span>
          <h1>About Jewelry</h1>
          <p>I’m Jewelry Kenepa, a Senior Technical Consultant working across the Microsoft modern workplace.</p>
          <a className="button" href="https://www.linkedin.com/in/jewelrykenepa/" target="_blank" rel="noopener noreferrer">Connect on LinkedIn <ArrowUpRight size={17} /></a>
        </div>
        <figure><img src="/assets/jewelry.jpg" alt="Jewelry Kenepa" width="480" height="540" /><figcaption><strong>Jewelry Kenepa</strong><span>Senior Technical Consultant</span><span>Netherlands</span></figcaption></figure>
      </header>
      <section className="shell about-story">
        <div><span className="micro-label">Why EndpointLog</span><h2>Notes from real technical work.</h2></div>
        <div>
          <p>A deployment that finally works. A script that saves an afternoon. A security setting with an unexpected consequence. Those are the moments worth documenting.</p>
          <p>EndpointLog brings that work together across endpoints, security, automation and AI. Every contribution aims to give enough context for another practitioner to understand the decision and apply the lesson.</p>
        </div>
      </section>
      <section className="shell expertise-section">
        <div className="section-heading"><div><span className="micro-label">Working areas</span><h2>Areas of focus</h2></div></div>
        <div className="expertise-grid">{focusAreas.map(({ name, topic }) => <a className="domain-card" key={name} href={`/knowledge?topic=${encodeURIComponent(topic)}`}><h3>{name}</h3></a>)}</div>
      </section>
      <section className="shell selected-section">
        <div className="section-heading"><div><span className="micro-label">Recent work</span><h2>Latest contributions</h2></div><a href="/knowledge" className="plain-link">View all knowledge <ArrowRight size={16} /></a></div>
        <div className="contribution-grid contribution-stack">{posts.slice(0, 3).map((post) => <ContributionCard key={post.id} post={post} showAuthor />)}</div>
      </section>
    </main>
  );
}
