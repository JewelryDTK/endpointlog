import { ArrowUpRight } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Contact', 'Connect with Jewelry Kenepa about EndpointLog and Microsoft workplace knowledge.', '/contact/');
export default function Contact() {
  return (
    <main id="main">
      <header className="page-heading shell contact-heading">
        <div><span className="micro-label">Get in touch</span><h1>Contact</h1></div>
        <p>Compare notes on a contribution, share a workplace challenge or discuss an idea.</p>
      </header>
      <section className="shell contact-options">
        <a href="https://www.linkedin.com/in/jewelrykenepa/" target="_blank" rel="noopener noreferrer">
          <span className="contact-icon">in</span><div><span className="micro-label">LinkedIn</span><h2>Connect with Jewelry</h2><p>The best place for professional conversations and updates.</p></div><ArrowUpRight size={22} />
        </a>
      </section>
    </main>
  );
}
