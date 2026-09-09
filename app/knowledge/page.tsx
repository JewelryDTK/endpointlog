import { ArticleLibrary } from '@/components/article-library';
export const metadata = { title: 'Knowledge' };
export default async function Knowledge({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <main id="main">
      <header className="page-heading shell">
        <span className="micro-label">Knowledge base</span>
        <h1>Find what you need.<br />Understand how it works.</h1>
        <p>Guides, builds and insights from real Microsoft workplace scenarios.</p>
      </header>
      <section className="shell knowledge-library" aria-label="Knowledge contributions">
        <ArticleLibrary
          topic={typeof params.topic === 'string' ? params.topic : ''}
          type={typeof params.type === 'string' ? params.type : ''}
          query={typeof params.q === 'string' ? params.q : ''}
        />
      </section>
    </main>
  );
}
