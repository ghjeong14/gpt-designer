require('dotenv').config();
const db = require("./db");

const log = {
    info: (msg) => console.log("\x1b[36m%s\x1b[0m", msg),     // cyan
    warn: (msg) => console.warn("\x1b[33m%s\x1b[0m", msg),    // yellow
    error: (msg) => console.error("\x1b[31m%s\x1b[0m", msg),  // red
    success: (msg) => console.log("\x1b[32m%s\x1b[0m", msg),  // green
  };
  

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json()); // allows us to read JSON in requests

// Test route
app.get('/', (req, res) => {
    res.send('GPT Designer backend is running!');
  });
  
// New POST route
app.post('/chat', async(req, res) => {
    const { prompt, role, model } = req.body;

    log.info("🟢 New request received");
    console.log("Prompt:", prompt);
    console.log("Role:", role);
    console.log("Model:", model);
  
    const body = {
    model,
    messages: [
        { role: "system", content: `You are a helpful ${role} giving short, structured responses.` },
        { role: "user", content: prompt }
    ]
   };

   try{
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "MiniGPT Designer"
        },
        body: JSON.stringify(body)
    });

    log.success("✅ Response status: " + response.status);

    const data = await response.json();
    if (data && data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        db.saveMessage(prompt, reply, role, model);
        return res.json({ reply });
        
    } else {
        log.warn("⚠️ No valid choices returned");
        return res.status(500).json({ reply: "The model didn't return a valid response." });
    }
   }catch (err) {
    log.error("❌ Backend error: " + err.message); // red text
    return res.status(500).json({ reply: "Server error: " + err.message });
  }
});

app.get("/history", (req, res) => {
    const messages = db.getAllMessages();
    res.json(messages);
});

db.init();

app.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});