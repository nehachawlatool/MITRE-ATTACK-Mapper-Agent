import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

// Use gemini-3-pro-preview for complex reasoning tasks like mapping TTPs
const MODEL_NAME = "gemini-3-pro-preview";

export const mapToMitre = async (input: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert Cyber Threat Intelligence Analyst and Detection Engineer.
    Your task is to analyze the provided cybersecurity scenario, detection rule, or log snippet.
    
    Strictly map the input to the MITRE ATT&CK Enterprise Matrix (latest version).
    
    For each identified behavior:
    1. Identify the specific Technique ID (e.g., T1059) and Name.
    2. If applicable, identify the Sub-technique ID (e.g., .001).
    3. Determine the Tactic(s).
    4. Assign a Confidence Level (High, Medium, Low) based on how explicit the evidence is.
    5. Provide a concise Reasoning explaining why this technique applies to the input.
    6. Suggest 1-2 generic detection ideas.
    
    Also, assess the overall risk score (0-100) and identify the primary tactic phase.
    
    Input to analyze:
    """
    ${input}
    """
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: "You are a precise cybersecurity analyst. You always return valid JSON conforming to the requested schema. You are knowledgeable about MITRE ATT&CK v15+.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
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
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini.");
  }

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Failed to parse analysis results.");
  }
};
