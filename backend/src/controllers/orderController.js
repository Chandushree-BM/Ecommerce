import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });
  const total = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);
  const order = await Order.create({ user: req.user.id, items, total, shippingAddress });
  res.status(201).json(order);
};

export const myOrders = async (req, res) => {
  const list = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.json(list);
};

// Admin
export const listOrders = async (req, res) => {
  const { page = 1, limit = 10, status, q } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (q) filter.$or = [ { _id: q }, { 'shippingAddress.fullName': new RegExp(q, 'i') } ];
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Order.find(filter).populate('user', 'email').sort('-createdAt').skip(skip).limit(Number(limit)),
    Order.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = status;
  await order.save();
  res.json({ success: true, order });
};

export const updateOrderNotes = async (req, res) => {
  const { notes } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { adminNotes: notes }, { new: true });
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, order });
};