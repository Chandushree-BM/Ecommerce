import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { adminLogin, adminProfile } from '../controllers/adminController.js';
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../controllers/productController.js';
import { listOrders, getOrder, updateOrderStatus, updateOrderNotes } from '../controllers/orderController.js';
import { exportOrdersCSV } from '../utils/csv.js';

const router = Router();

// Admin auth
router.post('/login', adminLogin);
router.get('/profile', auth, isAdmin, adminProfile);

// Products
router.post('/products', auth, isAdmin, adminCreateProduct);
router.put('/products/:id', auth, isAdmin, adminUpdateProduct);
router.delete('/products/:id', auth, isAdmin, adminDeleteProduct);
router.get('/products', auth, isAdmin, (req,res,next)=> next()); // reuse public list if desired

// Orders
router.get('/orders', auth, isAdmin, listOrders);
router.get('/orders/:id', auth, isAdmin, getOrder);
router.put('/orders/:id/status', auth, isAdmin, updateOrderStatus);
router.put('/orders/:id/notes', auth, isAdmin, updateOrderNotes);
router.post('/orders/export', auth, isAdmin, exportOrdersCSV);

export default router;