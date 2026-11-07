const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAllDonations,
  getDonationById,
  getMyDonations,
  updateDonation,
  deleteDonation,
  requestDonation,
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('donor'), createDonation)
  .get(getAllDonations);

router.get('/my', protect, authorize('donor'), getMyDonations);

router.route('/:id')
  .get(getDonationById)
  .put(protect, authorize('donor', 'admin'), updateDonation)
  .delete(protect, authorize('donor', 'admin'), deleteDonation);

router.post('/:id/request', protect, authorize('ngo'), requestDonation);

module.exports = router;
