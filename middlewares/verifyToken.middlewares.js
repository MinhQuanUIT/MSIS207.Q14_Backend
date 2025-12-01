const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT from Authorization header ("Bearer <token>") or cookie "token".
 * Attaches decoded payload to req.user.
 */
function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        let token;

        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) return res.status(401).json({ message: 'Access token required' });

        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

/**
 * Verify token and ensure the requester is the resource owner or an admin.
 * Checks req.params.id, req.body.userId or req.user.id for ownership.
 */
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        const requesterId = req.user && req.user.id;
        const targetId = req.params.id || req.body.userId;
        if (req.user && (req.user.isAdmin || requesterId === targetId)) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden' });
    });
}

/**
 * Verify token and ensure requester is an admin.
 */
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user && req.user.isAdmin) return next();
        return res.status(403).json({ message: 'Admin privileges required' });
    });
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};