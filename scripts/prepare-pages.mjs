import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
const output = new URL('../dist/client/', import.meta.url);
const pages = [];
const xml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function collectPages(directory = output) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('_')) await collectPages(new URL(`${entry.name}/`, directory));
    } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      const html = await readFile(new URL(entry.name, directory), 'utf8');
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      if (!canonical || pages.some(page => page.url === canonical)) continue;
      const data = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
      const schema = data ? JSON.parse(data) : null;
      pages.push({ url: canonical, article: schema?.['@type'] === 'BlogPosting' ? schema : null });
    }
  }
}

async function addPrettyRoutes(directory = output) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = new URL(entry.name, directory);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('_')) await addPrettyRoutes(new URL(`${entry.name}/`, directory));
      continue;
    }
    if (!entry.name.endsWith('.html') || entry.name === 'index.html' || entry.name === '404.html') continue;
    const routeName = entry.name.slice(0, -5);
    const routeDirectory = new URL(`${routeName}/`, directory);
    await mkdir(routeDirectory, { recursive: true });
    await copyFile(source, new URL('index.html', routeDirectory));
  }
}

await collectPages();
await writeFile(new URL('sitemap.xml', output), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${xml(page.url)}</loc>${page.article ? `<lastmod>${page.article.dateModified}</lastmod>` : ''}</url>`).join('')}</urlset>\n`);
const articles = pages.filter(page => page.article).sort((a,b) => Date.parse(b.article.datePublished) - Date.parse(a.article.datePublished));
await writeFile(new URL('feed.xml', output), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>EndpointLog</title><link>https://endpointlog.com/</link><description>Practical Microsoft workplace knowledge.</description><language>en</language>${articles.map(({url,article}) => `<item><title>${xml(article.headline)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(article.description)}</description><pubDate>${new Date(article.datePublished).toUTCString()}</pubDate></item>`).join('')}</channel></rss>\n`);
await addPrettyRoutes();
await writeFile(new URL('.nojekyll', output), '');
