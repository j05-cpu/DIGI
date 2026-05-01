"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Allow users to provide their own API key
let userApiKey: string | null = null;

export function setUserApiKey(apiKey: string) {
  userApiKey = apiKey;
}

function getApiKey(): string {
  return userApiKey || process.env.GOOGLE_AI_API_KEY || "";
}

export async function runAgentTask(prompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || getApiKey();
  
  if (!key) {
    return "⚠️ No API key configured. Please enter your Google AI API key in settings to enable the Digital Godfather agent.";
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      `You are Digital Godfather OS, an elite AI assistant designed for intelligent automation and command execution. 
      Respond as a sophisticated, professional assistant.
      User request: ${prompt}`
    ]);
    
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Digital Godfather Agent Error:", error);
    return "I encountered an issue processing your request. Please check your API key and try again.";
  }
}
