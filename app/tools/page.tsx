import { ArrowRight, Braces, CheckCircle2 } from 'lucide-react';
import { articleUrl, posts, toolDetails } from '@/lib/content';
export const metadata = { title: 'Tools' };
export default function Tools() {
  const builds = posts.filter((post) => post.type === 'Build');
  return (
    <main id="main">
      <header className="page-heading shell">
        <span className="micro-label">Tools library</span>
        <h1>Built for the work<br />that should be repeatable.</h1>
        <p>Scripts and practical solutions, documented with the problem, technology and decisions behind them.</p>
      </header>
      <section className="shell tool-list" aria-label="Practical tools">
        {builds.map((post, index) => {
          const detail = toolDetails[post.id];
          return (
            <article className="tool-card" key={post.id}>
              <div className="tool-index">0{index + 1}</div>
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
      <section className="shell tool-principle">
        <CheckCircle2 size={28} /><div><span className="micro-label">Built with context</span><h2>The code is only part of the solution.</h2><p>Each build explains why it exists, what it changes and how to approach it safely.</p></div>
      </section>
    </main>
  );
}
