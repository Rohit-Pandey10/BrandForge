import express from 'express';
import {
  handleRegister,
  handleLogin,
  handleGoogleAuth,
  handleGetMe
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/google', handleGoogleAuth);

// Protected routes
router.get('/me', requireAuth, handleGetMe);

export default router;
