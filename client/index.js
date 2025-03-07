const express = require('express');
const path = require('path');

const app = express();
// TODO: Make this an env
const PORT = 3000;

// Note: Nginx handles static assets in production
// Serve static assets under /assets
// if(process.env.NODE_ENV !== 'production')
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
