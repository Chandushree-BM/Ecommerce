import Product from '../models/Product.js';
import slugify from 'slugify';

export const listProducts = async (req, res) => {
  const { page = 1, limit = 10, q = '', category } = req.query;
  const filter = { isDeleted: false };
  if (q) filter.$or = [ { name: new RegExp(q, 'i') }, { slug: new RegExp(q, 'i') } ];
  if (category) filter.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p || p.isDeleted) return res.status(404).json({ message: 'Not found' });
  res.json(p);
};

export const adminCreateProduct = async (req, res) => {
  const { name, category, price, stock, weight = 0, description = '', images = [] } = req.body;
  if (!name || !category || !price) return res.status(400).json({ message: 'Missing fields' });
  const slug = slugify(name, { lower: true, strict: true });
  const exists = await Product.findOne({ slug });
  if (exists) return res.status(409).json({ message: 'Name/slug already exists' });
  const doc = await Product.create({ name, slug, category, price, stock, weight, description, images });
  res.status(201).json(doc);
};

export const adminUpdateProduct = async (req, res) => {
  const { id } = req.params;
  const update = { ...req.body };
  if (update.name) update.slug = slugify(update.name, { lower: true, strict: true });
  const doc = await Product.findByIdAndUpdate(id, update, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};

export const adminDeleteProduct = async (req, res) => {
  const { id } = req.params;
  const doc = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
};