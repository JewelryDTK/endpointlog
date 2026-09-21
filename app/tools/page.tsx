import { ArrowRight, Braces, CheckCircle2 } from 'lucide-react';
import { articleUrl, posts, toolDetails } from '@/lib/content';
export const metadata = { title: 'Tools', description: 'Practical Microsoft workplace scripts and builds with context, safeguards and outcomes.', alternates: { canonical: '/tools/' } };
export default function Tools() {
  const builds = posts.filter((post) => post.type === 'Build');
  return (
    <main id="main">
      <header className="page-heading shell">
        <div><span className="micro-label">Build library</span><h1>Tools</h1></div>
        <p>Scripts and practical solutions, including the problem, technology and decisions behind them.</p>
      </header>
      <section className="shell tool-list" aria-label="Practical tools">
        {builds.map((post) => {
          const detail = toolDetails[post.id];
          return (
            <article className="tool-card" key={post.id}>
              <div className="tool-main">
                <div className="tool-title-row"><span className="type-badge type-build">Build</span><span>{post.date}</span></div>
                <h2><a href={articleUrl(post)}>{post.title}</a></h2>
                <div className="tool-details">
                  <div><span className="micro-label">Problem</span><p>{detail.problem}</p></div>
                  <div><span className="micro-label">Outcome</span><p>{detail.outcome}</p></div>
                </div>
                <div className="tech-list">{detail.technology.map((technology) => <span key={technology}>{technology}</span>)}</div>
              </div>
              <div className="tool-action"><Braces size={25} /><a href={articleUrl(post)}>Open build notes <ArrowRight size={16} /></a></div>
            </article>
          );
        })}
      </section>
      <section className="shell tool-principle"><CheckCircle2 size={24} /><p>Each build explains why it exists, what it changes and how to approach it safely.</p></section>
    </main>
  );
}
