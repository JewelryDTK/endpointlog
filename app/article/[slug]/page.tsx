import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';
import { posts } from '@/lib/content';
import { ContributionCard } from '@/components/site-parts';

export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return { title: 'Contribution not found', robots: { index: false, follow: false } };
  const url = `/article/${post.slug}/`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: post.title, description: post.summary, publishedTime: new Date(`${post.date} 00:00:00 GMT`).toISOString(), authors: ['Jewelry Kenepa'], images: [{ url: post.image, alt: post.title }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary, images: [post.image] },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const sections = post.blocks.map((block, index) => ({ ...block, index })).filter((block) => block.type === 'h2' || block.type === 'h3');
  const related = posts.filter((item) => item.id !== post.id && item.topics.some((topic) => post.topics.includes(topic))).slice(0, 3);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: `https://endpointlog.com${post.image}`,
    datePublished: new Date(`${post.date} 00:00:00 GMT`).toISOString(),
    dateModified: new Date(`${post.date} 00:00:00 GMT`).toISOString(),
    author: { '@type': 'Person', name: 'Jewelry Kenepa', url: 'https://endpointlog.com/about/' },
    publisher: { '@type': 'Organization', name: 'EndpointLog', url: 'https://endpointlog.com/' },
    mainEntityOfPage: `https://endpointlog.com/article/${post.slug}/`,
  };
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
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
      <div className="shell article-cover"><img src={post.image} alt={post.title} width="1200" height="620" /></div>
      <div className="shell article-layout">
        <aside className="article-toc">
          <span className="micro-label">On this page</span>
          <nav>{sections.length ? sections.map((section) => <a key={section.index} href={`#section-${section.index}`}>{section.text}</a>) : <a href="#article-content">Read the contribution</a>}</nav>
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
