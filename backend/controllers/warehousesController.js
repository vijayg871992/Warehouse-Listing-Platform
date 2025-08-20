/**
 * Warehouse Controller
 * Handles warehouse management operations including CRUD and image uploads
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Warehouse, WarehouseApproval, User } = require('../models');
const { Op, Sequelize } = require('sequelize');
const winston = require('winston');

/**
 * Configure Winston logger for warehouse operations
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/warehouses.log' })
    ]
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `warehouse-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed!'));
        }
    },
});

// Utility functions
const getBaseUrl = (req) => {
    return 'https://vijayg.dev/warehouse-listing';
};

const getFullImageUrl = (imagePath, req) => {
    if (!imagePath) return null;
    
    // Avoid duplicating base URL if already present
    if (imagePath.startsWith('http')) return imagePath;
    
    const baseUrl = getBaseUrl(req);
    return `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
};

const processImages = (imagesData, req) => {
    if (!imagesData) return [];

    if (typeof imagesData === 'string') {
        return imagesData.split(',')
            .map(img => img.trim())
            .filter(Boolean)
            .map(img => getFullImageUrl(img, req));
    }

    if (Array.isArray(imagesData)) {
        return imagesData
            .map(img => img.trim())  
            .filter(Boolean)
            .map(img => getFullImageUrl(img, req));
    }

    return [];
};

const sanitizeWarehouseData = (data) => {
    const sanitized = {};
    
    // Handle numeric fields
    const numericFields = [
        'build_up_area', 'total_plot_area', 'total_parking_area', 
        'plinth_height', 'electricity_kva', 'rent', 'deposit', 
        'dock_doors', 'pin_code'
    ];
    
    numericFields.forEach(field => {
        if (data[field] === 'null' || data[field] === '' || data[field] === undefined) {
            sanitized[field] = null;
        } else {
            const num = Number(data[field]);
            sanitized[field] = isNaN(num) ? null : num;
        }
    });

    // Handle ENUM fields
    const enumFields = ['plot_status', 'listing_for', 'floor_plans', 'ownership_type', 'warehouse_type'];
    enumFields.forEach(field => {
        sanitized[field] = data[field] === 'null' || data[field] === '' ? null : data[field];
    });

    // Handle text fields
    const textFields = [
        'name', 'mobile_number', 'email', 'address', 'city', 'state', 
        'description', 'comments', 'rejection_reason'
    ];
    textFields.forEach(field => {
        sanitized[field] = data[field] === 'null' || data[field] === undefined ? null : data[field];
    });

    return sanitized;
};

// Helper function to get client IP
const getClientIP = (req) => {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '0.0.0.0';
};

// Middleware for file upload
exports.uploadMiddleware = upload.array('images', 5);

// Get city/state suggestions for autocomplete
exports.getCityStateSuggestions = async (req, res) => {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
        return res.json([]);
    }

    try {
        const results = await Warehouse.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('city')), 'city'],
                'state'
            ],
            where: {
                [Op.or]: [
                    { city: { [Op.iLike]: `%${query}%` } },
                    { state: { [Op.iLike]: `%${query}%` } }
                ],
                approval_status: 'approved'
            },
            limit: 10,
            order: [['city', 'ASC']]
        });

        const suggestions = results.map(result => ({
            city: result.city.trim(),
            state: result.state.trim(),
            label: `${result.city.trim()}, ${result.state.trim()}`
        }));

        res.json(suggestions);
    } catch (error) {
        logger.error(`Error fetching city/state suggestions: ${error.message}`);
        res.status(500).json({ error: 'Server error while fetching suggestions' });
    }
};

// Get warehouses with advanced filtering and pagination
exports.getWarehouses = async (req, res) => {
    const { 
        page = 1, 
        limit = 12, 
        location, 
        warehouse_type, 
        sizeRange, 
        budgetRange,
        ownership_type,
        listing_for,
        plot_status,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        search,
        showAll = false 
    } = req.query;
    
    const offset = (page - 1) * limit;

    try {
        const filter = {};
        
        // Basic filters
        if (location) {
            filter[Op.or] = [
                { city: { [Op.iLike]: `%${location}%` } },
                { state: { [Op.iLike]: `%${location}%` } },
                { address: { [Op.iLike]: `%${location}%` } }
            ];
        }
        
        if (warehouse_type) filter.warehouse_type = warehouse_type;
        if (ownership_type) filter.ownership_type = ownership_type;
        if (listing_for) filter.listing_for = listing_for;
        if (plot_status) filter.plot_status = plot_status;

        // Size range filter
        if (sizeRange) {
            const [minSize, maxSize] = sizeRange.split(',').map(Number);
            if (!isNaN(minSize) && !isNaN(maxSize)) {
                filter.build_up_area = { [Op.between]: [minSize, maxSize] };
            }
        }

        // Budget range filter
        if (budgetRange) {
            const [minBudget, maxBudget] = budgetRange.split(',').map(Number);
            if (!isNaN(minBudget) && !isNaN(maxBudget)) {
                filter.rent = { [Op.between]: [minBudget, maxBudget] };
            }
        }

        // Search filter
        if (search) {
            filter[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } },
                { city: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Visibility filter
        if (!showAll) {
            if (req.userId) {
                filter[Op.or] = [
                    { owner_id: req.userId },
                    { approval_status: 'approved' }
                ];
            } else {
                filter.approval_status = 'approved';
            }
        }

        // Sorting options
        const allowedSortFields = ['createdAt', 'updatedAt', 'rent', 'build_up_area', 'views', 'name'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        const { rows: warehouses, count } = await Warehouse.findAndCountAll({
            where: filter,
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'firstName', 'lastName', 'email'],
                required: false
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[validSortBy, validSortOrder]],
            distinct: true
        });

        // Process images for each warehouse
        const processedWarehouses = warehouses.map(warehouse => {
            const warehouseData = warehouse.toJSON();
            warehouseData.images = processImages(warehouseData.images, req);
            return warehouseData;
        });

        res.status(200).json({ 
            success: true, 
            data: processedWarehouses, 
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit),
                hasNext: page < Math.ceil(count / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        logger.error(`Error in getWarehouses: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch warehouses',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get warehouse by ID with view tracking
exports.getWarehouseById = async (req, res) => {
    const { id } = req.params;
    const clientIP = getClientIP(req);

    try {
        const warehouse = await Warehouse.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: WarehouseApproval,
                    as: 'approval',
                    attributes: ['status', 'comment', 'updatedAt']
                }
            ]
        });

        if (!warehouse) {
            return res.status(404).json({ 
                success: false, 
                message: 'Warehouse not found' 
            });
        }

        // Check if user can view this warehouse
        const canView = warehouse.approval_status === 'approved' || 
                       (req.userId && warehouse.owner_id === req.userId);

        if (!canView) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to view this warehouse' 
            });
        }

        const warehouseData = warehouse.toJSON();
        warehouseData.images = processImages(warehouseData.images, req);


        res.status(200).json({ 
            success: true, 
            data: warehouseData 
        });
    } catch (error) {
        logger.error(`Error in getWarehouseById: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch warehouse details' 
        });
    }
};

// Create a new warehouse
exports.createWarehouse = async (req, res) => {
    const sequelize = require('../config/database');
    
    try {
        logger.info('Creating new warehouse', {
            userId: req.userId,
            body: req.body,
            filesCount: req.files ? req.files.length : 0
        });

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Validate required fields
        const requiredFields = ['name', 'mobile_number', 'email', 'address', 'city', 'state', 'pin_code', 'warehouse_type', 'build_up_area', 'ownership_type'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check for duplicate warehouse (same name and address)
        const existingWarehouse = await Warehouse.findOne({
            where: {
                name: req.body.name.trim(),
                address: req.body.address.trim()
            }
        });

        if (existingWarehouse) {
            return res.status(409).json({
                success: false,
                message: 'A warehouse with the same name and address already exists. Please use a different name or address.'
            });
        }

        // Process images
        let imagesArray = [];
        if (req.files && req.files.length > 0) {
            imagesArray = req.files.map(file => file.path.replace(/\\/g, '/'));
            
            if (imagesArray.length > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Maximum 5 images allowed'
                });
            }
        }

        // Process additional details
        let parsedAdditionalDetails = {};
        if (req.body.additional_details) {
            try {
                parsedAdditionalDetails = typeof req.body.additional_details === 'string' 
                    ? JSON.parse(req.body.additional_details)
                    : req.body.additional_details;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid JSON in additional_details'
                });
            }
        }

        // Sanitize data
        const sanitizedData = sanitizeWarehouseData(req.body);

        // Start transaction
        const result = await sequelize.transaction(async (t) => {
            // Create warehouse
            const newWarehouse = await Warehouse.create({
                ...sanitizedData,
                images: imagesArray,
                additional_details: parsedAdditionalDetails,
                owner_id: req.userId,
                approval_status: 'pending',
                views: 0
            }, { transaction: t });

            // Create approval record
            await WarehouseApproval.create({
                warehouse_id: newWarehouse.id,
                status: 'pending'
            }, { transaction: t });

            return newWarehouse;
        });

        logger.info(`Warehouse created successfully: ${result.id}`);
        
        res.status(201).json({ 
            success: true, 
            data: result,
            message: 'Warehouse created successfully and submitted for approval'
        });
    } catch (error) {
        logger.error(`Error creating warehouse: ${error.message}`);
        
        // Clean up uploaded files if warehouse creation failed
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) logger.error(`Failed to delete file: ${file.path}`);
                });
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Failed to create warehouse',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update existing warehouse
exports.updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;

        const warehouse = await Warehouse.findByPk(id);
        if (!warehouse) {
            return res.status(404).json({ 
                success: false, 
                message: 'Warehouse not found' 
            });
        }

        // Check ownership
        if (warehouse.owner_id !== req.userId) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only update your own warehouses' 
            });
        }

        // Process images
        let finalImages = [];
        
        // Handle existing images
        if (req.body.existing_images) {
            try {
                const existingImages = typeof req.body.existing_images === 'string' 
                    ? JSON.parse(req.body.existing_images)
                    : req.body.existing_images;
                
                if (Array.isArray(existingImages)) {
                    finalImages = existingImages.filter(img => img && !img.startsWith('blob:'));
                }
            } catch (error) {
                logger.warn('Error parsing existing_images:', error);
            }
        }
        
        // Add new uploaded images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path.replace(/\\/g, '/'));
            finalImages = [...finalImages, ...newImages];
        }

        // Validate image count
        if (finalImages.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 5 images allowed'
            });
        }

        // Sanitize update data
        const sanitizedData = sanitizeWarehouseData(req.body);

        // Process additional details if provided
        let parsedAdditionalDetails = warehouse.additional_details;
        if (req.body.additional_details) {
            try {
                parsedAdditionalDetails = typeof req.body.additional_details === 'string' 
                    ? JSON.parse(req.body.additional_details)
                    : req.body.additional_details;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid JSON in additional_details'
                });
            }
        }

        // Update warehouse
        await warehouse.update({
            ...sanitizedData,
            images: finalImages.length > 0 ? finalImages : null,
            additional_details: parsedAdditionalDetails,
            approval_status: 'pending' // Reset to pending after update
        });

        // Update approval status
        await WarehouseApproval.update(
            { status: 'pending' },
            { where: { warehouse_id: id } }
        );

        const updatedWarehouse = await Warehouse.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });

        const warehouseData = updatedWarehouse.toJSON();
        warehouseData.images = processImages(warehouseData.images, req);

        res.status(200).json({ 
            success: true, 
            data: warehouseData,
            message: 'Warehouse updated successfully and resubmitted for approval'
        });
    } catch (error) {
        logger.error('Update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update warehouse',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete a warehouse
exports.deleteWarehouse = async (req, res) => {
    const { id } = req.params;
    
    try {
        const warehouse = await Warehouse.findByPk(id);
        if (!warehouse) {
            return res.status(404).json({ 
                success: false, 
                message: 'Warehouse not found' 
            });
        }

        // Check ownership
        if (warehouse.owner_id !== req.userId) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only delete your own warehouses' 
            });
        }

        // Delete associated files
        if (warehouse.images) {
            const images = typeof warehouse.images === 'string' 
                ? warehouse.images.split(',') 
                : warehouse.images;
            
            images.forEach(imagePath => {
                if (imagePath && !imagePath.startsWith('http')) {
                    const fullPath = path.join(__dirname, '..', imagePath);
                    fs.unlink(fullPath, (err) => {
                        if (err) logger.warn(`Failed to delete image file: ${fullPath}`);
                    });
                }
            });
        }

        await warehouse.destroy();
        
        logger.info(`Warehouse deleted: ${id} by user: ${req.userId}`);
        res.status(200).json({ 
            success: true, 
            message: 'Warehouse deleted successfully' 
        });
    } catch (error) {
        logger.error(`Error deleting warehouse: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete warehouse' 
        });
    }
};



// Get warehouse statistics for dashboard
exports.getWarehouseStats = async (req, res) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const warehouses = await Warehouse.findAll({
            where: { owner_id: userId },
            attributes: ['approval_status', 'createdAt']
        });

        // Calculate date ranges
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        const stats = {
            totalWarehouses: warehouses.length,
            pendingWarehouses: warehouses.filter(w => w.approval_status === 'pending').length,
            rejectedWarehouses: warehouses.filter(w => w.approval_status === 'rejected').length,
            thisMonthWarehouses: warehouses.filter(w => new Date(w.createdAt) >= thisMonth).length,
            lastMonthWarehouses: warehouses.filter(w => 
                new Date(w.createdAt) >= lastMonth && new Date(w.createdAt) < thisMonth
            ).length
        };

        // Calculate growth rate
        stats.growthRate = stats.lastMonthWarehouses > 0 
            ? (((stats.thisMonthWarehouses - stats.lastMonthWarehouses) / stats.lastMonthWarehouses) * 100).toFixed(2)
            : stats.thisMonthWarehouses > 0 ? 100 : 0;

        res.json({ success: true, data: stats });
    } catch (error) {
        logger.error('Error fetching warehouse stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch warehouse statistics' 
        });
    }
};

// Get user's warehouses
exports.getMyWarehouses = async (req, res) => {
    const { page = 1, limit = 12, status } = req.query;
    const offset = (page - 1) * limit;

    try {
        const where = { owner_id: req.userId };
        if (status) {
            where.approval_status = status;
        } else {
            // By default, exclude pending warehouses from "My Warehouses" view
            where.approval_status = { [Op.ne]: 'pending' };
        }

        const { rows: warehouses, count } = await Warehouse.findAndCountAll({
            where,
            include: [{
                model: WarehouseApproval,
                as: 'approval',
                attributes: ['status', 'comment', 'updatedAt']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            distinct: true
        });

        // Process images for each warehouse
        const processedWarehouses = warehouses.map(warehouse => {
            const warehouseData = warehouse.toJSON();
            warehouseData.images = processImages(warehouseData.images, req);
            return warehouseData;
        });

        res.json({
            success: true,
            data: processedWarehouses,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit),
                hasNext: page < Math.ceil(count / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        logger.error('Error fetching user warehouses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your warehouses'
        });
    }
};

module.exports = exports;