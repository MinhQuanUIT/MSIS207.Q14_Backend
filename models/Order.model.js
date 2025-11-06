// gọi thư viện
const mongoose = require('mongoose');

// tạo schema order
const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'Please provide a user ID']
    },
    orderItems: [ // bill -> cập nhập auto từ API cho phần price
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                require: true
            },
            quantity: {
                type: Number,
                require: true,
                min: [1, 'Quantity cannot be less than 1']
            },
            price: {
                type: Number,
                require: true,
                min: [0, 'Price cannot be negative']
            }
        }
    ],
    totalAmount: { // tổng giá trị  -> auto từ API 
        type: Number,
        require: true,
        min: [0, 'Total amount cannot be negative']
    },
    orderDate: { // ngày đặt
        type: Date,
        default: Date.now
    },
    status: { // trạng thái -> cập nhập thêm auto từ API 
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
},{
    timestamps: true
});

// xuất module order
module.exports = mongoose.model('Order', orderSchema);


