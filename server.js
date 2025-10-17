const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Import the API handler
const warriorbotHandler = require('./api/warriorbot.js').default;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('.'));

// API endpoint
app.all('/api/warriorbot', async (req, res) => {
  console.log('API request received:', req.method, req.url);
  console.log('Request body:', req.body);
  
  try {
    // Create a mock response object compatible with Vercel
    const mockRes = {
      status: (code) => ({
        json: (data) => res.status(code).json(data),
        end: () => res.status(code).end()
      }),
      setHeader: (name, value) => res.setHeader(name, value),
      json: (data) => res.json(data)
    };
    
    await warriorbotHandler(req, mockRes);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test API at: http://localhost:${PORT}/test-api.html`);
  console.log(`Main site at: http://localhost:${PORT}/`);
});