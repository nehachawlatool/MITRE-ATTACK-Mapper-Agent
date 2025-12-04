import { GoogleGenAI, Schema, Type } from "@google/genai";

// Re-defining schema here to ensure server-side isolation
const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    input_source: { type: Type.STRING, description: "The original text snippet being analyzed." },
    summary: { type: Type.STRING, description: "A brief executive summary of the threat scenario." },
    primary_tactic: { type: Type.STRING, description: "The most significant tactic observed." },
    overall_risk_score: { type: Type.NUMBER, description: "A score from 0 to 100 indicating severity." },
    mappings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Technique ID (e.g., T1059)" },
          subTechniqueId: { type: Type.STRING, description: "Sub-technique ID suffix (e.g., 001) or null if none." },
          name: { type: Type.STRING, description: "Technique Name" },
          tactics: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of tactics this technique belongs to."
          },
          confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          reasoning: { type: Type.STRING, description: "Why this technique was selected." },
          detection_suggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Brief ideas on how to detect this."
          }
        },
        required: ["id", "name", "tactics", "confidence", "reasoning"]
      }
    }
  },
  required: ["summary", "mappings", "primary_tactic", "overall_risk_score"]
};

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    // 1. Authentication Check (Optional but Recommended for Agents)
    // If you set AMETHYST_API_KEY in Vercel, this will enforce security.
    const authHeader = req.headers.get('x-api-key');
    const secretKey = process.env.AMETHYST_API_KEY;

    if (secretKey && authHeader !== secretKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 2. Parse Input
    const body = await req.json();
    const { input, isBulk } = body;

    if (!input) {
      return new Response(JSON.stringify({ error: 'Input is required' }), { status: 400 });
    }

    if (!process.env.API_KEY) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: API_KEY missing' }), { status: 500 });
    }

    // 3. Call Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const MODEL_NAME = "gemini-3-pro-preview";

    let prompt = "";
    let schema: Schema = {};

    if (isBulk) {
      prompt = `
        You are an expert Cyber Threat Intelligence Analyst.
        Analyze this batch of scenarios and map to MITRE ATT&CK v15+.
        Input Batch:
        """
        ${input}
        """
      `;
      schema = {
        type: Type.OBJECT,
        properties: {
          results: {
            type: Type.ARRAY,
            items: ANALYSIS_SCHEMA
          }
        }
      };
    } else {
      prompt = `
        You are an expert Cyber Threat Intelligence Analyst.
        Strictly map the input to the MITRE ATT&CK Enterprise Matrix.
        Input to analyze:
        """
        ${input}
        """
      `;
      schema = ANALYSIS_SCHEMA;
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are a precise cybersecurity analyst. Always return valid JSON.",
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    
    // Normalize response structure
    const data = isBulk ? (parsed as any).results : [parsed];

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}