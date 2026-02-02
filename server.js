import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Proxy endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            ...(history || []),
            { role: "user", parts: [{ text: message }] }
          ]
        }),
      }
    );

    const data = await response.json();
    res.json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi" });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
