const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/order.controller');

const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');

// Protected routes - require authentication
router.use(verifyToken);

// User routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllOrders);


module.exports = router;