const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide NGO name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide NGO description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please provide NGO category'],
        enum: ['education', 'healthcare', 'environment', 'poverty', 'animal-welfare', 'disaster-relief', 'other']
    },
    location: {
        type: String,
        required: [true, 'Please provide NGO location']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please provide target amount'],
        min: [0, 'Target amount cannot be negative']
    },
    raisedAmount: {
        type: Number,
        default: 0,
        min: [0, 'Raised amount cannot be negative']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/400x300?text=NGO'
    },
    walletAddress: {
        type: String,
        trim: true,
        lowercase: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate progress percentage
ngoSchema.virtual('progress').get(function () {
    return Math.min(Math.round((this.raisedAmount / this.targetAmount) * 100), 100);
});

// Include virtuals when converting to JSON
ngoSchema.set('toJSON', { virtuals: true });
ngoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('NGO', ngoSchema);
