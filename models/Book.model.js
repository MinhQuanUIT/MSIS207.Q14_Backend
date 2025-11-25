const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a book title'],
        trim: true
    },
    bookID: {
        type: String,
        required: true,
        default: () => nanoid(10),
        unique: true
    },
    author: {
        type: String,
        required: [true, 'Please provide an author name'],
        trim: true
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    sales: {
        type: Number,
        default: 0,
        min: [0, 'Sales cannot be negative']
    },
    description: {
        type: String,
        trim: true
    },
    inStock: {
        type: Boolean,
        default: false
    },
    reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);