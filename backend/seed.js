const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const NGO = require('./models/NGO');
const Donation = require('./models/Donation');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await NGO.deleteMany();
        await Donation.deleteMany();

        console.log('🗑️  Data cleared...');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@ngo.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create regular users
        const users = await User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Bob Wilson',
                email: 'bob@example.com',
                password: 'password123',
                role: 'user'
            }
        ]);

        console.log('✅ Users created...');

        // Create NGOs
        const ngos = await NGO.create([
            {
                name: 'Education for All',
                description: 'Providing quality education to underprivileged children across India. We believe every child deserves access to education regardless of their economic background.',
                category: 'education',
                location: 'Mumbai, Maharashtra',
                targetAmount: 500000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
                createdBy: admin._id
            },
            {
                name: 'Healthcare Heroes',
                description: 'Supporting rural healthcare facilities with medical equipment and trained professionals to ensure everyone has access to basic healthcare.',
                category: 'healthcare',
                location: 'Delhi, NCR',
                targetAmount: 750000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
                createdBy: admin._id
            },
            {
                name: 'Green Earth Initiative',
                description: 'Planting trees and creating awareness about environmental conservation. Join us in making our planet greener and cleaner for future generations.',
                category: 'environment',
                location: 'Bangalore, Karnataka',
                targetAmount: 300000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
                createdBy: admin._id
            },
            {
                name: 'Feed the Hungry',
                description: 'Combating hunger by providing nutritious meals to homeless and underprivileged communities. No one should go to bed hungry.',
                category: 'poverty',
                location: 'Kolkata, West Bengal',
                targetAmount: 400000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
                createdBy: admin._id
            },
            {
                name: 'Animal Rescue Center',
                description: 'Rescuing and rehabilitating abandoned and injured animals. Providing them with medical care, shelter, and love they deserve.',
                category: 'animal-welfare',
                location: 'Pune, Maharashtra',
                targetAmount: 250000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
                createdBy: admin._id
            },
            {
                name: 'Disaster Relief Fund',
                description: 'Providing immediate relief and rehabilitation to communities affected by natural disasters. Quick response saves lives.',
                category: 'disaster-relief',
                location: 'Chennai, Tamil Nadu',
                targetAmount: 1000000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?w=400',
                createdBy: admin._id
            },
            {
                name: 'Women Empowerment Foundation',
                description: 'Empowering women through skill development, education, and entrepreneurship opportunities. Building a society where women thrive.',
                category: 'education',
                location: 'Hyderabad, Telangana',
                targetAmount: 600000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
                createdBy: admin._id
            },
            {
                name: 'Clean Water Project',
                description: 'Installing water purification systems in villages without access to clean drinking water. Clean water is a basic human right.',
                category: 'healthcare',
                location: 'Jaipur, Rajasthan',
                targetAmount: 800000,
                raisedAmount: 0,
                image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
                createdBy: admin._id
            }
        ]);

        console.log('✅ NGOs created...');

        // Create some sample donations
        const donations = [];

        // Create donations for each NGO
        for (let i = 0; i < ngos.length; i++) {
            const ngo = ngos[i];
            const donorIndex = i % users.length;
            const donor = users[donorIndex];

            const donationAmount = Math.floor(Math.random() * 10000) + 5000;

            const donation = await Donation.create({
                amount: donationAmount,
                ngo: ngo._id,
                donor: donor._id,
                paymentMethod: ['credit-card', 'debit-card', 'upi', 'wallet'][Math.floor(Math.random() * 4)],
                paymentStatus: 'completed',
                message: 'Keep up the great work!',
                isAnonymous: Math.random() > 0.7,
                transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
            });

            donations.push(donation);
        }

        console.log('✅ Sample donations created...');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${users.length + 1} (including 1 admin)`);
        console.log(`   NGOs: ${ngos.length}`);
        console.log(`   Donations: ${donations.length}`);
        console.log('\n🔐 Login Credentials:');
        console.log('   Admin: admin@ngo.com / admin123');
        console.log('   User: john@example.com / password123');
        console.log('   User: jane@example.com / password123');
        console.log('   User: bob@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
