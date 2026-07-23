import React from 'react';
import { Film, Sparkles, Settings, Activity, FileSpreadsheet } from 'lucide-react';

export default function Header({ onOpenSettings, onOpenQueries, currentCity, leadsCount }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-glow-purple flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-purple-400 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-300">
                Reel Makers <span className="text-indigo-400">Lead Finder</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>AI Agent</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Discover short-form video creators, agencies & videographers in any city
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenQueries}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Search Queries</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>API Settings</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Engine Status */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px]">System Ready</span>
          </div>
        </div>

      </div>
    </header>
  );
}
