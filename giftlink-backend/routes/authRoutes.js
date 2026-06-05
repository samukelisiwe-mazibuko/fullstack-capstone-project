const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const pino = require('pino');

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

        const { firstName, lastName, email, password } = req.body;

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
            firstName,
            lastName,
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

module.exports = router;