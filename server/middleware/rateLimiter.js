const rateLimit = require('express-rate-limit');
const config = require('../config/config');
exports.generalLimiter = rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max, message: 'Too many requests, please try again later.' });
exports.authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many login attempts, please try again later.' });
exports.strictLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many requests, please try again later.' });