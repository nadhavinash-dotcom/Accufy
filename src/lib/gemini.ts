import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseBusinessCard(base64Image: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "Extract contact details from this business card or picture. Return exactly as JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            account: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            website: { type: Type.STRING }
          },
          required: ["name", "account"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.warn("Gemini parse business card failed:", error);
    throw error;
  }
}

export async function enrichCompanyData(companyName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find information about the company "${companyName}". Use your knowledge about typical tech/B2B companies context. Return a JSON object exactly matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            industry: { type: Type.STRING },
            headquarters: { type: Type.STRING },
            leadScore: { type: Type.INTEGER },
            aiNextAction: { type: Type.STRING }
          },
          required: ["industry", "headquarters", "leadScore", "aiNextAction"],
        },
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.warn("Gemini enriched data failed:", error);
    // fallback
    return {
      industry: "Technology",
      headquarters: "Global",
      leadScore: Math.floor(Math.random() * 50) + 40,
      aiNextAction: "Conduct initial research call"
    };
  }
}
