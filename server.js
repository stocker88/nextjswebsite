import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { BrowserRouter } from 'react-router-dom';
import Routes2 from './Routes';

const app = express();

app.use((req, res) => {
  const context = {};
  const appMarkup = renderToString(
      <Routes2 />
  );

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Isomorphic React-Node Application</title>
      </head>
      <body>
        <div id="root">${appMarkup}</div>
        <script src="/build/server.js"></script>
      </body>
    </html>
  `);
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
