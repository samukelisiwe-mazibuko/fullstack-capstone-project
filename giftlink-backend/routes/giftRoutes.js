const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Get all gifts
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get gift by id
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gift = await collection.findOne({ id: req.params.id });
        res.json(gift);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gift = await collection.insertOne(req.body);

        res.status(201).json(gift);
    } catch (e) {
        next(e);
    }
});

module.exports = router;