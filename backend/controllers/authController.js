const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
    
    return { accessToken, refreshToken };
};

// Register new user
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role = 'user' } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user' // Prevent unauthorized admin creation
        });
        
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);
        
        // Remove password from response
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt
        };
        
        console.log(`New user registered: ${email}`);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error(`Registration error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);
        
        // Remove password from response
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt
        };
        
        console.log(`User logged in: ${email}`);
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error(`Login error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Find user
        const user = await User.findByPk(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
        
        // Generate new tokens
        const tokens = generateTokens(user.id);
        
        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
        
        console.error(`Token refresh error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

