"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Brain, 
  MessageSquare, 
  Zap, 
  Settings, 
  X,
  Command,
  Shield,
  Activity
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "agents", icon: Brain, label: "Agents" },
  { id: "tasks", icon: Zap, label: "Tasks" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "activity", icon: Activity, label: "Activity" },
];

export default function Sidebar({ isOpen, onClose, activeTab, onNavigate }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 glass-card border-l-0 rounded-l-3xl z-50 lg:hidden"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold gold-gradient">Digital Godfather</h2>
                    <p className="text-xs text-gray-400">Elite Command</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Logo Placeholder */}
              <div className="glass-card p-6 mb-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                  <Command className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-sm text-gray-400">Logo Placeholder</p>
                <p className="text-xs text-gray-500">Drop your logo here</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-4 p-4 mb-2 rounded-xl transition-all ${
                      activeTab === item.id
                        ? "bg-white/10 gold-accent"
                        : "bg-transparent text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Settings */}
              <button 
                onClick={() => {
                  onNavigate("settings");
                  onClose();
                }}
                className="flex items-center gap-4 p-4 rounded-xl text-gray-400 hover:bg-white/5 transition-all"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
