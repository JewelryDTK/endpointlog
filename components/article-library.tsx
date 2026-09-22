'use client';

import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ContributionCard } from './site-parts';
import { contentTypes, posts, topics, type ContentType, type Topic } from '@/lib/content';

type Filters = { topic: Topic | ''; type: ContentType | ''; query: string };

function readFilters(): Filters {
  if (typeof window === 'undefined') return { topic: '', type: '', query: '' };
  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic') || '';
  const type = params.get('type') || '';
  return {
    topic: topics.includes(topic as Topic) ? topic as Topic : '',
    type: contentTypes.includes(type as ContentType) ? type as ContentType : '',
    query: params.get('q') || '',
  };
}

function filterUrl(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.topic) params.set('topic', filters.topic);
  if (filters.type) params.set('type', filters.type);
  if (filters.query) params.set('q', filters.query);
  return '/knowledge/' + (params.size ? '?' + params.toString() : '');
}

export function ArticleLibrary() {
  const [filters, setFilters] = useState<Filters>({ topic: '', type: '', query: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const sync = () => { const next = readFilters(); setFilters(next); setSearch(next.query); };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const updateFilters = (next: Filters) => {
    window.history.pushState({}, '', filterUrl(next));
    setFilters(next);
    setSearch(next.query);
  };

  const filtered = useMemo(() => {
    const needle = filters.query.trim().toLowerCase();
    return posts.filter((post) =>
      (!filters.topic || post.topics.includes(filters.topic)) &&
      (!filters.type || post.type === filters.type) &&
      (!needle || [post.title, post.summary, post.type, ...post.topics].join(' ').toLowerCase().includes(needle))
    );
  }, [filters]);

  const submitSearch = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFilters({ ...filters, query: search.trim() });
  };

  return (
    <>
      <div className="knowledge-controls">
        <form action="/knowledge/" method="get" className="knowledge-search" onSubmit={submitSearch}>
          <Search size={19} aria-hidden="true" />
          <input aria-label="Search knowledge" placeholder="Search titles, topics and summaries" type="search" name="q" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button type="submit">Search</button>
        </form>
        <div className="filter-groups">
          <fieldset>
            <legend>Topic</legend>
            <div className="filter-row">
              <a href={filterUrl({ ...filters, topic: '' })} onClick={(event) => { event.preventDefault(); updateFilters({ ...filters, topic: '' }); }} aria-current={!filters.topic ? 'page' : undefined}>All</a>
              {topics.map((item) => <a key={item} href={filterUrl({ ...filters, topic: item })} onClick={(event) => { event.preventDefault(); updateFilters({ ...filters, topic: item }); }} aria-current={filters.topic === item ? 'page' : undefined}>{item}</a>)}
            </div>
          </fieldset>
          <fieldset>
            <legend>Format</legend>
            <div className="filter-row">
              <a href={filterUrl({ ...filters, type: '' })} onClick={(event) => { event.preventDefault(); updateFilters({ ...filters, type: '' }); }} aria-current={!filters.type ? 'page' : undefined}>All</a>
              {contentTypes.map((item) => <a key={item} href={filterUrl({ ...filters, type: item })} onClick={(event) => { event.preventDefault(); updateFilters({ ...filters, type: item }); }} aria-current={filters.type === item ? 'page' : undefined}>{item}</a>)}
            </div>
          </fieldset>
        </div>
      </div>
      <div className="results-header">
        <p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'contribution' : 'contributions'}</p>
        {(filters.topic || filters.type || filters.query) && <a href="/knowledge/" onClick={(event) => { event.preventDefault(); updateFilters({ topic: '', type: '', query: '' }); }}>Clear filters <X size={15} /></a>}
      </div>
      {filtered.length ? (
        <div className="contribution-grid contribution-stack">{filtered.map((post) => <ContributionCard key={post.id} post={post} showAuthor />)}</div>
      ) : (
        <section className="empty-state">
          <Search size={30} />
          <h2>No matching contributions</h2>
          <p>Try a broader search or remove one of the filters.</p>
          <a className="button" href="/knowledge/" onClick={(event) => { event.preventDefault(); updateFilters({ topic: '', type: '', query: '' }); }}>Show all knowledge</a>
        </section>
      )}
    </>
  );
}
