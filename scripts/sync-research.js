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
  console.log(`Synced ${items.length} research previews`);
})().catch(error => {console.error(error.message); process.exit(1);});
