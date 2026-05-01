import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (optional - won\'t fail if no credentials)
let supabase: any = null;
try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.log("[DG] Supabase not configured");
}

// Agent prompts for CrewAI-style orchestration
const AGENT_PROMPTS: Record<number, string> = {
  1: "You are a Data Analyst Pro. Analyze the given data and provide insights.",
  2: "You are a Content Writer. Create high-quality content based on the topic.",
  3: "You are a Code Reviewer. Review code and provide feedback.",
  4: "You are a Research Assistant. Research thoroughly and summarize.",
  5: "You are Customer Support. Be helpful and professional.",
  6: "You are an SEO Optimizer. Optimize content for search engines.",
  7: "You are a Project Manager. Manage tasks efficiently.",
  8: "You are a Financial Analyst. Analyze financial data.",
  9: "You are a Legal Advisor. Provide legal guidance.",
  10: "You are an HR Recruiter. Help with recruitment tasks.",
  11: "You are a Social Media Manager. Manage social presence.",
  12: "You are an Email Writer. Write professional emails.",
  13: "You are a Translator. Translate accurately.",
  14: "You are a QA Tester. Test applications thoroughly.",
  15: "You are a Doc Writer. Write clear documentation.",
  16: "You are a Sales Closer. Help close deals.",
  17: "You are a Brand Strategist. Provide brand guidance.",
  18: "You are a UX Designer. Design user experiences.",
  19: "You are a Security Auditor. Find security issues.",
  20: "You are a Database Admin. Manage databases.",
  21: "You are a Copywriter. Write compelling copy.",
  22: "You are a Video Editor. Edit videos professionally.",
  23: "You are an Image Generator. Generate images.",
  24: "You are Meeting Notes. Take detailed notes.",
  25: "You are Calendar AI. Help with scheduling.",
  26: "You are a Task Organizer. Organize tasks.",
  27: "You are doing Competitor Research. Research competitors.",
  28: "You are an Ad Copywriter. Write ad copy.",
  29: "You are a Blog Strategist. Plan blog strategy.",
  30: "You are an API Integrator. Integrate APIs.",
};

// Log to Supabase
async function logAgentLaunch(agentId: number, task: string, status: string, result?: string) {
  if (!supabase) return;
  try {
    await supabase.from("agent_logs").insert({
      agent_id: agentId,
      task: task,
      status: status,
      result: result,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.log("[DG] Log error:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured on server" },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { agentId, task, userApiKey } = body;

    // Use user provided key if available, otherwise server key
    const key = userApiKey || apiKey;

    if (!agentId || !task) {
      return NextResponse.json(
        { error: "Missing agentId or task" },
        { status: 400 }
      );
    }

    // Get agent prompt
    const agentPrompt = AGENT_PROMPTS[agentId] || "You are Digital Godfather Agent.";
    
    // Log launch start
    await logAgentLaunch(agentId, task, "processing");

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // CrewAI-style multi-agent prompt
    const fullPrompt = `${agentPrompt}

Task: ${task}

Respond professionally and complete the task.`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    // Log success
    await logAgentLaunch(agentId, task, "completed", response.substring(0, 500));

    return NextResponse.json({
      success: true,
      agentId: agentId,
      response: response,
      status: "completed",
    });

  } catch (error: any) {
    console.error("[DG] Error:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error",
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Digital Godfather Engine",
    version: "1.0.0",
    agents: 30,
    status: "online",
  });
}
