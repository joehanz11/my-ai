const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        // Call the AI model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // You can use other models here too
            contents: userMessage,
        });

        // Send the AI's text back to the frontend
        res.json({ reply: response.text });

    } catch (error) {
        console.error("Error communicating with AI:", error);
        res.status(500).json({ error: 'Failed to generate response.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});