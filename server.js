require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const setupSwagger = require('./docs/swagger');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MSIS207 Q14 Backend API' });
});

// Set up Routers
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/books', require('./routes/book.routes'));
// app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/test', require('./routes/test.routes')); // Debug route
// app.use('/api/cart', require('./routes/cart.routes')); // TODO: Create cart.routes.js
// app.use('/api/admin', require('./routes/admin.routes')); // TODO: Create admin.routes.js

// Setup Swagger documentation - temporarily disabled
// setupSwagger(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 9500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

