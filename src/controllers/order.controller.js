import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  let itemsPrice = 0;
  for (const item of orderItems) {
    const p = await Product.findById(item.product);
    if (!p || !p.isActive) return res.status(400).json({ message: `Invalid product ${item.product}` });
    if (p.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
    itemsPrice += p.price * item.qty;
  }
  const shippingPrice = Number(req.body.shippingPrice || 0);
  const taxPrice = Number(req.body.taxPrice || 0);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: req.body.orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod || 'Card',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  });
  res.status(201).json(order);
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user','name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const markPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = new Date();
  await order.save();
  res.json(order);
});

export const markDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();
  res.json(order);
});
