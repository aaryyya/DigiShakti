import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin' | 'buyer';
  businessName?: string;
  businessType?: string;
  location?: string;
  businessSize?: 'micro' | 'small' | 'medium';
  profilePicture?: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  getSignedToken: () => string;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number cannot be longer than 20 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'buyer'],
      default: 'user',
    },
    businessName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    businessSize: {
      type: String,
      enum: ['micro', 'small', 'medium'],
    },
    profilePicture: {
      type: String,
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

// Compare user entered password to hashed password in database
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedToken = function (): string {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'fallbacksecret', 
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

export default mongoose.model<IUser>('User', UserSchema); 