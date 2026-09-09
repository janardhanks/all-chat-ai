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


/* -------------------------
   OPENAI
------------------------- */

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* -------------------------
   GEMINI
------------------------- */

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


/* -------------------------
   CHATGPT FUNCTION
------------------------- */

async function askChatGPT(question) {

    const response = await openai.responses.create({
        model: "gpt-5",
        input: question
    });

    return response.output_text;
}


/* -------------------------
   GEMINI FUNCTION
------------------------- */

async function askGemini(question) {

    const response = await gemini.models.generateContent({
        model: "gemini-3.7-flash",
        contents: question
    });

    return response.text;
}


/* -------------------------
   PERPLEXITY FUNCTION
------------------------- */

async function askPerplexity(question) {

    const response = await fetch(
        "https://api.perplexity.ai/v1/sonar",
        {
            method: "POST",

            headers: {
                "Authorization":
                    `Bearer ${process.env.PERPLEXITY_API_KEY}`,

                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                model: "sonar",

                messages: [
                    {
                        role: "user",
                        content: question
                    }
                ]

            })
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Perplexity API error: ${errorText}`
        );
    }


    const data =
        await response.json();


    return data
        .choices[0]
        .message
        .content;
}


/* -------------------------
   TEST ROUTE
------------------------- */

app.get("/", (req, res) => {

    res.json({
        message: "ALL CHAT AI backend is running!"
    });

});


/* -------------------------
   ASK AI ROUTE
------------------------- */

app.post("/api/ask", async (req, res) => {

    try {

        const {
            question,
            providers
        } = req.body;


        if (!question || !question.trim()) {

            return res.status(400).json({
                error: "Question is required."
            });

        }


        if (!Array.isArray(providers) ||
            providers.length === 0) {

            return res.status(400).json({
                error: "Select at least one AI."
            });

        }


        const tasks = [];


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


        if (providers.includes("Perplexity")) {

            tasks.push(
                askPerplexity(question)
                    .then(answer => ({
                        ai: "Perplexity",
                        answer
                    }))
                    .catch(error => ({
                        ai: "Perplexity",
                        error: error.message
                    }))
            );

        }


        const results =
            await Promise.all(tasks);


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


/* -------------------------
   START SERVER
------------------------- */

app.listen(PORT, () => {

    console.log(
        `ALL CHAT AI backend running on port ${PORT}`
    );

});
