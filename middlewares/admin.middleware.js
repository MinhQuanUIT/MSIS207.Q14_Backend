const isAdmin = (req, res, next) => {
    try {
        // req.user is set by verifyToken middleware
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { isAdmin };

