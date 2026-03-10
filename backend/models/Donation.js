const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please provide donation amount'],
        min: [0.00001, 'Donation amount must be at least 0.00001']
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: [true, 'Please provide NGO reference']
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide donor reference']
    },
    paymentMethod: {
        type: String,
        enum: ['credit-card', 'debit-card', 'upi', 'netbanking', 'wallet', 'ethereum'],
        default: 'credit-card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot be more than 500 characters']
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    blockchainHash: {
        type: String,
        unique: true,
        sparse: true
    },
    blockNumber: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update NGO raised amount after donation
donationSchema.post('save', async function () {
    const NGO = require('./NGO');

    // Calculate total donations for this NGO
    const stats = await this.constructor.aggregate([
        {
            $match: {
                ngo: this.ngo,
                paymentStatus: 'completed'
            }
        },
        {
            $group: {
                _id: '$ngo',
                total: { $sum: '$amount' }
            }
        }
    ]);

    if (stats.length > 0) {
        await NGO.findByIdAndUpdate(this.ngo, {
            raisedAmount: stats[0].total
        });
    }
});

module.exports = mongoose.model('Donation', donationSchema);
