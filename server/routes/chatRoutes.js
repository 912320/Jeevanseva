const express = require('express');
const router = express.Router();
const { chat, getSuggestedPrompts } = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');

// Dedicated rate limiter for chat — 30 messages per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many messages. Please slow down and try again in a minute.' }
});

// POST /api/chat — main chat endpoint
router.post('/', chatLimiter, chat);

// GET /api/chat/prompts — suggested starter prompts
router.get('/prompts', getSuggestedPrompts);

module.exports = router;
