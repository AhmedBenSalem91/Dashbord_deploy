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

async function createUsers() {
    try {
        const users = [
            { username: 'user1', password: 'password1', email: 'exemple1@gmail.com' },
            { username: 'user2', password: 'password2', email: 'exemple2@gmail.com' },
            { username: 'user3', password: 'password3', email: 'exemple3@gmail.com' },
        ];

        for (let userData of users) {
            const user = new User(userData);
            await user.save();
            console.log(`User ${user.username} created successfully`);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating users:', err);
    }
}

createUsers();
