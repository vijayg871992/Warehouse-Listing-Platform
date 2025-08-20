// publicWarehouseController.js
const { Warehouse, User, sequelize } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Utility functions
const getBaseUrl = () => {
    return process.env.BASE_URL || 'http://localhost:8080';
};

const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If the image path is already a complete URL (starts with http:// or https://), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    const baseUrl = getBaseUrl();
    return `${baseUrl}/${imagePath}`;
};

const processImages = (imagesData) => {
    if (!imagesData) return [];

    if (typeof imagesData === 'string') {
        return imagesData.split(',')
            .map(img => img.trim())
            .filter(Boolean)
            .map(getFullImageUrl);
    }
    
    if (Array.isArray(imagesData)) {
        return imagesData
            .filter(Boolean)
            .map(getFullImageUrl);
    }

    return [];
};

// Fetch public warehouses with pagination and filters
exports.getPublicWarehouses = async (req, res) => {
    const { 
        page = 1, 
        limit = 50, 
        location, 
        warehouse_type, 
        warehouseType,
        listingType,
        city,
        minArea,
        maxArea,
        sizeRange, 
        budgetRange,
        search
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Create fingerprint to identify anonymous users
    const visitorId = req.headers['x-visitor-id'] || req.ip;

    try {
        const filter = {
            // Only show approved warehouses to public users
            approval_status: 'approved'
        };
        
        // Apply filters
        if (location) {
            filter[Op.or] = [
                { city: { [Op.iLike]: `%${location}%` } },
                { state: { [Op.iLike]: `%${location}%` } },
                { address: { [Op.iLike]: `%${location}%` } }
            ];
        }
        
        // Support both parameter names for warehouse type
        const warehouseTypeFilter = warehouse_type || warehouseType;
        if (warehouseTypeFilter) {
            filter.warehouse_type = warehouseTypeFilter;
        }

        // Filter by listing type
        if (listingType) {
            filter.listing_for = listingType;
        }

        // Filter by city
        if (city) {
            filter.city = { [Op.iLike]: `%${city}%` };
        }

        // Filter by area range
        if (minArea || maxArea || sizeRange) {
            if (sizeRange) {
                const [minSize, maxSize] = sizeRange.split(',').map(Number);
                filter.build_up_area = { [Op.between]: [minSize, maxSize] };
            } else {
                const areaFilter = {};
                if (minArea) areaFilter[Op.gte] = parseInt(minArea);
                if (maxArea) areaFilter[Op.lte] = parseInt(maxArea);
                if (Object.keys(areaFilter).length > 0) {
                    filter.build_up_area = areaFilter;
                }
            }
        }
        
        if (budgetRange) {
            const [minBudget, maxBudget] = budgetRange.split(',').map(Number);
            filter.rent = { [Op.between]: [minBudget, maxBudget] };
        }

        // Add search functionality - don't override location filter
        if (search) {
            const searchCondition = [
                { name: { [Op.iLike]: `%${search}%` } },
                { city: { [Op.iLike]: `%${search}%` } },
                { state: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];

            if (filter[Op.or]) {
                // Combine with existing OR conditions
                filter[Op.and] = [
                    { [Op.or]: filter[Op.or] },
                    { [Op.or]: searchCondition }
                ];
                delete filter[Op.or];
            } else {
                filter[Op.or] = searchCondition;
            }
        }

        // Fetch warehouses with applied filters
        const { rows: warehouses, count } = await Warehouse.findAndCountAll({
            where: filter,
            include: [{
                model: User,
                as: 'owner',
                attributes: ['firstName', 'lastName', 'email']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        // Process images for display
        const processedWarehouses = warehouses.map(warehouse => {
            const warehouseData = warehouse.toJSON();
            // Convert image paths to full URLs
            if (warehouseData.images) {
                warehouseData.images = processImages(warehouseData.images);
            }
            return warehouseData;
        });

        res.status(200).json({ 
            success: true, 
            data: processedWarehouses, 
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        logger.error(`Error in getPublicWarehouses: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch warehouses' 
        });
    }
};

// Fetch public warehouse by ID
exports.getPublicWarehouseById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const warehouse = await Warehouse.findOne({
            where: { 
                id,
                approval_status: 'approved' // Only show approved warehouses
            },
            include: [{
                model: User,
                as: 'owner',
                attributes: ['firstName', 'lastName', 'email']
            }]
        });

        if (!warehouse) {
            return res.status(404).json({ 
                success: false, 
                message: 'Warehouse not found or not available' 
            });
        }

        const warehouseData = warehouse.toJSON();
        
        // Process images for display
        warehouseData.images = processImages(warehouseData.images);

        res.status(200).json({ 
            success: true, 
            data: warehouseData 
        });
    } catch (error) {
        logger.error(`Error in getPublicWarehouseById: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch warehouse details' 
        });
    }
};

// Track warehouse view (removed functionality)
exports.trackWarehouseView = async (req, res) => {
    res.json({ 
        success: true,
        message: 'View tracking disabled'
    });
};

// Get public warehouse statistics
exports.getPublicStats = async (req, res) => {
    try {
        const totalWarehouses = await Warehouse.count({
            where: { approval_status: 'approved' }
        });

        const warehousesByType = await Warehouse.findAll({
            where: { approval_status: 'approved' },
            attributes: [
                'warehouse_type',
                [sequelize.fn('COUNT', sequelize.col('warehouse_type')), 'count']
            ],
            group: ['warehouse_type']
        });

        const warehousesByCity = await Warehouse.findAll({
            where: { approval_status: 'approved' },
            attributes: [
                'city',
                [sequelize.fn('COUNT', sequelize.col('city')), 'count']
            ],
            group: ['city'],
            order: [[sequelize.fn('COUNT', sequelize.col('city')), 'DESC']],
            limit: 10
        });

        res.json({
            success: true,
            data: {
                totalWarehouses,
                warehousesByType: warehousesByType.map(w => ({
                    type: w.warehouse_type,
                    count: parseInt(w.dataValues.count)
                })),
                topCities: warehousesByCity.map(w => ({
                    city: w.city,
                    count: parseInt(w.dataValues.count)
                }))
            }
        });
    } catch (error) {
        logger.error(`Error in getPublicStats: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
};

// Get featured warehouses (most viewed, recently added, etc.)
exports.getFeaturedWarehouses = async (req, res) => {
    const { type = 'recent', limit = 6 } = req.query;
    
    try {
        let orderBy;
        switch (type) {
            case 'popular':
            case 'recent':
            default:
                orderBy = [['createdAt', 'DESC']];
                break;
        }

        const warehouses = await Warehouse.findAll({
            where: { approval_status: 'approved' },
            include: [{
                model: User,
                as: 'owner',
                attributes: ['firstName', 'lastName']
            }],
            order: orderBy,
            limit: parseInt(limit)
        });

        // Process images for display
        const processedWarehouses = warehouses.map(warehouse => {
            const warehouseData = warehouse.toJSON();
            warehouseData.images = processImages(warehouseData.images);
            return warehouseData;
        });

        res.json({
            success: true,
            data: processedWarehouses
        });
    } catch (error) {
        logger.error(`Error in getFeaturedWarehouses: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured warehouses'
        });
    }
};