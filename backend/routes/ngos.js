const express = require('express');
const {
    getNGOs,
    getNGO,
    createNGO,
    updateNGO,
    deleteNGO,
    getNGOStats
} = require('../controllers/ngoController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getNGOs)
    .post(protect, authorize('admin'), createNGO);

router.get('/stats/overview', getNGOStats);

router.route('/:id')
    .get(getNGO)
    .put(protect, authorize('admin'), updateNGO)
    .delete(protect, authorize('admin'), deleteNGO);

module.exports = router;
