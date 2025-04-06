import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  seller: mongoose.Types.ObjectId;
  stock: number;
  ratings: {
    rating: number;
    comment: string;
    user: mongoose.Types.ObjectId;
  }[];
  numReviews: number;
  averageRating: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      enum: [
        'Handcraft',
        'Textiles',
        'Food',
        'Agriculture',
        'Beauty',
        'Technology',
        'Services',
        'Other',
      ],
    },
    images: [
      {
        type: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      default: 0,
    },
    ratings: [
      {
        rating: {
          type: Number,
          required: true,
          default: 0,
        },
        comment: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    numReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>('Product', ProductSchema); 