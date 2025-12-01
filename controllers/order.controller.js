const Order = require('../models/Order.model');
const Book = require('../models/Book.model');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Protected
const createOrder = async (req, res) => {
    try {
        const { items, shippingInfo } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: 'No order items provided'
            });
        }

        let totalPrice = 0;
        const orderItems = [];

        // Validate and calculate total price
        for (let item of items) {
            const book = await Book.findById(item.book);
            if (!book) {
                return res.status(404).json({
                    message: `Book with ID ${item.book} not found`
                });
            }

            if (book.stock < item.qty) {
                return res.status(400).json({
                    message: `Insufficient stock for book: ${book.title}`
                });
            }

            orderItems.push({
                book: book._id,
                qty: item.qty,
                price: book.price
            });

            totalPrice += book.price * item.qty;
        }

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            shippingInfo,
            totalPrice
        });

        const savedOrder = await order.save();

        // Update book stock and sales
        for (let item of items) {
            await Book.findByIdAndUpdate(item.book, {
                $inc: { 
                    stock: -item.qty,
                    sales: item.qty
                }
            });
        }

        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('user', 'name email')
            .populate('items.book', 'title author price');

        res.status(201).json({
            message: 'Order created successfully',
            order: populatedOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Protected/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.book', 'title author price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Orders retrieved successfully',
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Protected
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.book', 'title author price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Your orders retrieved successfully',
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            message: 'Error fetching your orders',
            error: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Protected
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.book', 'title author price');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        res.status(200).json({
            message: 'Order retrieved successfully',
            order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Protected/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['pending', 'paid', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be: pending, paid, delivered, or cancelled'
            });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('user', 'name email')
            .populate('items.book', 'title author price');

        res.status(200).json({
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// @desc    Cancel order (User can cancel their own pending orders)
// @route   PUT /api/orders/:id/cancel
// @access  Protected
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Check if user owns this order
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                message: 'Only pending orders can be cancelled'
            });
        }

        // Restore book stock
        for (let item of order.items) {
            await Book.findByIdAndUpdate(item.book, {
                $inc: { 
                    stock: item.qty,
                    sales: -item.qty
                }
            });
        }

        order.status = 'cancelled';
        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('items.book', 'title author price');

        res.status(200).json({
            message: 'Order cancelled successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            message: 'Error cancelling order',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};