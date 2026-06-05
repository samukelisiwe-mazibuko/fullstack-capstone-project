/*jshint esversion: 8 */

const express = require("express");
const natural = require("natural");

const app = express();
app.use(express.json());

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

const analyzer = new Analyzer("English", stemmer, "afinn");

app.post("/sentiment", (req, res) => {
    try {
        const { sentence } = req.body;

        if (!sentence) {
            return res.status(400).json({ error: "sentence is required" });
        }

        const tokens = tokenizer.tokenize(sentence);
        const score = analyzer.getSentiment(tokens);

        let sentiment = "neutral";

        if (score < 0) sentiment = "negative";
        else if (score <= 0.33) sentiment = "neutral";
        else sentiment = "positive";

        return res.json({
            sentence,
            score,
            sentiment
        });

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

const port = 3060;
app.listen(port, () => {
    console.log(`Sentiment service running on port ${port}`);
});

