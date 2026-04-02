import { GoogleGenAI, Type } from "@google/genai";

const adviceSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: { type: Type.STRING },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
    priority_level: { type: Type.STRING },
    suggested_action: { type: Type.STRING },
  },
  required: ["analysis", "tips", "priority_level", "suggested_action"],
};

/**
 * Fetches sales outreach advice using Gemini 3 Flash.
 * Creates a new instance on each call to ensure the latest API key is used.
 */
export const getSalesAdvice = async (leadName: string, value: number) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || "placeholder" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a brief 3-step outreach strategy for a new lead: ${leadName} with a potential contract value of $${value}. Keep it professional and concise.`,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: adviceSchema,
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      analysis: "AI Assistant is currently offline.",
      tips: ["Please try again later"],
      priority_level: "UNKNOWN",
      suggested_action: "Wait and retry",
    };
  }
};

/**
 * Fetches operations optimization tips using Gemini 3 Flash.
 * Creates a new instance on each call to ensure the latest API key is used.
 */
export const getOperationsOptimization = async (company: string, stage: string) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || "placeholder" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 2 quick tips to move ${company} from the ${stage} stage to the next stage faster in an execution workflow.`,
      config: {
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema: adviceSchema,
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      analysis: "AI Assistant is currently offline.",
      tips: ["Please try again later"],
      priority_level: "UNKNOWN",
      suggested_action: "Wait and retry",
    };
  }
};
