import { ArticleLibrary } from '@/components/article-library';
export const metadata = { title: 'Knowledge' };
export default async function Knowledge({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <main id="main">
      <header className="page-heading shell">
        <div><span className="micro-label">Library / 08 contributions</span><h1>Knowledge</h1></div>
        <p>Search practical guides, builds and insights from Microsoft workplace projects.</p>
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
