import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   HEALTH CHECK
====================== */
app.get("/", (req, res) => {
    res.send("Nexa N.10 Server is running securely.");
});

/* ======================
   CHAT ENDPOINT
====================== */
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: "No message provided" });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `
You are Nexa N.10, a secure AI chatbot.

You are:
- Friendly
- Helpful
- Smart
- Slightly futuristic

You can:
- Answer questions
- Tell jokes
- Help with coding
- Explain things simply
                        `
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices) {
            return res.status(500).json({
                error: "Invalid response from AI",
                details: data
            });
        }

        const reply = data.choices[0].message.content;

        res.json({
            reply: reply
        });

    } catch (error) {
        console.error("Nexa Error:", error);

        res.status(500).json({
            error: "Nexa server failed"
        });
    }
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Nexa N.10 running on port ${PORT}`);
});
