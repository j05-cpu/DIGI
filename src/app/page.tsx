"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, Users, MessageSquare, Settings, Command, Zap, Brain,
  Loader2, Play, Eye, EyeOff, Sparkles, Send, Radio
} from "lucide-react";

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

export default function HomePage() {
  var activeTab = "dashboard" as Tab;
  var apiKey = "";
  var showApiKey = false;
  var keySaved = false;
  var messages: {role: string, content: string}[] = [];
  var input = "";
  var isLoading = false;
  var activeAgents: number[] = [];
  var processingAgent: number | null = null;
  var backendOnline = false;

  const [state, setState] = useState({
    activeTab: "dashboard" as Tab,
    apiKey: "",
    showApiKey: false,
    keySaved: false,
    messages: [] as {role: string, content: string}[],
    input: "",
    isLoading: false,
    activeAgents: [] as number[],
    processingAgent: null as number | null,
    backendOnline: false,
  });

  useEffect(function() {
    var savedKey = localStorage.getItem("dg_api_key");
    if (savedKey) {
      setState(function(s) { return {...s, apiKey: savedKey, keySaved: true}; });
    }
    // Check backend health
    fetch("/api/godfather").then(function(r) { 
      return r.json(); 
    }).then(function(d) {
      setState(function(s) { return {...s, backendOnline: true}; });
    }).catch(function() {});
  }, []);

  function setActiveTab(tab: Tab) {
    setState(function(s) { return {...s, activeTab: tab}; });
  }
  
  function setApiKey(val: string) {
    setState(function(s) { return {...s, apiKey: val, keySaved: false}; });
  }
  
  function setShowApiKey(val: boolean) {
    setState(function(s) { return {...s, showApiKey: val}; });
  }
  
  function setInput(val: string) {
    setState(function(s) { return {...s, input: val}; });
  }
  
  function setMessages(val: {role: string, content: string}[]) {
    setState(function(s) { return {...s, messages: val}; });
  }
  
  function handleSaveApiKey() {
    if (state.apiKey.trim()) {
      localStorage.setItem("dg_api_key", state.apiKey.trim());
      setState(function(s) { return {...s, keySaved: true}; });
    }
  }

  async function launchAgent(agentId: number) {
    if (!state.apiKey) return;
    setState(function(s) { return {...s, processingAgent: agentId, activeAgents: [...s.activeAgents, agentId]}; });
    setState(function(s) { 
      return {...s, messages: [...s.messages, {role: "system", content: "Launching Agent " + agentId + "..."}}; 
    });

    try {
      var response = await fetch("/api/godfather", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          agentId: agentId,
          task: "Execute your specialized task",
          userApiKey: state.apiKey
        })
      });
      var data = await response.json();
      
      if (data.success) {
        setState(function(s) { 
          return {...s, messages: [...s.messages, {role: "assistant", content: "[Agent " + agentId + "] " + data.response} }; 
        });
      } else {
        setState(function(s) { 
          return {...s, messages: [...s.messages, {role: "assistant", content: "Error: " + data.error} }; 
        });
      }
    } catch (e: any) {
      setState(function(s) { 
        return {...s, messages: [...s.messages, {role: "assistant", content: "Agent " + agentId + " launched (fallback mode)"}] }; 
      });
    } finally {
      setState(function(s) { return {...s, processingAgent: null}; });
    }
  }

  async function sendMessage() {
    if (!state.input.trim() || !state.apiKey) return;
    var userMsg = state.input;
    setState(function(s) { return {...s, input: "", messages: [...s.messages, {role: "user", content: userMsg}]}; });
    setState(function(s) { return {...s, isLoading: true}; });

    try {
      var response = await fetch("/api/godfather", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          agentId: 1,
          task: userMsg,
          userApiKey: state.apiKey
        })
      });
      var data = await response.json();
      
      if (data.success) {
        setState(function(s) { 
          return {...s, messages: [...s.messages, {role: "assistant", content: data.response}]}; 
        });
      }
    } catch (e) {
      setState(function(s) { 
        return {...s, messages: [...s.messages, {role: "assistant", content: "Error sending message"}]}; 
      });
    } finally {
      setState(function(s) { return {...s, isLoading: false}; });
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
            <p className="text-xs text-gray-400">
              {state.keySaved ? (state.backendOnline ? "Engine Online" : "Ready") : "No API Key"}
            </p>
          </div>
        </div>
      </header>

      {state.activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <motion.div className="glass-card p-4 text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{AGENTS_REGISTRY.length}</p>
              <p className="text-xs text-gray-400">Agents</p>
            </motion.div>
            <motion.div className="glass-card p-4 text-center">
              <Radio className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{state.activeAgents.length}</p>
              <p className="text-xs text-gray-400">Active</p>
            </motion.div>
            <motion.div className="glass-card p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 gold-accent" />
              <p className="text-2xl font-bold">{state.backendOnline ? "ON" : "OFF"}</p>
              <p className="text-xs text-gray-400">Engine</p>
            </motion.div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={function() { setActiveTab("agents"); }} className="glass-card-hover p-3 flex items-center gap-2 text-left">
                <Brain className="w-5 h-5 gold-accent" />
                <span className="text-sm">Launch Agent</span>
              </button>
              <button onClick={function() { setActiveTab("chat"); }} className="glass-card-hover p-3 flex items-center gap-2 text-left">
                <MessageSquare className="w-5 h-5 gold-accent" />
                <span className="text-sm">Start Chat</span>
              </button>
            </div>
          </div>
        </>
      )}

      {state.activeTab === "agents" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Agent Registry ({AGENTS_REGISTRY.length})</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {AGENTS_REGISTRY.map(function(agent) {
              return (
                <div key={agent.id} className="glass-card-hover p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-400">{agent.role}</p>
                  </div>
                  <button
                    onClick={function() { launchAgent(agent.id); }}
                    disabled={state.processingAgent === agent.id || !state.apiKey}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    {state.processingAgent === agent.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Launch
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {state.activeTab === "chat" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Chat</h3>
          <div className="space-y-2 mb-4 max-h-[50vh] overflow-y-auto">
            {state.messages.map(function(msg: any, i: number) {
              return (
                <div key={i} className={"p-2 rounded-xl " + (msg.role === "user" ? "bg-white/10 text-right" : "bg-white/5")}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              );
            })}
            {state.isLoading && <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Processing...</span></div>}
          </div>
          <div className="flex gap-2">
            <input value={state.input} onChange={function(e) { setInput(e.target.value); }} placeholder={state.apiKey ? "Message..." : "Set API key first"} className="flex-1 text-sm" disabled={!state.apiKey} />
            <button onClick={sendMessage} disabled={!state.input.trim() || state.isLoading || !state.apiKey} className="btn-primary">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {state.activeTab === "settings" && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gemini API Key</label>
              <div className="flex gap-2">
                <input type={state.showApiKey ? "text" : "password"} value={state.apiKey} onChange={function(e) { setApiKey(e.target.value); }} placeholder="Enter API key..." className="flex-1 text-sm" />
                <button onClick={function() { setShowApiKey(!state.showApiKey); }} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  {state.showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <a href="https://aistudio.google.com/apikey" target="_blank" className="text-xs text-blue-400 mt-2 block">Get free API key</a>
              <button onClick={handleSaveApiKey} disabled={!state.apiKey.trim()} className="btn-primary w-full mt-3">
                {state.keySaved ? "Saved" : "Save Key"}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t-0 rounded-t-3xl p-2 flex justify-around lg:hidden">
        <button onClick={function() { setActiveTab("dashboard"); }} className={"p-3 " + (state.activeTab === "dashboard" ? "gold-accent" : "text-gray-400")}>
          <Home className="w-6 h-6" />
        </button>
        <button onClick={function() { setActiveTab("agents"); }} className={"p-3 " + (state.activeTab === "agents" ? "gold-accent" : "text-gray-400")}>
          <Users className="w-6 h-6" />
        </button>
        <button onClick={function() { setActiveTab("chat"); }} className={"p-3 " + (state.activeTab === "chat" ? "gold-accent" : "text-gray-400")}>
          <MessageSquare className="w-6 h-6" />
        </button>
        <button onClick={function() { setActiveTab("settings"); }} className={"p-3 " + (state.activeTab === "settings" ? "gold-accent" : "text-gray-400")}>
          <Settings className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
