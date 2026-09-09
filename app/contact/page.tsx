import { ArrowUpRight, Mail } from 'lucide-react';
export const metadata = { title: 'Contact' };
export default function Contact() {
  return (
    <main id="main">
      <header className="page-heading shell contact-heading">
        <span className="micro-label">Contact</span>
        <h1>Start with the<br />technical question.</h1>
        <p>Want to compare notes on a contribution, share a workplace challenge or discuss an idea? Reach out.</p>
      </header>
      <section className="shell contact-options">
        <a href="https://www.linkedin.com/in/jewelrykenepa/" target="_blank" rel="noopener noreferrer">
          <span className="contact-icon">in</span><div><span className="micro-label">LinkedIn</span><h2>Connect with Jewelry</h2><p>The best place for professional conversations and updates.</p></div><ArrowUpRight size={22} />
        </a>
        <a href="mailto:info@workswithai.online">
          <span className="contact-icon"><Mail size={21} /></span><div><span className="micro-label">Email</span><h2>Send a direct note</h2><p>info@workswithai.online</p></div><ArrowUpRight size={22} />
        </a>
      </section>
    </main>
  );
}
