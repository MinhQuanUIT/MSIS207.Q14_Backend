// gọi thư viện
const mongoose = require('mongoose');
const Book = require('./models/Book.model');

const createOrder = async (req, res) => {
// client chỉ gửi bookid và quantity
const { ItemsOrder: ItemfromCus } = req.body

if (!ItemfromCus || ItemfromCus.length === 0) {
        return res.status(400).json({ msg: 'Empty cart' });
    }

    try {
        // Tạo mảng để lấy giá từ database
        const orderItemsProm = ItemfromCus.map(async (item) => {
            const book = await Book.findById(item.book); // Tìm sách trong DB
            if (!book) {
                throw new Error(`Can not found Book item: ${item.book}`);
            }
            
            return {
                book: item.book,
                quantity: item.quantity,
                price: book.gia, // <--- LẤY GIÁ THẬT TỪ DATABASE
                _id: undefined // loại id thừa
            };
        });

        // chạy all prom 
        const orderItems = await Promise.all(orderItemsProm);

        // auto tính tổng
        const totalAmount = orderItems.reduce((acc, item) => {
            return acc + (item.quantity * item.price);
        }, 0);

        //  Order mới
        const order = new Order({
            user: req.user.id,
            orderItems: orderItems, // Dùng mảng đã có giá thật
            totalAmount: totalAmount, // Dùng tổng đã tính
            // status: 'pending' (tự động)
        });

        // lưu database
        const createdOrder = await order.save();

        res.status(201).json(createdOrder);

    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message || 'Server Error');
    }
};