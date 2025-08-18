const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const passport = require('./config/passport');
require('dotenv').config();

// Import utilities and middleware
const logger = require('./utils/logger');
const { sequelize } = require('./models');
const { monitorPort } = require('./monitor-port');

// Import routes
const authRoutes = require('./routes/auth');
const warehouseRoutes = require('./routes/warehouses');
const publicWarehouseRoutes = require('./routes/publicWarehouseRoutes');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy (for nginx)
app.set('trust proxy', 1); // Trust first proxy only

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    trustProxy: false, // Disable since we're setting trust proxy globally
});
// app.use('/api/', limiter); // Temporarily disabled to avoid trust proxy issues

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://vijayg.dev',
        process.env.CORS_ORIGIN
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-visitor-id']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Passport
app.use(passport.initialize());

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.info(`Created uploads directory: ${uploadsDir}`);
}

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, uploadsDir)));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Warehouse Listing Platform API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/auth', authRoutes);
// OAuth routes (for nginx compatibility)
app.use('/auth', authRoutes);
app.use('/', warehouseRoutes);
app.use('/', publicWarehouseRoutes);
app.use('/api/admin', adminRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Warehouse Listing Platform API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            warehouses: '/api/warehouses',
            public: '/api/public/warehouses',
            admin: '/api/admin'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    logger.error(`Global error handler: ${error.message}`, {
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    // Multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum allowed size is 5MB per image.'
        });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            success: false,
            message: `Too many files. Maximum allowed is ${process.env.MAX_IMAGES || 5} images.`
        });
    }

    if (error.message.includes('Only image files')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // Database errors
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({
            field: err.path,
            message: err.message
        }));
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Resource already exists'
        });
    }

    // JSON parsing errors
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format in request body'
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        // Clean up any existing processes on port 8080
        await monitorPort();
        
        // Test database connection
        await sequelize.authenticate();
        logger.info('Database connection established successfully');

        // Sync database models (in development)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ force: false });
            logger.info('Database models synchronized');
        }

        // Start server with error handling
        const server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
            console.log(`🚀 Warehouse Listing Platform API running on http://localhost:${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is already in use. Trying to find an available port...`);
                // Try alternative ports
                const tryPort = (port) => {
                    const altServer = app.listen(port, () => {
                        logger.info(`Server running on alternative port ${port}`);
                        console.log(`🚀 Warehouse Listing Platform API running on http://localhost:${port}`);
                    });
                    altServer.on('error', (err) => {
                        if (err.code === 'EADDRINUSE' && port < 8090) {
                            tryPort(port + 1);
                        } else {
                            logger.error(`Failed to start server: ${err.message}`);
                            process.exit(1);
                        }
                    });
                };
                tryPort(8081);
            } else {
                logger.error(`Server error: ${error.message}`);
                process.exit(1);
            }
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            logger.info(`Received ${signal}. Starting graceful shutdown...`);
            
            server.close(async () => {
                logger.info('HTTP server closed');
                
                try {
                    await sequelize.close();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during database shutdown:', error);
                    process.exit(1);
                }
            });
        };

        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app;