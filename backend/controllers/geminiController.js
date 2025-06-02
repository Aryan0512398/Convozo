import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

/**
 * Handle AI chat request using Gemini
 * Accepts: { userId, message, history }
 * Returns: { reply }
 */
 const handleGeminiChat = async (req, res) => {
  const { userId, message, history = [] } = req.body;

  try {
    // Convert history to Gemini format
    const formattedHistory = history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Create a new Gemini chat session
    const chat = genAI.chats.create({
      model: "gemini-1.5-flash",
      history: formattedHistory,
    });

    // Send the user's message
    const result = await chat.sendMessage({ message });

    res.json({ reply: result.text });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({ error: "Gemini failed to respond." });
  }
};
export {handleGeminiChat}
