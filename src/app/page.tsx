"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Users, MessageSquare, Settings, Command, Brain, Loader2, Play, Eye, EyeOff, Sparkles, Send, Radio } from "lucide-react";

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
  { id: 14, name: "QA Tester", role: "Test apps", category: "Dev" },
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

interface Msg { role: string; content: string; }

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgents, setActiveAgents] = useState<number[]>([]);
  const [processingAgent, setProcessingAgent] = useState<number | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(function() {
    var savedKey = localStorage.getItem("dg_api_key");
    if (savedKey) { setApiKey(savedKey); setKeySaved(true); }
    fetch("/api/godfather").then(function(r: any) { return r.json(); }).then(function() { setBackendOnline(true); }).catch(function() {});
  }, []);

  function handleSaveApiKey() {
    if (apiKey.trim()) { localStorage.setItem("dg_api_key", apiKey.trim()); setKeySaved(true); }
  }

  async function launchAgent(agentId: number) {
    if (!apiKey) return;
    setProcessingAgent(agentId);
    var newActive = activeAgents.slice();
    newActive.push(agentId);
    setActiveAgents(newActive);
    var newMsgs: Msg[] = messages.slice();
    newMsgs.push({role: "system", content: "Launching Agent " + agentId + "..."});
    setMessages(newMsgs);

    try {
      var resp = await fetch("/api/godfather", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({agentId: agentId, task: "Execute your specialized task", userApiKey: apiKey})
      });
      var data = await resp.json();
      if (data.success) {
        var copyMsgs = messages.slice();
        copyMsgs.push({role: "assistant", content: "[Agent " + agentId + "] " + data.response});
        setMessages(copyMsgs);
      } else {
        var errMsgs = messages.slice();
        errMsgs.push({role: "assistant", content: "Error: " + data.error});
        setMessages(errMsgs);
      }
    } catch (e: any) {
      var failMsgs = messages.slice();
      failMsgs.push({role: "assistant", content: "Agent " + agentId + " launched (fallback mode)"});
      setMessages(failMsgs);
    } finally {
      setProcessingAgent(null);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !apiKey) return;
    var userMsg = input;
    setInput("");
    setIsLoading(true);
    var userMsgs = messages.slice();
    userMsgs.push({role: "user", content: userMsg});
    setMessages(userMsgs);

    try {
      var resp = await fetch("/api/godfather", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({agentId: 1, task: userMsg, userApiKey: apiKey})
      });
      var data = await resp.json();
      if (data.success) {
        var respMsgs = messages.slice();
        respMsgs.push({role: "assistant", content: data.response});
        setMessages(respMsgs);
      }
    } catch (e) {
      var errMsgs = messages.slice();
      errMsgs.push({role: "assistant", content: "Error sending message"});
      setMessages(errMsgs);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <header className="glass-card mb-4 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Command className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold gold-gradient">Digital Godfather</h1>
            <p className="text-xs text-gray-400">{keySaved ? (backendOnline ? "Engine Online" : "Ready") : "No API Key"}</p>
          </div>
        </div>
      </header>

      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <motion.div className="glass-card p-4 text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{AGENTS_REGISTRY.length}</p>
              <p className="text-xs text-gray-400">Agents</p>
            </motion.div>
            <motion.div className="glass-card p-4 text-center">
              <Radio className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{activeAgents.length}</p>
              <p className="text-xs text-gray-400">Active</p>
            </motion.div>
            <motion.div className="glass-card p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{backendOnline ? "ON" : "OFF"}</p>
              <p className="text-xs text-gray-400">Engine</p>
            </motion.div>
          </div>
          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={function() { setActiveTab("agents"); }} className="glass-card-hover p-3 flex items-center gap-2 text-left">
                <Brain className="w-5 h-5 gold-accent" /><span className="text-sm">Launch Agent</span>
              </button>
              <button onClick={function() { setActiveTab("chat"); }} className="glass-card-hover p-3 flex items-center gap-2 text-left">
                <MessageSquare className="w-5 h-5 gold-accent" /><span className="text-sm">Start Chat</span>
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === "agents" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Agent Registry ({AGENTS_REGISTRY.length})</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {AGENTS_REGISTRY.map(function(agent: any) {
              return (
                <div key={agent.id} className="glass-card-hover p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-400">{agent.role}</p>
                  </div>
                  <button onClick={function() { launchAgent(agent.id); }} disabled={processingAgent === agent.id || !apiKey} className="btn-primary text-sm flex items-center gap-2">
                    {processingAgent === agent.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}Launch
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Chat</h3>
          <div className="space-y-2 mb-4 max-h-[50vh] overflow-y-auto">
            {messages.map(function(msg: any, i: number) {
              return <div key={i} className={"p-2 rounded-xl " + (msg.role === "user" ? "bg-white/10 text-right" : "bg-white/5")}><p className="text-sm">{msg.content}</p></div>;
            })}
            {isLoading && <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Processing...</span></div>}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={function(e: any) { setInput(e.target.value); }} placeholder={apiKey ? "Message..." : "Set API key first"} className="flex-1 text-sm" disabled={!apiKey} />
            <button onClick={sendMessage} disabled={!input.trim() || isLoading || !apiKey} className="btn-primary"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gemini API Key</label>
              <div className="flex gap-2">
                <input type={showApiKey ? "text" : "password"} value={apiKey} onChange={function(e: any) { setApiKey(e.target.value); setKeySaved(false); }} placeholder="Enter API key..." className="flex-1 text-sm" />
                <button onClick={function() { setShowApiKey(!showApiKey); }} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <a href="https://aistudio.google.com/apikey" target="_blank" className="text-xs text-blue-400 mt-2 block">Get free API key</a>
              <button onClick={handleSaveApiKey} disabled={!apiKey.trim()} className="btn-primary w-full mt-3">{keySaved ? "Saved" : "Save Key"}</button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t-0 rounded-t-3xl p-2 flex justify-around lg:hidden">
        <button onClick={function() { setActiveTab("dashboard"); }} className={"p-3 " + (activeTab === "dashboard" ? "gold-accent" : "text-gray-400")}><Home className="w-6 h-6" /></button>
        <button onClick={function() { setActiveTab("agents"); }} className={"p-3 " + (activeTab === "agents" ? "gold-accent" : "text-gray-400")}><Users className="w-6 h-6" /></button>
        <button onClick={function() { setActiveTab("chat"); }} className={"p-3 " + (activeTab === "chat" ? "gold-accent" : "text-gray-400")}><MessageSquare className="w-6 h-6" /></button>
        <button onClick={function() { setActiveTab("settings"); }} className={"p-3 " + (activeTab === "settings" ? "gold-accent" : "text-gray-400")}><Settings className="w-6 h-6" /></button>
      </nav>
    </div>
  );
}
