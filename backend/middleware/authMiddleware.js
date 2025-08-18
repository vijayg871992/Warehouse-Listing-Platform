const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify JWT access token
const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user
        const user = await User.findByPk(decoded.userId);
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Add user info to request
        req.userId = user.id;
        req.user = user;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Verify admin role
const verifyAdminRole = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const user = await User.findByPk(decoded.userId);
                    
                    if (user && user.isActive) {
                        req.userId = user.id;
                        req.user = user;
                    }
                } catch (error) {
                    // Ignore token errors for optional auth
                }
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

module.exports = {
    authMiddleware: verifyAccessToken,
    adminMiddleware: verifyAdminRole,
    optionalAuth,
    verifyAccessToken,
    verifyAdminRole
};