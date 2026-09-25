import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ChatGPT
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Grok
const xai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1"
});

// Gemini
const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ===============================
// CHATGPT
// ===============================
async function askChatGPT(question) {
    const response = await openai.responses.create({
        model: "gpt-5",
        input: question
    });

    return response.output_text;
}


// ===============================
// GEMINI
// ===============================
async function askGemini(question) {
    const response = await gemini.models.generateContent({
        model: "gemini-3.7-flash",
        contents: question
    });

    return response.text;
}


// ===============================
// GROK
// ===============================
async function askGrok(question) {
    const response = await xai.responses.create({
        model: "grok-4.6",
        input: question
    });

    return response.output_text;
}


// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
    res.json({
        message: "ALL CHAT AI backend is running!"
    });
});


// ===============================
// ASK ALL SELECTED AI
// ===============================
app.post("/api/ask", async (req, res) => {
    try {
        const { question, providers } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Question is required."
            });
        }

        if (!Array.isArray(providers) || providers.length === 0) {
            return res.status(400).json({
                error: "Select at least one AI."
            });
        }

        const tasks = [];

        // ChatGPT
        if (providers.includes("ChatGPT")) {
            tasks.push(
                askChatGPT(question)
                    .then(answer => ({
                        ai: "ChatGPT",
                        answer
                    }))
                    .catch(error => ({
                        ai: "ChatGPT",
                        error: error.message
                    }))
            );
        }

        // Gemini
        if (providers.includes("Gemini")) {
            tasks.push(
                askGemini(question)
                    .then(answer => ({
                        ai: "Gemini",
                        answer
                    }))
                    .catch(error => ({
                        ai: "Gemini",
                        error: error.message
                    }))
            );
        }

        // Grok
        if (providers.includes("Grok")) {
            tasks.push(
                askGrok(question)
                    .then(answer => ({
                        ai: "Grok",
                        answer
                    }))
                    .catch(error => ({
                        ai: "Grok",
                        error: error.message
                    }))
            );
        }

        // Run all selected AI requests at the same time
        const results = await Promise.all(tasks);

        res.json({
            question,
            results
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong on the server."
        });
    }
});


// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
    console.log(`ALL CHAT AI backend running on port ${PORT}`);
});
