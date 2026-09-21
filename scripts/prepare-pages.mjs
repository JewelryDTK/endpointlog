import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
const output = new URL('../dist/client/', import.meta.url);

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

await addPrettyRoutes();
await writeFile(new URL('.nojekyll', output), '');
