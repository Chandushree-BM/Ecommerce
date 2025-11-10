import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { placeOrder, myOrders } from '../controllers/orderController.js';
const router = Router();
router.post('/', auth, placeOrder);
router.get('/my', auth, myOrders);
export default router;