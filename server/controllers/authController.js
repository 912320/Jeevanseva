const authService = require('../services/authService');
const apiResponse = require('../utils/apiResponse');
const AppError = require('../utils/apiError');
const { User, Patient, Doctor, Hospital } = require('../models');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return next(new AppError('Email already registered', 400));

    const user = await authService.registerUser({
      ...req.body,
      password_hash: password
    });

    const token = authService.generateToken(user);
    const safeUser = user.toJSON();
    delete safeUser.password_hash;

    apiResponse.success(res, { user: safeUser, token }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    if (!user) return next(new AppError('Invalid email or password', 401));

    const token = authService.generateToken(user);
    const safeUser = user.toJSON();
    delete safeUser.password_hash;

    apiResponse.success(res, { user: safeUser, token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  apiResponse.success(res, null, 'Logged out successfully');
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Patient, required: false },
        { model: Doctor, required: false },
        { model: Hospital, required: false }
      ],
      attributes: { exclude: ['password_hash'] }
    });
    if (!user) return next(new AppError('User not found', 404));
    apiResponse.success(res, { user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError('User not found', 404));
    const { name, phone, address, city, state } = req.body;
    await user.update({ name, phone, address, city, state });
    const safeUser = user.toJSON();
    delete safeUser.password_hash;
    apiResponse.success(res, { user: safeUser }, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError('User not found', 404));
    if (!(await user.comparePassword(oldPassword))) return next(new AppError('Invalid current password', 400));
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    apiResponse.success(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};