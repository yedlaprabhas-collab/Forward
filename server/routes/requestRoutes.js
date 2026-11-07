const express = require('express');
const router = express.Router();
const {
  getMyRequests,
  cancelRequest,
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, authorize('ngo'), getMyRequests);
router.put('/:id/cancel', protect, authorize('ngo', 'admin'), cancelRequest);

module.exports = router;
