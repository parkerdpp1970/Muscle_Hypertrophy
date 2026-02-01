import { GoogleGenAI, Chat, Type, Schema } from "@google/genai";
import { Flashcard, QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are an elite Exercise Physiologist and Hypertrophy Specialist. 
Your goal is to help users understand the science of muscle growth. 
The user is viewing a presentation titled "Science of Muscle Hypertrophy".
Answer questions based on current scientific consensus regarding mechanisms of hypertrophy (mechanical tension, metabolic stress, muscle damage), volume, frequency, intensity, and recovery.
Keep answers concise, encouraging, and scientifically accurate. Use simple formatting like bullet points if needed.
IMPORTANT: You must use UK English spelling and terminology at all times (e.g., 'fibre' not 'fiber', 'programme' not 'program', 'centre' not 'center', 'signalling' not 'signaling').`;

// Initialize a chat session
let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getChatSession();
    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the knowledge base.";
  }
};

export const generateFlashcards = async (): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 10 flashcards covering fundamental concepts in muscle hypertrophy science (e.g., Mechanical Tension, Metabolic Stress, Progressive Overload, Volume, Intensity, RPE). Avoid deep molecular biology terms like ribosome biogenesis. Keep definitions concise (under 30 words). Ensure all text uses UK English spelling (e.g., fibre, programme).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              definition: { type: Type.STRING }
            }
          }
        }
      }
    });

    // Handle the response text which should be a JSON string
    if (response.text) {
      return JSON.parse(response.text) as Flashcard[];
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return [];
  }
};

export const generateQuizQuestion = async (): Promise<QuizQuestion | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a multiple-choice question suitable for an intermediate fitness professional. Focus on practical application of hypertrophy science, training systems, and basic physiology (e.g., Progressive Overload, Rep Ranges, Rest Periods). Avoid overly complex academic jargon or deep molecular biology. Provide 4 options. One must be correct, three must be plausible but incorrect. For EACH option, provide a specific feedback paragraph (approx 40-50 words) explaining exactly why it is correct or incorrect. IMPORTANT: Use UK English spelling throughout (e.g., 'fibre', 'programme', 'minimise').",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  feedback: { type: Type.STRING, description: "A 40-50 word explanation of why this option is right or wrong, using UK English." }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};

export const generateResearchPrompt = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a single, specific, scientifically-phrased search query about a nuanced or debated topic in muscle hypertrophy (e.g., failure training, volume vs intensity, periodisation models, metabolite accumulation). The query will be used in a scientific search engine. Output ONLY the query text. Use UK English spelling.",
    });
    return response.text?.trim() || "impact of training volume on hypertrophy adaptations";
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "mechanical tension vs metabolic stress hypertrophy";
  }
};