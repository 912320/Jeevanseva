const multer = require('multer');
const path = require('path');
const config = require('../config/config');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.upload.dir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Not an image! Please upload only images.'), false);
};
module.exports = multer({ storage, fileFilter, limits: { fileSize: config.upload.maxFileSize } });