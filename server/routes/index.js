const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const hospitalRoutes = require('./hospitalRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const diseaseRoutes = require('./diseaseRoutes');
const medicineRoutes = require('./medicineRoutes');
const pharmacyRoutes = require('./pharmacyRoutes');
const emergencyRoutes = require('./emergencyRoutes');
const searchRoutes = require('./searchRoutes');
const chatRoutes = require('./chatRoutes');

router.use('/auth', authRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/diseases', diseaseRoutes);
router.use('/medicines', medicineRoutes);
router.use('/pharmacies', pharmacyRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/search', searchRoutes);
router.use('/chat', chatRoutes);

// Fallback for remaining features
['notifications', 'reviews', 'favorites', 'admin'].forEach(r => {
  const emptyRouter = express.Router();
  router.use(`/${r}`, emptyRouter);
});

module.exports = router;