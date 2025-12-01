//gọi hàm 
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');
// chuyển yêu cầu đến register và login 
router.post('/register', registerUser);
router.post('/login', loginUser);

// xuất route
module.exports = router;