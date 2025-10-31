import { validationResult } from 'express-validator';
import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.json({
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    token
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});
