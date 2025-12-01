//đọc file .env và nạp biên môi trường cho process
const dotenv = require('dotenv');
dotenv.config(); 

app.use(express.json());
// mở kết nối api đến route 
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// kết nối đến database
const connectDB = require('./config/db');
connectDB();