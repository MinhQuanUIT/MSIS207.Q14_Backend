const isAdmin = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin resource. Access denied.' });
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { isAdmin };
