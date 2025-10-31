import { validationResult } from 'express-validator';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.q) filter.name = { $regex: req.query.q, $options: 'i' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand) filter.brand = req.query.brand;
  filter.isActive = true;

  const [items, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const update = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

export const remove = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Deleted' });
});
