import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/product.model';
import { ApiError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Seller or Admin)
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, price, category, stock } = req.body;
    let images = [];

    // Handle uploaded images (from req.files if using multer)
    if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file: Express.Multer.File) => {
        return `/uploads/${file.filename}`;
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      seller: req.user._id,
      stock,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Filter options
    const filter: any = {};

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }

    // Seller filter
    if (req.query.seller) {
      filter.seller = req.query.seller;
    }

    // Search by name
    if (req.query.keyword) {
      filter.name = { $regex: req.query.keyword, $options: 'i' };
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('seller', 'name businessName')
      .limit(limit)
      .skip(startIndex)
      .sort(req.query.sortBy ? { [req.query.sortBy as string]: req.query.sortDir === 'desc' ? -1 : 1 } : { createdAt: -1 });

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        limit,
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name businessName location');

    if (!product) {
      return next(new ApiError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Seller or Admin)
export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError('Product not found', 404));
    }

    // Check if user is product owner or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError('Not authorized to update this product', 403));
    }

    const { name, description, price, category, stock } = req.body;
    let images = product.images;

    // Handle uploaded images (from req.files if using multer)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages = req.files.map((file: Express.Multer.File) => {
        return `/uploads/${file.filename}`;
      });
      images = [...images, ...newImages];
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        images,
        stock,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Seller or Admin)
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError('Product not found', 404));
    }

    // Check if user is product owner or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError('Not authorized to delete this product', 403));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError('Product not found', 404));
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return next(new ApiError('Product already reviewed', 400));
    }

    const review = {
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.ratings.push(review);
    product.numReviews = product.ratings.length;

    // Calculate average rating
    product.averageRating =
      product.ratings.reduce((acc, item) => item.rating + acc, 0) / product.ratings.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
    });
  } catch (error) {
    next(error);
  }
}; 