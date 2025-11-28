const Book = require('../models/Book.model');

/**
 * @desc    Create new book
 * @route   POST /api/books
 * @access  Admin only
 */
exports.createBook = async (req, res) => {
  try {
    const { title, author, price, stock, description, publishedDate } = req.body;

    // Validate required fields
    if (!title || !author || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title, author, and price' 
      });
    }

    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      price: Number(price),
      stock: stock ? Number(stock) : 0,
      description: description ? description.trim() : '',
      publishedDate: publishedDate || new Date(),
      inStock: (stock && Number(stock) > 0)
    });

    const savedBook = await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: savedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message
    });
  }
};

/**
 * @desc    Get all books with pagination and search
 * @route   GET /api/books
 * @access  Public
 */
exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sort = req.query.sort || '-createdAt';

    // Build search query
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const books = await Book.find(query)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-reviews'); // Exclude reviews for list view

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
};

/**
 * @desc    Get single book by ID
 * @route   GET /api/books/:id
 * @access  Public
 */
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('reviews.user', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
};

/**
 * @desc    Update book
 * @route   PUT /api/books/:id
 * @access  Admin only
 */
exports.updateBook = async (req, res) => {
  try {
    const { title, author, price, stock, description, publishedDate } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Update fields if provided
    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (price !== undefined) book.price = Number(price);
    if (stock !== undefined) {
      book.stock = Number(stock);
      book.inStock = book.stock > 0;
    }
    if (description !== undefined) book.description = description.trim();
    if (publishedDate) book.publishedDate = new Date(publishedDate);

    const updatedBook = await book.save();

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message
    });
  }
};

/**
 * @desc    Delete book
 * @route   DELETE /api/books/:id
 * @access  Admin only
 */
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message
    });
  }
};

/**
 * @desc    Add review to book
 * @route   POST /api/books/:id/reviews
 * @access  Authenticated users only
 */
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 10'
      });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user already reviewed this book
    const existingReviewIndex = book.reviews.findIndex(
      review => review.user.toString() === req.user.id
    );

    if (existingReviewIndex > -1) {
      // Update existing review
      book.reviews[existingReviewIndex].rating = Number(rating);
      book.reviews[existingReviewIndex].comment = comment || '';
      book.reviews[existingReviewIndex].reviewDate = new Date();
    } else {
      // Add new review
      book.reviews.push({
        user: req.user.id,
        rating: Number(rating),
        comment: comment || ''
      });
    }

    // Recalculate average rating
    if (book.reviews.length > 0) {
      const avgRating = book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length;
      book.averageRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place
    }

    const updatedBook = await book.save();

    // Populate user info in the response
    await book.populate('reviews.user', 'name email');

    res.json({
      success: true,
      message: existingReviewIndex > -1 ? 'Review updated successfully' : 'Review added successfully',
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};
