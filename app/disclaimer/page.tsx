export const metadata = { title: 'Disclaimer', description: 'Important information about using EndpointLog content.', alternates: { canonical: '/disclaimer/' } };

export default function Disclaimer() {
  return (
    <main id="main">
      <header className="page-heading shell"><div><span className="micro-label">Legal</span><h1>Disclaimer</h1></div><p>Important context for using EndpointLog content.</p></header>
      <article className="shell legal-content">
        <p><strong>Last updated:</strong> 21 September 2026</p>
        <h2>Independent publication</h2>
        <p>EndpointLog is an independent publication. It is not affiliated with, endorsed by or sponsored by Microsoft. Product names and trademarks belong to their respective owners.</p>
        <h2>Informational content</h2>
        <p>Content reflects practical experience and information available when published. Technology changes. No guarantee is made that every article remains complete, current or suitable for your environment.</p>
        <h2>Test before production</h2>
        <p>Verify settings against current official documentation. Review scripts before use. Test changes in a safe environment, use least privilege and maintain suitable backups and rollback plans.</p>
        <h2>External links</h2>
        <p>External links are provided for context. EndpointLog is not responsible for third-party availability, content or policies.</p>
      </article>
    </main>
  );
}
