"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function runAgentTask(prompt: string): Promise<string> {
  try {
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
    return "I apologize, but I encountered an issue processing your request. Please ensure your API key is configured correctly.";
  }
}
