// goi thu vien mongoose
const mongoose = require('mongoose');

// tạo schema cho review book
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // tham chiếu đến User model
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required from 1 to 10 points'],
        min: 1,
        max: 10
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    }
});

// tao schema cho book
const bookSchema = new mongoose.Schema({
    title: { // tên sach 
        type : String,
        required: [true,'Please provide a book title'],
        trim: true
    },
    author: { // tác giả
        type : String,
        required: [ true,'Please provide an author name'],
        trim: true
    },
    publishedDate: { // ngày xuất bản
        type: Date,
        required: [true, 'Please provide a published date'],
        default: Date.now
    }, 
    Price:{ // giá 
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    Sales:{ //. số lượng bán
        type: Number,
        required: [true, 'Please provide number of sales'],
        min: [0, 'Sales cannot be negative']
    },
    Description:{ // mô tả sách
        type: String,
        trim: true
    },
    inStock: { // hàng tồn
        type: Boolean, 
        default: 0
    },
    reviews: [reviewSchema] // mảng đánh giá -> xuất từ module review 
},{ 
    timestamps: true 
});

    // rating: đánh giá trung bình , number of reviews : số lượng đánh giá -> API );

// xuất module review và book 
module.exports = mongoose.model('Book', bookSchema);