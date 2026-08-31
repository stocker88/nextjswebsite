const fs = require('fs');
const path = require('path');

const siteUrl = 'https://www.stockstobuynow.ai';
const projectRoot = path.resolve(__dirname, '..');
const postsDirectory = path.join(projectRoot, '_posts');
const outputPath = path.join(projectRoot, 'public', 'sitemap.xml');

const escapeXml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const urls = [
  { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${siteUrl}/facts`, priority: '0.9', changefreq: 'monthly' },
  { loc: `${siteUrl}/web-app`, priority: '0.7', changefreq: 'monthly' },
];

for (const filename of fs.readdirSync(postsDirectory)) {
  if (!filename.endsWith('.md')) continue;

  const slug = filename.replace(/\.md$/, '');
  const filePath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const frontMatter = fileContents.match(/^---\s*\n([\s\S]*?)\n---/);
  const dateMatch = frontMatter?.[1].match(/^date:\s*['"]?([^'"\n]+)['"]?\s*$/m);
  const parsedDate = dateMatch?.[1] ? new Date(dateMatch[1].trim()) : null;

  urls.push({
    loc: `${siteUrl}/posts/${slug}`,
    lastmod: parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : undefined,
    priority: slug === 'privacypolicy' ? '0.3' : '0.8',
    changefreq: slug === 'privacypolicy' ? 'yearly' : 'monthly',
  });
}

const urlXml = urls.map(({ loc, lastmod, priority, changefreq }) => [
  '  <url>',
  `    <loc>${escapeXml(loc)}</loc>`,
  lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
  `    <changefreq>${changefreq}</changefreq>`,
  `    <priority>${priority}</priority>`,
  '  </url>',
].filter(Boolean).join('\n')).join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urlXml,
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(outputPath, sitemap);
console.log(`Generated ${outputPath} with ${urls.length} URLs.`);
