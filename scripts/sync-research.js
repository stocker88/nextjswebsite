const fs = require('fs');
const path = require('path');
const endpoint = 'https://us-central1-stocker-fcda2.cloudfunctions.net/researchPreviews';
(async () => {
  const items = []; let after = null;
  const cursors = new Set();
  do {
    const response = await fetch(endpoint + (after ? '?after=' + encodeURIComponent(after) : ''), {signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`Research endpoint returned ${response.status}. Deploy functions:researchPreviews first.`);
    const page = await response.json();
    if (!Array.isArray(page.items)) throw new Error('Invalid research response');
    items.push(...page.items);
    after = page.next;
    if (after && cursors.has(after)) throw new Error('Repeated research cursor');
    if (after) cursors.add(after);
  } while (after);
  items.sort((a,b) => (b.time || 0) - (a.time || 0));
  fs.writeFileSync(path.join(__dirname, '../data/research.json'), JSON.stringify(items));
  const now = Date.now();
  const milliseconds = time => time < 1e12 ? time * 1000 : time;
  const recent = items.filter(item => Number.isFinite(item.time) &&
    milliseconds(item.time) >= now - 10 * 86400000 && milliseconds(item.time) <= now);
  const destination = path.join(__dirname, '../public/research-previews.json');
  fs.mkdirSync(path.dirname(destination), {recursive:true});
  fs.writeFileSync(destination, JSON.stringify({kind:'recent-research', updatedAt:new Date(now).toISOString(), items:recent}));
  console.log(`Synced ${items.length} research previews`);
})().catch(error => {console.error(error.message); process.exit(1);});
