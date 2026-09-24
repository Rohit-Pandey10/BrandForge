import express from 'express';
import {
  handleStartInterview,
  handleNextQuestion,
  handleCompileBrandKit
} from '../controllers/interviewerController.js';

const router = express.Router();

/**
 * @route   POST /api/interview/start
 * @desc    Generates full 7-question discovery batch upfront in 1 call
 * @access  Public
 */
router.post('/start', handleStartInterview);

/**
 * @route   POST /api/interview/next
 * @desc    Evaluates transcript and returns the next Socratic question with 3 suggested pills
 * @access  Public
 */
router.post('/next', handleNextQuestion);

/**
 * @route   POST /api/interview/compile
 * @desc    Synthesizes transcript into structured Brand Kit JSON
 * @access  Public
 */
router.post('/compile', handleCompileBrandKit);

export default router;
