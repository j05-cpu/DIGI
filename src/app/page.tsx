"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Settings, 
  ChevronRight,
  Sparkles,
  Command
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import AgentDashboard from "@/components/dashboard/AgentDashboard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="glass-card mb-6 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
              <Command className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold gold-gradient">Digital Godfather</h1>
              <p className="text-xs text-gray-400">Command Center</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 text-center"
          >
            <Brain className="w-6 h-6 mx-auto mb-2 gold-accent" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-gray-400">Agents</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 text-center"
          >
            <MessageSquare className="w-6 h-6 mx-auto mb-2 gold-accent" />
            <p className="text-2xl font-bold">48</p>
            <p className="text-xs text-gray-400">Tasks</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center"
          >
            <Zap className="w-6 h-6 mx-auto mb-2 gold-accent" />
            <p className="text-2xl font-bold">99%</p>
            <p className="text-xs text-gray-400">Uptime</p>
          </motion.div>
        </div>

        {/* Agent Dashboard */}
        <AgentDashboard />
      </main>
    </div>
  );
}
