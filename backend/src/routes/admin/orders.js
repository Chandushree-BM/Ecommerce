import express from 'express';
const router = express.Router();
import Order from '../../models/Order.js';
import { protect, admin } from '../../middleware/auth.js';
import Product from '../../models/Product.js';

// @route   GET /api/admin/orders
// @desc    Get all orders with filters and pagination
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, search, startDate, endDate } = req.query;
    
    // Build query
    let query = {};
    
    if (status && status !== 'All') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/orders/:id
// @desc    Get order by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    
    const updatedOrder = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');
    
    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:id/notes
// @desc    Add admin notes to order
// @access  Private/Admin
router.put('/:id/notes', protect, admin, async (req, res) => {
  try {
    const { notes } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.adminNotes = notes;
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/orders/export
// @desc    Export orders to CSV
// @access  Private/Admin
router.post('/export', protect, admin, async (req, res) => {
  try {
    const { orderIds } = req.body;
    
    let query = {};
    if (orderIds && orderIds.length > 0) {
      query._id = { $in: orderIds };
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    // Create CSV content
    let csv = 'Order ID,Customer Name,Customer Email,Total,Status,Created At\n';
    
    orders.forEach(order => {
      csv += `${order.orderId},${order.user.name},${order.user.email},${order.total},${order.status},${order.createdAt}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/orders/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats/dashboard', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue.toFixed(2),
        totalProducts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
