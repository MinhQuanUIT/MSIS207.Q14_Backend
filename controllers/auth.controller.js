// gọi thư viện
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Logic user register
const registerUser = async (req, res) => {
    // Guard: ensure JSON body exists
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ msg: 'Thiếu nội dung body JSON' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Vui lòng nhập đầy đủ name, email và password' });
    }
    // Kiểm tra độ dài bảo mật
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }
    try {
        let existing = await User.findOne({ email });
        // kiểm tra email tồn tại
        if (existing) {
            return res.status(400).json({ msg: 'Email này đã tồn tại' });
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
        res.status(500).send('Lỗi Server');
    }
};

// Logic User login
const loginUser = async (req, res) => {
    // Guard: ensure JSON body exists
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ msg: 'Thiếu nội dung body JSON' });
    }

    const { email, password } = req.body;
    // kiểm tra dữ liệu user login
    if (!email || !password) {
        return res.status(400).json({ msg: 'Vui lòng nhập đầy đủ email và password' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });
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

// Xuất hàm
module.exports = {
    registerUser,
    loginUser
};