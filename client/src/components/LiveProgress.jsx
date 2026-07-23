import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, Loader2, Search, Globe, ShieldCheck, Filter } from 'lucide-react';

export default function LiveProgress({ logs, currentStage, targetCity, isComplete }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const stages = [
    { id: 'QUERIES', label: 'Generate Queries', icon: Search },
    { id: 'SEARCHING', label: 'Web Discovery', icon: Globe },
    { id: 'CRAWLING', label: 'Site Crawling', icon: Loader2 },
    { id: 'DEDUPLICATING', label: 'Deduplicating', icon: Filter },
    { id: 'COMPLETE', label: 'Ready', icon: CheckCircle2 }
  ];

  const getStageIndex = (stage) => {
    switch (stage) {
      case 'QUERIES': return 0;
      case 'SEARCHING': return 1;
      case 'CRAWLING': return 2;
      case 'DEDUPLICATING': return 3;
      case 'COMPLETE': return 4;
      default: return 0;
    }
  };

  const activeIndex = isComplete ? 4 : getStageIndex(currentStage);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 glass-panel rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            AI Crawling Engine • {targetCity || 'Searching'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!isComplete && (
            <div className="flex items-center space-x-1.5 text-xs text-amber-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Live Agent Active</span>
            </div>
          )}
          {isComplete && (
            <div className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Extraction Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="px-6 py-4 bg-slate-950/40 border-b border-white/5 grid grid-cols-5 gap-2">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isDone = idx < activeIndex || isComplete;
          const isCurrent = idx === activeIndex && !isComplete;

          return (
            <div key={st.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition duration-300 ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isCurrent
                    ? 'bg-purple-600 text-white shadow-glow-purple border border-purple-400 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[11px] mt-1.5 font-medium text-center ${
                isDone ? 'text-emerald-400' : isCurrent ? 'text-purple-300 font-semibold' : 'text-slate-500'
              }`}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Console Output Log */}
      <div className="p-4 bg-[#05070c] font-mono text-xs max-h-48 overflow-y-auto space-y-1.5 select-text">
        {logs.length === 0 && (
          <div className="text-slate-500 italic py-2">Initialising AI scraper stream...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="flex items-start space-x-2 text-slate-300">
            <span className="text-slate-600 shrink-0">[{log.time || new Date().toLocaleTimeString()}]</span>
            <span className={
              log.type === 'ERROR' ? 'text-rose-400 font-bold' :
              log.type === 'COMPLETE' ? 'text-emerald-400 font-semibold' :
              log.type === 'STAGE_CHANGE' ? 'text-purple-300 font-semibold' : 'text-slate-300'
            }>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
