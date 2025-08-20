const { Warehouse, WarehouseApproval, User, WarehouseAnalytics } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Get all warehouses with filters and pagination
exports.getAllWarehouses = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status = 'all',
            search = '',
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * parseInt(limit);
        
        // Build where conditions
        const whereConditions = {};
        
        if (status !== 'all') {
            whereConditions.approval_status = status;
        }
        
        if (search) {
            whereConditions[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
                { state: { [Op.like]: `%${search}%` } },
                { warehouse_type: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: warehouses } = await Warehouse.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            limit: parseInt(limit),
            offset: offset,
            order: [[sortBy, sortOrder]]
        });

        // Process images for each warehouse
        const processedWarehouses = warehouses.map(warehouse => {
            const warehouseData = warehouse.toJSON();
            if (warehouseData.images && warehouseData.images.length > 0) {
                warehouseData.images = warehouseData.images.map(image => {
                    // If the image path is already a complete URL, return as-is
                    if (image.startsWith('http://') || image.startsWith('https://')) {
                        return image;
                    }
                    return `https://vijayg.dev/warehouse-listing/${image}`;
                });
            }
            return warehouseData;
        });

        res.status(200).json({
            success: true,
            data: {
                warehouses: processedWarehouses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        logger.error(`Admin getAllWarehouses error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch warehouses'
        });
    }
};

// Get pending warehouses for approval
exports.getPendingWarehouses = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * parseInt(limit);

        const { count, rows: warehouses } = await Warehouse.findAndCountAll({
            where: { approval_status: 'pending' },
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'ASC']] // Oldest first for FIFO processing
        });

        // Process images
        const processedWarehouses = warehouses.map(warehouse => {
            const warehouseData = warehouse.toJSON();
            if (warehouseData.images && warehouseData.images.length > 0) {
                warehouseData.images = warehouseData.images.map(image => {
                    // If the image path is already a complete URL, return as-is
                    if (image.startsWith('http://') || image.startsWith('https://')) {
                        return image;
                    }
                    return `https://vijayg.dev/warehouse-listing/${image}`;
                });
            }
            return warehouseData;
        });

        res.status(200).json({
            success: true,
            data: {
                warehouses: processedWarehouses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        logger.error(`Admin getPendingWarehouses error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending warehouses'
        });
    }
};

// Get warehouse by ID (admin view)
exports.getWarehouseById = async (req, res) => {
    try {
        const { id } = req.params;

        const warehouse = await Warehouse.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: 'Warehouse not found'
            });
        }

        // Process images
        const warehouseData = warehouse.toJSON();
        if (warehouseData.images && warehouseData.images.length > 0) {
            warehouseData.images = warehouseData.images.map(image => {
                // If the image path is already a complete URL, return as-is
                if (image.startsWith('http://') || image.startsWith('https://')) {
                    return image;
                }
                return `https://vijayg.dev/warehouse-listing/${image}`;
            });
        }

        res.status(200).json({
            success: true,
            data: warehouseData
        });
    } catch (error) {
        logger.error(`Admin getWarehouseById error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch warehouse details'
        });
    }
};

// Approve warehouse
exports.approveWarehouse = async (req, res) => {
    const sequelize = require('../config/database');
    
    try {
        const { id } = req.params;
        const { comment = '' } = req.body;

        const result = await sequelize.transaction(async (t) => {
            // Update warehouse status
            const warehouse = await Warehouse.findByPk(id, { transaction: t });
            if (!warehouse) {
                throw new Error('Warehouse not found');
            }

            await warehouse.update({
                approval_status: 'approved'
            }, { transaction: t });

            // Update approval record
            await WarehouseApproval.update({
                status: 'approved',
                admin_id: req.userId,
                comment: comment
            }, {
                where: { warehouse_id: id },
                transaction: t
            });

            return warehouse;
        });

        logger.info(`Warehouse ${id} approved by admin ${req.userId}`);
        
        res.status(200).json({
            success: true,
            message: 'Warehouse approved successfully',
            data: result
        });
    } catch (error) {
        logger.error(`Admin approveWarehouse error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message === 'Warehouse not found' ? error.message : 'Failed to approve warehouse'
        });
    }
};

