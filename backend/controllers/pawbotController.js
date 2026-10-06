import { GoogleGenerativeAI } from '@google/generative-ai';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const chatWithPawbot = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return sendError(res, 'Message is required', 400);
    }

    if (!process.env.GEMINI_API_KEY) {
      return sendError(res, 'Gemini API Key is not configured.', 500);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Formatting history for Gemini
    const formattedHistory = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })) : [];

    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: "You are PawBot, a friendly and helpful AI assistant for a pet care app called FurEver Care. You help pet parents with general advice, tips, and answering questions about their pets. You are cheerful, use emojis, and always remind users that for serious medical issues they should consult a real veterinarian."
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    sendSuccess(res, { reply: responseText });
  } catch (error) {
    console.error('Pawbot error:', error);
    sendError(res, 'Failed to communicate with PawBot', 500);
  }
};
