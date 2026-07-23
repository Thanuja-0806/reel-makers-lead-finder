import React from 'react';
import { X, Key, ShieldCheck, Cpu } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, apiKeys, setApiKeys }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Search Provider Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          The Reel Makers Lead Finder includes built-in web discovery scraper engine. You can optionally supply your own search API keys below for enhanced coverage.
        </p>

        {/* Input Fields */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              SerpAPI Key (Google Search API)
            </label>
            <input
              type="password"
              value={apiKeys.serpapi || ''}
              onChange={(e) => setApiKeys({ ...apiKeys, serpapi: e.target.value })}
              placeholder="e.g. 5f8a92b... (Optional)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Google Custom Search API Key
            </label>
            <input
              type="password"
              value={apiKeys.googleApiKey || ''}
              onChange={(e) => setApiKeys({ ...apiKeys, googleApiKey: e.target.value })}
              placeholder="AIzaSy... (Optional)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple transition"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
}
