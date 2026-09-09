import { Search, X } from 'lucide-react';
import { ContributionCard } from './site-parts';
import { contentTypes, posts, topics, type ContentType, type Topic } from '@/lib/content';

type Props = { topic: string; type: string; query: string };

export function ArticleLibrary({ topic, type, query }: Props) {
  const activeTopic: Topic | '' = topics.includes(topic as Topic) ? topic as Topic : '';
  const activeType: ContentType | '' = contentTypes.includes(type as ContentType) ? type as ContentType : '';
  const needle = query.trim().toLowerCase();
  const filtered = posts.filter((post) =>
    (!activeTopic || post.topics.includes(activeTopic)) &&
    (!activeType || post.type === activeType) &&
    (!needle || [post.title, post.summary, post.type, ...post.topics].join(' ').toLowerCase().includes(needle))
  );

  const filterUrl = (nextTopic: string, nextType: string) => {
    const params = new URLSearchParams();
    if (nextTopic) params.set('topic', nextTopic);
    if (nextType) params.set('type', nextType);
    if (query) params.set('q', query);
    return '/knowledge' + (params.size ? '?' + params.toString() : '');
  };

  return (
    <>
      <div className="knowledge-controls">
        <form action="/knowledge" method="get" className="knowledge-search">
          {activeTopic && <input type="hidden" name="topic" value={activeTopic} />}
          {activeType && <input type="hidden" name="type" value={activeType} />}
          <Search size={19} aria-hidden="true" />
          <input aria-label="Search knowledge" placeholder="Search titles, topics and summaries" type="search" name="q" defaultValue={query} />
          <button type="submit">Search</button>
        </form>
        <div className="filter-groups">
          <fieldset>
            <legend>Topic</legend>
            <div className="filter-row">
              <a href={filterUrl('', activeType)} aria-current={!activeTopic ? 'page' : undefined}>All</a>
              {topics.map((item) => <a key={item} href={filterUrl(item, activeType)} aria-current={activeTopic === item ? 'page' : undefined}>{item}</a>)}
            </div>
          </fieldset>
          <fieldset>
            <legend>Format</legend>
            <div className="filter-row">
              <a href={filterUrl(activeTopic, '')} aria-current={!activeType ? 'page' : undefined}>All</a>
              {contentTypes.map((item) => <a key={item} href={filterUrl(activeTopic, item)} aria-current={activeType === item ? 'page' : undefined}>{item}</a>)}
            </div>
          </fieldset>
        </div>
      </div>
      <div className="results-header">
        <p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'contribution' : 'contributions'}</p>
        {(activeTopic || activeType || query) && <a href="/knowledge">Clear filters <X size={15} /></a>}
      </div>
      {filtered.length ? (
        <div className="contribution-grid">{filtered.map((post) => <ContributionCard key={post.id} post={post} />)}</div>
      ) : (
        <section className="empty-state">
          <Search size={30} />
          <h2>No matching contributions</h2>
          <p>Try a broader search or remove one of the filters.</p>
          <a className="button" href="/knowledge">Show all knowledge</a>
        </section>
      )}
    </>
  );
}
