import React from 'react';
import { Loader2, Sparkles, Film, Search, Globe, ShieldCheck, Filter } from 'lucide-react';

export default function AgentLoader({ currentStage, city }) {
  const getStageLabel = (stage) => {
    switch (stage) {
      case 'QUERIES':
        return 'Formulating intelligent search queries...';
      case 'SEARCHING':
        return 'Searching the web and discovering creators & agencies...';
      case 'CRAWLING':
        return 'Crawling discovered websites & extracting contacts...';
      case 'DEDUPLICATING':
        return 'Deduplicating leads & verifying confidence scores...';
      case 'COMPLETE':
        return 'Finalizing results...';
      default:
        return 'AI Agent is starting lead generation process...';
    }
  };

  const getStagePercentage = (stage) => {
    switch (stage) {
      case 'QUERIES': return 15;
      case 'SEARCHING': return 40;
      case 'CRAWLING': return 75;
      case 'DEDUPLICATING': return 90;
      case 'COMPLETE': return 100;
      default: return 5;
    }
  };

  const pct = getStagePercentage(currentStage);

  return (
    <div className="w-full max-w-xl mx-auto my-12 glass-panel rounded-2xl p-8 border border-purple-500/30 shadow-glow-purple text-center relative overflow-hidden animate-pulse-slow">
      {/* Background glowing blur */}
      <div className="absolute -inset-10 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Spinner and Icons */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-purple-500/30 flex items-center justify-center animate-spin relative">
          <Loader2 className="w-10 h-10 text-purple-400 absolute" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 absolute flex items-center justify-center shadow-lg">
          <Film className="w-5 h-5 text-purple-300 animate-pulse" />
        </div>
      </div>

      {/* Heading */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI Agent is Processing</span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        Finding Reel Makers in <span className="text-purple-400">{city}</span>
      </h3>
      
      <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto min-h-[32px]">
        {getStageLabel(currentStage)}
      </p>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-3 overflow-hidden p-0.5 mb-2">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 h-full rounded-full transition-all duration-500 shadow-glow-pink"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>ESTIMATED PROGRESS</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
