// routes/publicWarehouseRoutes.js
const express = require('express');
const {
    getPublicWarehouses,
    getPublicWarehouseById,
    trackWarehouseView,
    getPublicStats,
    getFeaturedWarehouses
} = require('../controllers/publicWarehouseController');

const router = express.Router();

// Public warehouse routes (no authentication required)
router.get('/api/public/warehouses', getPublicWarehouses);
router.get('/api/public/warehouses/stats', getPublicStats);
router.get('/api/public/warehouses/featured', getFeaturedWarehouses);
router.get('/api/public/warehouses/:id', getPublicWarehouseById);
router.post('/api/public/warehouses/:id/view', trackWarehouseView);

module.exports = router;