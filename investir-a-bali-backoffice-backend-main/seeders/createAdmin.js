const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path if necessary
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

async function createAdmin() {
    try {
        const admin = new User({
            username: 'admin',
            email: 'sassiyossr3@gmail.com',
            password: 'admin123',
            role : 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
}

createAdmin();
