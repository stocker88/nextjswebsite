const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/flutter-app') {
      try {
        const flutterAppContent = fs.readFileSync(path.join(__dirname, 'pages/index.tsx'), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(flutterAppContent);
      } catch (error) {
        console.error('Error reading Flutter content:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading Flutter content');
      }
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
