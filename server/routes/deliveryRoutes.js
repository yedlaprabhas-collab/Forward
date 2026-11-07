const express = require('express');
const router = express.Router();
const {
  getAvailableDeliveries,
  getMyDeliveries,
  acceptDelivery,
  markPickedUp,
  markDelivered,
  confirmDeliveryReceipt,
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/available', protect, authorize('volunteer'), getAvailableDeliveries);
router.get('/my', protect, authorize('volunteer'), getMyDeliveries);
router.put('/:id/accept', protect, authorize('volunteer'), acceptDelivery);
router.put('/:id/pickup', protect, authorize('volunteer'), markPickedUp);
router.put('/:id/deliver', protect, authorize('volunteer'), markDelivered);
router.put('/:id/confirm', protect, authorize('ngo', 'admin'), confirmDeliveryReceipt);

module.exports = router;
