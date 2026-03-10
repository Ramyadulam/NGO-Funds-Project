const mongoose = require('mongoose');
const Donation = require('./models/Donation');
const User = require('./models/User');
const NGO = require('./models/NGO');
const dotenv = require('dotenv');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const donationCount = await Donation.countDocuments();
        console.log('Total Donations in DB:', donationCount);

        if (donationCount > 0) {
            const lastDonation = await Donation.findOne().sort('-createdAt');
            console.log('Last Donation:', JSON.stringify(lastDonation, null, 2));

            const donor = await User.findById(lastDonation.donor);
            console.log('Donor of last donation:', donor ? donor.email : 'NOT FOUND');
        }

        const users = await User.find();
        console.log('Users in DB:', users.map(u => ({ id: u._id, email: u.email, name: u.name })));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
