import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ContributionCard } from '@/components/site-parts';
import { posts } from '@/lib/content';
export const metadata = { title: 'About Jewelry Kenepa' };
export default function About() {
  return (
    <main id="main">
      <header className="about-hero shell">
        <div>
          <span className="micro-label">About the practitioner</span>
          <h1>Learning in the field.<br />Documenting what lasts.</h1>
          <p>I’m Jewelry Kenepa, a Senior Technical Consultant working across the Microsoft modern workplace.</p>
          <a className="button" href="https://www.linkedin.com/in/jewelrykenepa/" target="_blank" rel="noopener noreferrer">Connect on LinkedIn <ArrowUpRight size={17} /></a>
        </div>
        <figure><img src="/assets/jewelry.jpg" alt="Jewelry Kenepa" width="480" height="540" /><figcaption>Senior Technical Consultant · Netherlands</figcaption></figure>
      </header>
      <section className="shell about-story">
        <div><span className="micro-label">Why EndpointLog</span><h2>Practical work deserves practical documentation.</h2></div>
        <div>
          <p>A deployment that finally works. A script that saves an afternoon. A security setting with an unexpected consequence. Those are the moments worth documenting.</p>
          <p>EndpointLog brings that work together across endpoints, security, automation and AI. Every contribution aims to give enough context for another practitioner to understand the decision and apply the lesson.</p>
        </div>
      </section>
      <section className="shell expertise-section">
        <div className="section-heading"><div><span className="micro-label">Working areas</span><h2>One workplace. Connected disciplines.</h2></div></div>
        <div className="expertise-grid">{['Microsoft Intune', 'Identity & security', 'PowerShell & Graph', 'Microsoft 365 Copilot'].map((item, index) => <div key={item}><span>0{index + 1}</span><h3>{item}</h3></div>)}</div>
      </section>
      <section className="shell selected-section">
        <div className="section-heading"><div><span className="micro-label">Recent work</span><h2>From the field manual.</h2></div><a href="/knowledge" className="plain-link">View all knowledge <ArrowRight size={16} /></a></div>
        <div className="contribution-grid">{posts.slice(0, 3).map((post) => <ContributionCard key={post.id} post={post} compact />)}</div>
      </section>
    </main>
  );
}
