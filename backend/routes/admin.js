const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Apply authentication and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin warehouse management routes
router.get('/warehouses', adminController.getAllWarehouses);
router.get('/warehouses/pending', adminController.getPendingWarehouses);
router.get('/warehouses/analytics', adminController.getWarehouseAnalytics);
router.get('/warehouses/:id', adminController.getWarehouseById);

// Warehouse approval routes
router.post('/warehouses/:id/approve', adminController.approveWarehouse);
router.post('/warehouses/:id/reject', adminController.rejectWarehouse);

// Warehouse management
router.put('/warehouses/:id', adminController.updateWarehouse);
router.delete('/warehouses/:id', adminController.deleteWarehouse);

// Admin dashboard stats
router.get('/stats/dashboard', adminController.getDashboardStats);
router.get('/stats/analytics', adminController.getAnalyticsData);

module.exports = router;