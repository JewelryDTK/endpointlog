export default function NotFound() {
  return (
    <main id="main" className="page-heading shell" style={{ minHeight: '65vh' }}>
      <span className="micro-label">404 · Page not found</span>
      <h1>This path is not<br />in the field manual.</h1>
      <p>Browse the knowledge base to find all published guides, builds and insights.</p>
      <a className="button" href="/knowledge" style={{ marginTop: 28 }}>Explore knowledge</a>
    </main>
  );
}
