const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

router.get('/', pharmacyController.getAllPharmacies);
router.get('/nearby', pharmacyController.getAllPharmacies);

module.exports = router;
