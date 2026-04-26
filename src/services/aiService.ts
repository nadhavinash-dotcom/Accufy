import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAICopilotResponse(prompt: string, context: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Accufy AI, an intelligent CRM assistant built into the Accufy CRM platform.
      
Context about the CRM data:
${context}

User Request:
${prompt}

Provide a helpful, concise, and professional response. If the user asks for a summary, summarize the data. If they ask to draft an email, draft it based on the context.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || 'I could not generate a response.';
  } catch (error) {
    console.error('AI generation error:', error);
    return 'Sorry, I encountered an error while processing your request.';
  }
}

export async function extractLeadInfo(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract lead information from the following text and return it as a JSON object with the following keys: name, email, company, role, status (New, Contacted, Qualified, Lost), value (number). If a value is missing, use null.
      
Text: ${text}`,
      config: {
        responseMimeType: 'application/json',
      },
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('AI extraction error:', error);
    return null;
  }
}
