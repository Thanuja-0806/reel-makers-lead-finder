import React from 'react';
import { X, Search, Sparkles, Code2 } from 'lucide-react';

export default function QueryPreviewModal({ isOpen, onClose, queries = [], city }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">
              Intelligent Search Queries ({city || 'City'})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          The AI engine automatically formulates these targeted queries to uncover video agencies, Instagram reel creators, videography studios, and freelance platforms in {city || 'the target city'}:
        </p>

        {/* Query List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {queries.map((q, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3 text-xs font-mono text-slate-200 hover:border-purple-500/40 transition"
            >
              <span className="text-purple-400 font-bold shrink-0">#{idx + 1}</span>
              <span className="truncate">{q}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
