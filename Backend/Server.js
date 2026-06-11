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
    res.send("🤖 Nexa N.20 is running securely.");
});

/* ======================
   CHAT ENDPOINT
====================== */
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        const memory = req.body.memory || "";

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
                    /* ======================
                       SYSTEM PROMPT (N.20)
                    ====================== */
                    {
                        role: "system",
                        content: `
You are Nexa N.20, an advanced AI assistant.

You have:
- Memory awareness
- Friendly personality
- Helpful explanations
- Clean and simple responses

Use the memory context if provided by the user.
                        `
                    },

                    /* ======================
                       MEMORY CONTEXT
                    ====================== */
                    {
                        role: "system",
                        content: `User memory: ${memory || "No memory available"}`
                    },

                    /* ======================
                       USER MESSAGE
                    ====================== */
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({
                error: "Invalid AI response",
                details: data
            });
        }

        const reply = data.choices[0].message.content;

        res.json({
            reply: reply
        });

    } catch (error) {
        console.error("Nexa Server Error:", error);

        res.status(500).json({
            error: "Nexa backend failed"
        });
    }
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🤖 Nexa N.20 running on port ${PORT}`);
});
