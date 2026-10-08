const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/unified', searchController.unifiedSearch);

module.exports = router;
