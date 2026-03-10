const express = require('express');
const {
    getDonations,
    getDonationsByNGO,
    createDonation,
    getDonation,
    getMyDonationStats,
    getAllDonations
} = require('../controllers/donationController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getDonations)
    .post(protect, createDonation);

router.get('/ngo/:ngoId', getDonationsByNGO);
router.get('/stats/me', protect, getMyDonationStats);
router.get('/admin/all', protect, authorize('admin'), getAllDonations);
router.get('/:id', protect, getDonation);

module.exports = router;
