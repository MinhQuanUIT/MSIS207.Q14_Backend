// Debug middleware imports
console.log('Testing middleware imports...');

try {
  const authMw = require('./middlewares/auth.middleware');
  console.log('auth.middleware:', authMw);
  console.log('verifyToken type:', typeof authMw.verifyToken);
} catch (err) {
  console.error('Error importing auth middleware:', err.message);
}

try {
  const adminMw = require('./middlewares/admin.middleware');  
  console.log('admin.middleware:', adminMw);
  console.log('isAdmin type:', typeof adminMw.isAdmin);
} catch (err) {
  console.error('Error importing admin middleware:', err.message);
}

// Test destructuring
try {
  const { verifyToken } = require('./middlewares/auth.middleware');
  const { isAdmin } = require('./middlewares/admin.middleware');
  console.log('Destructured verifyToken type:', typeof verifyToken);
  console.log('Destructured isAdmin type:', typeof isAdmin);
} catch (err) {
  console.error('Error destructuring:', err.message);
}