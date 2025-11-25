// gọi thư viện
const mongoose = require('mongoose');
// tạo schema user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: { // yêu cầu email
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, 
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: { // optional phone number
    type: String,
    match: [/^\d{10}$/, 'Please provide a valid phone number']
  },
  password: { // yêu cầu mật khẩu
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { // chọn vai trò
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: { // trạng thái hoạt động
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true // kiểm tra thời gian tạo và cập nhật
});

// xuất module user
module.exports = mongoose.model('User', userSchema);
