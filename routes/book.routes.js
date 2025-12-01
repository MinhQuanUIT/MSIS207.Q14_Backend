const express = require('express');
const router = express.Router();
const {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook,
    addReview
} = require('../controllers/book.controller');

const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);

// Admin only routes
router.post('/', verifyToken, isAdmin, createBook);
router.put('/:id', verifyToken, isAdmin, updateBook);
router.delete('/:id', verifyToken, isAdmin, deleteBook);

// Review routes (requires authentication)
router.post('/:id/reviews', verifyToken, addReview);

module.exports = router;
