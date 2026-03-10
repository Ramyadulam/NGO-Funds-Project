const Donation = require('../models/Donation');
const NGO = require('../models/NGO');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private
exports.getDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ donor: req.user._id })
            .populate('ngo', 'name category image')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get donations for specific NGO
// @route   GET /api/donations/ngo/:ngoId
// @access  Public
exports.getDonationsByNGO = async (req, res, next) => {
    try {
        const { ngoId } = req.params;

        const donations = await Donation.find({
            ngo: ngoId,
            paymentStatus: 'completed'
        })
            .populate('donor', 'name')
            .sort('-createdAt')
            .limit(50);

        // Hide donor info if anonymous
        const sanitizedDonations = donations.map(donation => ({
            _id: donation._id,
            amount: donation.amount,
            donorName: donation.isAnonymous ? 'Anonymous' : donation.donor?.name || 'Anonymous',
            message: donation.message,
            createdAt: donation.createdAt
        }));

        res.status(200).json({
            success: true,
            count: sanitizedDonations.length,
            data: sanitizedDonations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res, next) => {
    try {
        const { ngoId, amount, paymentMethod, message, isAnonymous } = req.body;

        // Validate input
        if (!ngoId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Please provide NGO ID and donation amount'
            });
        }

        // Check if NGO exists
        const ngo = await NGO.findById(ngoId);
        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        if (!ngo.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This NGO is not accepting donations at the moment'
            });
        }

        // Generate unique transaction ID
        const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create donation
        const donation = await Donation.create({
            amount,
            ngo: ngoId,
            donor: req.user._id,
            paymentMethod: paymentMethod || 'credit-card',
            paymentStatus: 'completed',
            message,
            isAnonymous: isAnonymous || false,
            transactionId,
            blockchainHash: req.body.blockchainHash,
            blockNumber: req.body.blockNumber
        });

        // Populate the donation
        await donation.populate('ngo', 'name category image');

        // Record on blockchain if not already done by frontend
        if (!req.body.blockchainHash) {
            try {
                const contractService = require('../services/contract.service');
                const txHash = await contractService.recordDonationOnChain(
                    ngoId,
                    amount.toString(),
                    message || "Donation via App"
                );

                if (txHash) {
                    donation.blockchainHash = txHash;
                    await donation.save();
                }
            } catch (blockchainError) {
                console.error("Blockchain recording failed:", blockchainError);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Donation successful! Thank you for your contribution.',
            data: donation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private
exports.getDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('ngo', 'name category image')
            .populate('donor', 'name email');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Make sure user is donation owner or admin
        if (donation.donor._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this donation'
            });
        }

        res.status(200).json({
            success: true,
            data: donation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get donation statistics for user
// @route   GET /api/donations/stats/me
// @access  Private
exports.getMyDonationStats = async (req, res, next) => {
    try {
        const stats = await Donation.aggregate([
            {
                $match: {
                    donor: req.user._id,
                    paymentStatus: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalDonations: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        // Get donations by category
        const categoryStats = await Donation.aggregate([
            {
                $match: {
                    donor: req.user._id,
                    paymentStatus: 'completed'
                }
            },
            {
                $lookup: {
                    from: 'ngos',
                    localField: 'ngo',
                    foreignField: '_id',
                    as: 'ngoDetails'
                }
            },
            { $unwind: '$ngoDetails' },
            {
                $group: {
                    _id: '$ngoDetails.category',
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalDonations: stats[0]?.totalDonations || 0,
                totalAmount: stats[0]?.totalAmount || 0,
                categoryBreakdown: categoryStats
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all donations (Admin only)
// @route   GET /api/donations/admin/all
// @access  Private/Admin
exports.getAllDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find()
            .populate('ngo', 'name category')
            .populate('donor', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        next(error);
    }
};
