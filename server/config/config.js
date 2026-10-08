require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'jeevanseva',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expire: process.env.JWT_EXPIRE || '1d'
  },
  cors: {
    origin: process.env.CLIENT_URL || '*'
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
    max: process.env.RATE_LIMIT_MAX || 100
  },
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 5242880,
    dir: process.env.UPLOAD_DIR || 'uploads/'
  }
};