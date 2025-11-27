import { GoogleGenAI, Type } from "@google/genai";
import { RiskAnalysis } from '../types.ts';

export const analyzeInvoiceRisk = async (
  buyerName: string,
  amount: number,
  currency: string,
  dueDate: string,
  description: string
): Promise<RiskAnalysis> => {
  try {
    // Initialize inside function to avoid startup crash if env is missing
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a professional financial risk analyst for an invoice factoring protocol.
      Analyze the following invoice data to generate a risk assessment.
      
      Invoice Details:
      - Buyer: ${buyerName}
      - Amount: ${amount} ${currency}
      - Due Date: ${dueDate}
      - Description: ${description}
      
      Provide a risk score (0-100, where 100 is safest), a letter grade (A+, A, B, C, D, F), a short justification (max 1 sentence), and a recommended APR for lending.
      Be realistic but slightly conservative. 
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            grade: { type: Type.STRING },
            justification: { type: Type.STRING },
            recommendedApr: { type: Type.NUMBER },
          },
          required: ["score", "grade", "justification", "recommendedApr"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as RiskAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback mock data if API fails or key is missing
    return {
      score: 70,
      grade: 'B',
      justification: "AI analysis unavailable, using baseline conservative estimate.",
      recommendedApr: 10.5
    };
  }
};