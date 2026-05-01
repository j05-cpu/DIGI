"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

function getApiKey(): string {
  return process.env.GOOGLE_AI_API_KEY || "";
}

export async function runAgentTask(prompt: string, userApiKey?: string): Promise<string> {
  const apiKey = userApiKey || getApiKey();
  
  console.log("[Digital Godfather] API Key present:", !!apiKey, "User provided:", !!userApiKey);
  
  if (!apiKey) {
    return "⚠️ No API key configured. Please click the settings icon and enter your Google AI API key.";
  }

  try {
    console.log("[Digital Godfather] Initializing Gemini with key...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("[Digital Godfather] Generating content...");
    const result = await model.generateContent([
      `You are Digital Godfather OS, an elite AI assistant designed for intelligent automation. 
      Respond as a sophisticated, professional assistant.
      User request: ${prompt}`
    ]);
    
    const response = result.response;
    const text = response.text();
    console.log("[Digital Godfather] Response received, length:", text.length);
    return text;
  } catch (error: any) {
    console.error("[Digital Godfather] Error:", error?.message || error);
    const msg = error?.message || "";
    if (msg.includes("API_KEY")) {
      return "❌ Invalid API key. Please check your Google AI API key and try again.";
    }
    if (msg.includes("quota") || msg.includes("limit")) {
      return "⏳ API quota exceeded. Please try again later or use a different API key.";
    }
    return "⚠️ I encountered an error: " + (msg.slice(0, 100));
  }
}
