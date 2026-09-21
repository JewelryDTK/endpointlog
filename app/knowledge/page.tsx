import { ArticleLibrary } from '@/components/article-library';
export const metadata = { title: 'Knowledge', description: 'Browse practical Microsoft workplace guides, builds and insights.', alternates: { canonical: '/knowledge/' } };
export default function Knowledge() {
  return (
    <main id="main">
      <header className="page-heading shell">
        <div><span className="micro-label">Knowledge library</span><h1>Knowledge</h1></div>
        <p>Search practical guides, builds and insights from Microsoft workplace projects.</p>
      </header>
      <section className="shell knowledge-library" aria-label="Knowledge contributions">
        <ArticleLibrary />
      </section>
    </main>
  );
}
