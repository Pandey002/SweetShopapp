import { Router } from 'express';
import * as sweetController from '../controllers/sweet.controller';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public/Protected Routes (All Authenticated)
router.use(authenticateToken);

// 1. Search Route (MUST BE FIRST)
router.get('/search', sweetController.searchSweets);

// 2. Get All Route
router.get('/', sweetController.getAllSweets);

// 3. Get By ID Route (Must be last of the GETs)
router.get('/:id', sweetController.getSweetById);

// 4. POST, PUT, DELETE Routes
router.post('/', isAdmin, sweetController.createSweet);
router.post('/:id/purchase', sweetController.purchaseSweet);
router.put('/:id', isAdmin, sweetController.updateSweet);
router.delete('/:id', isAdmin, sweetController.deleteSweet);
router.post('/:id/restock', isAdmin, sweetController.restockSweet);

export default router;
