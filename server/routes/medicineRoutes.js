const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.get('/', medicineController.getAllMedicines);
router.get('/search', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);

module.exports = router;
