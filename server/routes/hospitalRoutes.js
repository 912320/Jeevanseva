const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

router.post('/sync-google-nearby', hospitalController.syncGoogleNearbyHospitals);
router.post('/sync-rapidapi-nearby', hospitalController.syncRapidApiNearbyHospitals);
router.get('/nearby', hospitalController.getAllHospitals);
router.get('/', hospitalController.getAllHospitals);
router.get('/:id', hospitalController.getHospitalById);

module.exports = router;
