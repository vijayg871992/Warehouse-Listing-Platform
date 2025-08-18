// routes/warehouses.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyAccessToken } = require('../middleware/authMiddleware');
const {
    getCityStateSuggestions,
    getWarehouses,
    createWarehouse,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse,
    getWarehouseStats,
    getMyWarehouses
} = require('../controllers/warehousesController');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'warehouse-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed'));
        }
    },
});

// Public routes (no authentication required)
router.get('/api/cities', getCityStateSuggestions);

// Stats routes (must be before :id routes)
router.get('/api/warehouses/stats', verifyAccessToken, getWarehouseStats);
router.get('/api/warehouses/my', verifyAccessToken, getMyWarehouses);

// Protected CRUD routes
router.get('/api/warehouses', verifyAccessToken, getWarehouses);
router.post('/api/warehouses', verifyAccessToken, upload.array('images', parseInt(process.env.MAX_IMAGES) || 5), createWarehouse);
router.get('/api/warehouses/:id', verifyAccessToken, getWarehouseById);
router.put('/api/warehouses/:id', verifyAccessToken, upload.array('images', parseInt(process.env.MAX_IMAGES) || 5), updateWarehouse);
router.delete('/api/warehouses/:id', verifyAccessToken, deleteWarehouse);

module.exports = router;