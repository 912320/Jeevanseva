const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'doctor', 'hospital', 'admin']).withMessage('Invalid role'),
  body('phone').optional({ checkFalsy: true }).isString()
], validate, authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, authController.login);

router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getMe);
router.put('/me', auth, authController.updateProfile);
router.put('/change-password', auth, [
  body('oldPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], validate, authController.changePassword);

module.exports = router;