// Reject warehouse
exports.rejectWarehouse = async (req, res) => {
    const sequelize = require('../config/database');
    
    try {
        const { id } = req.params;
        const { comment = '' } = req.body;

        if (!comment.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const result = await sequelize.transaction(async (t) => {
            // Update warehouse status
            const warehouse = await Warehouse.findByPk(id, { transaction: t });
            if (!warehouse) {
                throw new Error('Warehouse not found');
            }

            await warehouse.update({
                approval_status: 'rejected'
            }, { transaction: t });

            // Update approval record
            await WarehouseApproval.update({
                status: 'rejected',
                admin_id: req.userId,
                comment: comment
            }, {
                where: { warehouse_id: id },
                transaction: t
            });

            return warehouse;
        });

        logger.info(`Warehouse ${id} rejected by admin ${req.userId} with reason: ${comment}`);
        
        res.status(200).json({
            success: true,
            message: 'Warehouse rejected successfully',
            data: result
        });
    } catch (error) {
        logger.error(`Admin rejectWarehouse error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message === 'Warehouse not found' ? error.message : 'Failed to reject warehouse'
        });
    }
};

// Update warehouse (admin can edit any warehouse)
exports.updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const warehouse = await Warehouse.findByPk(id);
        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: 'Warehouse not found'
            });
        }

        await warehouse.update(updateData);

        logger.info(`Warehouse ${id} updated by admin ${req.userId}`);
        
        res.status(200).json({
            success: true,
            message: 'Warehouse updated successfully',
            data: warehouse
        });
    } catch (error) {
        logger.error(`Admin updateWarehouse error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update warehouse'
        });
    }
};

// Delete warehouse (admin can delete any warehouse)
exports.deleteWarehouse = async (req, res) => {
    const sequelize = require('../config/database');
    
    try {
        const { id } = req.params;

        const result = await sequelize.transaction(async (t) => {
            const warehouse = await Warehouse.findByPk(id, { transaction: t });
            if (!warehouse) {
                throw new Error('Warehouse not found');
            }

            // Delete associated images
            if (warehouse.images && warehouse.images.length > 0) {
                warehouse.images.forEach(imagePath => {
                    const fullPath = path.join(__dirname, '..', imagePath);
                    fs.unlink(fullPath, (err) => {
                        if (err) logger.warn(`Failed to delete image: ${imagePath}`);
                    });
                });
            }

            // Delete warehouse approval record
            await WarehouseApproval.destroy({
                where: { warehouse_id: id },
                transaction: t
            });

            // Delete warehouse analytics
            await WarehouseAnalytics.destroy({
                where: { warehouse_id: id },
                transaction: t
            });

            // Delete warehouse
            await warehouse.destroy({ transaction: t });

            return warehouse;
        });

        logger.info(`Warehouse ${id} deleted by admin ${req.userId}`);
        
        res.status(200).json({
            success: true,
            message: 'Warehouse deleted successfully'
        });
    } catch (error) {
        logger.error(`Admin deleteWarehouse error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message === 'Warehouse not found' ? error.message : 'Failed to delete warehouse'
        });
    }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalWarehouses,
            pendingWarehouses,
            approvedWarehouses,
            rejectedWarehouses
        ] = await Promise.all([
            Warehouse.count(),
            Warehouse.count({ where: { approval_status: 'pending' } }),
            Warehouse.count({ where: { approval_status: 'approved' } }),
            Warehouse.count({ where: { approval_status: 'rejected' } })
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalWarehouses,
                    pendingWarehouses,
                    approvedWarehouses,
                    rejectedWarehouses
                }
            }
        });
    } catch (error) {
        logger.error(`Admin getDashboardStats error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};

// Get analytics data
exports.getAnalyticsData = async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        
        let startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 7);
        }

        const analytics = await WarehouseAnalytics.findAll({
            where: {
                date: {
                    [Op.gte]: startDate
                }
            },
            order: [['date', 'ASC']]
        });

        // Group analytics by date
        const analyticsMap = {};
        analytics.forEach(record => {
            const date = record.date;
            if (!analyticsMap[date]) {
                analyticsMap[date] = {
                    date,
                    views: 0,
                    uniqueVisitors: 0,
                    inquiries: 0
                };
            }
            analyticsMap[date].views += record.views;
            analyticsMap[date].uniqueVisitors += record.unique_visitors;
            analyticsMap[date].inquiries += record.inquiries;
        });

        const chartData = Object.values(analyticsMap);

        res.status(200).json({
            success: true,
            data: {
                chartData,
                summary: {
                    totalViews: chartData.reduce((sum, day) => sum + day.views, 0),
                    totalUniqueVisitors: chartData.reduce((sum, day) => sum + day.uniqueVisitors, 0),
                    totalInquiries: chartData.reduce((sum, day) => sum + day.inquiries, 0)
                }
            }
        });
    } catch (error) {
        logger.error(`Admin getAnalyticsData error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics data'
        });
    }
};

// Get warehouse analytics for admin
exports.getWarehouseAnalytics = async (req, res) => {
    try {
        const { 
            period = '30d',
            warehouseId = null
        } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30);
        }

        const whereConditions = {
            date: {
                [Op.gte]: startDate
            }
        };

        if (warehouseId) {
            whereConditions.warehouse_id = warehouseId;
        }

        const analytics = await WarehouseAnalytics.findAll({
            where: whereConditions,
            include: [
                {
                    model: Warehouse,
                    as: 'warehouse',
                    attributes: ['id', 'name', 'city', 'approval_status']
                }
            ],
            order: [['date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        logger.error(`Admin getWarehouseAnalytics error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch warehouse analytics'
        });
    }
};