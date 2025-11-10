import express from 'express';
const router = express.Router();
import Product from '../../models/Product.js';
import { protect, admin } from '../../middleware/auth.js';

// @route   GET /api/admin/products
// @desc    Get all products (including deleted) with pagination
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, search, includeDeleted } = req.query;
    
    // Build query
    let query = {};
    
    if (!includeDeleted || includeDeleted === 'false') {
      query.isDeleted = false;
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, slug, description, price, category, stock, weight, images } = req.body;
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this slug already exists' });
    }
    
    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      stock,
      weight,
      images: images || [],
    });
    
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/products/:id
// @desc    Get product by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { name, slug, description, price, category, stock, weight, images } = req.body;
    
    // Check if slug is being changed and if it already exists
    if (slug && slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this slug already exists' });
      }
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        description,
        price,
        category,
        stock,
        weight,
        images,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product (soft delete)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Soft delete
    product.isDeleted = true;
    await product.save();
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/products/import
// @desc    Bulk import products
// @access  Private/Admin
router.post('/import', protect, admin, async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of products' });
    }
    
    const createdProducts = await Product.insertMany(products);
    
    res.status(201).json({
      success: true,
      count: createdProducts.length,
      products: createdProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
