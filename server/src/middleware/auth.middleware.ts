import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import mongoose from 'mongoose';

// Interface for authenticated request
export interface AuthRequest extends Request {
  user?: any;
}

// Verify token middleware
export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');

    if (typeof decoded !== 'object' || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      });
    }

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Admin role middleware
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
};

// Seller check middleware (user is admin or the resource owner)
export const isSellerOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (
    req.user &&
    (req.user.role === 'admin' || req.user.role === 'user') &&
    (req.user.role === 'admin' || req.user._id.toString() === req.params.id)
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
};

// Verify user is owner of the resource
export const isResourceOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  const resourceId = req.params.id;
  const userId = req.user._id;

  if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID',
    });
  }

  // If user is admin, allow access
  if (req.user.role === 'admin') {
    return next();
  }

  // Check if the authenticated user is the owner of the resource
  if (resourceId === userId.toString()) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Not authorized to access this resource',
  });
}; 