const NGO = require('../models/NGO');

// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
exports.getNGOs = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let query = { isActive: true };

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const ngos = await NGO.find(query)
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: ngos.length,
            data: ngos
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single NGO
// @route   GET /api/ngos/:id
// @access  Public
exports.getNGO = async (req, res, next) => {
    try {
        const ngo = await NGO.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        res.status(200).json({
            success: true,
            data: ngo
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new NGO
// @route   POST /api/ngos
// @access  Private (Admin)
exports.createNGO = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const ngo = await NGO.create(req.body);

        // Register on Blockchain if not already registered by frontend
        if (!req.body.isRegisteredOnChain) {
            try {
                const contractService = require('../services/contract.service');
                const walletAddress = req.body.walletAddress || "0x0000000000000000000000000000000000000000";
                await contractService.registerNGOOnChain(ngo._id.toString(), ngo.name, walletAddress);
            } catch (blockchainError) {
                console.error("Blockchain registration failed:", blockchainError);
            }
        }

        res.status(201).json({
            success: true,
            message: 'NGO created successfully',
            data: ngo
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update NGO
// @route   PUT /api/ngos/:id
// @access  Private (Admin)
exports.updateNGO = async (req, res, next) => {
    try {
        let ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        // Make sure user is NGO creator or admin
        if (ngo.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this NGO'
            });
        }

        ngo = await NGO.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'NGO updated successfully',
            data: ngo
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete NGO
// @route   DELETE /api/ngos/:id
// @access  Private (Admin)
exports.deleteNGO = async (req, res, next) => {
    try {
        const ngo = await NGO.findById(req.params.id);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: 'NGO not found'
            });
        }

        // Make sure user is NGO creator or admin
        if (ngo.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this NGO'
            });
        }

        await ngo.deleteOne();

        res.status(200).json({
            success: true,
            message: 'NGO deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get NGO statistics
// @route   GET /api/ngos/stats/overview
// @access  Public
exports.getNGOStats = async (req, res, next) => {
    try {
        const totalNGOs = await NGO.countDocuments({ isActive: true });

        const stats = await NGO.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalTarget: { $sum: '$targetAmount' },
                    totalRaised: { $sum: '$raisedAmount' }
                }
            }
        ]);

        const categoryStats = await NGO.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalNGOs,
                totalTarget: stats[0]?.totalTarget || 0,
                totalRaised: stats[0]?.totalRaised || 0,
                categoryDistribution: categoryStats
            }
        });
    } catch (error) {
        next(error);
    }
};
