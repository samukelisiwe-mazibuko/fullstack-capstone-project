const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

const logger = pino();
require('dotenv').config();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

router.post('/register', async (req, res) => {
    try {
        // Step 1: connect to DB
        const db = await connectToDatabase();

        // Step 2: get collection
        const users = db.collection('users');

        const { name, email, password } = req.body;
        // Step 3: check existing email
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Step 4: hash password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        // Step 5: save user
        const newUser = {
            name,
            email,
            password: hash
        };

        const result = await users.insertOne(newUser);

        // Step 6: create JWT
        const token = jwt.sign(
            { id: result.insertedId },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        logger.info("User registered successfully");

        res.json({
            email: email,
            authtoken: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Task 1: Connect to giftsdb
        const db = await connectToDatabase();
        
        // Task 2: Access users collection
        const usersCollection = db.collection('users');

        // Task 3: Check if user exists
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Task 4: Compare passwords (encrypted password check)
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Task 5: Fetch user details
        const userName = user.name;
        const userEmail = user.email;

        // Task 6: Create JWT token
        const authtoken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "1h" }
        );

        // Send response (ONLY required fields)
        return res.json({ authtoken, userName, userEmail });

    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

router.put(
    '/update',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        // Task 2: Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Task 3: Check email in header
            const email = req.headers.email;
            if (!email) {
                return res.status(400).json({ message: "Email is required in header" });
            }

            // Task 4: Connect to DB
            const db = await connectToDatabase();
            const users = db.collection('users');

            // Task 5: Find user
            const existingUser = await users.findOne({ email });

            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Prepare update object
            const updateData = {
                name: req.body.name || existingUser.name,
                updatedAt: new Date()
            };

            // If password is provided, hash it
            if (req.body.password) {
                const salt = await bcryptjs.genSalt(10);
                updateData.password = await bcryptjs.hash(req.body.password, salt);
            }

            // Task 6: Update user
            await users.updateOne(
                { email },
                { $set: updateData }
            );

            // Get updated user
            const updatedUser = await users.findOne({ email });

            // Task 7: Create JWT
            const authtoken = jwt.sign(
                { id: updatedUser._id },
                process.env.JWT_SECRET || "secretkey",
                { expiresIn: "1h" }
            );

            return res.json({
                authtoken,
                userName: updatedUser.name,
                userEmail: updatedUser.email
            });

        } catch (e) {
            console.error(e);
            return res.status(500).send('Internal server error');
        }
    }
);

module.exports = router;