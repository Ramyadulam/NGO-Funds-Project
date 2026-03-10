const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDatabase();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/donations', require('./routes/donations'));

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NGO Fund Management API is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to NGO Fund Management API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            ngos: '/api/ngos',
            donations: '/api/donations',
            health: '/api/health'
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
