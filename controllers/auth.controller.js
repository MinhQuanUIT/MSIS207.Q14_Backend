// gọi thư viện
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Logic user register
const registerUser = async (req, res) => {
    // Guard: ensure JSON body exists
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ msg: 'Missing JSON body content' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter name, email, and password' });
    }
    // Kiểm tra độ dài bảo mật
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }
    try {
        let existing = await User.findOne({ email });
        // kiểm tra email tồn tại
        if (existing) {
            return res.status(400).json({ msg: 'This email already exists' });
        }
        const user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
};

// Logic User login
const loginUser = async (req, res) => {
    // Guard: ensure JSON body exists
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ msg: 'Missing JSON body content' });
    }

    const { email, password } = req.body;
    // kiểm tra dữ liệu user login
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter both email and password' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Information not valid' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Information not valid' });
        }
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};
//GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // từ authMiddleware
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Xuất hàm
module.exports = {
    registerUser,
    loginUser
};