const app = require('./app');
const db = require('./models');
const config = require('./config/config');

const PORT = config.port || 5000;

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

db.sequelize.authenticate().then(() => {
  console.log('Database connected successfully...');
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (http://127.0.0.1:${PORT})`);
  });

  process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => process.exit(1));
  });
}).catch(err => {
  console.log('Error connecting to database:', err);
});