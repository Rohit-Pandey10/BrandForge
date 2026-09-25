import express from 'express';
import {
  handleGetBrandSessions,
  handleSaveBrandSession,
  handleSyncGuestBrands,
  handleDeleteBrandSession
} from '../controllers/brandHistoryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All brand history routes require authentication
router.use(requireAuth);

router.get('/', handleGetBrandSessions);
router.post('/', handleSaveBrandSession);
router.post('/sync-guest', handleSyncGuestBrands);
router.delete('/:id', handleDeleteBrandSession);

export default router;
