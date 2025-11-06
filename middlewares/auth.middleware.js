//  gọi thư viện
const jwt = require('jsonwebtoken');

//Check token và user role
const auth = (req, res, next) => {
    // Nhận token 
    const token = req.header('x-auth-token'); 

    // check thẻ
        if (!token) {
        return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });
    }

    // Bước 3: Kiểm tra thẻ
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // check { id: '...', role: '...' }
        next();

    } catch (err) {
        // Token lỗi
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};

// check admin
const admin = (req, res, next) => {
    // check role admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Truy cập bị cấm, bạn không phải Admin' });
    }
    next();
};
// xuất hàm
module.exports = { auth, admin };