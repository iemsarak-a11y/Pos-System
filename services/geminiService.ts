
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Product description generation will be disabled.");
}

export const generateProductDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please add your Gemini API key.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `Generate a short, appealing product description for a cafe product named "${productName}". The description should be suitable for a point-of-sale system menu. Keep it under 150 characters. Be creative and enticing.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description. Please try again.";
  }
};
