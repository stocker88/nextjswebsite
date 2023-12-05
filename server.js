// server.js or api/server.js

const express = require('express');
const path = require('path');

const app = express();

// Serve static assets with caching
app.use('/static', express.static(path.join(__dirname, 'public'), {
  maxAge: '30d',
  immutable: true,
}));

// Define other routes or server configurations as needed

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
