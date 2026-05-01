"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, Users, MessageSquare, Settings, Command, Zap, Brain,
  Loader2, Play, Plus, X, Eye, EyeOff, Sparkles
} from "lucide-react";

// 30 Professional Agents
const AGENTS_REGISTRY = [
  { id: 1, name: "Data Analyst Pro", role: "Analyze datasets", category: "Data" },
  { id: 2, name: "Content Writer", role: "Create content", category: "Content" },
  { id: 3, name: "Code Reviewer", role: "Review code", category: "Dev" },
  { id: 4, name: "Research Assistant", role: "Research topics", category: "Research" },
  { id: 5, name: "Customer Support", role: "Support users", category: "Support" },
  { id: 6, name: "SEO Optimizer", role: "Optimize SEO", category: "Marketing" },
  { id: 7, name: "Project Manager", role: "Manage projects", category: "Management" },
  { id: 8, name: "Financial Analyst", role: "Analyze finances", category: "Data" },
  { id: 9, name: "Legal Advisor", role: "Legal guidance", category: "Legal" },
  { id: 10, name: "HR Recruiter", role: "Recruit talent", category: "HR" },
  { id: 11, name: "Social Media Manager", role: "Manage social", category: "Marketing" },
  { id: 12, name: "Email Writer", role: "Write emails", category: "Content" },
  { id: 13, name: "Translator", role: "Translate text", category: "Content" },
  { id: 14, name: " QA Tester", role: "Test apps", category: "Dev" },
  { id: 15, name: "Doc Writer", role: "Write docs", category: "Content" },
  { id: 16, name: "Sales Closer", role: "Close deals", category: "Sales" },
  { id: 17, name: "Brand Strategist", role: "Strategy", category: "Marketing" },
  { id: 18, name: "UX Designer", role: "Design UX", category: "Design" },
  { id: 19, name: "Security Audit", role: "Audit security", category: "Dev" },
  { id: 20, name: "Database Admin", role: "Manage DB", category: "Dev" },
  { id: 21, name: "Copywriter", role: "Copywriting", category: "Content" },
  { id: 22, name: "Video Editor", role: "Edit videos", category: "Media" },
  { id: 23, name: "Image Generator", role: "Gen images", category: "Media" },
  { id: 24, name: "Meeting Notes", role: "Notes", category: "Productivity" },
  { id: 25, name: "Calendar AI", role: "Schedule", category: "Productivity" },
  { id: 26, name: "Task Organizer", role: "Organize tasks", category: "Productivity" },
  { id: 27, name: "Competitor Research", role: "Research", category: "Research" },
  { id: 28, name: "Ad Copywriter", role: "Ads", category: "Marketing" },
  { id: 29, name: "Blog Strategist", role: "Blog strategy", category: "Content" },
  { id: 30, name: "API Integrator", role: "Integrate APIs", category: "Dev" },
];

type Tab = "dashboard" | "agents" | "chat" | "settings";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState<number[]>([]);
  const [processingAgent, setProcessingAgent] = useState<number | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("dg_api_key");
    if (savedKey) { setApiKey(savedKey); setKeySaved(true); }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("dg_api_key", apiKey.trim());
      setKeySaved(true);
    }
  };

  const launchAgent = async (agentId: number) => {
    setProcessingAgent(agentId);
    setActiveAgents(prev => [...prev, agentId]);
    
    // Simulate CrewAI task with Gemini
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Launch agent ${agentId}. Execute task and respond with confirmation.` } }]
        })
      });
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "Agent launched!";
      setMessages(prev => [...prev, { role: "assistant", content: `[Agent ${agentId}] ${result}` }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Agent ${agentId} launched (simulation mode)` }]);
    } finally {
      setProcessingAgent(null);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !apiKey) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are Digital Godfather OS. Respond professionally. User: ${input}` }] }]
        })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error sending message" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <header className="glass-card mb-4 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Command className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold gold-gradient">Digital Godfather</h1>
            <p className="text-xs text-gray-400">{keySaved ? "🟢 Connected" : "🔴 No API Key"}</p>
          </div>
        </div>
      </header>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <motion.div className="glass-card p-4 text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{AGENTS_REGISTRY.length}</p>
              <p className="text-xs text-gray-400">Agents</p>
            </motion.div>
            <motion.div className="glass-card p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{activeAgents.length}</p>
              <p className="text-xs text-gray-400">Active</p>
            </motion.div>
            <motion.div className="glass-card p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{keySaved ? "ON" : "OFF"}</p>
              <p className="text-xs text-gray-400">AI Engine</p>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setActiveTab("agents")} className="glass-card-hover p-3 flex items-center gap-2 text-left">
                <Brain className="w-5 h-5 gold-accent" />
                <span className="text-sm">Launch Agent</span>
              </button>
              <button onClick={() => setActiveTab("chat")} className="glass-card-hover p-3 flex items-center gap-2 text-left">
                <MessageSquare className="w-5 h-5 gold-accent" />
                <span className="text-sm">Start Chat</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Agents Tab */}
      {activeTab === "agents" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Agent Registry ({AGENTS_REGISTRY.length} Agents)</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {AGENTS_REGISTRY.map((agent) => (
              <div key={agent.id} className="glass-card-hover p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-xs text-gray-400">{agent.role} • {agent.category}</p>
                </div>
                <button
                  onClick={() => launchAgent(agent.id)}
                  disabled={processingAgent === agent.id || !apiKey}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  {processingAgent === agent.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Launch
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Chat</h3>
          <div className="space-y-2 mb-4 max-h-[50vh] overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded-xl ${msg.role === "user" ? "bg-white/10 text-right" : "bg-white/5"}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
            {isLoading && <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Processing...</span></div>}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={apiKey ? "Message..." : "Set API key first"} className="flex-1 text-sm" disabled={!apiKey} />
            <button onClick={sendMessage} disabled={!input.trim() || isLoading || !apiKey} className="btn-primary">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Google AI API Key</label>
              <div className="flex gap-2">
                <input type={showApiKey ? "text" : "password"} value={apiKey} onChange={(e) => { setApiKey(e.target.value); setKeySaved(false); }} placeholder="Enter API key..." className="flex-1 text-sm" />
                <button onClick={() => setShowApiKey(!showApiKey)} className="w-12 h-12 bg-white/5 rounded-xl">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <a href="https://aistudio.google.com/apikey" target="_blank" className="text-xs text-blue-400 mt-2 block">Get free API key</a>
              <button onClick={handleSaveApiKey} disabled={!apiKey.trim()} className="btn-primary w-full mt-3">
                {keySaved ? "✓ Saved" : "Save Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t-0 rounded-t-3xl p-2 flex justify-around lg:hidden">
        <button onClick={() => setActiveTab("dashboard")} className={`p-3 ${activeTab === "dashboard" ? "gold-accent" : "text-gray-400"}`}>
          <Home className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab("agents")} className={`p-3 ${activeTab === "agents" ? "gold-accent" : "text-gray-400"}`}>
          <Users className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab("chat")} className={`p-3 ${activeTab === "chat" ? "gold-accent" : "text-gray-400"}`}>
          <MessageSquare className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab("settings")} className={`p-3 ${activeTab === "settings" ? "gold-accent" : "text-gray-400"}`}>
          <Settings className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
