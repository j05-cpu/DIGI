"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function runAgentTask(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    return "⚠️ No API key. Click settings and enter your Google AI API key.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      `You are Digital Godfather OS - elite AI assistant. Be professional and concise. 
      
User request: ${prompt}`
    ]);

    return result.response.text();
  } catch (error: any) {
    console.error("[DG] Error:", error);
    const msg = error?.message || String(error);
    
    if (msg.includes("Failed to fetch")) {
      return "🌐 Network blocked. CORS issue detected. Using fallback mode...";
    }
    if (msg.includes("API_KEY") || msg.includes("invalid")) {
      return "❌ Invalid API key.";
    }
    if (msg.includes("quota")) {
      return "⏳ API quota exceeded.";
    }
    return "⚠️ " + msg.slice(0, 60);
  }
}
