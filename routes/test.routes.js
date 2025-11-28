const express = require('express');
const router = express.Router();

// Test route without any middleware
router.get('/simple', (req, res) => {
  res.json({ message: 'Simple test route works' });
});

// Test with verifyToken only
const { verifyToken } = require('../middlewares/auth.middleware');
router.get('/with-auth', verifyToken, (req, res) => {
  res.json({ message: 'Auth middleware works', user: req.user });
});

// Test with both middlewares
const { isAdmin } = require('../middlewares/admin.middleware');
router.get('/with-admin', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Admin middleware works', user: req.user });
});

module.exports = router;