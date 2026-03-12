require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Security headers (CSP disabled — React SPA serves all assets same-origin)
app.use(helmet({ contentSecurityPolicy: false }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stripe webhook needs raw body — mount BEFORE json middleware
app.use('/api/payment', require('./routes/payment'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/services',  require('./routes/services'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/tutorials', require('./routes/tutorials'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/quotes',    require('./routes/quotes'));
app.use('/api/designs',   require('./routes/designs'));
app.use('/api/contact',   require('./routes/contact'));
app.use('/api/clients',   require('./routes/clients'));
app.use('/api/admin',     require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Request logger — logs every request with timestamp so we can debug routing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Serve frontend static files (always — works in both dev and production on server)
const frontendPath = path.join(__dirname, '../../client/public_html');
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  // React Router catch-all — serve index.html for any non-API route
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // Dev: no build present, just return 404 for unknown routes
  app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Rokit Media API running on port ${PORT}`));
