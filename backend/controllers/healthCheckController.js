import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyzeHealthImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: 'Gemini API Key is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Assuming imageBase64 includes the data URI scheme like 'data:image/jpeg;base64,...'
    // Extract mime type and base64 string
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
        return res.status(400).json({ success: false, message: 'Invalid image format.' });
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const prompt = "You are a veterinary AI assistant. Analyze this image of a pet and identify any visible health issues or concerns, and list possible causes. Provide a structured, helpful response. Remind the user prominently that you are an AI, not a replacement for a real veterinarian, and they should consult a professional for medical advice.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    const responseText = result.response.text();
    
    res.json({ success: true, analysis: responseText });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze image' });
  }
};
