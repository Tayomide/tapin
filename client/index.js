const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static assets under /assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Dynamic middleware to serve HTML files based on route structure
app.use((req, res, next) => {
  const filePath = path.join(__dirname, req.path, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      next(); // Move to the next middleware if the file isn't found
    }
  });
});

// Default route for root index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
