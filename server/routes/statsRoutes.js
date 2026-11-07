const express = require('express');
const router = express.Router();
const { getApiRoot, getPublicStats, getHealth } = require('../controllers/statsController');

router.get('/', getApiRoot);
router.get('/stats', getPublicStats);
router.get('/health', getHealth);

module.exports = router;
