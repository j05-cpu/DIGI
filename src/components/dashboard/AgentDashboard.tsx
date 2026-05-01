"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Bot, 
  Loader2, 
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AgentDashboard() {
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Welcome to Digital Godfather OS. How may I serve you?", timestamp: new Date() },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("dg_api_key");
    if (savedKey) { setApiKey(savedKey); setKeySaved(true); }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("dg_api_key", apiKey.trim());
      setKeySaved(true);
      setIsSettingsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !apiKey) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Use REST API directly
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are Digital Godfather OS. Respond professionally. User: ${input}` }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      
      const assistantMsg: Message = { id: (Date.now()+1).toString(), role: "assistant", content: text, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      const errMsg = error?.message || "Error";
      setMessages(prev => [...prev, { 
        id: (Date.now()+1).toString(), 
        role: "assistant", 
        content: errMsg.includes("Failed to fetch") ? "🌐 Network error. Check your connection." : "⚠️ " + errMsg.slice(0, 60),
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Bot className="w-5 h-5 gold-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Digital Godfather</h3>
          <p className="text-xs text-gray-400">{apiKey ? "🟢 Ready" : "🔴 No API Key"}</p>
        </div>
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {isSettingsOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 bg-white/5 rounded-xl">
          <label className="block text-sm font-medium mb-2">Google AI API Key</label>
          <div className="flex gap-2">
            <input type={showApiKey ? "text" : "password"} value={apiKey} onChange={(e) => { setApiKey(e.target.value); setKeySaved(false); }} placeholder="Enter API key..." className="flex-1 text-sm" />
            <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <a href="https://aistudio.google.com/apikey" target="_blank" className="text-xs text-blue-400 mt-2 block">Get free API key</a>
          <button onClick={handleSaveApiKey} disabled={!apiKey.trim()} className="btn-primary w-full mt-3 text-sm">
            {keySaved ? "✓ Saved" : "Save Key"}
          </button>
        </motion.div>
      )}

      <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === "user" ? "bg-white/10" : "bg-white/5"}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin gold-accent" /><span className="text-sm text-gray-400">Processing...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={apiKey ? "Enter command..." : "Set API key first..."} className="flex-1 text-sm" disabled={isLoading || !apiKey} />
        <button type="submit" disabled={!input.trim() || isLoading || !apiKey} className="btn-primary w-12 h-12 p-0 flex items-center justify-center">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
