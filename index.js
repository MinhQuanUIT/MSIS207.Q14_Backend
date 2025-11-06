//đọc file .env và nạp biên môi trường cho process
const dotenv = require('dotenv');
dotenv.config(); 

app.use(express.json());
// mở kết nối api đến route auth 
app.use('/api/auth', require('./routes/auth.routes'));

