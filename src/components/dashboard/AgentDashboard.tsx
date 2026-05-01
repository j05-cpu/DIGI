"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Bot, 
  Loader2, 
  Settings,
  Key,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Server action call
async function callAgent(prompt: string, apiKey: string) {
  const { runAgentTask } = await import("@/lib/agents/actions");
  return runAgentTask(prompt, apiKey);
}

export default function AgentDashboard() {
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Digital Godfather OS. I am your elite AI assistant powered by advanced intelligence. How may I serve you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("dg_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setKeySaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("dg_api_key", apiKey.trim());
      setKeySaved(true);
      setIsSettingsOpen(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("dg_api_key");
    setApiKey("");
    setKeySaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStatus("processing");

    try {
      const result = await callAgent(input, apiKey);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I encountered an issue processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="glass-card p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Bot className="w-5 h-5 gold-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Digital Godfather Agent</h3>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              status === "processing" ? "bg-yellow-400 animate-pulse" :
              status === "success" ? "bg-green-400" :
              status === "error" ? "bg-red-400" :
              apiKey ? "bg-green-400" :
              "bg-red-400"
            }`} />
            <p className="text-xs text-gray-400">
              {status === "processing" ? "Processing..." :
               status === "success" ? "Ready" :
               status === "error" ? "Error" :
               apiKey ? "API Key Ready" :
               "No API Key"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* API Key Settings */}
      {isSettingsOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 p-4 bg-white/5 rounded-xl"
        >
          <label className="block text-sm font-medium mb-2">
            <Key className="w-4 h-4 inline mr-2" />
            Google AI API Key
          </label>
          <div className="flex gap-2">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setKeySaved(false);
              }}
              placeholder="Enter your Google AI API key..."
              className="flex-1 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Get your free API key from aistudio.google.com/apikey
          </p>
          <div className="flex gap-2 mt-3">
            <button 
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Save Key
            </button>
            {keySaved && (
              <button 
                onClick={handleClearApiKey}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              msg.role === "user"
                ? "bg-white/10 text-white"
                : "bg-white/5 text-gray-200"
            }`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin gold-accent" />
              <span className="text-sm text-gray-400">Processing task...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your command..."
          className="flex-1 text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="btn-primary w-12 h-12 p-0 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
