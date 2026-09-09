import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { posts } from '@/lib/content';
import { ContributionCard } from '@/components/site-parts';

export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return { title: post?.title || 'Contribution not found', description: post?.summary };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const sections = post.blocks.map((block, index) => ({ ...block, index })).filter((block) => block.type === 'h2' || block.type === 'h3');
  const related = posts.filter((item) => item.id !== post.id && item.topics.some((topic) => post.topics.includes(topic))).slice(0, 3);
  return (
    <main id="main">
      <header className="article-heading shell">
        <a href="/knowledge" className="back-link"><ArrowLeft size={16} /> Knowledge</a>
        <div className="article-classification">
          <span className={`type-badge type-${post.type.toLowerCase()}`}>{post.type}</span>
          {post.topics.map((topic) => <a key={topic} href={`/knowledge?topic=${encodeURIComponent(topic)}`}>{topic}</a>)}
        </div>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <div className="article-meta">
          <a href="/about"><img src="/assets/jewelry.jpg" alt="" width="44" height="44" /><span><strong>Jewelry Kenepa</strong><small>Author and practitioner</small></span></a>
          <span><Clock3 size={16} /> {post.minutes} min read</span><span>{post.date}</span>
        </div>
      </header>
      <div className="shell article-cover"><img src={post.image} alt="" width="1200" height="620" /></div>
      <div className="shell article-layout">
        <aside className="article-toc">
          <span className="micro-label">On this page</span>
          <nav>{sections.length ? sections.map((section) => <a key={section.index} href={`#section-${section.index}`}>{section.text}</a>) : <a href="#article-content">Read the contribution</a>}</nav>
          <a className="source-link" href={post.url} target="_blank" rel="noopener noreferrer">Original publication <ArrowUpRight size={14} /></a>
        </aside>
        <article className="article-prose" id="article-content">
          <div className="article-summary"><span className="micro-label">At a glance</span><p>{post.summary}</p></div>
          {post.blocks.map((block, index) =>
            block.type === 'h2' ? <h2 id={`section-${index}`} key={index}>{block.text}</h2> :
            block.type === 'h3' ? <h3 id={`section-${index}`} key={index}>{block.text}</h3> :
            block.type === 'pre' ? <pre key={index} tabIndex={0}><code>{block.text}</code></pre> :
            block.type === 'li' ? <ul key={index}><li>{block.text}</li></ul> :
            <p key={index}>{block.text}</p>
          )}
          <div className="article-author">
            <img src="/assets/jewelry.jpg" alt="Jewelry Kenepa" width="64" height="64" />
            <div><span className="micro-label">Documented by</span><h2>Jewelry Kenepa</h2><p>Senior Technical Consultant sharing practical knowledge from the Microsoft workplace.</p><a href="/about">About Jewelry <ArrowRight size={15} /></a></div>
          </div>
        </article>
      </div>
      <section className="shell related-section">
        <div className="section-heading"><div><span className="micro-label">Continue exploring</span><h2>Related knowledge</h2></div><a className="plain-link" href="/knowledge">All contributions <ArrowRight size={16} /></a></div>
        <div className="contribution-grid">{related.map((item) => <ContributionCard key={item.id} post={item} compact />)}</div>
      </section>
    </main>
  );
}
