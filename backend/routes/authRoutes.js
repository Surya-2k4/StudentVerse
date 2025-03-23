 
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied!');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

// ✅ Register User (Admin only)
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).send('Please fill all fields');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send('User already exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).send('User registered successfully!');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// ✅ Login User (User & Admin)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please provide email and password');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// ✅ Get Current User Profile (Protected Route)
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// ✅ Admin Middleware - Only Admin can access
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access Denied. Admins only!');
    }
    next();
};

// ✅ Protected route accessible only by Admin
router.get('/admin', authenticate, adminAuth, (req, res) => {
    res.send('Welcome Admin! You have full access.');
});

module.exports = router;
