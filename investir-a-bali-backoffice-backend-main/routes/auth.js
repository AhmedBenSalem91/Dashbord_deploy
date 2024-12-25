const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        console.log('User found:', user);

        const isMatch = await user.comparePassword(password);
        console.log('Password comparison result:', isMatch);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET
        );


        const expirationTime = new Date().getTime() + 4 * 60 * 60 * 1000; // 4 hours in ms

        user.registrationToken = token;
        await user.save();

        // Return the token and user info to the client
        res.json({ token, expiresIn: expirationTime, user});
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
