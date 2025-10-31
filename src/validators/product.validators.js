import { body } from 'express-validator';

export const createProductRules = [
  body('name').notEmpty().withMessage('name is required'),
  body('slug').notEmpty().withMessage('slug is required'),
  body('price').isFloat({ min: 0 }).withMessage('price must be >= 0'),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock must be >= 0'),
];
