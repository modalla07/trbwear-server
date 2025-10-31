import { body } from 'express-validator';

export const registerRules = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('valid email required'),
  body('password').isLength({ min: 6 }).withMessage('password min 6 chars'),
];
