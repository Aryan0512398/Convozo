import express from "express";
import { handleGeminiChat } from "../controllers/geminiController.js";

const geminiRouter = express.Router();

geminiRouter.post("/ask", handleGeminiChat);

export default geminiRouter;
