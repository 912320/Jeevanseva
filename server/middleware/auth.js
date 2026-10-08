const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/config');
const { User } = require('../models');
const AppError = require('../utils/apiError');

module.exports = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('Not authorized to access this route', 401));
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findByPk(decoded.id);
    if (!user) return next(new AppError('User not found', 401));
    if (!user.is_active) return next(new AppError('User is deactivated', 403));
    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Not authorized to access this route', 401));
  }
};